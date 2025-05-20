/*  /app/tools/savings-goal-planner/page.tsx
    Savings Goal Calculator – Spring Money
---------------------------------------------------------------- */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ──────────────────────────
   Types
   ────────────────────────── */
interface Inputs {
  targetAmount: string;    // ₹
  initialSavings?: string; // ₹ (optional)
  interestRate: string;    // % p.a.
  timePeriod: string;      // years
}

interface YearRow {
  year: number;
  start: number;
  interest: number;
  contribution: number;
  end: number;
}

interface Results {
  monthlySaving: number;
  totalSavings: number;
  interestEarned: number;
  barData: { name: string; value: number }[];
  lineData: { month: number; saved: number }[];
  table: YearRow[];
  enoughAlready: boolean;
}

/* ──────────────────────────
   Tooltip Icon
   ────────────────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tooltipIcon"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="info-icon">i</span>
      {show && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltipIcon {
          position: relative;
          display: inline-block;
          margin-left: 5px;
          cursor: pointer;
          vertical-align: middle;
        }
        .info-icon {
          display: inline-block;
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          font-size: 0.6rem;
          width: 14px;
          height: 14px;
          text-align: center;
          line-height: 14px;
          font-weight: bold;
        }
        .tooltiptext {
          visibility: visible;
          width: 220px;
          background: #108e66;
          color: #fcfffe;
          text-align: left;
          border-radius: 4px;
          padding: 6px 8px;
          position: absolute;
          z-index: 1000;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          line-height: 1.2;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .tooltiptext::after {
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

/* ──────────────────────────
   Helper: number → words (Indian)
   ────────────────────────── */
