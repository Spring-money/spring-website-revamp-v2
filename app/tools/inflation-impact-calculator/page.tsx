/*
  Place this file at: /app/tools/inflationImpactCalculator/page.tsx
  ----------------------------------------------------------------
  Inflation-Impact Calculator – final version
  • Next.js 13 app router (client component)
  • Consistent Poppins font + brand colours
  • Tooltips, figures-to-words, chart toggle, table, CTA
  • NEW: Important Considerations card
*/

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

/**************** Tooltip Component ****************/
const Tooltip: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="tooltip"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="info-icon">i</span>
      {hover && <span className="tooltiptext">{text}</span>}

      {/* tooltip styles */}
      <style jsx>{`
        .tooltip {
          position: relative;
          display: inline-block;
          margin-left: 6px;
          cursor: pointer;
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
          width: 220px;
          background: #108e66;
          color: #fcfffe;
          padding: 6px 8px;
          position: absolute;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 4px;
          font-size: 0.75rem;
          line-height: 1.2;
          box-shadow: 0 2px 5px rgba(39, 43, 42, 0.2);
          z-index: 1000;
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

/************ Number-to-Words Helpers ************/
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

const numberToWordsPercent = (val: number): string => {
  if (Number.isInteger(val)) return numberToWords(val) + " percent";
  const int = Math.floor(val),
    dec = Math.round((val - int) * 10);
  return `${numberToWords(int)} point ${numberToWords(dec)} percent`;
};

/********** Main Inflation Impact Calculator **********/
const InflationImpactCalculator: React.FC = () => {
  const [present, setPresent] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [fv, setFv] = useState<number | null>(null);
  const [table, setTable] = useState<{ year: number; value: number }[]>([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatNumber = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const calculate = () => {
    if (
      !present ||
      !rate ||
      !years ||
      isNaN(+present) ||
      isNaN(+rate) ||
      isNaN(+years) ||
      +present <= 0 ||
      +years <= 0
    ) {
      setError("Please enter valid positive numbers");
      return;
    }
    setError(null);
    setLoading(true);

    const pv = +present;
    const r = +rate / 100;
    const n = +years;

    const future = pv * Math.pow(1 + r, n);
    const rows: { year: number; value: number }[] = [];

    for (let i = 1; i <= n; i++) {
      rows.push({ year: i, value: pv * Math.pow(1 + r, i) });
    }

    setFv(Math.round(future));
    setTable(rows);
    setLoading(false);
  };

  return (
    <div className="container">
      {/* Back nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      {/* Heading */}
      <h1 className="title">How Much Will Expenses Cost Post-Inflation?</h1>
      <p className="description">
        Enter today’s expense, an annual inflation rate and the number of years
        ahead to estimate its future cost.
      </p>
      <div className="explain">
        <p>
          <strong>Inflation Impact:</strong> This calculator shows how{" "}
          <strong>inflation reduces your money’s purchasing power</strong> over
          time. Even a small annual inflation rate can significantly erode the
          value of your savings or future expenses.
        </p>
        <p>
          It compares the <strong>current value</strong> of a specified amount
          with its <strong>future equivalent</strong> after accounting for
          inflation — or vice versa. This helps you plan realistically for{" "}
          <em>long-term goals, retirement, or large future purchases</em>.
        </p>
        <p>
          Use it to understand how much more you’ll need in the future to
          maintain the same lifestyle or afford the same items.
        </p>
      </div>

      {/* Form */}
      <div className="form-container">
        <h2 className="section-title">Inputs</h2>
        <div className="input-group">
          <label>
            <span className="input-label">
              Present Expense (₹)
              <Tooltip text="Current expense value" />
            </span>
            <input
              type="number"
              value={present}
              onChange={(e) => setPresent(e.target.value)}
              placeholder="e.g., 50000"
            />
            {present && (
              <div className="converter">{numberToWords(+present)} Rupees</div>
            )}
          </label>

          <label>
            <span className="input-label">
              Inflation Rate (%)
              <Tooltip text="Annual inflation rate" />
            </span>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g., 6"
            />
            {rate && (
              <div className="converter">{numberToWordsPercent(+rate)}</div>
            )}
          </label>

          <label>
            <span className="input-label">
              Years Ahead
              <Tooltip text="Number of years" />
            </span>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g., 5"
            />
            {years && (
              <div className="converter">{numberToWords(+years)} Years</div>
            )}
          </label>
        </div>

        {error && <div className="error">{error}</div>}

        <button
          className="calculate-button"
          onClick={calculate}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </div>

      {/* Results */}
      {fv !== null && (
        <div className="results-container">
          <h2 className="results-title">Results</h2>

          {/* summary */}
          <div className="summary-card">
            <div className="summary-item">
              Current Cost: <strong>₹{formatNumber(+present)}</strong>
            </div>
            <div className="summary-item">
              Future Cost: <strong>₹{formatNumber(fv)}</strong>
            </div>
            <div className="summary-item highlight">
              Increase: ₹{formatNumber(fv - +present)}
            </div>
          </div>

          {/* chart toggle */}
          <div className="chart-toggle">
            <button
              onClick={() => setChartType("line")}
              className={chartType === "line" ? "active" : ""}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={chartType === "bar" ? "active" : ""}
            >
              Bar Chart
            </button>
          </div>

          {/* chart */}
          <div className="chart-container">
            <ResponsiveContainer width="90%" height={300}>
              {chartType === "line" ? (
                <LineChart
                  data={table}
                  margin={{ left: 50, right: 30, top: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: "Year",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis tickFormatter={(v) => formatNumber(v)} />
                  <RechartsTooltip
                    formatter={(v: any) => formatNumber(v as number)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#108e66"
                    strokeWidth={2}
                    name="Cost"
                  />
                </LineChart>
              ) : (
                <BarChart data={table}>
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => formatNumber(v)} />
                  <RechartsTooltip
                    formatter={(v: any) => formatNumber(v as number)}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" name="Cost" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* table */}
          <h2 className="results-title">Year-wise Breakdown</h2>
          <div className="amortization-table">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Estimated Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{formatNumber(row.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NEW: Important considerations */}
          <div className="considerations">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                The calculation assumes a <strong>constant</strong> inflation
                rate every year; real-world inflation fluctuates.
              </li>
              <li>
                If inflation outpaces your income growth, the{" "}
                <strong>real burden</strong> of future expenses will be even
                higher.
              </li>
              <li>
                Use this tool to set savings targets for long-term goals (e.g.,
                education, retirement).
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* styles */}
      <style jsx>{`
        /* layout & typography */
        .container {
          padding: 2rem;
          font-family: Poppins, sans-serif;
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
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        /* form */
        .form-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
        }
        .input-group {
          display: grid;
          grid-template-columns: repeat( 2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .input-group label {
          display: flex;
          flex-direction: column;
        }
        .input-label {
          display: flex;
          align-items: center;
          font-size: 1rem;
          margin-bottom: 4px;
        }
        input {
          padding: 0.5rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          font-size: 1rem;
        }
        .converter {
          font-size: 0.9rem;
          color: #272b2a;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          display: block;
        }
        .calculate-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
        }
        .calculate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .explain {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
          color: #272b2a;
        }
        .explain p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }

        /* results */
        .results-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
        }
        .results-title {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .summary-card {
          display: grid;
          gap: 0.75rem;
          border: 1px solid #272b2a;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          background: #fcfffe;
        }
        .summary-item {
          font-size: 1rem;
        }
        .summary-item.highlight {
          font-weight: 700;
          color: #108e66;
        }

        /* charts */
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .chart-toggle button {
          background: transparent;
          border: 1px solid #272b2a;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
          transition: 0.2s;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          margin: 1rem 0 2rem;
          display: flex;
          justify-content: center;
        }

        /* table */
        .amortization-table {
          overflow: auto;
          border: 1px solid #272b2a;
          border-radius: 8px;
          max-height: 300px;
          margin-bottom: 1.5rem;
        }
        .amortization-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .amortization-table th,
        .amortization-table td {
          border: 1px solid #272b2a;
          padding: 0.5rem;
          text-align: center;
        }
        .amortization-table th {
          background: #108e66;
          color: #fcfffe;
          position: sticky;
          top: 0;
        }

        /* considerations card */
        .considerations {
          color: #272b2a;
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #272b2a;
          border: 1px solid #272b2a;
          margin-top: 2rem;
        }
        .considerations h4 {
          margin: 0 0 0.5rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .input-group {
            grid-template-columns: 1fr;
          }
          .chart-container {
            margin: 1.5rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InflationImpactCalculator;
