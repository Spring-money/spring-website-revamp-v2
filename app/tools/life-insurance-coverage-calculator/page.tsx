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
} from "recharts";

// Tooltip icon aligned with label
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tooltip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="info-icon">i</span>
      {show && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltip {
          position: relative;
          display: inline-block;
          margin-left: 4px;
          vertical-align: middle;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.7rem;
          font-weight: bold;
          cursor: default;
        }
        .tooltiptext {
          position: absolute;
          bottom: 120%;
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
          border: 4px solid transparent;
          border-top-color: #108e66;
        }
      `}</style>
    </span>
  );
};

// Convert numbers to Indian words
const numberToWords = (n: number): string => {
  if (isNaN(n)) return "";
  const num = Math.round(Math.abs(n));
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
  const helper = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100)
      return tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "");
    if (x < 1000)
      return (
        ones[Math.floor(x / 100)] +
        " Hundred" +
        (x % 100 ? " " + helper(x % 100) : "")
      );
    if (x < 100000)
      return (
        helper(Math.floor(x / 1000)) +
        " Thousand" +
        (x % 1000 ? " " + helper(x % 1000) : "")
      );
    if (x < 10000000)
      return (
        helper(Math.floor(x / 100000)) +
        " Lakh" +
        (x % 100000 ? " " + helper(x % 100000) : "")
      );
    return (
      helper(Math.floor(x / 10000000)) +
      " Crore" +
      (x % 10000000 ? " " + helper(x % 10000000) : "")
    );
  };
  return helper(num) + " Rupees";
};

// Round up to nearest 50,000
const roundUp50k = (x: number) => Math.ceil(x / 50000) * 50000;

export default function LifeInsuranceCoverageCalculator() {
  // Inputs
  const [income, setIncome] = useState("600000");
  const [expense, setExpense] = useState("500000");
  const [inflation, setInflation] = useState("6");
  const [yearsSupport, setYearsSupport] = useState("15");
  const [dependants, setDependants] = useState("2");
  const [loans, setLoans] = useState("200000");
  const [goals, setGoals] = useState("1000000");
  const [currentCover, setCurrentCover] = useState("500000");
  const [assets, setAssets] = useState("200000");
  const [errors, setErrors] = useState("");
  const [results, setResults] = useState<{
    coverNeeded: number;
    shortfall: number;
    components: { name: string; value: number }[];
  } | null>(null);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  // Validation
  const validate = () => {
    if (+income <= 0) return "Income must be positive.";
    if (+expense <= 0) return "Expense must be positive.";
    if (+inflation < 0) return "Inflation cannot be negative.";
    if (+yearsSupport <= 0) return "Years of support must be ≥ 1.";
    if (+dependants < 0) return "Dependants cannot be negative.";
    if (+loans < 0 || +goals < 0 || +currentCover < 0 || +assets < 0)
      return "Liabilities, goals, cover & assets ≥ 0.";
    return "";
  };

  // Calculation
  const calculate = () => {
    const err = validate();
    if (err) {
      setErrors(err);
      return;
    }
    setErrors("");
    const exp = +expense;
    const yrs = +yearsSupport;
    const realReturn = 0.04; // post-tax growth
    // PV of expenses
    const expensePV = exp * ((1 - Math.pow(1 + realReturn, -yrs)) / realReturn);
    const liabilities = +loans;
    const goalFund = +goals;
    const assetOffset = +assets;
    const rawNeed = expensePV + liabilities + goalFund - assetOffset;
    const coverNeeded = roundUp50k(rawNeed);
    const shortfall = Math.max(0, coverNeeded - +currentCover);
    setResults({
      coverNeeded,
      shortfall,
      components: [
        { name: "Expenses PV", value: Math.round(expensePV) },
        { name: "Liabilities", value: liabilities },
        { name: "Goals Fund", value: goalFund },
        { name: "Assets Offset", value: assetOffset },
      ],
    });
  };

  const pieData = results?.components || [];
  const barData = results
    ? [
        { name: "Required Cover", value: results.coverNeeded },
        { name: "Existing Cover", value: +currentCover },
      ]
    : [];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>
      <h1 className="title">How Much Life-Cover Do I Need?</h1>
      <p className="description">
        Estimate the term-insurance cover that secures your family’s lifestyle,
        clears liabilities, and funds future goals.
      </p>
      <div className="explanation">
  <p>
    <strong>Life Insurance Coverage Calculator:</strong> This tool estimates how much life insurance coverage your family may need to stay financially secure in your absence.
  </p>
  <p>
    It considers key factors like <strong>living expenses</strong>, <strong>outstanding debts</strong>, <strong>children’s education costs</strong>, and <strong>existing assets or savings</strong>. The goal is to ensure your loved ones can maintain their lifestyle and meet major financial goals if you’re no longer around.
  </p>
</div>

      {errors && <p className="error">{errors}</p>}

      <section className="card">
        <h2>Income &amp; Expenses</h2>
        <div className="grid">
          <label>
            <div>
              {" "}
              Current Annual Income{" "}
              <TooltipIcon text="Net salary or business income after tax" />{" "}
            </div>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="eg 600000"
            />
            <small>{numberToWords(+income)}</small>
          </label>
          <label>
            <div>
              {" "}
              Annual Household Expense{" "}
              <TooltipIcon text="Yearly living costs for your family" />{" "}
            </div>
            <input
              type="number"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
            />
            <small>{numberToWords(+expense)}</small>
          </label>
          <label>
            <div>
              {" "}
              Expected Inflation (%){" "}
              <TooltipIcon text="Average annual price rise" />{" "}
            </div>
            <input
              type="number"
              value={inflation}
              onChange={(e) => setInflation(e.target.value)}
            />
            <small>{numberToWords(+inflation)} percent</small>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Family &amp; Horizon</h2>
        <div className="grid">
          <label>
            <div>
              {" "}
              Years to Support{" "}
              <TooltipIcon text="Until your youngest is self-reliant" />{" "}
            </div>
            <input
              type="number"
              value={yearsSupport}
              onChange={(e) => setYearsSupport(e.target.value)}
            />
            <small>{numberToWords(+yearsSupport)} Years</small>
          </label>
          <label>
            <div>
              {" "}
              Number of Dependants{" "}
              <TooltipIcon text="Spouse, kids, elderly parents" />{" "}
            </div>
            <input
              type="number"
              value={dependants}
              onChange={(e) => setDependants(e.target.value)}
            />
            <small>{numberToWords(+dependants)}</small>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Liabilities &amp; Goals</h2>
        <div className="grid">
          <label>
            <div>
              {" "}
              Outstanding Loans{" "}
              <TooltipIcon text="Principal left on all loans" />{" "}
            </div>
            <input
              type="number"
              value={loans}
              onChange={(e) => setLoans(e.target.value)}
            />
            <small>{numberToWords(+loans)}</small>
          </label>
          <label>
            <div>
              Future Goals Fund{" "}
              <TooltipIcon text="Today’s cost for education, weddings, etc." />{" "}
            </div>
            <input
              type="number"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
            <small>{numberToWords(+goals)}</small>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Current Cushion</h2>
        <div className="grid">
          <label>
            <div>
              {" "}
              Existing Life Cover{" "}
              <TooltipIcon text="Term/EPF/Employer cover you already have" />{" "}
            </div>
            <input
              type="number"
              value={currentCover}
              onChange={(e) => setCurrentCover(e.target.value)}
            />
            <small>{numberToWords(+currentCover)}</small>
          </label>
          <label>
            <div>
              {" "}
              Liquid Assets{" "}
              <TooltipIcon text="FDs, mutual funds earmarked for family" />{" "}
            </div>
            <input
              type="number"
              value={assets}
              onChange={(e) => setAssets(e.target.value)}
            />
            <small>{numberToWords(+assets)}</small>
          </label>
        </div>
      </section>

      <button className="calc-button" onClick={calculate}>
        Calculate Cover
      </button>

      {results && (
        <section className="card results">
          <h2>Your Recommended Cover</h2>
          <div className="outputs">
            <div>
              <strong>Total Cover Needed</strong>
              <br />₹{results.coverNeeded.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Existing Cover</strong>
              <br />₹{(+currentCover).toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Shortfall</strong>
              <br />₹{results.shortfall.toLocaleString("en-IN")}
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
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          ["#108E66", "#272A2B", "#525ECC", "#108E66"][i % 4]
                        }
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                </PieChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(v) =>
                      `₹${(v as number).toLocaleString("en-IN")}`
                    }
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Bar dataKey="value" fill="#108E66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3>Year-Wise Cash-Flow</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Inflated Expense</th>
                  <th>Discounted PV</th>
                  <th>Remaining Corpus</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const rows = [];
                  let remaining = results.coverNeeded;
                  let cumPV = 0;
                  const inf = +inflation / 100,
                    r = 0.04;
                  for (let y = 1; y <= +yearsSupport; y++) {
                    const infExp = +expense * Math.pow(1 + inf, y - 1);
                    const pv = infExp / Math.pow(1 + r, y);
                    cumPV += pv;
                    remaining = results.coverNeeded - cumPV;
                    rows.push(
                      <tr key={y}>
                        <td>{y}</td>
                        <td>₹{Math.round(infExp).toLocaleString("en-IN")}</td>
                        <td>₹{Math.round(pv).toLocaleString("en-IN")}</td>
                        <td>
                          ₹
                          {Math.max(0, Math.round(remaining)).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                })()}
              </tbody>
            </table>
          </div>

          <ul className="disc">
          <h3>Important Considerations</h3>

            <li>
              Insurers quote in ₹50 k multiples—our figures are rounded up.
            </li>
            <li>
              Actual premium varies by health, occupation & plan features.
            </li>
            <li>Inflation and returns assumptions affect your cover need.</li>
            <li>Review and update cover periodically as goals change.</li>
          </ul>
        </section>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
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
          font-weight: 500;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .error {
          color: red;
          text-align: center;
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
        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-weight: 500;
        }
        input,
        select {
          margin-top: 0.25rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        small {
          margin-top: 0.25rem;
          color: #444;
          font-size: 0.85rem;
        }
        .calc-button {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 2rem;
        }
        .results .outputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .results .outputs > div {
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          font-weight: 500;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .chart-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
         
        }
        .table-wrap {
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #272a2b;
          padding: 0.5rem;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fcfffe;
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
        }
      `}</style>
    </main>
  );
}
