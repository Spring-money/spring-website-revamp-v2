/*  /app/tools/net-worth-calculator/page.tsx
    Net‑Worth Calculator – Spring Money
----------------------------------------------------------------------------*/
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
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ──────────────────────────
   Type Definitions
   ────────────────────────── */
interface Inputs {
  /* Assets */
  liquidAssets: string;
  partialLiquidAssets: string;
  illiquidAssets: string;
  /* Liabilities */
  shortTermLiabilities: string;
  longTermLiabilities: string;
  otherLiabilities: string;
}

interface Results {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatio: number;
  pieData: { name: string; value: number }[];
  barData: { name: string; value: number }[];
  assetDist: { liquid: number; partial: number; illiquid: number };
}

/* ──────────────────────────
   Tooltip Icon  (consistent style)
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
   Helper: number ➜ words  (Indian)
   ────────────────────────── */
const numberToWords = (num: number): string => {
  if (isNaN(num)) return "";
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
      return `${tens[Math.floor(n / 10)]}${n % 10 ? " " + ones[n % 10] : ""}`;
    if (n < 1000)
      return `${ones[Math.floor(n / 100)]} Hundred${
        n % 100 ? " " + helper(n % 100) : ""
      }`;
    if (n < 100000)
      return `${helper(Math.floor(n / 1000))} Thousand${
        n % 1000 ? " " + helper(n % 1000) : ""
      }`;
    if (n < 10000000)
      return `${helper(Math.floor(n / 100000))} Lakh${
        n % 100000 ? " " + helper(n % 100000) : ""
      }`;
    return `${helper(Math.floor(n / 10000000))} Crore${
      n % 10000000 ? " " + helper(n % 10000000) : ""
    }`;
  };
  return helper(Math.round(Math.abs(num)));
};

/* ──────────────────────────
   Component
   ────────────────────────── */
const NetWorthCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    liquidAssets: "",
    partialLiquidAssets: "",
    illiquidAssets: "",
    shortTermLiabilities: "",
    longTermLiabilities: "",
    otherLiabilities: "",
  });
  const [errors, setErrors] = useState<Partial<Inputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  /* universal change handler */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* validation (any filled value must be ≥ 0) */
  const validate = () => {
    const newErr: Partial<Inputs> = {};
    Object.entries(inputs).forEach(([k, v]) => {
      if (v && (isNaN(+v) || +v < 0))
        newErr[k as keyof Inputs] = "Enter a valid number";
    });
    /* need at least one asset OR one liability to proceed */
    const allEmpty = Object.values(inputs).every((v) => !v);
    if (allEmpty) newErr.liquidAssets = "Enter at least one value";
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  /* compute */
  const calculate = () => {
    if (!validate()) return;
    setLoading(true);

    /* blank → 0 */
    const v = Object.fromEntries(
      Object.entries(inputs).map(([k, val]) => [k, val ? +val : 0])
    ) as Record<keyof Inputs, number>;

    const totalAssets =
      v.liquidAssets + v.partialLiquidAssets + v.illiquidAssets;
    const totalLiabilities =
      v.shortTermLiabilities + v.longTermLiabilities + v.otherLiabilities;
    const netWorth = totalAssets - totalLiabilities;
    const debtToAssetRatio =
      totalAssets ? (totalLiabilities / totalAssets) * 100 : 0;

    const pieData = [
      { name: "Liquid", value: v.liquidAssets },
      { name: "Partial Liquid", value: v.partialLiquidAssets },
      { name: "Illiquid", value: v.illiquidAssets },
    ];
    const barData = [
      { name: "Total Assets", value: totalAssets },
      { name: "Total Liabilities", value: totalLiabilities },
    ];

    setResults({
      totalAssets,
      totalLiabilities,
      netWorth,
      debtToAssetRatio,
      pieData,
      barData,
      assetDist: {
        liquid: totalAssets ? (v.liquidAssets / totalAssets) * 100 : 0,
        partial: totalAssets ? (v.partialLiquidAssets / totalAssets) * 100 : 0,
        illiquid: totalAssets ? (v.illiquidAssets / totalAssets) * 100 : 0,
      },
    });
    setTimeout(() => setLoading(false), 300);
  };

  const PIE_COLORS = ["#108e66", "#525ecc", "#888888"];

  /* ────────────────────────── render ────────────────────────── */
  return (
    <div className="container">
      {/* Back nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Net Worth Calculator</h1>
      <p className="description">
        Get a clear snapshot of your financial health by comparing everything
        you own with everything you owe.
      </p>
      <div className="explanation">
  <p>
    <strong>Net Worth Calculator:</strong> This tool helps you determine your overall financial health by calculating the difference between your total assets and total liabilities.
  </p>
  <p>
    It provides a clear snapshot of your <strong>current financial position</strong>, helping you track your wealth growth over time and make informed decisions about budgeting, saving, and investing.
  </p>
</div>


      {/* ─── form ─── */}
      <div className="form-container">
        {/* Assets */}
        <h2 className="section-title">Assets</h2>
        <div className="input-group">
          {[
            [
              "liquidAssets",
              "Liquid Assets (₹)",
              "Savings A/c, liquid funds, FDs.",
            ],
            [
              "partialLiquidAssets",
              "Partial Liquid Assets (₹)",
              "Bonds, insurance, corporate deposits.",
            ],
            [
              "illiquidAssets",
              "Illiquid Assets (₹)",
              "Property, business, art, gold.",
            ],
          ].map(([k, lbl, tip]) => (
            <label key={k}>
              <span className="input-label">
                {lbl}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={k}
                value={(inputs as any)[k]}
                onChange={handleChange}
              />
              {(inputs as any)[k] && (
                <span className="converter">
                  {numberToWords(+inputs[k as keyof Inputs]!)} Rupees
                </span>
              )}
              {errors[k as keyof Inputs] && (
                <span className="error">{errors[k as keyof Inputs]}</span>
              )}
            </label>
          ))}
        </div>

        {/* Liabilities */}
        <h2 className="section-title">Liabilities</h2>
        <div className="input-group">
          {[
            [
              "shortTermLiabilities",
              "Short‑Term Liabilities (₹)",
              "Credit cards, taxes, bills.",
            ],
            [
              "longTermLiabilities",
              "Long‑Term Liabilities (₹)",
              "Home / car / personal loans.",
            ],
            [
              "otherLiabilities",
              "Other Liabilities (₹)",
              "Any additional outstanding debt.",
            ],
          ].map(([k, lbl, tip]) => (
            <label key={k}>
              <span className="input-label">
                {lbl}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={k}
                value={(inputs as any)[k]}
                onChange={handleChange}
              />
              {(inputs as any)[k] && (
                <span className="converter">
                  {numberToWords(+inputs[k as keyof Inputs]!)} Rupees
                </span>
              )}
              {errors[k as keyof Inputs] && (
                <span className="error">{errors[k as keyof Inputs]}</span>
              )}
            </label>
          ))}
        </div>

        <button
          className="calculate-button"
          disabled={loading}
          onClick={calculate}
        >
          {loading ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ─── results ─── */}
      {results && (
        <div className="results-container">
          <h2 className="results-title">Snapshot</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Total Assets:</strong> ₹
              {results.totalAssets.toLocaleString("en-IN")} (
              {numberToWords(results.totalAssets)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Total Liabilities:</strong> ₹
              {results.totalLiabilities.toLocaleString("en-IN")} (
              {numberToWords(results.totalLiabilities)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Net Worth:</strong> ₹
              {results.netWorth.toLocaleString("en-IN")} (
              {numberToWords(results.netWorth)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Debt‑to‑Asset Ratio:</strong>{" "}
              {results.debtToAssetRatio.toFixed(1)} %
            </div>
          </div>

          {/* suggestion banner */}
          <div
            className="suggestion-banner"
            style={{
              background: results.netWorth >= 0 ? "#e7f9e7" : "#fff8e5",
              borderLeft: `4px solid ${
                results.netWorth >= 0 ? "#108e66" : "#ff9f00"
              }`,
              padding: "0.8rem",
              borderRadius: "4px",
              marginBottom: "1.2rem",
            }}
          >
            {results.netWorth >= 0 ? (
              <>Great! You have a positive net worth. Keep building assets.</>
            ) : (
              <>
                Your liabilities exceed assets. Focus on debt repayment to
                improve your net worth.
              </>
            )}
          </div>

          {/* chart explanation */}
          <div className="chart-explanation">
            <p>
              Use the <strong>Pie Chart</strong> to view the asset allocation
              and the <strong>Bar Chart</strong> to compare total assets versus
              liabilities.
            </p>
          </div>

          {/* chart toggle */}
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

          {/* chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={results.pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)} %`
                    }
                  >
                    {results.pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                </PieChart>
              ) : (
                <BarChart data={results.barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" name="Amount" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* optional table */}
          <h2 className="results-title">Asset Breakdown</h2>
          <div className="amortization-table">
            <table>
              <thead>
                <tr>
                  <th>Asset Type</th>
                  <th>Value (₹)</th>
                  <th>% of Assets</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Liquid</td>
                  <td>
                    ₹
                    {(+inputs.liquidAssets || 0).toLocaleString("en-IN")}
                  </td>
                  <td>{results.assetDist.liquid.toFixed(1)} %</td>
                </tr>
                <tr>
                  <td>Partial Liquid</td>
                  <td>
                    ₹
                    {(+inputs.partialLiquidAssets || 0).toLocaleString("en-IN")}
                  </td>
                  <td>{results.assetDist.partial.toFixed(1)} %</td>
                </tr>
                <tr>
                  <td>Illiquid</td>
                  <td>
                    ₹
                    {(+inputs.illiquidAssets || 0).toLocaleString("en-IN")}
                  </td>
                  <td>{results.assetDist.illiquid.toFixed(1)} %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                A positive net worth indicates a healthy financial position.
              </li>
              <li>
                Aim to keep your debt‑to‑asset ratio as low as possible to
                reduce financial risk.
              </li>
              <li>
                Revisit your net‑worth calculation every six months to track
                progress.
              </li>
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
          overflow-x: auto;
          border: 1px solid #272b2a;
          border-radius: 8px;
          margin-bottom: 1.5rem;
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
          .summary-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default NetWorthCalculator;
