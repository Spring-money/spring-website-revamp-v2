// File: /app/tools/second-hand-car-valuation-calculator/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─────────── Helpers ─────────── */
function numberToWords(n: number): string {
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
}

/* ─────────── Rates & Factors ─────────── */
type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";
type Condition = "Excellent" | "Very Good" | "Good" | "Fair";

const ageDepRates = [
  { max: 0.5, rate: 0.05 },
  { max: 1, rate: 0.15 },
  { max: 2, rate: 0.2 },
  { max: 3, rate: 0.3 },
  { max: 4, rate: 0.4 },
  { max: 5, rate: 0.5 },
  { max: Infinity, rate: 0.6 },
] as const;

const fuelFactors: Record<FuelType, number> = {
  Petrol: 1.0,
  Diesel: 1.05,
  CNG: 0.9,
  Electric: 0.9,
};

const conditionFactors: Record<Condition, number> = {
  Excellent: 1.0,
  "Very Good": 0.95,
  Good: 0.9,
  Fair: 0.8,
};

/* ─────────── Component ─────────── */
export default function SecondhandCarValuation() {
  const [makeModel, setMakeModel] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState<FuelType>("Petrol");
  const [cond, setCond] = useState<Condition>("Excellent");

  const [result, setResult] = useState<{
    estimated: number;
    depreciation: number;
    pct: number;
    curve: { year: number; value: number }[];
  } | null>(null);

  /* ─────────── Calculation ─────────── */
  const calculate = () => {
    const bp = parseFloat(basePrice);
    const yr = parseInt(year, 10);
    const km = parseFloat(mileage);

    if (!bp || !yr || isNaN(km)) return;

    const age = new Date().getFullYear() - yr;
    const ageRate = ageDepRates.find((d) => age <= d.max)!.rate;
    const postAge = bp * (1 - ageRate);

    const expectedKm = age * 10000;
    let kmAdj = ((km - expectedKm) / 10000) * 0.01;
    kmAdj = Math.max(-0.05, Math.min(0.05, kmAdj));
    const postKm = postAge * (1 - kmAdj);

    const postFuel = postKm * fuelFactors[fuel];
    const est = postFuel * conditionFactors[cond];

    const depreciation = bp - est;
    const pct = (depreciation / bp) * 100;

    const curve = Array.from({ length: age + 1 }, (_, i) => {
      const r = ageDepRates.find((d) => i <= d.max)!.rate;
      return { year: i, value: Math.round(bp * (1 - r)) };
    });

    setResult({
      estimated: Math.round(est),
      depreciation: Math.round(depreciation),
      pct: Math.round(pct),
      curve,
    });
  };

  return (
    <div className="container">
      {/* ───────── Navigation ───────── */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Used Car Valuation</h1>
      <p className="description">Estimate the fair resale value of your car.</p>

      {/* ───────── Small explainer ───────── */}
      <div className="explanation">
        <p>
          <strong>Second-Hand Car Valuation:</strong> this tool estimates the
          current market value of a used vehicle using age-based depreciation,
          kilometres driven, fuel-type &amp; overall condition multipliers.
        </p>
      </div>

      {/* ───────── Input card ───────── */}
      <div className="card form-card">
        <h2 className="section-title">Car Details</h2>
        <div className="input-grid">
          <label>
            <span>Make &amp; Model</span>
            <input
              type="text"
              placeholder="e.g. Maruti Swift VDI"
              value={makeModel}
              onChange={(e) => setMakeModel(e.target.value)}
            />
          </label>

          <label>
            <span>Ex-Showroom Price (₹)</span>
            <input
              type="number"
              placeholder="e.g. 6,00,000"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            {basePrice && (
              <span className="words">
                {numberToWords(+basePrice)} Rupees
              </span>
            )}
          </label>

          <label>
            <span>Year of Manufacture</span>
            <input
              type="number"
              placeholder="e.g. 2018"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            {year && <span className="words">{numberToWords(+year)}</span>}
          </label>

          <label>
            <span>Kilometres Driven</span>
            <input
              type="number"
              placeholder="e.g. 45000"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
            {mileage && (
              <span className="words">
                {numberToWords(+mileage)} Kilometres
              </span>
            )}
          </label>

          <label>
            <span>Fuel Type</span>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value as FuelType)}
            >
              {Object.keys(fuelFactors).map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Condition</span>
            <select
              value={cond}
              onChange={(e) => setCond(e.target.value as Condition)}
            >
              {Object.keys(conditionFactors).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <button className="calc" onClick={calculate}>
          Calculate Value
        </button>
      </div>

      {/* ───────── Results ───────── */}
      {result && (
        <div className="card">
          <h2 className="section-title">Valuation Result</h2>

          <div className="summary">
            <div>
              <strong>Estimated Value</strong>
              <br />₹{result.estimated.toLocaleString("en-IN")}
              <br />({numberToWords(result.estimated)} Rupees)
            </div>
            <div>
              <strong>Total Depreciation</strong>
              <br />₹{result.depreciation.toLocaleString("en-IN")}
              <br />({result.pct}%)
            </div>
          </div>

          <h3 className="section-title">Depreciation Curve</h3>
          <div className="chart">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={result.curve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{
                    value: "Age (yrs)",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                <Tooltip
                  formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Value"
                  stroke="#108e66"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>Depreciation rates are indicative IRDAI averages.</li>
              <li>Mileage adjustment is clamped to ±5 %.</li>
              <li>
                Fuel-type &amp; condition multipliers reflect typical resale
                trends.
              </li>
              <li>
                Cars &gt; 5 yrs old may vary widely — always cross-check local
                quotes.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ───────── Styles ───────── */}
      <style jsx>{`
        .container {
          padding: 1.6rem;
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
        }
        .title {
          text-align: center;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          margin-bottom: 1.2rem;
          color: #555;
        }
        .explanation {
          background: #fcfffe;
          border-left: 4px solid #108e66;
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.95rem;
          margin-bottom: 1.4rem;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          padding: 1.5rem;
          margin-bottom: 1.6rem;
        }
        .form-card {
          padding-bottom: 1rem;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .input-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.2rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 1rem;
        }
        input,
        select {
          height: 40px;
          padding: 0.5rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
        }
        .words {
          font-size: 0.8rem;
          color: #272a2b;
          margin-top: 2px;
        }
        .calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.2rem;
          border-left: 4px solid #108e66;
          padding-left: 1rem;
        }
        .chart {
          margin-top: 1rem;
        }
        .disclaimer {
          background: #fcfffe;
          border: 1px solid #272a2b;
          border-radius: 6px;
          padding: 1rem;
          font-size: 0.9rem;
        }
        .disclaimer h4 {
          margin: 0 0 0.5rem;
          font-weight: 600;
        }
        .disclaimer ul {
          margin: 0;
          padding-left: 1.2rem;
        }
        .disclaimer li {
          margin-bottom: 0.4rem;
        }
        @media (max-width: 600px) {
          .input-grid,
          .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
