// File: /app/tools/gym-membership-roi-calculator/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Tooltip component
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
          border: 4px solid transparent;
          border-top-color: #108e66;
        }
      `}</style>
    </span>
  );
};

// Number→Words (Indian)
const numberToWords = (num: number): string => {
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

export default function GymMembershipROICalculator() {
  // Inputs state
  const [fee, setFee] = useState("");
  const [joining, setJoining] = useState("");
  const [sessions, setSessions] = useState("");
  const [hoursPer, setHoursPer] = useState("");
  const [travelCost, setTravelCost] = useState("");
  const [hourlyValue, setHourlyValue] = useState("");
  const [healthSave, setHealthSave] = useState("");
  const [prodBoost, setProdBoost] = useState("");
  const [discount, setDiscount] = useState("");
  const [altCost, setAltCost] = useState("");
  const [mode, setMode] = useState<"bar" | "area">("bar");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<null | {
    totalCost: number;
    benefitNPV: number;
    netGain: number;
    roiPct: number;
    costPerWorkout: number;
    savingsVsAlt: number;
    monthlyData: Array<{
      month: number;
      cumCost: number;
      cumBenefit: number;
      net: number;
    }>;
  }>(null);
  const [calculating, setCalculating] = useState(false);

  // Validate inputs
  const validate = () => {
    const e: Record<string, string> = {};
    const nums = {
      fee,
      joining,
      sessions,
      hoursPer,
      travelCost,
      hourlyValue,
      healthSave,
      prodBoost,
      discount,
      altCost,
    };
    for (const [k, v] of Object.entries(nums)) {
      if (!v || isNaN(Number(v)) || Number(v) < 0) e[k] = "Invalid";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const round100 = (n: number) => Math.round(n / 100) * 100;

  const calculate = () => {
    if (!validate()) return;
    setCalculating(true);
    const F = +fee,
      J = +joining;
    const S = +sessions,
      H = +hoursPer;
    const T = +travelCost,
      V = +hourlyValue;
    const HS = +healthSave,
      PB = +prodBoost;
    const D = +discount / 100,
      A = +altCost;
    // costs
    const annualCost = F + J + S * 52 * T;
    const timeCost = S * 52 * H * V;
    const totalCost = round100(annualCost + timeCost);
    // benefits
    const benefit = HS + PB;
    const benefitNPV = round100(benefit / (1 + D));
    // metrics
    const netGain = round100(benefitNPV - totalCost);
    const roiPct = +((netGain / totalCost) * 100).toFixed(2);
    const costPerWorkout = +(totalCost / (S * 52)).toFixed(2);
    const altAnnual = S * 52 * A;
    const savingsVsAlt = round100(altAnnual - totalCost);
    // monthly breakdown
    const monthlyCost = totalCost / 12;
    const monthlyBenefit = benefitNPV / 12;
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const cumCost = round100(monthlyCost * m);
      const cumBenefit = round100(monthlyBenefit * m);
      return {
        month: m,
        cumCost,
        cumBenefit,
        net: round100(cumBenefit - cumCost),
      };
    });
    setResults({
      totalCost,
      benefitNPV,
      netGain,
      roiPct,
      costPerWorkout,
      savingsVsAlt,
      monthlyData,
    });
    setTimeout(() => setCalculating(false), 200);
  };

  const barData = results
    ? [
        { name: "Cost", value: results.totalCost },
        { name: "Benefit NPV", value: results.benefitNPV },
        { name: "Net Gain", value: results.netGain },
      ]
    : [];

  return (
    <main className="container">
      {/* Back */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back"> Back to Dashboard</button>
        </Link>
      </div>
      <h1 className="title">Is My Gym Membership Really Worth It?</h1>
      <p className="desc">
        Compare your <strong>total costs</strong> (fees, travel, time) to the{" "}
        <strong>discounted value</strong> of health & productivity benefits.
      </p>
      <div className="explanation">
        <p>
          <strong>Gym Membership ROI:</strong> This calculator helps evaluate
          whether your <strong>monthly or annual gym membership</strong> is
          worth the cost by comparing it against your{" "}
          <strong>usage, fitness goals, and potential alternatives</strong>.
        </p>
        <p>
          It considers your <strong>attendance frequency</strong>,{" "}
          <strong>cost per visit</strong>, and potential{" "}
          <strong>healthcare savings or gains</strong> in productivity or
          well-being. You can also factor in{" "}
          <em>alternative options like home workouts</em> or{" "}
          <em>pay-per-visit gyms</em> for comparison.
        </p>
        <p>
          Use this tool to ensure your fitness investment is giving you the best
          value — not just financially but also in terms of{" "}
          <strong>health outcomes and lifestyle fit</strong>.
        </p>
      </div>

      {/* Inputs */}
      <section className="card">
        <h2>Membership Costs</h2>
        <div className="grid">
          {[
            {
              label: "Annual Fee (₹)",
              value: fee,
              set: setFee,
              tip: "Yearly subscription including taxes",
              ex: "24000",
            },
            {
              label: "Joining / Locker (₹)",
              value: joining,
              set: setJoining,
              tip: "One-time ancillary charges",
              ex: "2000",
            },
          ].map((f) => (
            <div key={f.label}>
              <label>
                {f.label}
                <TooltipIcon text={f.tip} />
                <input
                  type="number"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={`e.g. ${f.ex}`}
                />
                {errors[f.value as string] && (
                  <small className="error">{errors[f.value]}</small>
                )}
              </label>
              {!!f.value && (
                <small className="conv">{numberToWords(+f.value)} Rupees</small>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Usage & Opportunity Cost</h2>
        <div className="grid">
          {[
            {
              label: "Sessions/Week",
              value: sessions,
              set: setSessions,
              tip: "How many times you go",
              ex: "3",
            },
            {
              label: "Session Length (hrs)",
              value: hoursPer,
              set: setHoursPer,
              tip: "Duration of each session",
              ex: "1.5",
            },
            {
              label: "Travel Cost/Visit (₹)",
              value: travelCost,
              set: setTravelCost,
              tip: "Fuel, cab, etc.",
              ex: "60",
            },
            {
              label: "Hourly Value (₹)",
              value: hourlyValue,
              set: setHourlyValue,
              tip: "Cost per hour",
              ex: "500",
            },
          ].map((f) => (
            <div key={f.label}>
              <label>
                {f.label}
                <TooltipIcon text={f.tip} />
                <input
                  type="number"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={`e.g. ${f.ex}`}
                />
              </label>
              {!!f.value && (
                <small className="conv">
                  {numberToWords(+f.value)}
                  {f.label.includes("hr") ? " Hours" : " Rupees"}
                </small>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Benefits & Comparison</h2>
        <div className="grid">
          {[
            {
              label: "Health Savings (₹)",
              value: healthSave,
              set: setHealthSave,
              tip: "Lower medical bills",
              ex: "8000",
            },
            {
              label: "Productivity Boost (₹)",
              value: prodBoost,
              set: setProdBoost,
              tip: "Better focus earnings",
              ex: "6000",
            },
            {
              label: "Discount Rate (%)",
              value: discount,
              set: setDiscount,
              tip: "For Net Present Value of benefits",
              ex: "7",
            },
            {
              label: "Alt Cost/Session (₹)",
              value: altCost,
              set: setAltCost,
              tip: "Pay-per-class rate",
              ex: "300",
            },
          ].map((f) => (
            <div key={f.label}>
              <label>
                {f.label}
                <TooltipIcon text={f.tip} />
                <input
                  type="number"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={`e.g. ${f.ex}`}
                />
              </label>
              {!!f.value && (
                <small className="conv">
                  {numberToWords(+f.value)}
                  {f.label.includes("%") ? " percent" : " Rupees"}
                </small>
              )}
            </div>
          ))}
        </div>
      </section>

      <button className="calc" onClick={calculate} disabled={calculating}>
        {calculating ? "Calculating…" : "Calculate"}
      </button>

      {/* Results */}
      {results && (
        <section className="card results">
          <h2>Results</h2>
          <div className="summary">
            <div>
              <strong>Total Annual Cost</strong>
              <br />₹{results.totalCost.toLocaleString()}
            </div>
            <div>
              <strong>NPV of Benefits</strong>
              <br />₹{results.benefitNPV.toLocaleString()}
            </div>
            <div>
              <strong>Net Gain</strong>
              <br />₹{results.netGain.toLocaleString()}
            </div>
            <div>
              <strong>ROI %</strong>
              <br />
              {results.roiPct}%
            </div>
            <div>
              <strong>Cost/Workout</strong>
              <br />₹{results.costPerWorkout.toLocaleString()}
            </div>
            <div>
              <strong>Savings vs Alt</strong>
              <br />₹{results.savingsVsAlt.toLocaleString()}
            </div>
          </div>

          {/* Chart Toggle */}
          <div className="toggle">
            <button
              className={mode === "bar" ? "active" : ""}
              onClick={() => setMode("bar")}
            >
              Bar Chart
            </button>
            <button
              className={mode === "area" ? "active" : ""}
              onClick={() => setMode("area")}
            >
              Area Chart
            </button>
          </div>

          {/* Chart */}
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              {mode === "bar" ? (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108E66" />
                </BarChart>
              ) : (
                <AreaChart data={results.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Month",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString()}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke="#108E66"
                    fill="#108E66"
                    name="Net"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Cum Cost</th>
                  <th>Cum Benefit PV</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {results.monthlyData.map((r) => (
                  <tr key={r.month}>
                    <td>{r.month}</td>
                    <td>₹{r.cumCost.toLocaleString()}</td>
                    <td>₹{r.cumBenefit.toLocaleString()}</td>
                    <td>₹{r.net.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insights */}
          <div className="disc">
            <h4>Important considerations</h4>
            <ul>
              <li>
                This calculator focuses on{" "}
                <em>financial and usage-based value</em> — intangible benefits
                like mental well-being or social engagement may not be fully
                captured.
              </li>
              <li>
                Assumes <em>consistent attendance</em> and that alternative
                options (e.g., home gym, running) are viable and cost-effective.
              </li>
              <li>
                Health improvements and healthcare savings are{" "}
                <em>estimated</em> and can vary significantly by individual.
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* Styles */}
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
        .back {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-family: "Poppins", sans-serif;
          font-weight: 500;
        }
        .title {
          font-size: 2rem;
          font-weight: 600;
          text-align: center;
        }
        .desc {
          text-align: center;
          margin: 0.5rem 0 1.5rem;
          color: #555;
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
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.25rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .conv {
          font-size: 0.85rem;
          color: #444;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          font-size: 0.8rem;
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
        .calc {
          width: 100%;
          padding: 0.75rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .summary > div {
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          font-weight: 500;
        }
        .toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart {
          width: 100%;
          height: 300px;
          margin-bottom: 1rem;
        }
        .table-wrap {
          overflow-x: auto;
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
          font-size: 0.9rem;
        }
        th {
          background: #108e66;
          color: #fcfffe;
        }
        .insight {
          text-align: center;
          font-weight: 500;
          color: #108e66;
          margin: 1rem 0;
        }

        @media (max-width: 600px) {
          .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
