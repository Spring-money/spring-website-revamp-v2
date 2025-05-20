// File: /app/tools/passive-income-projection-tool/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ───────── Tooltip Icon ───────── */
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
          display:inline-block;
          cursor: pointer;
          
        }
        .i {
          background: #108e66;
          color: #fcfffe;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: bold;
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
          border: 4px solid transparent;
          border-top-color: #108e66;
        }
      `}</style>
    </span>
  );
};

/* ───────── Number → Words (Indian) ───────── */
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
    ],
    t = [
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
const wordsPercent = (v: number) => `${words(v)} percent`;

interface Inputs {
  corpus: string;
  topup: string;
  yield: string;
  growth: string;
  reinvest: "yes" | "no";
  goal: string;
  years: string;
  inflation: string;
}

const PassiveIncomeProjectionTool: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    corpus: "",
    topup: "",
    yield: "",
    growth: "",
    reinvest: "no",
    goal: "",
    years: "",
    inflation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [cagr, setCagr] = useState(0);
  const [breakEven, setBreakEven] = useState("");
  const [chart, setChart] = useState<"line" | "area">("line");

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputs((p) => ({ ...p, [name]: value }));
  };

  const calculate = () => {
    setError(null);
    setRows([]);
    const P0 = +inputs.corpus,
      m = +inputs.topup || 0,
      y = +inputs.yield / 100,
      g = +inputs.growth / 100,
      n = +inputs.years,
      infl = +inputs.inflation / 100 || 0,
      goal = +inputs.goal || NaN,
      reinvest = inputs.reinvest === "yes";
    if (!P0 || !n) {
      setError(
        "Please enter <strong>Current Corpus</strong> and <strong>Projection Horizon</strong>"
      );
      return;
    }

    let corpus = P0,
      monthCnt = 0,
      breakMonth = -1;
    const out: any[] = [];
    for (let yr = 1; yr <= n; yr++) {
      let incomeYr = 0;
      for (let mth = 0; mth < 12; mth++) {
        monthCnt++;
        const yld = corpus * (y / 12);
        if (!reinvest) incomeYr += yld;
        corpus += m + (reinvest ? yld : 0);
        corpus *= 1 + g / 12;
        if (!reinvest && !isNaN(goal) && breakMonth < 0 && yld * 12 >= goal)
          breakMonth = monthCnt;
      }
      out.push({
        year: yr,
        corpus: Math.round(corpus),
        income: Math.round(incomeYr),
        realIncome: Math.round(incomeYr / Math.pow(1 + infl, yr)),
      });
    }
    setRows(out);
    setCagr(+((Math.pow(out[n - 1].corpus / P0, 1 / n) - 1) * 100).toFixed(2));
    if (!reinvest && breakMonth > 0) {
      const y = Math.ceil(breakMonth / 12),
        mo = breakMonth - (y - 1) * 12;
      setBreakEven(`${y} yr ${mo} mo`);
    } else setBreakEven("N/A (reinvesting)");
  };

  const fieldMeta = [
    {
      key: "corpus",
      label: "Current Corpus (₹)",
      ph: "5,00,000",
      tip: "Amount already invested",
    },
    {
      key: "topup",
      label: "Monthly Top-Up (₹)",
      ph: "25,000",
      tip: "Extra amount added monthly",
    },
    {
      key: "yield",
      label: "Net Yield (% p.a.)",
      ph: "8",
      tip: "Annual income yield after tax",
    },
    {
      key: "growth",
      label: "Growth Rate (% p.a.)",
      ph: "6",
      tip: "Expected price appreciation",
    },
    {
      key: "years",
      label: "Projection Horizon (yrs)",
      ph: "15",
      tip: "How long to project",
    },
    {
      key: "goal",
      label: "Income Goal (₹/mo)",
      ph: "50,000",
      tip: "Optional passive-income target",
    },
    {
      key: "inflation",
      label: "Inflation (% p.a.)",
      ph: "5",
      tip: "Used to show real income",
    },
  ] as const;

  const conv = (k: string, v: string) => {
    if (!v) return "";
    const num = +v;
    return ["yield", "growth", "inflation"].includes(k)
      ? wordsPercent(num)
      : `${words(num)} Rupees`;
  };

  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Passive Income Projection Tool</h1>
      <p className="sub">See how soon your investments could pay your bills.</p>

      <div className="explanation">
        <p>
          <strong>Passive Income Projection:</strong> This tool helps estimate
          the <strong>monthly</strong> or <strong>annual income</strong> you
          can generate from your investments or assets like{" "}
          <em>real estate, dividends, fixed deposits, or digital products</em>
          .
        </p>
        <p>
          It factors in your <strong>initial investment</strong>,{" "}
          <strong>expected returns</strong>, and{" "}
          <strong>withdrawal strategy</strong> to calculate how much income
          you can sustainably generate without depleting your capital — or,
          optionally, with partial drawdown.
        </p>
        <p>
          Use it to assess whether your passive income is enough to support
          expenses, work toward <strong>financial independence</strong>, or
          supplement your regular earnings.
        </p>
      </div>

      <div className="card">
        <h2 className="sect">Enter Details</h2>
        <div className="grid">
          {fieldMeta.map((f) => (
            <div className="field" key={f.key}>
              <label className="lbl" htmlFor={f.key}>
                {f.label}
                <Tip text={f.tip} />
              </label>
              <input
                id={f.key}
                name={f.key}
                type="number"
                value={inputs[f.key as keyof Inputs]}
                onChange={handleChange}
                placeholder={f.ph}
              />
              <span className="conv">
                {conv(f.key, inputs[f.key as keyof Inputs])}
              </span>
            </div>
          ))}
          <div className="field">
            <label className="lbl" htmlFor="reinvest">
              Reinvest Income?
              <Tip text="Select 'Yes' to reinvest cash returns into the corpus" />
            </label>
            <select
              id="reinvest"
              name="reinvest"
              value={inputs.reinvest}
              onChange={handleChange}
            >
              <option value="no">No — take income out</option>
              <option value="yes">Yes — reinvest income</option>
            </select>
          </div>
        </div>
        {error && (
          <p className="err" dangerouslySetInnerHTML={{ __html: error }}></p>
        )}
        <button className="calc" onClick={calculate}>
          Calculate
        </button>
      </div>

      {rows.length > 0 && (
        <>
          <div className="card">
            <h2 className="sect">Projection</h2>
            <div className="chart-toggle">
              <button
                className={chart === "line" ? "active" : ""}
                onClick={() => setChart("line")}
              >
                Corpus & Income
              </button>
              <button
                className={chart === "area" ? "active" : ""}
                onClick={() => setChart("area")}
              >
                Nominal vs Real Income
              </button>
            </div>
            <div className="chart">
              <ResponsiveContainer width="100%" height={300}>
                {chart === "line" ? (
                  <LineChart data={rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={fmt} />
                    <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="corpus"
                      stroke="#108e66"
                      name="Corpus"
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#272a2b"
                      name="Income/yr"
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={fmt} />
                    <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#108e66"
                      fill="#108e6655"
                      name="Nominal"
                    />
                    <Area
                      type="monotone"
                      dataKey="realIncome"
                      stroke="#272a2b"
                      fill="#272a2b55"
                      name="Real"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="summary">
              <div>
                <strong>CAGR</strong>
                <br />
                {cagr}%
              </div>
              <div>
                <strong>Break-Even Time</strong>
                <br />
                {breakEven}
              </div>
            </div>
            <h3 className="sect" style={{ marginTop: "1rem" }}>
              Annual Snapshot
            </h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Corpus (₹)</th>
                    <th>Income (₹)</th>
                    <th>Real Income (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.year}>
                      <td>{r.year}</td>
                      <td>{fmt(r.corpus)}</td>
                      <td>{fmt(r.income)}</td>
                      <td>{fmt(r.realIncome)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/*  Important Considerations */}
          <div className="disc">
            <h2>Important Considerations</h2>
            <ul>
              <li>Assumes constant yields, growth and inflation.</li>
              <li>Taxes on income are ignored.</li>
              <li>Review projections regularly and adjust inputs.</li>
            </ul>
          </div>
        </>
      )}

      <style jsx>{`
        .wrap {
          width: 100%;
          padding: 1.25rem;
          font-family: "Poppins", sans-serif;
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
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .sub {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .explanation {
          border-left: 4px solid #108e66;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        .explanation p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .sect {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem 1.4rem;
          margin-bottom: 1rem;
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
        select {
          padding: 0.55rem 0.6rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
          color: #272a2b;
          width: 100%;
        }
        .conv {
          font-size: 0.9rem;
          margin-top: 0.25rem;
          color: #272a2b;
        }
        .err {
          color: red;
          text-align: center;
          margin-top: 0.5rem;
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
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin: 1rem 0;
        }
        .chart-toggle button {
          background: transparent;
          border: 1px solid #272a2b;
          padding: 0.4rem 0.9rem;
          border-radius: 4px;
          font-weight: 500;
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
        .summary {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
          border-left: 4px solid #108e66;
          padding-left: 1rem;
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
        .toggle-btns {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin: 1rem 0;
        }
        .toggle-btns button {
          background: #fff;
          border: 1px solid #272a2b;
          padding: 0.4rem 0.9rem;
          border-radius: 20px;
          cursor: pointer;
        }
        .toggle-btns .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
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
      `}</style>
      <style jsx global>{`
        body,
        input,
        select,
        button {
          font-family: "Poppins", sans-serif;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
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

export default PassiveIncomeProjectionTool;
