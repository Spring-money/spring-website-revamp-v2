/*  /app/tools/subscription-cost-analyser-calculator/page.tsx
    Subscription Cost Analyser Calculator — Spring Money Theme
---------------------------------------------------------------- */
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

/* ───────── Types ───────── */
type Frequency = "Monthly" | "Quarterly" | "Bi-Annual" | "Annual";

interface Subscription {
  id: number;
  name: string;
  category: string;
  cost: string;
  frequency: Frequency;
  usagePerMonth: string;
}

interface Totals {
  totalMonthly: number;
  totalAnnual: number;
  highestName: string;
}

/* ───────── Helpers ───────── */
const freqToMonths: Record<Frequency, number> = {
  Monthly: 1,
  Quarterly: 3,
  "Bi-Annual": 6,
  Annual: 12,
};

const palette = ["#108e66", "#0c7e5a", "#086f4d", "#055f41", "#024F35"];

const Tip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="i">i</span>
      {open && <span className="box">{text}</span>}
      <style jsx>{`
        .tip {
          position: relative;
          margin-left: 6px;
          cursor: pointer;
        }
        .i {
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          font-size: 0.6rem;
          line-height: 14px;
          text-align: center;
          font-weight: 700;
          display: inline-block;
        }
        .box {
          position: absolute;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          background: #fcfffe;
          color: #272a2b;
          border: 1px solid #108e66;
          border-radius: 4px;
          padding: 6px 8px;
          font-size: 0.75rem;
          line-height: 1.2;
          width: 220px;
          white-space: pre-wrap;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .box::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -4px;
          border: 4px solid transparent;
          border-top-color: #fcfffe;
        }
      `}</style>
    </span>
  );
};

