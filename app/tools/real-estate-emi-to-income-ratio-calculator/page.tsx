// File: /app/tools/emi-to-income-ratio-calculator/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// -----------------------
// Tooltip Component
// -----------------------
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="tooltip"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="info-icon">i</span>
      {hover && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltip {
          position: relative;
          display: inline-block;
          margin-left: 4px;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.6rem;
          font-weight: bold;
        }
        .tooltiptext {
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
          z-index: 10;
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

// -----------------------
// Number-to-Words Helper
// -----------------------
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero";
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
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const helper = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + helper(n % 100) : "")
      );
    if (n < 100000)
      return (
        helper(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + helper(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        helper(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + helper(n % 100000) : "")
      );
    return (
      helper(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + helper(n % 10000000) : "")
    );
  };
  return helper(Math.round(Math.abs(num)));
};
const numberToWordsPercent = (v: number): string => {
  const intPart = Math.floor(v),
    dec = Math.round((v - intPart) * 10);
  return dec
    ? `${numberToWords(intPart)} point ${numberToWords(dec)} percent`
    : `${numberToWords(intPart)} percent`;
};

// -----------------------
// Main Component
// -----------------------
export default function EMIToIncomeRatioCalculator() {
  // Inputs
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyEMI, setMonthlyEMI] = useState("");
  const [maxRatioPercent, setMaxRatioPercent] = useState("40");
  const [error, setError] = useState<string | null>(null);

  // Results
  const [actualRatio, setActualRatio] = useState(0);
  const [maxAffordableEMI, setMaxAffordableEMI] = useState(0);
  const [marginEMI, setMarginEMI] = useState(0);
  const [status, setStatus] = useState("");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [calculated, setCalculated] = useState(false);

  const fmtNum = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const fmtPct = (n: number) => n.toFixed(1);

  const handleCalculate = () => {
    setError(null);
    const inc = parseFloat(monthlyIncome);
    const emi = parseFloat(monthlyEMI);
    const pct = parseFloat(maxRatioPercent) / 100;
    if (!inc || inc <= 0) return setError("Enter a valid monthly income");
    if (emi < 0) return setError("Enter a valid EMI");
    if (pct <= 0) return setError("Enter a valid recommendation %");

    const ratio = (emi / inc) * 100;
    const maxEMI = inc * pct;
    const margin = maxEMI - emi;
    const stat =
      ratio <= pct * 100
        ? "Within recommended limit"
        : "Exceeds recommended limit";

    setActualRatio(ratio);
    setMaxAffordableEMI(maxEMI);
    setMarginEMI(margin);
    setStatus(stat);
    setCalculated(true);
  };

  const pieData = [
    { name: "EMI", value: parseFloat(monthlyEMI) || 0 },
    {
      name: "Balance",
      value: (parseFloat(monthlyIncome) || 0) - (parseFloat(monthlyEMI) || 0),
    },
  ];
  const barData = [
    { name: "Your EMI", value: parseFloat(monthlyEMI) || 0 },
    { name: "Max EMI", value: maxAffordableEMI },
  ];

  return (
    <main className="container">
      {/* Top Nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      {/* Header */}
      <h1 className="title">How Much of My Income Goes to EMI?</h1>
      <p className="description">
        See what share of your monthly net income your home-loan EMI consumes.
      </p>
      <div className="explanation">
        <p>
          <strong>EMI-to-Income Ratio:</strong> This is a key financial metric
          that compares your monthly home loan EMI to your monthly income. It
          helps gauge how affordable a property is relative to your earnings.
        </p>
        
        <p>
          This calculator evaluates your ratio based on your{" "}
          <strong>monthly income</strong> and proposed{" "}
          <strong>home loan EMI</strong>, giving insight into whether your real
          estate purchase aligns with safe borrowing practices.
        </p>
      </div>

      {/* Form */}
      <section className="card form-card">
        <div className="grid-inline">
          <div>
            <label>
              Monthly Net Income (₹)
              <TooltipIcon text="Your take-home salary after taxes" />
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g. 75,000"
            />
            {monthlyIncome && (
              <small className="converter">
                {numberToWords(+monthlyIncome)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Monthly EMI (₹)
              <TooltipIcon text="Your fixed home-loan installment" />
            </label>
            <input
              type="number"
              value={monthlyEMI}
              onChange={(e) => setMonthlyEMI(e.target.value)}
              placeholder="e.g. 30,000"
            />
            {monthlyEMI && (
              <small className="converter">
                {numberToWords(+monthlyEMI)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Recommended Max EMI % of Income
              <TooltipIcon text="Lenders recommend 30–40% of income" />
            </label>
            <input
              type="number"
              value={maxRatioPercent}
              onChange={(e) => setMaxRatioPercent(e.target.value)}
              placeholder="40"
            />
            <small className="converter">
              {numberToWordsPercent(+maxRatioPercent)}
            </small>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="calculate-button" onClick={handleCalculate}>
          Calculate My EMI Ratio
        </button>
      </section>

      {/* Results */}
      {calculated && (
        <section className="card results-card">
          <h2 className="section-title">Your Results</h2>
          <div className="grid-inline summary-grid">
            <div className="result">
              <strong>EMI-to-Income Ratio</strong>
              <p className="value">{fmtPct(actualRatio)}%</p>
              <small className="note">
                ({numberToWordsPercent(actualRatio)})
              </small>
            </div>
            <div className="result">
              <strong>Max Affordable EMI</strong>
              <p className="value">₹{fmtNum(maxAffordableEMI)}</p>
              <small className="note">
                ({numberToWords(maxAffordableEMI)} Rupees)
              </small>
            </div>
            <div className="result">
              <strong>EMI Margin</strong>
              <p className="value">₹{fmtNum(marginEMI)}</p>
              <small className="note">
                ({numberToWords(marginEMI)} Rupees)
              </small>
            </div>
            <div className="result">
              <strong>Affordability Status</strong>
              <p className="value">{status}</p>
            </div>
          </div>

          <div className="chart-toggle">
            <button
              className={chartType === "pie" ? "active" : ""}
              onClick={() => setChartType("pie")}
            >
              Pie Chart
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    <Cell fill="#108E66" />
                    <Cell fill="#272A2B" />
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                </PieChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={fmtNum} />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                  <Legend verticalAlign="bottom" />
                  <Bar dataKey="value" fill="#108E66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="disc">
          <h3 >Points to Consider</h3>

            <ul>
              <li>
                Keep EMIs ≤ 40% of net income to maintain healthy cash flow.
              </li>
              <li>
                Include other loans (car, personal) when assessing total debt.
              </li>
              <li>
                Maintain an emergency fund before upping your EMI capacity.
              </li>
              <li>
                Factor in future salary growth or bonuses for real capacity.
              </li>
              <li>
                Account for any fees (GST, processing) that add to EMI costs.
              </li>
            </ul>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
          margin: auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          text-align: left;
          margin-bottom: 1rem;
        }
        .back-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .description {
          text-align: center;
          color: #555;
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
        .card {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .form-card .grid-inline,
        .summary-grid {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .form-card .grid-inline > div,
        .summary-grid > div {
          flex: 1;
          min-width: 220px;
        }
        label {
          display: flex;
          align-items: center;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        input {
          width: 100%;
          padding: 0.6rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .converter {
          display: block;
          margin-top: 0.3rem;
          font-size: 0.85rem;
          color: #555;
        }
        .error {
          color: red;
          text-align: center;
          margin-top: 1rem;
        }
        .calculate-button {
          display: block;
          width: 100%;
          margin-top: 1rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .results-card .section-title {
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .result {
          text-align: center;
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 1rem;
        }
        .value {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }
        .note {
          font-size: 0.85rem;
          color: #555;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
          margin-top: 1.2rem;

        }
        .chart-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #fafafa;
          cursor: pointer;
          font-weight: 500;
          margin-top: 1.5rem;

        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
          margin-top: 1.5rem;
        }
        .chart-container {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
          margin-top: 1.5rem;
        }
        .points-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .points-list {
          list-style: disc inside;
          line-height: 1.5;
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

        @media (max-width: 600px) {
          .form-card .grid-inline,
          .summary-grid {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
