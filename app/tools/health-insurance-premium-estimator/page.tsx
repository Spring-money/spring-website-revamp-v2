// File: /app/tools/health-insurance-premium/page.tsx

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

type CityTier = "metro" | "tier1" | "tier2";
type Lifestyle = "smoker" | "non-smoker";

const rateTable: Record<CityTier, number[]> = {
  metro: [700, 950, 1450, 2150],
  tier1: [650, 900, 1350, 2000],
  tier2: [600, 850, 1250, 1850],
};

function getAgeBand(age: number): number {
  if (age <= 30) return 0;
  if (age <= 40) return 1;
  if (age <= 50) return 2;
  return 3;
}

// Tooltip icon
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
          vertical-align: middle;
          margin-left: 4px;
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

// Figures → Words (Indian)
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
  return helper(num);
};

export default function HealthPremiumEstimator() {
  const [age, setAge] = useState("35");
  const [city, setCity] = useState<CityTier>("metro");
  const [members, setMembers] = useState("1");
  const [sumInsured, setSumInsured] = useState("500000");
  const [term, setTerm] = useState("1");
  const [ped, setPed] = useState(false);
  const [lifestyle, setLifestyle] = useState<Lifestyle>("non-smoker");
  const [errors, setErrors] = useState("");
  const [results, setResults] = useState<{
    base: number;
    famLoad: number;
    riskLoad: number;
    discounted: number;
    gst: number;
    total: number;
  } | null>(null);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  const validate = () => {
    if (+age <= 0) return "Enter a valid age.";
    if (+members < 1) return "Members must be at least 1.";
    if (+sumInsured % 100000 !== 0 || +sumInsured <= 0)
      return "Sum insured must be in multiples of ₹1 Lakh.";
    if (![1, 2, 3].includes(+term)) return "Term must be 1–3 years.";
    return "";
  };

  const calculate = () => {
    const err = validate();
    if (err) {
      setErrors(err);
      return;
    }
    setErrors("");
    const band = getAgeBand(+age);
    const rate = rateTable[city][band];
    const base = Math.round((rate * (+sumInsured / 100000)) / 10) * 10;
    const famFactor =
      +members === 1 ? 1 : +members === 2 ? 1.85 : 1 + (+members - 1) * 0.8;
    const afterFam = base * famFactor;
    const famLoad = Math.round((afterFam - base) / 10) * 10;
    const pedLoad = ped ? 0.3 : 0;
    const smokeLoad = lifestyle === "smoker" ? 0.15 : 0;
    const afterRisk =
      Math.round((afterFam * (1 + pedLoad + smokeLoad)) / 10) * 10;
    const riskLoad = afterRisk - afterFam;
    const disc = +term === 2 ? 0.05 : +term === 3 ? 0.08 : 0;
    const discounted = Math.round((afterRisk * (1 - disc)) / 10) * 10;
    const gst = Math.round((discounted * 0.18) / 10) * 10;
    const total = discounted + gst;
    setResults({ base, famLoad, riskLoad, discounted, gst, total });
  };

  const pieData = results
    ? [
        { name: "Base", value: results.base },
        { name: "Family Load", value: results.famLoad },
        { name: "Risk Load", value: results.riskLoad },
        { name: "GST", value: results.gst },
      ]
    : [];

  const barData = results
    ? [{ name: `${term} yr`, Premium: results.total }]
    : [];

  const COLORS = ["#108E66", "#272A2B", "#525ECC", "#108E66"];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">What Will My Health-Cover Cost?</h1>
      <p className="desc">
        Instantly estimate your annual health insurance premium based on age,
        city tier, family size and lifestyle factors.
      </p>
      <div className="explanation">
        <p>
          <strong>Health Insurance Premium Estimator:</strong> This tool helps
          you estimate the <strong>annual premium</strong> you might pay for a
          health insurance plan based on your{" "}
          <strong>age, sum insured, lifestyle habits</strong>, and{" "}
          <strong>coverage features</strong>.
        </p>
        <p>
          The premium depends on factors like your{" "}
          <strong>pre-existing conditions</strong>,{" "}
          <strong>family members included</strong> in the policy, and optional
          benefits like <strong>maternity cover</strong>,{" "}
          <strong>OPD expenses</strong>, or <strong>room rent limit</strong>.
        </p>
        <p>
          Use this estimator to understand how different inputs impact the cost
          and to compare <strong>plan affordability</strong> before selecting
          the most suitable policy for your needs.
        </p>
      </div>

      {errors && <p className="error">{errors}</p>}

      {/* Applicant Details */}
      <section className="card">
        <h2>Applicant Details</h2>
        <div className="grid">
          <label>
            <div className="label-row">
              <span>Age (Years)</span>
              <TooltipIcon text="Eldest member’s age" />
            </div>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </label>
          <label>
            <div className="label-row">
              <span>City Tier</span>
              <TooltipIcon text="Metro / Tier-1 / Tier-2" />
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as CityTier)}
            >
              <option value="metro">Metro</option>
              <option value="tier1">Tier-1</option>
              <option value="tier2">Tier-2</option>
            </select>
          </label>
          <label>
            <div className="label-row">
              <span>Members</span>
              <TooltipIcon text="Adults + children covered" />
            </div>
            <input
              type="number"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Cover Details */}
      <section className="card">
        <h2>Cover Details</h2>
        <div className="grid">
          <label>
            <div className="label-row">
              <span>Sum-Insured (₹)</span>
              <TooltipIcon text="In multiples of ₹1 Lakh" />
            </div>
            <input
              type="number"
              value={sumInsured}
              onChange={(e) => setSumInsured(e.target.value)}
            />
            <small>{numberToWords(+sumInsured)} Rupees</small>
          </label>
          <label>
            <div className="label-row">
              <span>Policy Term (Years)</span>
              <TooltipIcon text="1-3 years (discounts apply)" />
            </div>
            <select value={term} onChange={(e) => setTerm(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2 (5% off)</option>
              <option value="3">3 (8% off)</option>
            </select>
          </label>
        </div>
      </section>

      {/* Risk Factors */}
      <section className="card">
        <h2>Risk Factors</h2>
        <div className="grid">
          <label>
            <div className="label-row">
              <span>Pre-existing Ailment?</span>
              <TooltipIcon text="Adds +30% loading" />
            </div>
            <select
              value={ped ? "yes" : "no"}
              onChange={(e) => setPed(e.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            <div className="label-row">
              <span>Lifestyle</span>
              <TooltipIcon text="Smoker adds +15%" />
            </div>
            <select
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value as Lifestyle)}
            >
              <option value="non-smoker">Non-smoker</option>
              <option value="smoker">Smoker</option>
            </select>
          </label>
        </div>
      </section>

      <button className="calc" onClick={calculate}>
        Calculate Premium
      </button>

      {results && (
        <section className="card results">
          <h2>Your Quote</h2>
          <div className="outputs">
            <div>
              <strong>Base</strong>
              <br />₹{results.base.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>+ Family Load</strong>
              <br />₹{(results.base + results.famLoad).toLocaleString("en-IN")}
            </div>
            <div>
              <strong>+ Risk Load</strong>
              <br />₹
              {(
                results.base +
                results.famLoad +
                results.riskLoad
              ).toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Net Premium</strong>
              <br />₹{results.discounted.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>GST (18%)</strong>
              <br />₹{results.gst.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total Payable</strong>
              <br />₹{results.total.toLocaleString("en-IN")}
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
          <div className="chart">
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
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
                    tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Bar dataKey="Premium" fill="#108E66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <ul className="disc">
            <h3> Important Considerations </h3>
            <li>
              Multi-year policies lock in rates & offer up to 8% discount.
            </li>
            <li>
              Pre-existing condition & smoker status add significant loadings.
            </li>
            <li>
              Always review the insurer’s product brochure for exclusions.
            </li>
            <li>
              Choose sum insured in ₹1 Lakh slabs to align with plan rates.
            </li>
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
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .desc {
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
        .label-row {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.95rem;
          font-weight: 500;
        }
        label {
          display: flex;
          flex-direction: column;
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
        .calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        .results .outputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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
          font-weight: 500;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart {
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
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