const words = (n: number): string => {
  if (!isFinite(n)) return "";
  n = Math.round(Math.abs(n));
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
  const h = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100)
      return `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`;
    if (x < 1000)
      return `${ones[Math.floor(x / 100)]} Hundred${
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

/* ───────── Component ───────── */
const SubscriptionCostAnalyser: React.FC = () => {
  const [subs, setSubs] = useState<Subscription[]>([
    {
      id: 1,
      name: "",
      category: "Entertainment",
      cost: "",
      frequency: "Monthly",
      usagePerMonth: "",
    },
  ]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {}
  );
  const [costPerUse, setCostPerUse] = useState<Record<number, number>>({});
  const [chart, setChart] = useState<"pie" | "bar">("pie");
  const [busy, setBusy] = useState(false);

  /* -------- handlers -------- */
  const handleChange = (id: number, field: keyof Subscription, value: string) =>
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );

  const addRow = () => {
    const nextId = subs.length ? Math.max(...subs.map((s) => s.id)) + 1 : 1;
    setSubs([
      ...subs,
      {
        id: nextId,
        name: "",
        category: "Entertainment",
        cost: "",
        frequency: "Monthly",
        usagePerMonth: "",
      },
    ]);
  };

  const removeRow = (id: number) =>
    setSubs((prev) => prev.filter((s) => s.id !== id));

  /* -------- calculation -------- */
  const calculate = () => {
    setBusy(true);
    const cleanSubs = subs.filter(
      (s) => s.name && +s.cost > 0 && +s.usagePerMonth > 0
    );

    const monthlySubs = cleanSubs.map((s) => {
      const months = freqToMonths[s.frequency];
      const monthlyCost = +s.cost / months;
      const cpu = monthlyCost / +s.usagePerMonth;
      return { ...s, monthlyCost, cpu };
    });

    const totalMonthly = monthlySubs.reduce((sum, s) => sum + s.monthlyCost, 0);
    const highest = monthlySubs.reduce(
      (max, s) => (s.monthlyCost > max.monthlyCost ? s : max),
      { monthlyCost: 0, name: "" } as any
    );

    const categoryMap: Record<string, number> = {};
    monthlySubs.forEach((s) => {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + s.monthlyCost;
    });

    const cpuMap: Record<number, number> = {};
    monthlySubs.forEach((s) => (cpuMap[s.id] = s.cpu));

    setTotals({
      totalMonthly: Math.round(totalMonthly),
      totalAnnual: Math.round(totalMonthly * 12),
      highestName: highest.name || "—",
    });
    setCategoryTotals(categoryMap);
    setCostPerUse(cpuMap);
    setBusy(false);
  };

  /* -------- chart data -------- */
  const pieData = Object.entries(categoryTotals).map(([cat, val]) => ({
    name: cat,
    value: Math.round(val),
  }));

  const barData = [...subs]
    .filter((s) => s.name && +s.cost > 0)
    .map((s) => ({
      name: s.name,
      value: Math.round(+s.cost / freqToMonths[s.frequency]),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Subscription Cost Analyser</h1>
      <p className="sub">
        Catalogue your recurring subscriptions and uncover saving opportunities.
      </p>
      <div className="explanation-box">
  <p>
    <strong>Subscription Cost Analyzer:</strong> This tool helps you estimate and track the cost of various subscription services over time, allowing you to analyze how they impact your budget.
  </p>
  <p>
    This calculator allows you to input the <strong>monthly subscription costs</strong> of various services (such as streaming platforms, fitness apps, software subscriptions, etc.) and calculates the <strong>annual expenditure</strong>. It will also show you the cumulative cost over a specific period, helping you identify opportunities to save.
  </p>
  <p>
    Remember, <strong>small monthly expenses</strong> can add up significantly over the course of a year. This tool helps you make informed decisions about your ongoing subscriptions.
  </p>
</div>

      {/* input table */}
      <div className="card">
        <h2 className="sect">Your Subscriptions</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Total Cost (₹)</th>
                <th>Frequency</th>
                <th>Uses/Month</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>
                    <input
                      name="name"
                      value={s.name}
                      onChange={(e) =>
                        handleChange(s.id, "name", e.target.value)
                      }
                      placeholder="e.g., Netflix"
                      aria-label="Subscription name"
                    />
                  </td>

                  {/* accessible select for category */}
                  <td>
                    <select
                      aria-label="Subscription category"
                      value={s.category}
                      onChange={(e) =>
                        handleChange(s.id, "category", e.target.value)
                      }
                    >
                      {[
                        "Entertainment",
                        "Productivity",
                        "Health",
                        "Utilities",
                        "Other",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      name="cost"
                      type="number"
                      value={s.cost}
                      onChange={(e) =>
                        handleChange(s.id, "cost", e.target.value)
                      }
                      placeholder="e.g., 799"
                      aria-label="Cost amount"
                    />
                  </td>

                  {/* accessible select for frequency */}
                  <td>
                    <select
                      aria-label="Billing frequency"
                      value={s.frequency}
                      onChange={(e) =>
                        handleChange(
                          s.id,
                          "frequency",
                          e.target.value as Frequency
                        )
                      }
                    >
                      {["Monthly", "Quarterly", "Bi-Annual", "Annual"].map(
                        (f) => (
                          <option key={f}>{f}</option>
                        )
                      )}
                    </select>
                  </td>

                  <td>
                    <input
                      name="usagePerMonth"
                      type="number"
                      value={s.usagePerMonth}
                      onChange={(e) =>
                        handleChange(s.id, "usagePerMonth", e.target.value)
                      }
                      placeholder="e.g., 30"
                      aria-label="Expected uses per month"
                    />
                  </td>
                  <td>
                    {subs.length > 1 && (
                      <button
                        className="del"
                        onClick={() => removeRow(s.id)}
                        aria-label="Delete row"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="add" onClick={addRow}>
          ＋ Add Subscription
        </button>
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate My Subscription Costs"}
        </button>
      </div>

      {/* results */}
      {totals && (
        <div className="card">
          <h2 className="sect">Summary</h2>
          <div className="summary">
            <div>
              <strong>Total Monthly Cost</strong>
              <br />₹{totals.totalMonthly.toLocaleString("en-IN")}
              <br />({words(totals.totalMonthly)} Rupees)
            </div>
            <div>
              <strong>Total Annual Cost</strong>
              <br />₹{totals.totalAnnual.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Highest-Cost Subscription</strong>
              <br />
              {totals.highestName}
            </div>
          </div>

          {/* chart toggle */}
          <div className="chart-toggle">
            <button
              onClick={() => setChart("pie")}
              className={chart === "pie" ? "active" : ""}
            >
              By Category
            </button>
            <button
              onClick={() => setChart("bar")}
              className={chart === "bar" ? "active" : ""}
            >
              Top 5 Services
            </button>
          </div>

          {/* charts */}
          <div className="chart">
            <ResponsiveContainer width="100%" height={310}>
              {chart === "pie" ? (
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                </PieChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* cost-per-use table */}
          <h3 className="sect" style={{ marginTop: "1rem" }}>
            Cost-Per-Use Table
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Subscription</th>
                  <th>₹/Use</th>
                </tr>
              </thead>
              <tbody>
                {subs
                  .filter((s) => s.name && costPerUse[s.id] !== undefined)
                  .map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{costPerUse[s.id].toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* actionable insights */}
          <div className="note">
            <p>
              Your top subscription, <strong>{totals.highestName}</strong>,
              costs ₹{barData[0]?.value?.toLocaleString("en-IN") || "0"}/month.
            </p>
            <p>
              {Object.values(costPerUse).some((v) => v > 50)
                ? "Some services cost more than ₹50 per use. Consider cancelling or downgrading low-value subscriptions."
                : "All tracked services cost less than ₹50 per use — great value!"}
            </p>
          </div>
        </div>
      )}

      {/* ───────── styles ───────── */}
      <style jsx>{`
        .wrap {
          padding: 1.25rem 1rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
          max-width: 100%;
          margin: 0 auto;
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
          font-weight: 500;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2.4rem;
          font-weight: 700;
          margin: 0.3rem 0;
        }
        .sub {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1.2rem;
        }

        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .sect {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.3rem 0 0.8rem;
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
        }
        .table-wrap {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #272a2b;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        input,
        select {
          width: 100%;
          padding: 0.45rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          color: #272a2b;
        }
        .del {
          background: none;
          border: none;
          color: red;
          font-size: 1.1rem;
          cursor: pointer;
        }
          .explanation-box {
          background: #FCFFFE;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
          color: #272B2A;
        }
        .explanation-box p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }

        .add {
          background: transparent;
          border: 1px dashed #272a2b;
          padding: 0.45rem 1rem;
          border-radius: 4px;
          margin-right: 0.6rem;
          cursor: pointer;
        }
        .calc {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.65rem 1.2rem;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
        }

        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          padding-left: 0.8rem;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 0.8rem;
        }
        .chart-toggle button {
          background: transparent;
          border: 1px solid #272a2b;
          padding: 0.4rem 0.9rem;
          border-radius: 4px;
          font-weight: 500;
          color: #272a2b;
          cursor: pointer;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          table {
            font-size: 0.85rem;
          }
        }
      `}</style>
      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
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

export default SubscriptionCostAnalyser;
