/*  /app/tools/annuity-calculator/page.tsx
    Annuity Return Calculator — Spring Money Theme (a11y‑compliant)
------------------------------------------------------------------- */
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
type Freq = "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly";

interface Inputs {
  corpus: string;
  rate: string;
  freq: Freq;
  term: string;
}
interface PeriodRow {
  period: number;
  payment: number;
  cumulative: number;
}
interface Results {
  payment: number;
  totalPayout: number;
  totalReturn: number;
  effectiveYield: number;
  rows: PeriodRow[];
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

/* ───────────────── Number → Words (Indian) ───────────────── */
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
const wordsPercent = (v: number) =>
  `${words(Math.floor(v))}${
    v % 1 ? ` point ${words(Math.round((v % 1) * 10))}` : ""
  } percent`;

/* ───────────────── Component ───────────────── */
const AnnuityReturnCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    corpus: "",
    rate: "",
    freq: "Monthly",
    term: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"line" | "bar">("line");

  /* -------- helpers -------- */
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  const ok = (v: string) => v !== "" && !isNaN(+v) && +v > 0;
  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    (["corpus", "rate", "term"] as (keyof Inputs)[]).forEach((k) => {
      if (!ok(inputs[k])) e[k] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* -------- calculate -------- */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);
    const corpus = +inputs.corpus,
      r = +inputs.rate / 100,
      m = { Monthly: 12, Quarterly: 4, "Half-Yearly": 2, Yearly: 1 }[
        inputs.freq
      ],
      term = +inputs.term,
      N = term * m,
      rPer = r / m;

    const payment = corpus * (rPer / (1 - Math.pow(1 + rPer, -N)));
    const totalPayout = payment * N,
      totalReturn = totalPayout - corpus,
      effectiveYield = (totalReturn / corpus) * (1 / term) * 100;

    const rows: Array<PeriodRow> = Array.from({ length: N }, (_, i) => ({
      period: i + 1,
      payment: Math.round(payment),
      cumulative: Math.round(payment * (i + 1)),
    }));

    setResults({
      payment: Math.round(payment),
      totalPayout: Math.round(totalPayout),
      totalReturn: Math.round(totalReturn),
      effectiveYield: +effectiveYield.toFixed(2),
      rows,
      insight: `Your ₹${corpus.toLocaleString(
        "en-IN"
      )} will yield ₹${Math.round(payment).toLocaleString(
        "en-IN"
      )} every ${inputs.freq.toLowerCase()}. Over ${term} years you earn ₹${Math.round(
        totalReturn
      ).toLocaleString("en-IN")} (≈${effectiveYield.toFixed(2)}% p.a.).`,
    });
    setTimeout(() => setBusy(false), 300);
  };

  /* chart data */
  const lineData = results
    ? results.rows.map((r) => ({ p: r.period, cum: r.cumulative }))
    : [];
  const barData = results
    ? results.rows.map((r) => ({ p: r.period, pay: r.payment }))
    : [];

  const conv = (k: keyof Inputs, v: string) => {
    if (!v) return "";
    const num = +v;
    if (!isFinite(num)) return "";
    switch (k) {
      case "corpus":
        return `${words(num)} Rupees`;
      case "rate":
        return wordsPercent(num);
      case "term":
        return `${words(num)} Years`;
      default:
        return "";
    }
  };

  /* ────────────── JSX ────────────── */
  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Annuity Return Calculator</h1>
      <p className="sub">
        Estimate periodic payouts from a lump‑sum annuity purchase.
      </p>

      {/* explanation box */}
      <div className="explanation">


        <p>
          <strong>Annuity Calculator:</strong> An annuity is a financial product
          that provides a series of
          <strong> regular payments</strong> made at equal intervals, typically
          used for retirement income. It can be either <em>fixed</em> or{" "}
          <em>variable</em> depending on the payout structure and underlying
          investments.
        </p>
        <p>
          This calculator helps you determine the <strong>present value</strong>{" "}
          or <strong>future value</strong> of an annuity based on your inputs
          like <strong>payment amount</strong>, <strong>interest rate</strong>,
          and <strong>number of periods</strong>. It assumes payments occur at
          the <em>end</em> of each period (ordinary annuity) unless otherwise
          specified.
        </p>
      </div>

      {/* form card */}
      <div className="card">
        <h2 className="sect">Enter Details</h2>
        <div className="grid">
          {[
            [
              "corpus",
              "Annuity Purchase Amount (₹)",
              "e.g. 10,00,000",
              "Lump sum invested to buy annuity",
            ],
            [
              "rate",
              "Annuity Rate (% p.a.)",
              "e.g. 6.5",
              "Annual payout rate guaranteed by insurer",
            ],
            [
              "term",
              "Annuity Term (Years)",
              "e.g. 20",
              "Number of years payments will be made",
            ],
          ].map(([k, l, ph, tip]) => {
            const id = `inp-${k}`;
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
                  placeholder={ph}
                  onChange={onChange}
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
            <label htmlFor="freq" className="lbl">
              Payout Frequency
              <Tip text="How often payments occur" />
            </label>
            <select
              id="freq"
              name="freq"
              value={inputs.freq}
              onChange={onChange}
              className="sel"
            >
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Half-Yearly</option>
              <option>Yearly</option>
            </select>
          </div>
        </div>
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* results */}
      {results && (
        <div className="card">
          <h2 className="sect">Summary</h2>
          <div className="summary">
            <div>
              <strong>Payment / {inputs.freq}</strong>
              <br />₹{results.payment.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total Payments</strong>
              <br />₹{results.totalPayout.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total Return</strong>
              <br />₹{results.totalReturn.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Effective Yield</strong>
              <br />
              {results.effectiveYield.toFixed(2)}%
            </div>
          </div>

          <div className="note">{results.insight}</div>

          <div className="chart-expl">
            <p>
              The <strong>Line Chart</strong> shows cumulative payouts, while
              the <strong>Bar Chart</strong> displays the fixed payment each
              period.
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
                    dataKey="p"
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
                    name="Cumulative Received"
                    stroke="#108e66"
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="p"
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
                  <Bar dataKey="pay" name="Payment" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="sect" style={{ marginTop: "1.2rem" }}>
            Period‑wise Breakdown
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Payment (₹)</th>
                  <th>Cumulative (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((r) => (
                  <tr key={r.period}>
                    <td>{r.period}</td>
                    <td>{r.payment.toLocaleString("en-IN")}</td>
                    <td>{r.cumulative.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="disc">
            <h2>Important considerations</h2>
            <ul>
              <li>
                Assumes payments at the <em>end</em> of each period (ordinary
                annuity).
              </li>
              <li>Taxes, fees, and inflation are not factored in.</li>
              <li>Compare with prevailing FD or bond yields for context.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ────────────── Styles ────────────── */}
      <style jsx>{`
        .wrap {
          width: 100%;
          padding: 1.25rem 1rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
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
          margin-bottom: 1rem;
        }

        .explanation {
          border-left: 4px solid #108e66;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
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

        input,
        .sel {
          padding: 0.55rem 0.6rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
          color: #272a2b;
          width: 100%;
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
          font-size: 0.95rem;
          margin: 1rem 0;
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
        .disc ul {
          margin: 0;
          padding-left: 1.4rem;
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
        body,
        input,
        select,
        button {
          font-family: Poppins, sans-serif;
        }
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

export default AnnuityReturnCalculator;
