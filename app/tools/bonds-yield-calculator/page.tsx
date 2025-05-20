/*  /app/tools/bonds-yield-calculator/page.tsx
    Bonds Yield Calculator — Spring Money Theme
---------------------------------------------------------------- */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ─────────────────── Types ─────────────────── */
interface Inputs {
  faceValue: string;
  marketPrice: string;
  couponRate: string;
  frequency: string;
  yearsToMaturity: string;
}

interface CashRow {
  period: number;
  coupon: number;
  discountFac: number;
  pv: number;
  cumPv: number;
}

interface Results {
  currentYield: number;
  ytm: number;
  rows: CashRow[];
  totalPvCoupons: number;
  pvPrincipal: number;
  insight: string;
}

/* ───────────────── Tooltip Icon ───────────────── */
const Tip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="i">i</span>
      {open && <span className="box">{text}</span>}
      <style jsx>{`
        .tip {
        position: relative;
          display: inline-block;
          margin-left: 4px;
        }
        .i {
          background: #108e66;
          color: #fcfffe;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.7rem;
          font-weight: bold;
          cursor: default;
        }
        .box {
         position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background: #108e66;
          color: #fcfffe;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          white-space: nowrap;
          z-index: 1000;
        }
        .box::after {
         content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -4px;
          border-width: 4px;
          border-style: solid;
          border-color: #108e66 transparent transparent transparent;
        }
      `}</style>
    </span>
  );
};

/* ───────────────── Number→Words ───────────────── */
const words = (n: number): string => {
  if (!isFinite(n)) return "";
  n = Math.round(Math.abs(n));
  if (n === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const h = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100)
      return `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`;
    if (x < 1000)
      return `${ones[Math.floor(x / 100)]} Hundred${
        x % 100 ? " " + h(x % 100) : ""
      }`;
    if (x < 100000)
      return `${h(Math.floor(x / 1000))} Thousand${
        x % 1000 ? " " + h(x % 1000) : ""
      }`;
    if (x < 10000000)
      return `${h(Math.floor(x / 100000))} Lakh${
        x % 100000 ? " " + h(x % 100000) : ""
      }`;
    return `${h(Math.floor(x / 10000000))} Crore${
      x % 10000000 ? " " + h(x % 10000000) : ""
    }`;
  };
  return h(n);
};

const wordsPercent = (v: number): string =>
  Number.isInteger(v)
    ? `${words(v)} percent`
    : `${words(Math.floor(v))} point ${words(
        Math.round((v - Math.floor(v)) * 10)
      )} percent`;

/* ───────────────── YTM Solver (binary search) ───────────────── */
const solveYTM = (
  price: number,
  couponPerPeriod: number,
  nPeriods: number,
  freq: number,
  face: number
): number => {
  let low = 0,
    high = 0.5; // search 0–50% p.a.
  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    let pv = 0;
    for (let k = 1; k <= nPeriods; k++) {
      pv += couponPerPeriod / Math.pow(1 + mid / freq, k);
    }
    pv += face / Math.pow(1 + mid / freq, nPeriods);
    if (pv > price) low = mid;
    else high = mid;
  }
  return ((low + high) / 2) * 100; // annualized %
};

