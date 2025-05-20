// File: /app/tools/festival-gift-budget-planner/page.tsx

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

// Tooltip Component
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
          display: inline-flex;
          align-items: center;
          margin-left: 6px;
          cursor: default;
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
          pointer-events: none;
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

// Number to Words (Indian)
const numberToWords = (num: number): string => {
  if (!num && num !== 0) return "";
  const n = Math.round(Math.abs(num));
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
  return helper(n);
};

interface Category {
  id: number;
  name: string;
  plan: string;
  actual: string;
}

export default function FestivalGiftBudgetPlanner() {
  const [festival, setFestival] = useState("Diwali 2024");
  const [eventDate, setEventDate] = useState("2024-11-01");
  const [budget, setBudget] = useState("50000");
  const [months, setMonths] = useState("6");
  const [returnRate, setReturnRate] = useState("5");
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Parents", plan: "10000", actual: "0" },
  ]);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [results, setResults] = useState<{
    plannedTotal: number;
    actualTotal: number;
    variance: number;
    monthlySaving: number;
    plannedPct: number;
    actualPct: number;
  } | null>(null);
  const [errors, setErrors] = useState<string>("");

  // Add / Remove row
  const addRow = () => {
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name: "", plan: "0", actual: "0" },
    ]);
  };
  const removeRow = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const validate = () => {
    if (!festival.trim() || !eventDate) return "Please fill all fields.";
    if (isNaN(+budget) || +budget <= 0) return "Invalid budget.";
    if (isNaN(+months) || +months <= 0) return "Invalid months.";
    if (isNaN(+returnRate) || +returnRate < 0) return "Invalid return rate.";
    for (const c of categories) {
      if (!c.name.trim()) return "Name cannot be empty.";
      if (isNaN(+c.plan) || +c.plan < 0) return "Invalid planned amount.";
      if (isNaN(+c.actual) || +c.actual < 0) return "Invalid actual amount.";
    }
    return "";
  };

  const calculate = () => {
    const err = validate();
    if (err) {
      setErrors(err);
      return;
    }
    setErrors("");
    const B = Math.round(+budget / 100) * 100;
    const plans = categories.map((c) => Math.round(+c.plan / 100) * 100);
    const actuals = categories.map((c) => Math.round(+c.actual / 100) * 100);
    const plannedTotal = plans.reduce((a, b) => a + b, 0);
    const actualTotal = actuals.reduce((a, b) => a + b, 0);
    const variance = B - actualTotal;
    const r = +returnRate / 100 / 12;
    const n = +months;
    const monthlySaving =
      r > 0
        ? Math.round((B * r) / (Math.pow(1 + r, n) - 1) / 100) * 100
        : Math.round(B / n / 100) * 100;
    const plannedPct = +((plannedTotal / B) * 100).toFixed(2);
    const actualPct = +((actualTotal / B) * 100).toFixed(2);
    setResults({
      plannedTotal,
      actualTotal,
      variance,
      monthlySaving,
      plannedPct,
      actualPct,
    });
  };

  // Prepare chart data
  const pieData = categories.map((c) => ({
    name: c.name,
    value: Math.round(+c.plan / 100) * 100,
  }));
  const barData = categories.map((c) => ({
    name: c.name,
    planned: Math.round(+c.plan / 100) * 100,
    actual: Math.round(+c.actual / 100) * 100,
  }));
  const COLORS = ["#108E66", "#272A2B", "#525ECC", "#F8B195", "#C06C84"];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much Can I Spend This Festive Season?</h1>
      <p className="description">
        Set your gift budget, list recipients, and track actual spending to stay
        on target.
      </p>
      <div className="explanation">
        <p>
          <strong>Festival Gift Budget Planner:</strong> This tool helps you
          allocate a thoughtful yet realistic{" "}
          <strong>budget for gifting</strong> during festive seasons by
          factoring in your{" "}
          <strong>
            total spend limit, number of recipients, and priority levels
          </strong>
          .
        </p>
        <p>
          It aims to balance <strong>generosity</strong> with{" "}
          <strong>financial discipline</strong>, ensuring you spread joy without
          overspending. You can plan ahead, categorize gifts by relationship or
          importance, and track your limits—all while sticking to your financial
          goals.
        </p>
      </div>

      {errors && <p className="error">{errors}</p>}

      {/* Budget Settings */}
      <section className="card">
        <h2 className="card-title">Festival & Budget Settings</h2>
        <div className="grid">
          {[
            {
              label: "Festival Name",
              value: festival,
              onChange: setFestival,
              tip: "E.g. Diwali 2024",
              type: "text",
            },
            {
              label: "Event Date",
              value: eventDate,
              onChange: setEventDate,
              tip: "When you'll spend most money",
              type: "date",
            },
            {
              label: "Overall Budget (₹)",
              value: budget,
              onChange: setBudget,
              tip: "Max you wish to spend",
              type: "number",
              converter: `${numberToWords(+budget)} Rupees`,
              placeholder: "e.g. ₹50,000 INR",
            },
            {
              label: "Months Until Festival",
              value: months,
              onChange: setMonths,
              tip: "For monthly saving calc",
              type: "number",
              converter: `${numberToWords(+months)} Months`,
              placeholder: "e.g. 6",
            },
            {
              label: "Expected Return on Savings (%)",
              value: returnRate,
              onChange: setReturnRate,
              tip: "Post-tax yield",
              type: "number",
              converter: `${numberToWords(+returnRate)} percent`,
              placeholder: "e.g. 5",
            },
          ].map((f, idx) => (
            <label key={idx}>
              <div className="label-row">
                {f.label}
                <TooltipIcon text={f.tip} />
              </div>
              <input
                type={f.type as any}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                placeholder={f.placeholder}
              />
              {f.converter && (
                <small className="converter">{f.converter}</small>
              )}
            </label>
          ))}
        </div>
      </section>

      {/* Recipients / Categories */}
      <section className="card">
        <h2 className="card-title">Recipients & Categories</h2>
        <table className="table-input">
          <thead>
            <tr>
              <th>#</th>
              <th>Person / Category</th>
              <th>Planned (₹)</th>
              <th>Actual (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>
                  <input
                    value={c.name}
                    onChange={(e) =>
                      setCategories((cs) =>
                        cs.map((x) =>
                          x.id === c.id ? { ...x, name: e.target.value } : x
                        )
                      )
                    }
                    placeholder="e.g. Alice"
                    title="Recipient name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={c.plan}
                    onChange={(e) =>
                      setCategories((cs) =>
                        cs.map((x) =>
                          x.id === c.id ? { ...x, plan: e.target.value } : x
                        )
                      )
                    }
                    placeholder="e.g. 5,000"
                    title="Planned amount in INR"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={c.actual}
                    onChange={(e) =>
                      setCategories((cs) =>
                        cs.map((x) =>
                          x.id === c.id ? { ...x, actual: e.target.value } : x
                        )
                      )
                    }
                    placeholder="e.g. 5,000"
                    title="Actual amount in INR"
                  />
                </td>
                <td>
                  {categories.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => removeRow(c.id)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-btn" onClick={addRow}>
          + Add Gift/Category
        </button>
      </section>

      <button className="calculate-btn" onClick={calculate}>
        Calculate Budget
      </button>

      {/* Results */}
      {results && (
        <section className="card results">
          <h2 className="card-title">Results for {festival}</h2>

          <div className="summary">
            <div>
              <strong>Budget Cap</strong>
              <br />₹{results.plannedTotal.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Planned Spend</strong>
              <br />₹{results.plannedTotal.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Actual Spend</strong>
              <br />₹{results.actualTotal.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Balance / Overshoot</strong>
              <br />₹{results.variance.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Monthly Saving Needed</strong>
              <br />₹{results.monthlySaving.toLocaleString("en-IN")}
            </div>
          </div>

          {/* Chart Toggle */}
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
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
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
                  <Legend />
                  <Bar dataKey="planned" fill="#108E66" />
                  <Bar dataKey="actual" fill="#272A2B" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Detailed Table */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Planned (₹)</th>
                  <th>Actual (₹)</th>
                  <th>Diff (₹)</th>
                  <th>% of Budget</th>
                </tr>
              </thead>
              <tbody>
                {barData.map((row, i) => (
                  <tr
                    key={i}
                    className={row.planned > +budget * 0.25 ? "flag" : ""}
                  >
                    <td>{i + 1}</td>
                    <td>{row.name}</td>
                    <td>{row.planned.toLocaleString("en-IN")}</td>
                    <td>{row.actual.toLocaleString("en-IN")}</td>
                    <td>
                      {(row.planned - row.actual).toLocaleString("en-IN")}
                    </td>
                    <td>{((row.actual / +budget) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={2}>
                    <strong>Total</strong>
                  </td>
                  <td>{results.plannedTotal.toLocaleString("en-IN")}</td>
                  <td>{results.actualTotal.toLocaleString("en-IN")}</td>
                  <td>
                    {(
                      results.plannedTotal - results.actualTotal
                    ).toLocaleString("en-IN")}
                  </td>
                  <td>{results.actualPct}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="disc">
            <h2>Important considerations</h2>
            <ul>
              <li>
                Assumes a fixed total budget set by you for the entire festival
                season.
              </li>
              <li>
                Does not factor in last-minute purchases or emotional
                overspending.
              </li>
              <li>
                Ideal for tracking planned vs. actual gifting spend per
                recipient.
              </li>
              <li>DIY or non-monetary gifts are not automatically included.</li>
              <li>
                Adjust for inflation or price surges during peak festive times.
              </li>
            </ul>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: "Poppins", sans-serif;
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
          cursor: pointer;
          font-weight: 500;
        }
        .title {
          font-size: 2rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #555;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
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
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
        }
        .label-row {
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        input {
          margin-top: 0.5rem;
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
        .table-input {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0.5rem;
        }
        .table-input th,
        .table-input td {
          border: 1px solid #ccc;
          padding: 0.5rem;
          text-align: center;
        }
        .add-btn {
          background: transparent;
          border: 1px solid #108e66;
          color: #108e66;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .remove-btn {
          background: #ff6666;
          border: none;
          color: #fff;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .calculate-btn {
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
        .results .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .results .summary > div {
          background: #fcfffe;
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
          margin: 1rem 0;
        }
        .chart-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          width: 100%;
          height: 300px;
        }
        .table-wrap {
          overflow-x: auto;
          margin: 1rem 0;
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
        .flag {
          background: #fff4e5;
        }
        .total-row {
          font-weight: 600;
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
