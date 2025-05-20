/*  /app/tools/emergency-fund-planner/page.tsx
    Emergency Fund Calculator – Spring Money
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

/* ──────────────────────────
   Type Definitions
   ────────────────────────── */
interface Inputs {
  targetFund: string;        // How much do you need?
  periodYears: string;       // Build it in how many years?
  alreadySaved?: string;     // Current corpus (optional)
  monthlySavings: string;    // Planned monthly contribution
  monthlyIncome?: string;    // For info (optional)
  style: "Conservative" | "Moderate" | "Aggressive";
}

interface Results {
  projectedAmount: number;
  gap: number;                // positive ⇒ short‑fall
  barData: { name: string; value: number }[];
  lineData: { month: number; saved: number }[];
  months: number;
  savingsRatio?: number;      // if income given
}

/* ──────────────────────────
   Tooltip Icon (reuse style)
   ────────────────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tooltipIcon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="info-icon">i</span>
      {open && <span className="tooltiptext">{text}</span>}
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
  if (isNaN(num) || num === 0) return num === 0 ? "Zero" : "";
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
const EmergencyFundCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    targetFund: "",
    periodYears: "",
    alreadySaved: "",
    monthlySavings: "",
    monthlyIncome: "",
    style: "Moderate",
  });
  const [errors, setErrors] = useState<Partial<Inputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  /* handle changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* validation */
  const validate = () => {
    const req: (keyof Inputs)[] = ["targetFund", "periodYears", "monthlySavings"];
    const newErr: Partial<Inputs> = {};
    req.forEach((k) => {
      if (!inputs[k] || isNaN(+inputs[k]!) || +inputs[k]! <= 0)
        newErr[k] = "Enter a valid number";
    });
    if (inputs.periodYears && (!Number.isInteger(+inputs.periodYears) || +inputs.periodYears > 50))
      newErr.periodYears = "Enter whole years (max 50)";
    if (inputs.alreadySaved && (+inputs.alreadySaved < 0 || isNaN(+inputs.alreadySaved)))
      newErr.alreadySaved = "Enter a valid number";
    if (inputs.monthlyIncome && (+inputs.monthlyIncome <= 0 || isNaN(+inputs.monthlyIncome)))
      newErr.monthlyIncome = "Enter a valid number";
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  /* style → annual return % */
  const styleRate = { Conservative: 4, Moderate: 8, Aggressive: 12 } as const;

  /* calculate */
  const calculate = () => {
    if (!validate()) return;
    setLoading(true);

    const target = +inputs.targetFund;
    const years = +inputs.periodYears;
    const months = years * 12;
    const savedNow = inputs.alreadySaved ? +inputs.alreadySaved : 0;
    const monthly = +inputs.monthlySavings;
    const annualRate = styleRate[inputs.style];
    const r = annualRate / 12 / 100; // monthly rate

    /* future value */
    const fvLump = savedNow * Math.pow(1 + r, months);
    const fvSip = monthly * ((Math.pow(1 + r, months) - 1) / r);
    const projected = fvLump + fvSip;
    const gap = target - projected;

    /* build chart data */
    const barData = [
      { name: "Target Fund", value: target },
      { name: "Projected", value: projected },
    ];

    const lineData: { month: number; saved: number }[] = [];
    let curr = savedNow;
    for (let m = 1; m <= months; m++) {
      curr = curr * (1 + r) + monthly;
      lineData.push({ month: m, saved: curr });
    }

    const result: Results = {
      projectedAmount: projected,
      gap,
      barData,
      lineData,
      months,
    };

    if (inputs.monthlyIncome) result.savingsRatio = (monthly / +inputs.monthlyIncome) * 100;

    setResults(result);
    setTimeout(() => setLoading(false), 350);
  };

  const BAR_COLORS = ["#108e66", "#272b2a"];

  /* ────────────────────────── render ────────────────────────── */
  return (
    <div className="container">
      {/* back nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Emergency Fund Calculator</h1>
      <p className="description">
        Find out if your current plan will hit the emergency corpus you need – and how to bridge any
        gap.
      </p>
      <div className="explanation">
  <p>
    <strong>Emergency Fund Calculator:</strong> This calculator helps you determine the ideal size of your <strong>emergency fund</strong> based on your living expenses and risk tolerance. An emergency fund is crucial to cover unexpected expenses like medical bills, car repairs, or job loss without disrupting your long-term financial goals.
  </p>
  <p>
    By entering your <strong>monthly expenses</strong> and desired fund coverage (e.g., 2, 3,  4 years), the calculator provides you with a target savings amount. This ensures you're prepared for financial surprises, offering peace of mind and financial security.
  </p>
</div>


      {/* ─── form ─── */}
      <div className="form-container">
        <h2 className="section-title">Plan Inputs</h2>
        <div className="input-group">
          {/* Target Fund */}
          <label>
            <span className="input-label">
              Desired Emergency Fund (₹)
              <TooltipIcon text="How much corpus you want as an emergency buffer." />
            </span>
            <input
              type="number"
              name="targetFund"
              value={inputs.targetFund}
              onChange={handleChange}
              placeholder="e.g., 300000"
            />
            {inputs.targetFund && (
              <span className="converter">{numberToWords(+inputs.targetFund)} Rupees</span>
            )}
            {errors.targetFund && <span className="error">{errors.targetFund}</span>}
          </label>

          {/* Period */}
          <label>
            <span className="input-label">
              Time Duration (Years)
              <TooltipIcon text="By when do you want to reach the target?" />
            </span>
            <input
              type="number"
              name="periodYears"
              value={inputs.periodYears}
              onChange={handleChange}
              placeholder="e.g., 3"
            />
            {inputs.periodYears && (
              <span className="converter">{numberToWords(+inputs.periodYears)} Years</span>
            )}
            {errors.periodYears && <span className="error">{errors.periodYears}</span>}
          </label>

          {/* Already Saved */}
          <label>
            <span className="input-label">
              Already Saved (₹)
              <TooltipIcon text="Current balance in your dedicated emergency fund." />
            </span>
            <input
              type="number"
              name="alreadySaved"
              value={inputs.alreadySaved}
              onChange={handleChange}
              placeholder="e.g., 50000"
            />
            {inputs.alreadySaved && (
              <span className="converter">{numberToWords(+inputs.alreadySaved)} Rupees</span>
            )}
            {errors.alreadySaved && <span className="error">{errors.alreadySaved}</span>}
          </label>

          {/* Monthly Savings */}
          <label>
            <span className="input-label">
              Monthly Contribution (₹)
              <TooltipIcon text="How much can you set aside each month towards this goal?" />
            </span>
            <input
              type="number"
              name="monthlySavings"
              value={inputs.monthlySavings}
              onChange={handleChange}
              placeholder="e.g., 7000"
            />
            {inputs.monthlySavings && (
              <span className="converter">{numberToWords(+inputs.monthlySavings)} Rupees</span>
            )}
            {errors.monthlySavings && <span className="error">{errors.monthlySavings}</span>}
          </label>

          {/* Monthly Income (optional) */}
          <label>
            <span className="input-label">
              Monthly Income (₹) <em style={{ fontWeight: 400 }}>(optional)</em>
              <TooltipIcon text="Helps us show how much of your income goes into this goal." />
            </span>
            <input
              type="number"
              name="monthlyIncome"
              value={inputs.monthlyIncome}
              onChange={handleChange}
              placeholder="e.g., 60000"
            />
            {inputs.monthlyIncome && (
              <span className="converter">{numberToWords(+inputs.monthlyIncome)} Rupees</span>
            )}
            {errors.monthlyIncome && <span className="error">{errors.monthlyIncome}</span>}
          </label>

          {/* Investment Style */}
          <label>
            <span className="input-label">
              Investment Style
              <TooltipIcon text="Expected return: Conservative 4 %, Moderate 8 %, Aggressive 12 % p.a." />
            </span>
            <select name="style" value={inputs.style} onChange={handleChange} className="select">
              <option>Conservative</option>
              <option>Moderate</option>
              <option>Aggressive</option>
            </select>
          </label>
        </div>

        <button className="calculate-button" disabled={loading} onClick={calculate}>
          {loading ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ─── results ─── */}
      {results && (
        <div className="results-container">
          <h2 className="results-title">Projection</h2>

          <div className="summary-card">
            <div className="summary-item">
              <strong>Projected Corpus:</strong> ₹{results.projectedAmount.toLocaleString("en-IN")} (
              {numberToWords(results.projectedAmount)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Target Amount:</strong> ₹{(+inputs.targetFund).toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>Status:</strong>{" "}
              {results.gap >= 0
                ? `Short by ₹${results.gap.toLocaleString("en-IN")}`
                : `Ahead by ₹${Math.abs(results.gap).toLocaleString("en-IN")}`}
            </div>
            {results.savingsRatio !== undefined && (
              <div className="summary-item">
                <strong>Saving → Income:</strong> {results.savingsRatio.toFixed(1)} %
              </div>
            )}
          </div>

          {/* suggestion banner */}
          <div
            className="suggestion-banner"
            style={{
              background: results.gap <= 0 ? "#e7f9e7" : "#fff8e5",
              borderLeft: `4px solid ${results.gap <= 0 ? "#108e66" : "#ff9f00"}`,
              padding: "0.8rem",
              borderRadius: "4px",
              marginBottom: "1.2rem",
            }}
          >
            {results.gap <= 0 ? (
              <>Great job! You’re on track to exceed your goal.</>
            ) : (
              <>
                You need an extra ₹{results.gap.toLocaleString("en-IN")} in&nbsp;
                {inputs.periodYears} year
                {+inputs.periodYears > 1 ? "s" : ""}. Consider increasing your monthly
                contribution or extending the time horizon.
              </>
            )}
          </div>

          {/* chart explanation */}
          <div className="chart-explanation">
            <p>
              <strong>Bar Chart</strong> compares the goal versus projected corpus. Switch to a{" "}
              <strong>Line Chart</strong> for month‑on‑month growth.
            </p>
          </div>

          {/* chart toggle */}
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
                  <Bar dataKey="value" fill={BAR_COLORS[0]} name="Amount" />
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
                    name="Cumulative Saved over Time (in Months)"
                    stroke="#108e66"
                    strokeWidth={2}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="disclaimer">
            <h4>Important Consideration</h4>
            <ul>
              <li>Projection assumes steady contributions and constant return.</li>
              <li>Actual returns vary; review your plan annually.</li>
              <li>Speak with a financial adviser for personalised advice.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ────────────────────────── styles ────────────────────────── */}
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
        .form-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
          .explanation {
          background: #FCFFFE;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
          color: #272B2A;
        }
        .explanation p {
          margin: 0.5rem 0;
          line-height: 1.5;
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
        input,
        .select {
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          height: 38px;
          font-size: 1rem;
        }
        select.select {
          background: #fff;
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
        .disclaimer {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #272b2a;
          border: 1px solid #272b2a;
        }
        .disclaimer h4 {
          margin: 0 0 0.5rem;
        }
        .disclaimer ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        .disclaimer li {
          margin-bottom: 0.4rem;
        }
        /* responsive */
        @media (max-width: 768px) {
          .input-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EmergencyFundCalculator;