/* ───────────────── Component ───────────────── */
const BondsYieldCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    faceValue: "",
    marketPrice: "",
    couponRate: "",
    frequency: "2",
    yearsToMaturity: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"line" | "bar">("line");

  /* ---------- handlers ---------- */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  const ok = (v: string) => v !== "" && !isNaN(+v) && +v > 0;
  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    (
      [
        "faceValue",
        "marketPrice",
        "couponRate",
        "frequency",
        "yearsToMaturity",
      ] as (keyof Inputs)[]
    ).forEach((k) => {
      if (!ok(inputs[k])) e[k] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- calculation ---------- */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const FV = +inputs.faceValue;
    const P = +inputs.marketPrice;
    const rate = +inputs.couponRate / 100;
    const freq = +inputs.frequency;
    const years = +inputs.yearsToMaturity;
    const n = freq * years;
    const C = (FV * rate) / freq; // coupon per period
    const annualCoupon = FV * rate;

    const currentYield = (annualCoupon / P) * 100;
    const ytm = solveYTM(P, C, n, freq, FV);

    // PV rows
    const rows: CashRow[] = [];
    let cum = 0,
      couponPvSum = 0;
    for (let k = 1; k <= n; k++) {
      const disc = 1 / Math.pow(1 + ytm / 100 / freq, k);
      const cash = k === n ? C + FV : C;
      const pv = cash * disc;
      cum += pv;
      rows.push({
        period: k,
        coupon: k === n ? C : C,
        discountFac: disc,
        pv,
        cumPv: cum,
      });
      if (k === n) couponPvSum += C * disc;
      else couponPvSum += pv;
    }
    const pvPrincipal = FV / Math.pow(1 + ytm / 100 / freq, n);

    const insight = `Current yield is ${currentYield.toFixed(
      2
    )}%. YTM of ${ytm.toFixed(2)}% reflects total return if held to maturity.`;

    setResults({
      currentYield: +currentYield.toFixed(2),
      ytm: +ytm.toFixed(2),
      rows,
      totalPvCoupons: Math.round(couponPvSum),
      pvPrincipal: Math.round(pvPrincipal),
      insight,
    });
    setTimeout(() => setBusy(false), 300);
  };

  /* ---------- chart data ---------- */
  const lineData = results
    ? results.rows.map((r) => ({ period: r.period, cum: r.cumPv }))
    : [];
  const barData = results
    ? [
        { name: "Coupons PV", value: results.totalPvCoupons },
        { name: "Principal PV", value: results.pvPrincipal },
      ]
    : [];

  const conv = (k: keyof Inputs, v: string): string => {
    if (!v) return "";
    const num = +v;
    if (!isFinite(num)) return "";
    switch (k) {
      case "faceValue":
      case "marketPrice":
        return `${words(num)} Rupees`;
      case "couponRate":
        return wordsPercent(num);
      case "frequency":
        return `${words(num)} Times`;
      case "yearsToMaturity":
        return `${words(num)} Years`;
      default:
        return "";
    }
  };

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Bonds Yield Calculator</h1>
      <p className="sub">
        Compute the Current Yield and Yield-to-Maturity (YTM) of a bond.
      </p>

      {/* ----- Simple Definitions ----- */}
      <div className="explanation">
        <p>
          <strong>What is a Bond?</strong> A bond is a fixed-income instrument
          in which you lend money to a government or company in exchange for
          periodic interest payments (<em>coupons</em>) and repayment of the
          face value at maturity.
        </p>
        <p>
          <strong>What is Bond Yield?</strong> The <em>Current Yield</em> looks
          at annual coupons relative to today's market price, while the{" "}
          <em>Yield-to-Maturity (YTM)</em> captures the total annual return if
          you hold the bond until it matures.
        </p>
      </div>

      {/* ----- Form ----- */}
      <div className="card">
        <h2 className="sect">Enter Bond Details</h2>
        <div className="grid">
          {[
            [
              "faceValue",
              "Face Value (₹)",
              "e.g. ₹1,000 INR",
              "Amount repaid at maturity",
            ],
            [
              "marketPrice",
              "Current Market Price (₹)",
              "e.g. ₹950 INR",
              "Price you pay today",
            ],
            [
              "couponRate",
              "Annual Coupon Rate (%)",
              "e.g. 7.5",
              "Annual interest % of face value",
            ],
            [
              "frequency",
              "Coupon Frequency (per year)",
              "e.g. 2",
              "Interest payments per year",
            ],
            [
              "yearsToMaturity",
              "Years to Maturity",
              "e.g. 5",
              "Years until bond matures",
            ],
          ].map(([k, label, ph, tip]) => {
            const id = `input-${k}`;
            return (
              <div className="field" key={k}>
                <label htmlFor={id} className="lbl">
                  {label}
                  <Tip text={tip} />
                </label>
                <input
                  id={id}
                  name={k}
                  type="number"
                  value={inputs[k as keyof Inputs]}
                  onChange={onChange}
                  placeholder={ph}
                />
                <span className="conv">
                  {conv(k as keyof Inputs, inputs[k as keyof Inputs])}
                </span>
                {errors[k as keyof Inputs] && (
                  <span className="err">{errors[k as keyof Inputs]}</span>
                )}
              </div>
            );
          })}
        </div>
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ----- Results ----- */}
      {results && (
        <div className="card">
          <h2 className="sect">Summary</h2>
          <div className="summary">
            <div>
              <strong>Current Yield</strong>
              <br />
              {results.currentYield.toFixed(2)}%
            </div>
            <div>
              <strong>Yield-to-Maturity</strong>
              <br />
              {results.ytm.toFixed(2)}%
            </div>
          </div>

          <div className="note">{results.insight}</div>

          {/* charts */}
          <div className="chart-expl">
            <p>
              <strong>Line Chart</strong> shows cumulative present value of
              cash-flows; <strong>Bar Chart</strong> splits coupon vs. principal
              PV.
            </p>
          </div>
          <div className="toggle">
            <button
              onClick={() => setChart("line")}
              className={chart === "line" ? "active" : ""}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChart("bar")}
              className={chart === "bar" ? "active" : ""}
            >
              Bar Chart
            </button>
          </div>

          <div className="chart">
            <ResponsiveContainer
              width="100%"
              height={chart === "line" ? 300 : 280}
            >
              {chart === "line" ? (
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="period"
                    stroke="#272a2b"
                    label={{
                      value: "Period",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    stroke="#272a2b"
                    width={90}
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cum"
                    stroke="#108e66"
                    strokeWidth={2}
                    name="Cumulative PV"
                  />
                </LineChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    width={90}
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* table */}
          <h3 className="sect" style={{ marginTop: "1.2rem" }}>
            Cash-flow Present Value
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Coupon (₹)</th>
                  <th>Discount Factor</th>
                  <th>Present Value (₹)</th>
                  <th>Cumulative PV (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((r) => (
                  <tr key={r.period}>
                    <td>{r.period}</td>
                    <td>{r.coupon.toLocaleString("en-IN")}</td>
                    <td>{r.discountFac.toFixed(4)}</td>
                    <td>{r.pv.toLocaleString("en-IN")}</td>
                    <td>{r.cumPv.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                YTM assumes coupons are reinvested at the same yield and the
                bond is held to maturity.
              </li>
              <li>
                Taxes, brokerage fees, and liquidity risks are not included.
              </li>
              <li>
                If market YTM exceeds your required return, the bond may be
                attractive.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ───────────────── Styles ───────────────── */}
      <style jsx>{`
        .wrap {
          padding: 1.25rem 1rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
          width: 100%;
          margin: 0 auto;
        }
        .nav {
          margin-bottom: 1rem;
        }
        .back {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2.4rem;
          font-weight: 700;
          margin: 0.3rem 0;
        }
        .sub {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1.1rem;
        }

        .explanation {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
        }
        .explanation p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }

        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .sect {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.3rem 0 0.8rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem 1.4rem;
          margin-bottom: 1.1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .lbl {
          font-size: 0.9rem;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
        }

        input {
          padding: 0.55rem 0.6rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
          color: #272a2b;
          width: 100%;
          box-sizing: border-box;
        }

        .conv {
          font-size: 0.9rem;
          color: #272a2b;
          margin-top: 0.25rem;
        }
        .err {
          color: red;
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }

        .calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem 1.2rem;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.8rem;
        }

        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          padding-left: 0.8rem;
        }
        .note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-bottom: 0.8rem;
        }

        .chart-expl {
          background: #fcfffe;
          padding: 1rem;
          border-left: 4px solid #108e66;
          border-radius: 8px;
          margin: 1rem 0;
          font-size: 0.95rem;
        }

        .toggle {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin: 1rem 0;
        }
        .toggle button {
          background: transparent;
          border: 1px solid #272a2b;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          color: #272a2b;
          cursor: pointer;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }

        .chart {
          margin-bottom: 1rem;
        }

        .table-wrap {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #272a2b;
          border-radius: 6px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        th,
        td {
          border: 1px solid #272a2b;
          padding: 0.45rem;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fcfffe;
          position: sticky;
          top: 0;
        }

        .disc {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }
        .disc h4 {
          margin: 0 0 0.5rem;
        }
        .disc ul {
          margin: 0;
          padding-left: 1.4rem;
        }
        .disc li {
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default BondsYieldCalculator;