const numberToWords = (num: number): string => {
  if (isNaN(num)) return "";
  if (num === 0) return "Zero";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const helper = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return `${tens[Math.floor(n / 10)]}${n % 10 ? " " + ones[n % 10] : ""}`;
    if (n < 1000) return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? " " + helper(n % 100) : ""}`;
    if (n < 100000)
      return `${helper(Math.floor(n / 1000))} Thousand${n % 1000 ? " " + helper(n % 1000) : ""}`;
    if (n < 10000000)
      return `${helper(Math.floor(n / 100000))} Lakh${n % 100000 ? " " + helper(n % 100000) : ""}`;
    return `${helper(Math.floor(n / 10000000))} Crore${n % 10000000 ? " " + helper(n % 10000000) : ""}`;
  };
  return helper(Math.round(Math.abs(num)));
};

/* ──────────────────────────
   Component
   ────────────────────────── */
const SavingsGoalCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    targetAmount: "",
    initialSavings: "",
    interestRate: "",
    timePeriod: "",
  });
  const [errors, setErrors] = useState<Partial<Inputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  /* universal change */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* validation */
  const validate = () => {
    const newErr: Partial<Inputs> = {};
    const req: (keyof Inputs)[] = ["targetAmount", "interestRate", "timePeriod"];
    req.forEach((k) => {
      if (!inputs[k] || isNaN(+inputs[k]!) || +inputs[k]! <= 0) newErr[k] = "Enter a valid number";
    });
    if (inputs.initialSavings && (+inputs.initialSavings < 0 || isNaN(+inputs.initialSavings)))
      newErr.initialSavings = "Enter a valid number";
    if (inputs.timePeriod && (!Number.isInteger(+inputs.timePeriod) || +inputs.timePeriod > 50))
      newErr.timePeriod = "Enter whole years (max 50)";
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  /* calculation */
  const calculate = () => {
    if (!validate()) return;
    setLoading(true);

    const target = +inputs.targetAmount;
    const initSavings = inputs.initialSavings ? +inputs.initialSavings : 0;
    const rate = +inputs.interestRate / 100;
    const years = +inputs.timePeriod;
    const n = years * 12;
    const r = rate / 12;

    /* future value of initial corpus */
    const fvInit = initSavings * Math.pow(1 + r, n);

    /* monthly saving required (PMT)  */
    const denom = (Math.pow(1 + r, n) - 1) / r;
    let pmt = (target - fvInit) / denom;
    if (pmt < 0) pmt = 0; // already enough

    /* final corpus */
    const totalSavings = pmt * denom + fvInit;
    const interestEarned = totalSavings - initSavings - pmt * n;

    /* bar data  */
    const barData = [
      { name: "Initial Corpus", value: initSavings },
      { name: "Total Contrib.", value: pmt * n },
      { name: "Interest", value: interestEarned },
    ];

    /* line data (monthly growth) */
    const lineData: { month: number; saved: number }[] = [];
    let bal = initSavings;
    for (let m = 1; m <= n; m++) {
      bal = bal * (1 + r) + pmt;
      lineData.push({ month: m, saved: bal });
    }

    /* yearly table */
    const table: YearRow[] = [];
    bal = initSavings;
    for (let y = 1; y <= years; y++) {
      const start = bal;
      const balAfterYear = bal * Math.pow(1 + r, 12) + pmt * ((Math.pow(1 + r, 12) - 1) / r);
      const interest = balAfterYear - start - pmt * 12;
      table.push({
        year: y,
        start,
        interest,
        contribution: pmt * 12,
        end: balAfterYear,
      });
      bal = balAfterYear;
    }

    setResults({
      monthlySaving: pmt,
      totalSavings,
      interestEarned,
      barData,
      lineData,
      table,
      enoughAlready: pmt === 0,
    });
    setTimeout(() => setLoading(false), 350);
  };

  const COLORS = ["#108e66", "#525ecc", "#888"];

  /* ─── render ─── */
  return (
    <div className="container">
      {/* back nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Savings Goal Calculator</h1>
      <p className="description">
        Work out exactly how much you need to put aside each month to hit a future savings target.
      </p>
      <div className="explanation">
  <p>
    <strong>Savings Goal Calculator:</strong> This tool helps you plan how much you need to save regularly to reach a specific <strong>financial goal</strong> within a set time frame. Whether it’s for a vacation, a big purchase, or an emergency fund, it provides a clear roadmap.
  </p>
  <p>
    By entering your <strong>target amount</strong>, <strong>time horizon</strong>, and <strong>expected interest rate</strong>, the calculator determines your required <strong>monthly or periodic savings</strong>. It assumes consistent contributions and compound interest over time.
  </p>
</div>


      {/* form */}
      <div className="form-container">
        <h2 className="section-title">Goal Inputs</h2>
        <div className="input-group">
          {[
            [
              "targetAmount",
              "Target Amount (₹)",
              "The total amount you want by the end of the period.",
              "e.g. 1,000,000",
            ],
            [
              "initialSavings",
              "Initial Savings (₹) (optional)",
              "What you already have set aside for this goal.",
              "e.g. 50,000",
            ],
            [
              "interestRate",
              "Expected Annual Return (%)",
              "Average yearly growth rate you expect.",
              "e.g. 8",
            ],
            [
              "timePeriod",
              "Time Horizon (Years)",
              "How many years until you need the money.",
              "e.g. 10",
            ],
          ].map(([k, label, tip, ph]) => (
            <label key={k}>
              <span className="input-label">
                {label}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={k}
                value={(inputs as any)[k]}
                onChange={handleChange}
                placeholder={ph}
              />
              {(inputs as any)[k] && (
                <span className="converter">
                  {k === "timePeriod"
                    ? `${numberToWords(+inputs.timePeriod)} Years`
                    : `${numberToWords(+((inputs as any)[k]))} Rupees`}
                </span>
              )}
              {errors[k as keyof Inputs] && (
                <span className="error">{errors[k as keyof Inputs]}</span>
              )}
            </label>
          ))}
        </div>

        <button className="calculate-button" onClick={calculate} disabled={loading}>
          {loading ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* results */}
      {results && (
        <div className="results-container">
          <h2 className="results-title">Plan Summary</h2>

          <div className="summary-card">
            <div className="summary-item">
              <strong>
                {results.enoughAlready ? "Surplus Amount" : "Required Monthly Saving"}:
              </strong>{" "}
              ₹{results.monthlySaving.toLocaleString("en-IN")}{" "}
              {!results.enoughAlready && `(${numberToWords(results.monthlySaving)} Rupees)`}
            </div>
            <div className="summary-item">
              <strong>Total Savings (FV):</strong> ₹{results.totalSavings.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>Interest Earned:</strong> ₹{results.interestEarned.toLocaleString("en-IN")}
            </div>
          </div>

          {/* suggestion */}
          <div
            className="suggestion-banner"
            style={{
              background: results.enoughAlready ? "#e7f9e7" : "#fff8e5",
              borderLeft: `4px solid ${results.enoughAlready ? "#108e66" : "#ff9f00"}`,
            }}
          >
            {results.enoughAlready ? (
              <>Good news! Your current savings will already exceed the target.</>
            ) : (
              <>Put aside ₹{results.monthlySaving.toLocaleString("en-IN")} per month to reach the goal.</>
            )}
          </div>

          {/* chart explain */}
          <div className="chart-explanation">
            <p>
              <strong>Bar Chart</strong> breaks down how the final corpus is built. Switch to{" "}
              <strong>Line Chart</strong> for month-wise growth.
            </p>
          </div>

          {/* toggle */}
          <div className="chart-toggle">
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
            <button
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              Line Chart
            </button>
          </div>

          {/* chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={results.barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" name="Amount" fill="#108E66">
                    {results.barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart data={results.lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="saved"
                    name="Cumulative Saved"
                    stroke="#108e66"
                    strokeWidth={2}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* table */}
          <h2 className="results-title">Year-wise Snapshot</h2>
          <div className="amortization-table">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Start (₹)</th>
                  <th>Interest (₹)</th>
                  <th>Contribution (₹)</th>
                  <th>End (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.table.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{r.start.toLocaleString("en-IN")}</td>
                    <td>{r.interest.toLocaleString("en-IN")}</td>
                    <td>{r.contribution.toLocaleString("en-IN")}</td>
                    <td>{r.end.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* disclaimer */}
          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>Assumes fixed monthly contributions and constant annual return.</li>
              <li>Inflation, taxes and fees are not factored in.</li>
              <li>Review progress yearly and adjust for life-event changes.</li>
            </ul>
          </div>
        </div>
      )}

       <style jsx>{`
        .container {
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272b2a;
        }
        .top-nav {
          margin-bottom: 1rem;
        }
        .back-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
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
        .form-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .input-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 1rem;
        }
        .input-label {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        input {
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          height: 38px;
          font-size: 1rem;
        }
        .converter {
          font-size: 0.85rem;
          color: #272b2a;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          font-size: 0.8rem;
        }
        .calculate-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          width: 100%;
        }
        .calculate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        /* results */
        .results-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .results-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }
        .summary-card {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.2rem;
          display: grid;
          gap: 0.75rem;
          border: 1px solid #272b2a;
        }
        .summary-item {
          font-size: 1rem;
        }
        .chart-explanation {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.8rem;
          border-left: 4px solid #108e66;
          text-align: center;
          font-size: 0.95rem;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
        }
        .chart-toggle button {
          background: transparent;
          border: 1px solid #272b2a;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          margin: 1rem 0 2rem;
        }
        .amortization-table {
          max-height: 400px;
          overflow-y: auto;
          border-radius: 8px;
          border: 1px solid #272b2a;
          margin-bottom: 1.2rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #272b2a;
          padding: 0.5rem;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fcfffe;
          position: sticky;
          top: 0;
        }
        .disclaimer {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #272b2a;
          border: 1px solid #272b2a;
        }
        @media (max-width: 768px) {
          .input-group {
            grid-template-columns: 1fr;
          }
        }
      `}
    </style>
    </div>
  );
};

export default SavingsGoalCalculator;
