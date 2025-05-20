/*  /app/tools/lumpsum-investment-calculator/page.tsx
    Lumpsum Investment Calculator — Spring Money Theme
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

/* ────────────── Types ────────────── */
type FreqKey = "Annually" | "Semi-Annually" | "Quarterly" | "Monthly";

interface Inputs {
  principal: string;
  annualRate: string;
  frequency: FreqKey;
  years: string;
}

interface YearRow {
  year: number;
  openingBalance: number;
  interestEarned: number;
  closingBalance: number;
}

interface Results {
  maturityAmount: number;
  totalInterest: number;
  cagr: number;
  rows: YearRow[];
  insight: string;
}

/* ────────────── Tooltip ────────────── */
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
          margin-left: 6px;
          cursor: pointer;
        }
        .i {
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          font-size: 0.6rem;
          line-height: 14px;
          text-align: center;
          font-weight: 700;
          display: inline-block;
        }
        .box {
          position: absolute;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          background: #fcfffe;
          color: #272a2b;
          border: 1px solid #108e66;
          border-radius: 4px;
          padding: 6px 8px;
          font-size: 0.75rem;
          line-height: 1.2;
          width: 220px;
          white-space: pre-wrap;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .box::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -4px;
          border: 4px solid transparent;
          border-top-color: #fcfffe;
        }
      `}</style>
    </span>
  );
};

/* ────────────── Number→Words ────────────── */
const words = (n: number): string => {
  if (!isFinite(n)) return "";
  n = Math.round(Math.abs(n));
  if (n === 0) return "Zero";
  const o = [
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
  const t = [
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
    if (x < 20) return o[x];
    if (x < 100)
      return `${t[Math.floor(x / 10)]}${x % 10 ? " " + o[x % 10] : ""}`;
    if (x < 1000)
      return `${o[Math.floor(x / 100)]} Hundred${
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

/* ────────────── Component ────────────── */
const LumpsumInvestmentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    principal: "",
    annualRate: "",
    frequency: "Annually",
    years: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"line" | "bar">("line");

  /* input change */
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* validation */
  const ok = (v: string) => v !== "" && !isNaN(+v) && +v > 0;
  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    (["principal", "annualRate", "years"] as (keyof Inputs)[]).forEach((k) => {
      if (!ok(inputs[k])) e[k] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* calculation */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const P = +inputs.principal;
    const r = +inputs.annualRate / 100;
    const nMap = { Annually: 1, "Semi-Annually": 2, Quarterly: 4, Monthly: 12 };
    const n = nMap[inputs.frequency];
    const t = +inputs.years;

    const A = P * Math.pow(1 + r / n, n * t);
    const interest = A - P;
    const cagr = (Math.pow(A / P, 1 / t) - 1) * 100;

    const rows: YearRow[] = [];
    let prev = P;
    for (let y = 1; y <= t; y++) {
      const closing = P * Math.pow(1 + r / n, n * y);
      rows.push({
        year: y,
        openingBalance: Math.round(prev),
        interestEarned: Math.round(closing - prev),
        closingBalance: Math.round(closing),
      });
      prev = closing;
    }

    setResults({
      maturityAmount: Math.round(A),
      totalInterest: Math.round(interest),
      cagr: +cagr.toFixed(2),
      rows,
      insight: `Your ₹${P.toLocaleString("en-IN")} will grow to ₹${Math.round(
        A
      ).toLocaleString(
        "en-IN"
      )} in ${t} years at ${+inputs.annualRate}% p.a., earning ₹${Math.round(
        interest
      ).toLocaleString("en-IN")} in total.`,
    });
    setTimeout(() => setBusy(false), 300);
  };

  /* chart data */
  const lineData = results
    ? results.rows.map((r) => ({ year: r.year, balance: r.closingBalance }))
    : [];
  const barData = results
    ? results.rows.map((r) => ({ year: r.year, interest: r.interestEarned }))
    : [];
  const conv = (k: keyof Inputs, val: string): string => {
    if (!val) return "";
    const num = +val;
    if (!isFinite(num)) return "";
    switch (k) {
      case "principal":
        return `${words(num)} Rupees`;
      case "annualRate":
        return wordsPercent(num);
      case "years":
        return `${words(num)} Years`;
      default:
        return "";
    }
  };

  /* ───────── JSX ───────── */
  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Lumpsum Investment Calculator</h1>
      <p className="sub">Project the future value of a one-time investment.</p>
      <div className="explanation">
        <p>
          <strong>Lump Sum Investment Calculator:</strong> This tool estimates
          the <strong>future value</strong> of a one-time investment based on a
          given <strong>investment duration</strong> and{" "}
          <strong>expected annual return (CAGR)</strong>.
        </p>
        <p>
          It simulates how your capital grows over time through the power of{" "}
          <strong>compound interest</strong>. The calculator is ideal for
          assessing investments in <em>mutual funds, stocks, bonds, or FDs</em>.
        </p>
        <p>
          Useful for long-term planning, this helps you understand how{" "}
          <strong>starting early</strong> and <strong>staying invested</strong>{" "}
          can lead to substantial wealth accumulation.
        </p>
      </div>

      {/* ── Form ── */}
      <div className="card">
        <h2 className="sect">Enter Details</h2>
        <div className="grid">
          {[
            [
              "principal",
              "Investment Amount (₹)",
              "e.g. 5 00 000",
              "One-time lump-sum you invest",
            ],
            [
              "annualRate",
              "Expected Annual Return (%)",
              "e.g. 12",
              "Anticipated yearly growth rate",
            ],
            [
              "years",
              "Investment Duration (Years)",
              "e.g. 10",
              "Total investment period",
            ],
          ].map(([k, l, ph, tip]) => {
            const id = `input-${k}`;
            return (
              <div className="field" key={k}>
                <label htmlFor={id} className="lbl">
                  {l}
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
          <div className="field">
            <label htmlFor="freq-select" className="lbl">
              Compounding Frequency
              <Tip text="How often interest compounds per year" />
            </label>
            <select
              id="freq-select"
              name="frequency"
              value={inputs.frequency}
              onChange={onChange}
              aria-label="Compounding Frequency"
              className="sel"
            >
              <option>Annually</option>
              <option>Semi-Annually</option>
              <option>Quarterly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ── Results ── */}
      {results && (
        <div className="card">
          <h2 className="sect">Summary</h2>
          <div className="summary">
            <div>
              <strong>Maturity Amount</strong>
              <br />₹{results.maturityAmount.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total Interest</strong>
              <br />₹{results.totalInterest.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Effective CAGR</strong>
              <br />
              {results.cagr.toFixed(2)}%
            </div>
          </div>

          <div className="note">{results.insight}</div>

          {/* charts */}
          <div className="chart-expl">
            <p>
              The <strong>Line Chart</strong> shows the year-end balance, while
              the <strong>Bar Chart</strong> highlights interest earned each
              year.
            </p>
          </div>
          <div className="toggle">
            <button
              className={chart === "line" ? "active" : ""}
              onClick={() => setChart("line")}
            >
              Line Chart
            </button>
            <button
              className={chart === "bar" ? "active" : ""}
              onClick={() => setChart("bar")}
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
                    dataKey="year"
                    stroke="#272a2b"
                    label={{
                      value: "Year",
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
                    dataKey="balance"
                    stroke="#108e66"
                    strokeWidth={2}
                    name="Year-End Balance"
                  />
                </LineChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    stroke="#272a2b"
                    label={{
                      value: "Year",
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
                  <Bar
                    dataKey="interest"
                    fill="#108e66"
                    name="Interest Earned"
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* table */}
          <h3 className="sect" style={{ marginTop: "1.2rem" }}>
            Year-wise Breakdown
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Opening (₹)</th>
                  <th>Interest (₹)</th>
                  <th>Closing (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{r.openingBalance.toLocaleString("en-IN")}</td>
                    <td>{r.interestEarned.toLocaleString("en-IN")}</td>
                    <td>{r.closingBalance.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Important Considerations */}
          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                This calculation assumes the stated return rate stays constant
                for the entire duration.
              </li>
              <li>Taxes, fees, and inflation are not accounted for.</li>
              <li>
                A higher compounding frequency generally boosts returns if the
                annual rate is unchanged.
              </li>
              <li>
                Compare the projected CAGR with current FD or bond yields before
                investing.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Styles ── */}
      <style jsx>{`
        .wrap {
          padding: 1.25rem 1rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
          max-width: 100%;
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
          .explanation {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
          color: #272b2a;
        }
        .explanation p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        .sub {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1.1rem;
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
        input,
        .sel {
          padding: 0.55rem 0.6rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
          color: #272a2b;
          width: 100%;
          box-sizing: border-box;
        }
        .sel {
          height: 40px;
        }
        .conv {
          font-size: 0.9rem;
          color: #272a2b;
          margin-top: 0.25rem;
        }
        .err {
          color: red;
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-bottom: 0.9rem;
          border-left: 4px solid #108e66;
          padding-left: 0.8rem;
        }
        .note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-bottom: 1rem;
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
          cursor: pointer;
          border-radius: 4px;
          font-weight: 500;
          color: #272a2b;
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

export default LumpsumInvestmentCalculator;
