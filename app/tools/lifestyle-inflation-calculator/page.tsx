// File: app/tools/lifestyle-inflation-calculator/page.tsx
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
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ───────────────────────── Tooltip Icon ───────────────────────── */
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
          font-size: 0.65rem;
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
          z-index: 1000;
        }
        .tooltiptext::after {
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

/* ───────────────────── Indian Number → Words ──────────────────── */
const numberToWords = (num: number): string => {
  num = Math.abs(Math.round(num));
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
  return helper(num);
};
const fmtNum = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const fmtPct = (n: number) => (+n).toFixed(1);

export default function LifestyleInflationCalculator() {
  // Inputs
  const [currentExpense, setCurrentExpense] = useState("");
  const [expenseInflationRate, setExpenseInflationRate] = useState("");
  const [investmentReturnRate, setInvestmentReturnRate] = useState("");
  const [years, setYears] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Results
  const [sumExpenses, setSumExpenses] = useState(0);
  const [sumFlatExpenses, setSumFlatExpenses] = useState(0);
  const [extraTotalSpend, setExtraTotalSpend] = useState(0);
  const [potentialCorpus, setPotentialCorpus] = useState(0);
  const [projEndExpense, setProjEndExpense] = useState(0);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [chartDataLine, setChartDataLine] = useState<any[]>([]);
  const [chartDataBar, setChartDataBar] = useState<any[]>([]);
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    setError(null);
    const curr = parseFloat(currentExpense);
    const r_exp = parseFloat(expenseInflationRate) / 100;
    const r_inv = parseFloat(investmentReturnRate) / 100;
    const N = parseInt(years, 10);

    if (isNaN(curr) || curr <= 0)
      return setError("Enter valid current expense");
    if (isNaN(r_exp) || r_exp < 0)
      return setError("Enter valid inflation rate");
    if (isNaN(r_inv) || r_inv < 0) return setError("Enter valid return rate");
    if (isNaN(N) || N <= 0) return setError("Enter valid projection years");

    let sumExp = 0,
      sumFlat = 0;
    const diffs: number[] = [];

    for (let y = 1; y <= N; y++) {
      const ann = curr * Math.pow(1 + r_exp, y - 1) * 12;
      sumExp += ann;
      sumFlat += curr * 12;
      diffs.push(ann - curr * 12);
    }
    let fv = 0;
    for (let y = 1; y <= N; y++) {
      fv += diffs[y - 1] * Math.pow(1 + r_inv, N - y);
    }
    const endExp = curr * Math.pow(1 + r_exp, N - 1);

    // Chart data
    const lineArr = [];
    for (let y = 1; y <= N; y++) {
      lineArr.push({
        year: y,
        inflated: Math.round(curr * Math.pow(1 + r_exp, y - 1)),
        flat: curr,
      });
    }
    setChartDataLine(lineArr);
    setChartDataBar([
      { name: "Extra Spend", value: Math.round(sumExp - sumFlat) },
      { name: "Potential Corpus", value: Math.round(fv) },
    ]);

    setSumExpenses(sumExp);
    setSumFlatExpenses(sumFlat);
    setExtraTotalSpend(sumExp - sumFlat);
    setPotentialCorpus(fv);
    setProjEndExpense(endExp);
    setCalculated(true);
  };

  return (
    <main className="container">
      {/* Back button */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Is Lifestyle Inflation Eating Your Wealth?</h1>
      <p className="description">
        See how rising expenses erode savings and what you could have built
        instead.
      </p>
      <div className="explanation">
        <p>
          <strong>Lifestyle Inflation:</strong> This refers to the tendency to
          increase your spending as your income grows, often leading to{" "}
          <strong>little to no improvement in savings</strong> despite earning
          more.
        </p>
        <p>
          This calculator helps you understand how{" "}
          <strong>increased income</strong> combined with rising lifestyle costs
          can impact your <strong>long-term savings potential</strong>. It
          highlights how important it is to{" "}
          <strong>balance enjoyment and financial discipline</strong> as your
          earnings grow.
        </p>
      </div>

      {/* Input Form */}
      <section className="card form-card">
        <div className="grid">
          <div>
            <label className="input-label">
              Current Monthly Expenses (₹)
              <TooltipIcon text="Your fixed & variable monthly costs" />
            </label>
            <input
              type="number"
              value={currentExpense}
              onChange={(e) => setCurrentExpense(e.target.value)}
              placeholder="e.g. 50,000"
            />
            {currentExpense && (
              <div className="converter">
                {numberToWords(+currentExpense)} Rupees
              </div>
            )}
          </div>
          <div>
            <label className="input-label">
              Annual Expense Increase (%)
              <TooltipIcon text="Lifestyle inflation rate" />
            </label>
            <input
              type="number"
              value={expenseInflationRate}
              onChange={(e) => setExpenseInflationRate(e.target.value)}
              placeholder="e.g. 5"
            />
            {expenseInflationRate && (
              <div className="converter">
                {numberToWords(+expenseInflationRate)} Percent
              </div>
            )}
          </div>
          <div>
            <label className="input-label">
              Expected Investment Return (%)
              <TooltipIcon text="Return if invested instead" />
            </label>
            <input
              type="number"
              value={investmentReturnRate}
              onChange={(e) => setInvestmentReturnRate(e.target.value)}
              placeholder="e.g. 8"
            />
            {investmentReturnRate && (
              <div className="converter">
                {numberToWords(+investmentReturnRate)} Percent
              </div>
            )}
          </div>
          <div>
            <label className="input-label">
              Projection Period (Years)
              <TooltipIcon text="How many years to simulate" />
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="primary-button" onClick={handleCalculate}>
          Calculate Impact
        </button>
      </section>

      {/* Results */}
      {calculated && (
        <section className="card results-card">
          <div className="grid summary-grid">
            <div>
              <strong>Total Spend (inflated)</strong>
              <br />₹{fmtNum(sumExpenses)}
            </div>
            <div>
              <strong>Total Spend (flat)</strong>
              <br />₹{fmtNum(sumFlatExpenses)}
            </div>
            <div>
              <strong>Extra Spend</strong>
              <br />₹{fmtNum(extraTotalSpend)}
            </div>
            <div>
              <strong>Potential Corpus</strong>
              <br />₹{fmtNum(potentialCorpus)}
            </div>
            <div>
              <strong>End Monthly Expense</strong>
              <br />₹{fmtNum(projEndExpense)}
            </div>
          </div>

          <div className="toggle-group">
            <button
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              Line Chart
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "line" ? (
                <LineChart data={chartDataLine}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={fmtNum} />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                  <Legend />
                  <Line dataKey="inflated" stroke="#108e66" name="Inflated" />
                  <Line dataKey="flat" stroke="#272a2b" name="Flat" />
                </LineChart>
              ) : (
                <BarChart data={chartDataBar}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={fmtNum} />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="disc">
            <h3 className="section-title">Important considerations </h3>
            <ul className="points-list">
              <li>
                Even small annual increases compound significantly over time.
              </li>
              <li>Investing the difference can build significant wealth.</li>
              <li>Track and cap discretionary expenses to curb inflation.</li>
              <li>Review budget annually to adjust for income growth.</li>
            </ul>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
          margin: 0 auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272b2a;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          margin-bottom: 1rem;
        }
        .back-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        .title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
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
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
          padding: 1.5rem;
        }
        .form-card .grid,
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .input-label {
          display: flex;
          align-items: center;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .converter {
          font-size: 0.85rem;
          color: #444;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
        .primary-button,
        .calculate-button {
          display: block;
          margin: 1rem auto 0;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .summary-grid > div {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          font-weight: 500;
        }
        .toggle-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .toggle-group button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
        }
        .toggle-group .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-wrapper {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
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
          .form-card .grid,
          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
