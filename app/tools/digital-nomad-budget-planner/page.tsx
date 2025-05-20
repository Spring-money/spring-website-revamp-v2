/*  /app/tools/digital-nomad-budget-planner/page.tsx
    How Long Will My Funds Last as a Digital Nomad?
---------------------------------------------------------------- */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ───────────────── Types ───────────────── */
interface Inputs {
  income: string;
  travelFund: string;
  otherIncome: string;
  accommodation: string;
  insuranceVisas: string;
  coworking: string;
  transportFixed: string;
  food: string;
  leisure: string;
  miscellaneous: string;
  savingsGoal: string;
  bufferFund: string;
}
interface BufferPoint {
  m: number;
  buffer: number;
}
interface Results {
  totalIncome: number;
  fixedTotal: number;
  variableTotal: number;
  totalCosts: number;
  surplus: number;
  remainingToSave: number;
  monthsBuffer: number;
  bufferSeries: BufferPoint[];
}

/* ───────────────── Tooltip Icon ───────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="tooltipIcon"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="info-icon">i</span>
      {hover && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltipIcon {
          position: relative;
          display: inline-block;
          margin-left: 5px;
          cursor: pointer;
        }
        .info-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          font-size: 0.6rem;
          font-weight: bold;
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
        }
        .tooltiptext {
          position: absolute;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          background: #fcfffe;
          color: #272a2b;
          border: 1px solid #108e66;
          border-radius: 4px;
          padding: 6px 8px;
          width: 220px;
          font-size: 0.75rem;
          line-height: 1.2;
          z-index: 1000;
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
          border-color: #fcfffe transparent transparent transparent;
        }
      `}</style>
    </span>
  );
};

/* ───────────────── Number-to-Words ───────────────── */
const toWords = (n: number): string => {
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

/* ───────────────── Main Component ───────────────── */
const DigitalNomadBudgetPlanner: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    income: "",
    travelFund: "",
    otherIncome: "",
    accommodation: "",
    insuranceVisas: "",
    coworking: "",
    transportFixed: "",
    food: "",
    leisure: "",
    miscellaneous: "",
    savingsGoal: "",
    bufferFund: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    (Object.keys(inputs) as (keyof Inputs)[]).forEach((k) => {
      const v = inputs[k];
      if (!v || isNaN(+v) || +v < 0) e[k] = "Invalid number";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const income = +inputs.income;
    const other = +inputs.otherIncome;
    const travelFund = +inputs.travelFund;
    const accommodation = +inputs.accommodation;
    const insuranceVisas = +inputs.insuranceVisas;
    const coworking = +inputs.coworking;
    const transportFixed = +inputs.transportFixed;
    const food = +inputs.food;
    const leisure = +inputs.leisure;
    const miscellaneous = +inputs.miscellaneous;
    const savingsGoal = +inputs.savingsGoal;
    const buffer = +inputs.bufferFund;

    const totalIncome = income + other;
    const fixedTotal =
      accommodation + insuranceVisas + coworking + transportFixed;
    const variableTotal = food + leisure + miscellaneous;
    const totalCosts = fixedTotal + variableTotal;
    const surplus = Math.round(totalIncome - totalCosts);
    const remainingToSave =
      surplus < savingsGoal ? Math.round(savingsGoal - surplus) : 0;
    const monthsBuffer =
      surplus >= 0
        ? Math.floor(buffer / totalCosts)
        : Math.floor((travelFund + buffer) / (totalCosts - totalIncome));

    const bufferSeries: BufferPoint[] = [];
    let buf = buffer;
    for (let m = 1; m <= 12; m++) {
      buf += surplus;
      bufferSeries.push({ m, buffer: Math.round(buf) });
    }

    setResults({
      totalIncome,
      fixedTotal,
      variableTotal,
      totalCosts,
      surplus,
      remainingToSave,
      monthsBuffer,
      bufferSeries,
    });
    setTimeout(() => setBusy(false), 300);
  };

  const barData = results
    ? [
        { name: "Income", value: results.totalIncome },
        { name: "Costs", value: results.totalCosts },
        { name: "Surplus", value: results.surplus },
      ]
    : [];
  const lineData = results
    ? results.bufferSeries.map((r) => ({ m: r.m, buffer: r.buffer }))
    : [];
  const BAR_COLORS = ["#108e66", "#272a2b", "#525ecc"];

  return (
    <div className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn">Back to Dashboard</button>
        </Link>
      </div>
      <h1 className="title">How Long Will My Funds Last as a Digital Nomad?</h1>
      <p className="description">
        Enter your income, expenses, and savings goals to see your monthly
        surplus, buffer lifespan, and 12-month projection.
      </p>
      <div className="explanation">
  <p>
    <strong>Digital Nomad Budget Planner:</strong> This calculator helps you create a <strong>realistic monthly budget </strong> 
    while living and working remotely across different cities or countries. It's designed for <strong>digital nomads</strong> 
    who need to track expenses and manage income with <strong>geographic flexibility</strong>.
  </p>
  <p>
    By entering your expected <strong>accommodation, travel, food, workspace, and lifestyle expenses</strong> along with 
    your <strong>monthly income</strong>, the calculator provides a clear overview of your <strong>net surplus or deficit</strong>. 
    This helps you make smarter decisions about <strong>destination choices</strong> and <strong>spending habits</strong>.
  </p>
</div>


      <div className="card">
        <h2 className="section-title">Income & Funding</h2>
        <div className="input-group">
          {["income", "travelFund", "otherIncome"].map((key, i) => {
            const labels = [
              "Monthly Remote Income",
              "One-time Travel Fund",
              "Other Income",
            ];
            const tips = [
              "Net earnings per month after taxes",
              "Lump sum for travel",
              "Side gigs or passive income",
            ];
            return (
              <label key={key}>
                <span className="input-label">
                  {labels[i]} (₹)
                  <TooltipIcon text={tips[i]} />
                </span>
                <input
                  name={key}
                  type="number"
                  value={(inputs as any)[key]}
                  onChange={onChange}
                  placeholder={
                    key === "income" ? "e.g., 50,000" :
                    key === "travelFund" ? "e.g., 1,00,000" :
                    key === "otherIncome" ? "e.g., 10,000" :
                    ""
                  }
                />
                <span className="words">
                  {(inputs as any)[key] && !isNaN(+(inputs as any)[key])
                    ? `${toWords(+(inputs as any)[key])} Rupees`
                    : ""}
                </span>
                {errors[key as keyof Inputs] && (
                  <span className="error">{errors[key as keyof Inputs]}</span>
                )}
              </label>
            );
          })}
        </div>

        <h2 className="section-title">Fixed Monthly Costs</h2>
        <div className="input-group">
          {[
            "accommodation",
            "insuranceVisas",
            "coworking",
            "transportFixed",
          ].map((key, i) => {
            const labels = [
              "Accommodation",
              "Insurance & Visas",
              "Co-working / Internet",
              "Local Transport",
            ];
            const tips = [
              "Rent or Airbnb cost",
              "Health insurance + visas",
              "Workspace & internet",
              "SIM, metro/bus passes",
            ];
            return (
              <label key={key}>
                <span className="input-label">
                  {labels[i]} (₹)
                  <TooltipIcon text={tips[i]} />
                </span>
                <input
                  name={key}
                  type="number"
                  value={(inputs as any)[key]}
                  onChange={onChange}
                  placeholder={
                    key === "accommodation" ? "e.g., 20,000" :
                    key === "insuranceVisas" ? "e.g., 5,000" :
                    key === "coworking" ? "e.g., 3,000" :
                    key === "transportFixed" ? "e.g., 2,000" :
                    ""
                  }
                />
                <span className="words">
                  {(inputs as any)[key] && !isNaN(+(inputs as any)[key])
                    ? `${toWords(+(inputs as any)[key])} Rupees`
                    : ""}
                </span>
                {errors[key as keyof Inputs] && (
                  <span className="error">{errors[key as keyof Inputs]}</span>
                )}
              </label>
            );
          })}
        </div>

        <h2 className="section-title">Variable Monthly Costs</h2>
        <div className="input-group">
          {["food", "leisure", "miscellaneous"].map((key, i) => {
            const labels = [
              "Food & Dining",
              "Activities & Leisure",
              "Miscellaneous",
            ];
            const tips = [
              "Groceries + eating out",
              "Tours & entertainment",
              "Unexpected expenses",
            ];
            return (
              <label key={key}>
                <span className="input-label">
                  {labels[i]} (₹)
                  <TooltipIcon text={tips[i]} />
                </span>
                <input
                  name={key}
                  type="number"
                  value={(inputs as any)[key]}
                  onChange={onChange}
                  placeholder={
                    key === "food" ? "e.g., 10,000" :
                    key === "leisure" ? "e.g., 5,000" :
                    key === "miscellaneous" ? "e.g., 2,000" :
                    ""
                  }
                />
                <span className="words">
                  {(inputs as any)[key] && !isNaN(+(inputs as any)[key])
                    ? `${toWords(+(inputs as any)[key])} Rupees`
                    : ""}
                </span>
                {errors[key as keyof Inputs] && (
                  <span className="error">{errors[key as keyof Inputs]}</span>
                )}
              </label>
            );
          })}
        </div>

        <h2 className="section-title">Savings & Buffer</h2>
        <div className="input-group">
          {["savingsGoal", "bufferFund"].map((key, i) => {
            const labels = ["Monthly Savings Goal", "Emergency Buffer Fund"];
            const tips = [
              "Amount you aim to save per month",
              "Buffer for emergencies",
            ];
            return (
              <label key={key}>
                <span className="input-label">
                  {labels[i]} (₹)
                  <TooltipIcon text={tips[i]} />
                </span>
                <input
                  name={key}
                  type="number"
                  value={(inputs as any)[key]}
                  onChange={onChange}
                  placeholder={
                    key === "savingsGoal" ? "e.g., 50,000" :
                    key === "bufferFund" ? "e.g., 10,000" :
                    ""
                  }
                />
                <span className="words">
                  {(inputs as any)[key] && !isNaN(+(inputs as any)[key])
                    ? `${toWords(+(inputs as any)[key])} Rupees`
                    : ""}
                </span>
                {errors[key as keyof Inputs] && (
                  <span className="error">{errors[key as keyof Inputs]}</span>
                )}
              </label>
            );
          })}
        </div>

        <button className="calculate-btn" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate Budget"}
        </button>
      </div>

      {results && (
        <div className="card">
          <h2 className="section-title">Budget Snapshot</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Total Income:</strong> ₹
              {results.totalIncome.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>Total Costs:</strong> ₹
              {results.totalCosts.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>Surplus / Deficit:</strong> ₹
              {results.surplus.toLocaleString("en-IN")}
            </div>
            {results.remainingToSave > 0 && (
              <div className="summary-item">
                <strong>Shortfall to Savings Goal:</strong> ₹
                {results.remainingToSave.toLocaleString("en-IN")}
              </div>
            )}
            <div className="summary-item">
              <strong>Buffer Sustainability:</strong> {results.monthsBuffer}{" "}
              months
            </div>
          </div>

          <div className="chart-note">
            <p>
              Use the toggle below to switch between your income vs costs bar
              chart and your buffer projection line chart for the next 12
              months.
            </p>
          </div>
          <div className="toggle-btns">
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

          {chartType === "bar" ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ left: 30, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#272a2b" />
                  <YAxis stroke="#272a2b" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {barData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData} margin={{ left: 30, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="m"
                    label={{
                      value: "Month",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    stroke="#272a2b"
                  />
                  <YAxis stroke="#272a2b" />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="buffer"
                    name="Buffer"
                    stroke="#108e66"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <h2 className="section-title">12‑Month Buffer Projection</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Cumulative Buffer (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.bufferSeries.map((r) => (
                  <tr key={r.m}>
                    <td>{r.m}</td>
                    <td>{r.buffer.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actionable">
            <h3>Important consideration</h3>
            <p>
               If your surplus is below your savings goal, consider adjusting
              your leisure or accommodation costs.
            </p>
            <p>
               With the current buffer, you can sustain your lifestyle for **
              {results.monthsBuffer} months** without new income.
            </p>
            <p>
               Aim to keep your surplus at or above your savings goal for
              long‑term stability.
            </p>
            
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 1.5rem 1rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
          width: 100%;
          margin: 0 auto;
        }
        .top-nav {
          margin-bottom: 1rem;
        }
        .back-btn {
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
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .card {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        .input-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem 1.5rem;
          margin-bottom: 1.2rem;
        }
        .input-label {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
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
        input {
          width: 100%;
          height: 42px;
          padding: 0.55rem 0.5rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          margin-top: 0.35rem;
          background: #fcfffe;
        }
        .words {
          font-size: 0.8rem;
          margin-top: 2px;
          color: #272a2b;
        }
        .error {
          color: red;
          font-size: 0.8rem;
        }
        .calculate-btn,
        .cta-btn {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
        }
        .summary-card {
          background: #fcfffe;
          padding: 0.9rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          display: grid;
          gap: 0.65rem;
        }
        .summary-item {
          font-size: 1rem;
        }
        .chart-note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .toggle-btns {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin: 1rem 0;
        }
        .toggle-btns button {
          background: #ffffff;
          border: 1px solid #272a2b;
          padding: 0.4rem 0.9rem;
          cursor: pointer;
          border-radius: 20px;
          font-weight: 500;
        }
        .toggle-btns .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          margin-bottom: 1rem;
        }
        .table-wrap {
          max-height: 200px;
          overflow: auto;
          border: 1px solid #272a2b;
          border-radius: 8px;
          margin-bottom: 1rem;
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
          position: sticky;
          top: 0;
        }
        .actionable {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }
        }
        .actionable p {
          
        }
        @media (max-width: 768px) {
          .input-group {
            grid-template-columns: 1fr;
          }
          .summary-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <style jsx global>{`
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

export default DigitalNomadBudgetPlanner;
