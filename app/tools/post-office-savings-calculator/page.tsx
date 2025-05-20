/*  /app/tools/post-office-savings-calculator/page.tsx
    Post-Office Savings Calculator — Spring Money Theme
---------------------------------------------------------------- */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ───────── Types ───────── */
type Scheme = "fd" | "rd";

interface Inputs {
  schemeType: Scheme;
  /* FD */
  fdPrincipal: string;
  fdRate: string;
  fdTenure: string;
  /* RD */
  rdMonthly: string;
  rdRate: string;
  rdTenure: string;
}

interface YearRow {
  year: number;
  balance: number;
  interest: number;
}

interface Results {
  maturity: number;
  invested: number;
  interest: number;
  effYield: number;
  rows: YearRow[];
  chartData1: any[]; // per-scheme line / area
  chartData2: any[]; // bar / pie
  insight: string;
}

/* ───────── Tooltip ───────── */
const Tip: React.FC<{ text: string }> = ({ text }) => {
  const [h, setH] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <span className="i">i</span>
      {h && <span className="box">{text}</span>}
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

/* ───────── Number→Words ───────── */
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
  Number.isInteger(v)
    ? `${words(v)} percent`
    : `${words(Math.floor(v))} point ${words(
        Math.round((v - Math.floor(v)) * 10)
      )} percent`;

/* ───────── Component ───────── */
const PostOfficeSavingsCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    schemeType: "fd",
    fdPrincipal: "",
    fdRate: "",
    fdTenure: "",
    rdMonthly: "",
    rdRate: "",
    rdTenure: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"main" | "second">("main");

  /* ---------- helpers ---------- */
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    if (inputs.schemeType === "fd") {
      ["fdPrincipal", "fdRate", "fdTenure"].forEach((k) => {
        if (!inputs[k as keyof Inputs] || +inputs[k as keyof Inputs] <= 0)
          e[k as keyof Inputs] = "Required";
      });
    } else {
      ["rdMonthly", "rdRate", "rdTenure"].forEach((k) => {
        if (!inputs[k as keyof Inputs] || +inputs[k as keyof Inputs] <= 0)
          e[k as keyof Inputs] = "Required";
      });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- calculation ---------- */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    if (inputs.schemeType === "fd") {
      const P = +inputs.fdPrincipal;
      const r = +inputs.fdRate / 100;
      const n = +inputs.fdTenure;
      const qRate = r / 4,
        qTotal = 4 * n;
      const maturity = P * Math.pow(1 + qRate, qTotal);
      const interest = maturity - P;
      const rows: YearRow[] = [];
      for (let yr = 1; yr <= n; yr++) {
        const bal = P * Math.pow(1 + qRate, yr * 4);
        rows.push({
          year: yr,
          balance: Math.round(bal),
          interest: Math.round(bal - P),
        });
      }
      const effYield = (Math.pow(maturity / P, 1 / n) - 1) * 100;
      setResults({
        maturity: Math.round(maturity),
        invested: P,
        interest: Math.round(interest),
        effYield: +effYield.toFixed(2),
        rows,
        chartData1: rows.map((r) => ({ year: r.year, Balance: r.balance })),
        chartData2: rows.map((r) => ({
          year: r.year,
          Interest: r.interest - (r.year > 1 ? rows[r.year - 2].interest : 0),
        })),
        insight: `Your Post Office FD will grow to ₹${Math.round(
          maturity
        ).toLocaleString("en-IN")} in ${n} years, earning ₹${Math.round(
          interest
        ).toLocaleString("en-IN")} interest.`,
      });
    } else {
      const R = +inputs.rdMonthly;
      const r = +inputs.rdRate / 100;
      const n = +inputs.rdTenure;
      const i = r / 400;
      const nQ = n * 4;
      const maturity =
        R * ((Math.pow(1 + i, nQ) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
      const invested = R * 12 * n;
      const interest = maturity - invested;
      const rows: YearRow[] = [];
      for (let yr = 1; yr <= n; yr++) {
        const q = yr * 4;
        const bal =
          R * ((Math.pow(1 + i, q) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
        rows.push({
          year: yr,
          balance: Math.round(bal),
          interest: Math.round(bal - R * yr * 12),
        });
      }
      const effYield = (Math.pow(maturity / invested, 1 / n) - 1) * 100;
      setResults({
        maturity: Math.round(maturity),
        invested: Math.round(invested),
        interest: Math.round(interest),
        effYield: +effYield.toFixed(2),
        rows,
        chartData1: rows.map((r) => ({ year: r.year, FutureValue: r.balance })),
        chartData2: [
          { name: "Invested", value: invested },
          { name: "Interest", value: interest },
        ],
        insight: `Your Post Office RD corpus will reach ₹${Math.round(
          maturity
        ).toLocaleString(
          "en-IN"
        )} after ${n} years, on a total investment of ₹${Math.round(
          invested
        ).toLocaleString("en-IN")}.`,
      });
    }
    setTimeout(() => setBusy(false), 300);
  };

  const conv = (k: keyof Inputs, v: string): string => {
    if (!v) return "";
    const num = +v;
    if (!isFinite(num)) return "";
    switch (k) {
      case "fdPrincipal":
      case "rdMonthly":
        return `${words(num)} Rupees`;
      case "fdRate":
      case "rdRate":
        return wordsPercent(num);
      case "fdTenure":
      case "rdTenure":
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

      <h1 className="title">Post-Office Savings Calculator</h1>
      <p className="sub">
        Estimate maturity value for Post Office Fixed Deposit (FD) or Recurring
        Deposit (RD).
      </p>
      <div className="explanation">
        <p>
          <strong>Post Office Savings Calculator:</strong> This tool helps
          estimate the <strong>maturity amount</strong> and{" "}
          <strong>interest earned</strong> from various post office savings
          schemes like <em>RD, FD</em>.
        </p>
        <p>
          It accounts for the <strong>deposit amount</strong>,{" "}
          <strong>interest rate</strong>, and <strong>tenure</strong> to provide
          a projection of your total returns at maturity.
        </p>
        <p>
          Ideal for conservative investors, this calculator reflects the benefit
          of <strong>government-backed</strong>, low-risk savings options with{" "}
          <strong>fixed interest payouts</strong> and periodic compounding.
        </p>
      </div>

      {/* toggle */}
      <div className="toggle">
        <button
          onClick={() => setInputs((p) => ({ ...p, schemeType: "fd" }))}
          className={inputs.schemeType === "fd" ? "active" : ""}
        >
          Fixed Deposit
        </button>
        <button
          onClick={() => setInputs((p) => ({ ...p, schemeType: "rd" }))}
          className={inputs.schemeType === "rd" ? "active" : ""}
        >
          Recurring Deposit
        </button>
      </div>

      {/* form */}
      <div className="card">
        <h2 className="sect">
          {inputs.schemeType === "fd" ? "FD Details" : "RD Details"}
        </h2>
        <div className="grid">
          {inputs.schemeType === "fd" ? (
            <>
              {[
                [
                  "fdPrincipal",
                  "Deposit Amount (₹)",
                  "e.g. 3 00 000",
                  "One-time investment",
                ],
                [
                  "fdRate",
                  "Annual Interest Rate (%)",
                  "e.g. 7.4",
                  "PO FD annual rate",
                ],
                ["fdTenure", "Tenure (Years)", "e.g. 5", "Duration in years"],
              ].map(([k, l, ph, tip]) => (
                <div className="field" key={k}>
                  <label className="lbl" htmlFor={k}>
                    {l}
                    <Tip text={tip} />
                  </label>
                  <input
                    id={k}
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
              ))}
            </>
          ) : (
            <>
              {[
                [
                  "rdMonthly",
                  "Monthly Deposit (₹)",
                  "e.g. 5 000",
                  "Amount deposited each month",
                ],
                [
                  "rdRate",
                  "Annual Interest Rate (%)",
                  "e.g. 6.7",
                  "PO RD annual rate",
                ],
                ["rdTenure", "Tenure (Years)", "e.g. 10", "Duration in years"],
              ].map(([k, l, ph, tip]) => (
                <div className="field" key={k}>
                  <label className="lbl" htmlFor={k}>
                    {l}
                    <Tip text={tip} />
                  </label>
                  <input
                    id={k}
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
              ))}
            </>
          )}
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
              <strong>Maturity Value</strong>
              <br />₹{results.maturity.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total Invested</strong>
              <br />₹{results.invested.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total Interest</strong>
              <br />₹{results.interest.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Effective Yield</strong>
              <br />
              {results.effYield.toFixed(2)}% p.a.
            </div>
          </div>

          <div className="note">{results.insight}</div>

          {/* chart toggle */}
          <div className="chart-toggle">
            <button
              onClick={() => setChart("main")}
              className={chart === "main" ? "active" : ""}
            >
              Growth Chart
            </button>
            <button
              onClick={() => setChart("second")}
              className={chart === "second" ? "active" : ""}
            >
              {inputs.schemeType === "fd"
                ? "Annual Interest"
                : "Investment Split"}
            </button>
          </div>

          {/* charts */}
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              {chart === "main" ? (
                inputs.schemeType === "fd" ? (
                  <LineChart data={results.chartData1}>
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
                  <AreaChart data={results.chartData1}>
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
                    <Area
                      dataKey="FutureValue"
                      stroke="#108e66"
                      fill="#108e66"
                    />
                  </AreaChart>
                )
              ) : inputs.schemeType === "fd" ? (
                <BarChart data={results.chartData2}>
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
                  <Bar dataKey="Interest" fill="#108e66" />
                </BarChart>
              ) : (
                <PieChart>
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Pie
                    data={results.chartData2}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                  >
                    <Cell fill="#108e66" />
                    <Cell fill="#272a2b" />
                  </Pie>
                </PieChart>
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
                  <th>
                    {inputs.schemeType === "fd"
                      ? "FD Balance (₹)"
                      : "Cumulative Value (₹)"}
                  </th>
                  <th>Interest (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{r.balance.toLocaleString("en-IN")}</td>
                    <td>{r.interest.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* considerations */}
          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              {inputs.schemeType === "fd" ? (
                <>
                  <li>
                    FD interest is compounded quarterly at the entered rate.
                  </li>
                  <li>Interest earned is taxable as per your slab.</li>
                  <li>Premature withdrawal can reduce returns.</li>
                </>
              ) : (
                <>
                  <li>
                    RD maturity uses quarterly compounding on each installment.
                  </li>
                  <li>
                    Missing deposits may attract penalties or lower rates.
                  </li>
                  <li>Interest earned is fully taxable.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ───────── styles ───────── */}
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
          margin-bottom: 1.2rem;
        }

        .toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.2rem;
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
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
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

export default PostOfficeSavingsCalculator;
