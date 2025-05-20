/*  /app/tools/rmd-calculator/page.tsx
    Required Minimum Distribution (RMD) Calculator — Spring Money Theme
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

/* ───────── Types ───────── */
interface Inputs {
  balance: string;
  returnRate: string;
  age: string;
}
interface YearRow {
  year: number;
  age: number;
  divisor: number;
  rmd: number;
  endBal: number;
}
interface Results {
  divisor: number;
  rmd1: number;
  rem1: number;
  rows: YearRow[];
  insight: string;
}

/* ───────── Divisor Table (IRS Uniform Lifetime, ages 70-115) ───────── */
const divisors: Record<number, number> = {
  70: 27.4,
  71: 26.5,
  72: 25.5,
  73: 24.7,
  74: 23.8,
  75: 22.9,
  76: 22.0,
  77: 21.2,
  78: 20.3,
  79: 19.5,
  80: 18.7,
  81: 17.9,
  82: 17.1,
  83: 16.3,
  84: 15.5,
  85: 14.8,
  86: 14.1,
  87: 13.4,
  88: 12.7,
  89: 12.0,
  90: 11.4,
  91: 10.8,
  92: 10.2,
  93: 9.6,
  94: 9.1,
  95: 8.6,
  96: 8.1,
  97: 7.6,
  98: 7.1,
  99: 6.7,
  100: 6.3,
  101: 5.9,
  102: 5.5,
  103: 5.2,
  104: 4.9,
  105: 4.6,
  106: 4.3,
  107: 4.1,
  108: 3.9,
  109: 3.7,
  110: 3.5,
  111: 3.4,
  112: 3.3,
  113: 3.1,
  114: 3.0,
  115: 2.9,
};

/* ───────── Tooltip ───────── */
const Tip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="i">i</span>
      {show && <span className="box">{text}</span>}
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

/* ───────── Number → Words (Indian style) ───────── */
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
const wordsPercent = (v: number) =>
  Number.isInteger(v)
    ? `${words(v)} percent`
    : `${words(Math.floor(v))} point ${words(
        Math.round((v - Math.floor(v)) * 10)
      )} percent`;

