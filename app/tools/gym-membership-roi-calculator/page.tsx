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

/* ───────── Tooltip ───────── */
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

/* ───────── Number→Words (Indian) ───────── */
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
  const h = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "");
    if (x < 1000) return ones[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " + h(x % 100) : "");
    if (x < 100000) return h(Math.floor(x / 1000)) + " Thousand" + (x % 1000 ? " " + h(x % 1000) : "");
    if (x < 10000000) return h(Math.floor(x / 100000)) + " Lakh" + (x % 100000 ? " " + h(x % 100000) : "");
    return h(Math.floor(x / 10000000)) + " Crore" + (x % 10000000 ? " " + h(x % 10000000) : "");
  };
  return h(n);
};

/* ───────── Component ───────── */
export default function GymMembershipROICalculator() {
  /* ---------- input states ---------- */
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
    monthlyData: { month: number; cumCost: number; cumBenefit: number; net: number }[];
  }>(null);
  const [calculating, setCalculating] = useState(false);

  /* ---------- validation ---------- */
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

  /* ---------- calculate ---------- */
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

    const annualCost = F + J + S * 52 * T;
    const timeCost = S * 52 * H * V;
    const totalCost = round100(annualCost + timeCost);

    const benefit = HS + PB;
    const benefitNPV = round100(benefit / (1 + D));

    const netGain = round100(benefitNPV - totalCost);
    const roiPct = +((netGain / totalCost) * 100).toFixed(2);
    const costPerWorkout = +(totalCost / (S * 52)).toFixed(2);
    const altAnnual = S * 52 * A;
    const savingsVsAlt = round100(altAnnual - totalCost);

    const monthlyCost = totalCost / 12;
    const monthlyBenefit = benefitNPV / 12;
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const cumCost = round100(monthlyCost * m);
      const cumBenefit = round100(monthlyBenefit * m);
      return { month: m, cumCost, cumBenefit, net: round100(cumBenefit - cumCost) };
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

  /* ---------- UI ---------- */
  return (
    <main className="container">
      {/* Back nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Is My Gym Membership Really Worth It?</h1>
      <p className="desc">
        Compare your <strong>total costs</strong> (fees, travel, time) to the{" "}
        <strong>discounted value</strong> of health & productivity benefits.
      </p>

      <div className="explanation">
        <p>
          <strong>Gym Membership ROI:</strong> Evaluate whether your membership
          fees are justified compared with health and productivity gains or
          cheaper alternatives.
        </p>
      </div>

      {/* ----- input cards ----- */}
      {/* Membership Costs */}
      <section className="card">
        <h2>Membership Costs</h2>
        <div className="grid">
          {[
            ["Annual Fee (₹)", fee, setFee, "Yearly subscription", "24000"],
            ["Joining / Locker (₹)", joining, setJoining, "One-time charges", "2000"],
          ].map(([lbl, val, setter, tip, ph]) => (
            <div key={lbl as string}>
              <label>
                {String(lbl)} <TooltipIcon text={tip as string} />
                <input
                  type="number"
                  value={val as string}
                  onChange={(e) => (setter as any)(e.target.value)}
                  placeholder={`e.g. ${ph}`}
                />
              </label>
              {!!val && <small className="conv">{numberToWords(+val)} Rupees</small>}
            </div>
          ))}
        </div>
      </section>

      {/* Usage */}
      <section className="card">
        <h2>Usage & Opportunity Cost</h2>
        <div className="grid">
          {[
            ["Sessions/Week", sessions, setSessions, "How many visits", "3"],
            ["Session Length (hrs)", hoursPer, setHoursPer, "Hours each visit", "1.5"],
            ["Travel Cost/Visit (₹)", travelCost, setTravelCost, "Fuel or transport", "60"],
            ["Hourly Value (₹)", hourlyValue, setHourlyValue, "Your time worth", "500"],
          ].map(([lbl, val, setter, tip, ph]) => (
            <div key={lbl as string}>
              <label>
                {String(lbl)} <TooltipIcon text={tip as string} />
                <input
                  type="number"
                  value={val as string}
                  onChange={(e) => (setter as any)(e.target.value)}
                  placeholder={`e.g. ${ph}`}
                />
              </label>
              {!!val && (
                <small className="conv">
                  {numberToWords(+val)}
                  {lbl.toString().includes("hrs") ? " Hours" : " Rupees"}
                </small>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="card">
        <h2>Benefits & Comparison</h2>
        <div className="grid">
          {[
            ["Health Savings (₹)", healthSave, setHealthSave, "Lower medical bills", "8000"],
            ["Productivity Boost (₹)", prodBoost, setProdBoost, "Extra earnings", "6000"],
            ["Discount Rate (%)", discount, setDiscount, "For NPV", "7"],
            ["Alt Cost/Session (₹)", altCost, setAltCost, "Pay-per-class", "300"],
          ].map(([lbl, val, setter, tip, ph]) => (
            <div key={lbl as string}>
              <label>
                {String(lbl)} <TooltipIcon text={tip as string} />
                <input
                  type="number"
                  value={val as string}
                  onChange={(e) => (setter as any)(e.target.value)}
                  placeholder={`e.g. ${ph}`}
                />
              </label>
              {!!val && (
                <small className="conv">
                  {numberToWords(+val)}
                  {lbl.toString().includes("%") ? " percent" : " Rupees"}
                </small>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Calculate */}
      <button className="calc" onClick={calculate} disabled={calculating}>
        {calculating ? "Calculating…" : "Calculate"}
      </button>

      {/* ----- results ----- */}
      {results && (
        <section className="card results">
          <h2>Results</h2>
          <div className="summary">
            {[
              ["Total Annual Cost", results.totalCost],
              ["NPV of Benefits", results.benefitNPV],
              ["Net Gain", results.netGain],
              ["ROI %", results.roiPct],
              ["Cost/Workout", results.costPerWorkout],
              ["Savings vs Alt", results.savingsVsAlt],
            ].map(([k, v]) => (
              <div key={k}>
                <strong>{k}</strong>
                <br />
                {typeof v === "number" ? `₹${v.toLocaleString()}` : v}
              </div>
            ))}
          </div>

          {/* chart toggle */}
          <div className="toggle">
            <button className={mode === "bar" ? "active" : ""} onClick={() => setMode("bar")}>
              Bar Chart
            </button>
            <button className={mode === "area" ? "active" : ""} onClick={() => setMode("area")}>
              Area Chart
            </button>
          </div>

          {/* charts */}
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              {mode === "bar" ? (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              ) : (
                <AreaChart data={results.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Legend />
                  <Area type="monotone" dataKey="net" stroke="#108e66" fill="#108e66" name="Net" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* table */}
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

          {/* considerations */}
          <div className="disc">
            <h4>Important considerations</h4>
            <ul>
              <li>Intangible benefits like mental well-being are not fully captured.</li>
              <li>Assumes consistent attendance and viable alternatives.</li>
              <li>Health savings vary widely by individual.</li>
            </ul>
          </div>
        </section>
      )}

      {/* styles */}
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
        .disc {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }

        /* ───────── Mobile tweaks ───────── */
        @media (max-width: 680px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .title {
            font-size: 1.6rem;
          }
          .toggle {
            flex-direction: column;
            gap: 0.5rem;
          }
          .toggle button {
            width: 100%;
          }
          .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