/* ───────── Component ───────── */
const RMDCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    balance: "",
    returnRate: "",
    age: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"line" | "bar">("line");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ── validation ── */
  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    (["balance", "returnRate", "age"] as (keyof Inputs)[]).forEach((k) => {
      if (!inputs[k]) e[k] = "Required";
      else if (+inputs[k] <= 0) e[k] = "Positive";
    });
    const ageNum = +inputs.age;
    if (ageNum < 70 || ageNum > 115) e.age = "70-115 only";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── calculation ── */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const balance0 = +inputs.balance;
    const returnRate = +inputs.returnRate;
    const age0 = +inputs.age;

    const divisor0 = divisors[age0];
    const rmd0 = balance0 / divisor0;
    let remaining = (balance0 - rmd0) * (1 + returnRate / 100);

    const rows: YearRow[] = [
      {
        year: 1,
        age: age0,
        divisor: divisor0,
        rmd: Math.round(rmd0),
        endBal: Math.round(remaining),
      },
    ];

    for (let yr = 2; yr <= 30 && remaining > 1_000; yr++) {
      const ageN = age0 + yr - 1;
      const divN = divisors[ageN] ?? divisors[115];
      const rmdN = remaining / divN;
      remaining = (remaining - rmdN) * (1 + returnRate / 100);
      rows.push({
        year: yr,
        age: ageN,
        divisor: divN,
        rmd: Math.round(rmdN),
        endBal: Math.round(remaining),
      });
    }

    const insight = `If you withdraw only the RMD, your corpus is projected to last until age ${
      rows[rows.length - 1].age
    }.`;

    setResults({
      divisor: divisor0,
      rmd1: Math.round(rmd0),
      rem1: Math.round(rows[0].endBal),
      rows,
      insight,
    });
    setBusy(false);
  };

  /* chart data */
  const lineData = results
    ? results.rows.map((r) => ({ year: r.year, Balance: r.endBal }))
    : [];
  const barData = results
    ? results.rows.map((r) => ({ year: r.year, RMD: r.rmd }))
    : [];

  const conv = (k: keyof Inputs, v: string): string => {
    if (!v) return "";
    const num = +v;
    switch (k) {
      case "balance":
        return `${words(num)} Rupees`;
      case "returnRate":
        return wordsPercent(num);
      case "age":
        return `${words(num)} Years`;
    }
  };

  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Required Minimum Distribution (RMD) Calculator</h1>
      <p className="sub">
        Find out how much you must withdraw from your retirement corpus each
        year.
      </p>

      {/* ── What is RMD? ── */}
      <div className="explanation">
        <p>
          <strong>What is an RMD?</strong> A Required Minimum Distribution is
          the minimum amount you’re mandated to withdraw each year from
          tax-deferred retirement accounts (like a traditional IRA or 401(k))
          once you reach the statutory starting age. It’s calculated by dividing
          last year’s account balance by a life-expectancy divisor from the IRS
          Uniform Lifetime Table. Skipping your RMD can result in hefty
          penalties, so plan these withdrawals carefully.
        </p>
      </div>

      {/* ── Form ── */}
      <div className="card">
        <h2 className="sect">Enter Details</h2>
        <div className="grid">
          {(["balance", "returnRate", "age"] as (keyof Inputs)[]).map((key) => {
            const details: Record<keyof Inputs, [string, string, string]> = {
              balance: [
                "Prior-Year-End Corpus (₹)",
                "e.g. 1 00 00 000",
                "Account value as on Dec-31",
              ],
              returnRate: [
                "Expected Annual Return (%)",
                "e.g. 8",
                "Growth rate on remaining corpus",
              ],
              age: [
                "Current Age (Years)",
                "e.g. 72",
                "Age at withdrawal (70-115)",
              ],
            };
            const [label, placeholder, tip] = details[key];
            return (
              <div className="field" key={key}>
                <label className="lbl" htmlFor={key}>
                  {label}
                  <Tip text={tip} />
                </label>
                <input
                  id={key}
                  name={key}
                  type="number"
                  value={inputs[key]}
                  onChange={onChange}
                  placeholder={placeholder}
                />
                <span className="conv">{conv(key, inputs[key])}</span>
                {errors[key] && <span className="err">{errors[key]}</span>}
              </div>
            );
          })}
        </div>
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ── Results ── */}
      {results && (
        <div className="card">
          <h2 className="sect">Year-1 Summary</h2>
          <div className="summary">
            <div>
              <strong>Distribution Divisor</strong>
              <br />
              {results.divisor}
            </div>
            <div>
              <strong>RMD (Year-1)</strong>
              <br />₹{results.rmd1.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Projected Balance End Year-1</strong>
              <br />₹{results.rem1.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="note">{results.insight}</div>

          <div className="chart-toggle">
            <button
              onClick={() => setChart("line")}
              className={chart === "line" ? "active" : ""}
            >
              Balance Trend
            </button>
            <button
              onClick={() => setChart("bar")}
              className={chart === "bar" ? "active" : ""}
            >
              RMD per Year
            </button>
          </div>

          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              {chart === "line" ? (
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Line dataKey="Balance" stroke="#108e66" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Bar dataKey="RMD" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="sect" style={{ marginTop: "1.2rem" }}>
            Year-wise Schedule
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Age</th>
                  <th>Divisor</th>
                  <th>RMD (₹)</th>
                  <th>End Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{r.age}</td>
                    <td>{r.divisor}</td>
                    <td>{r.rmd.toLocaleString("en-IN")}</td>
                    <td>{r.endBal.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              <li>Divisors follow the IRS Uniform Lifetime Table.</li>
              <li>
                Assumes constant annual return; actual performance may vary.
              </li>
              <li>
                Withdrawing more than the RMD will shorten corpus longevity.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ───────── Styles ───────── */}
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
        .sub {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }

        .explanation {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.4rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
        }
        .explanation p {
          margin: 0.4rem 0;
          line-height: 1.5;
        }

        /* rest unchanged … */

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
          margin-bottom: 1rem;
        }

        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        .chart-toggle button {
          background: transparent;
          border: 1px solid #272a2b;
          padding: 0.45rem 0.9rem;
          border-radius: 4px;
          font-weight: 500;
          color: #272a2b;
          cursor: pointer;
        }
        .chart-toggle .active {
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

        .cta {
          text-align: center;
          margin: 1rem 0;
          font-size: 0.95rem;
        }
        .cta a {
          color: #108e66;
          font-weight: 600;
          text-decoration: none;
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

export default RMDCalculator;
