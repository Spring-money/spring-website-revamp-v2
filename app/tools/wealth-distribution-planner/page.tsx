// File: /app/tools/wealth-distribution-planner/page.tsx

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
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

// -----------------------
// Tooltip Icon Component
// -----------------------
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="tooltip-icon"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="info-icon">i</span>
      {hover && <span className="tooltip-text">{text}</span>}
      <style jsx>{`
        .tooltip-icon {
          position: relative;
          display: inline-block;
          margin-left: 6px;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: bold;
        }
        .tooltip-text {
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
          z-index: 1000;
        }
        .tooltip-text::after {
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

// -----------------------
// Number to Words Helper
// -----------------------
const numberToWords = (num: number): string => {
  num = Math.round(Math.abs(num));
  if (num === 0) return "Zero";
  const ones = [
    "", "One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen",
    "Eighteen","Nineteen",
  ];
  const tens = [
    "", "", "Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety",
  ];
  const helper = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10? " "+ones[n%10] : "");
    if (n < 1000) return ones[Math.floor(n/100)]+" Hundred"+(n%100? " "+helper(n%100):"");
    if (n < 100000)
      return helper(Math.floor(n/1000))+" Thousand"+(n%1000? " "+helper(n%1000):"");
    if (n < 10000000)
      return helper(Math.floor(n/100000))+" Lakh"+(n%100000? " "+helper(n%100000):"");
    return helper(Math.floor(n/10000000))+" Crore"+(n%10000000? " "+helper(n%10000000):"");
  };
  return helper(num);
};

interface YearData {
  year: number;
  total: number;
}

enum RiskProfile {
  Conservative = "Conservative",
  Moderate = "Moderate",
  Aggressive = "Aggressive",
}

export default function WealthDistributionPlanner() {
  const [current, setCurrent] = useState("");
  const [sip, setSip] = useState("");
  const [years, setYears] = useState("");
  const [risk, setRisk] = useState<RiskProfile>(RiskProfile.Moderate);
  const [eRet, setERet] = useState("");
  const [dRet, setDRet] = useState("");
  const [gRet, setGRet] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [chartType, setChartType] = useState<"pie" | "line">("pie");

  const valid = useMemo(() => {
    const c = parseFloat(current);
    const y = parseInt(years);
    return c > 0 && y > 0;
  }, [current, years]);

  const mix = useMemo(() => {
    switch (risk) {
      case RiskProfile.Conservative:
        return { equity: 0.2, debt: 0.5, gold: 0.2, cash: 0.1 };
      case RiskProfile.Aggressive:
        return { equity: 0.7, debt: 0.2, gold: 0.05, cash: 0.05 };
      default:
        return { equity: 0.5, debt: 0.3, gold: 0.1, cash: 0.1 };
    }
  }, [risk]);

  const equityReturn = parseFloat(eRet) || 12;
  const debtReturn = parseFloat(dRet) || 7;
  const goldReturn = parseFloat(gRet) || 8;
  const cashReturn = 3;

  const yearsInt = parseInt(years) || 0;
  const currentVal = parseFloat(current) || 0;
  const sipAnnual = (parseFloat(sip) || 0) * 12;

  const projection = useMemo<YearData[]>(() => {
    let corpus = currentVal;
    const data: YearData[] = [];
    for (let i = 1; i <= yearsInt; i++) {
      const eq = corpus * mix.equity * (1 + equityReturn / 100) + sipAnnual * mix.equity;
      const db = corpus * mix.debt * (1 + debtReturn / 100) + sipAnnual * mix.debt;
      const gd = corpus * mix.gold * (1 + goldReturn / 100) + sipAnnual * mix.gold;
      const cs = corpus * mix.cash * (1 + cashReturn / 100) + sipAnnual * mix.cash;
      corpus = eq + db + gd + cs;
      data.push({ year: i, total: Math.round(corpus) });
    }
    return data;
  }, [
    currentVal,
    yearsInt,
    mix,
    equityReturn,
    debtReturn,
    goldReturn,
    sipAnnual,
  ]);

  const final = projection[projection.length - 1]?.total || 0;
  const cagr =
    yearsInt > 0
      ? +(((final / currentVal) ** (1 / yearsInt) - 1) * 100).toFixed(2)
      : 0;

  const pieData = [
    { name: "Equity", value: currentVal * mix.equity, color: "#108E66" },
    { name: "Debt",   value: currentVal * mix.debt,   color: "#272A2B" },
    { name: "Gold",   value: currentVal * mix.gold,   color: "#FFC107" },
    { name: "Cash",   value: currentVal * mix.cash,   color: "#03A9F4" },
  ];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Wealth Distribution Planner</h1>
      <p className="description">
        Allocate your lump-sum and SIP across Equity, Debt, Gold & Cash based on your risk and horizon.
      </p>

      <div className="explanation">
        <p>
          Based on your risk profile—<strong>Conservative</strong>, <strong>Moderate</strong>, or <strong>Aggressive</strong>—this planner divides your corpus into four asset classes:
          <strong> Equity</strong> for growth, <strong>Debt</strong> for stability, <strong>Gold</strong> as a hedge, and <strong>Cash</strong> for liquidity. It assumes default CAGRs, projects each segment’s annual compounding plus your SIP contributions, and rolls up into a total corpus. Use this to visualize how your allocation performs over time, validate decisions, and adjust your strategy as goals or market conditions evolve.
        </p>
      </div>

      <section className="form-section">
        <h2 className="section-title">Your Inputs</h2>
        <div className="input-grid">
          <label>
            <span className="input-label">
              Investable Corpus (₹)<TooltipIcon text="Lump-sum available today" />
            </span>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="e.g. 10,00,000"
            />
            {current && <div className="converter">{numberToWords(+current)} Rupees</div>}
          </label>

          <label>
            <span className="input-label">
              Monthly SIP (₹)<TooltipIcon text="Monthly commitment" />
            </span>
            <input
              type="number"
              value={sip}
              onChange={(e) => setSip(e.target.value)}
              placeholder="e.g. 10,000"
            />
            {sip && <div className="converter">{numberToWords(+sip)} Rupees</div>}
          </label>

          <label>
            <span className="input-label">
              Horizon (yrs)<TooltipIcon text="Investment duration" />
            </span>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 10"
            />
          </label>
        </div>

        <h2 className="section-title">Risk & Returns</h2>
        <div className="input-grid">
          <label>
            <span className="input-label">Risk Profile</span>
            <select value={risk} onChange={(e) => setRisk(e.target.value as RiskProfile)}>
              <option>Conservative</option>
              <option>Moderate</option>
              <option>Aggressive</option>
            </select>
          </label>

          <label>
            <span className="input-label">
              Equity CAGR (%)<TooltipIcon text="Compound anual growth rate of Euity" />
            </span>
            <input
              type="number"
              value={eRet}
              onChange={(e) => setERet(e.target.value)}
              placeholder="12"
            />
          </label>

          <label>
            <span className="input-label">
              Debt CAGR (%)<TooltipIcon text="Compound Anual Growth Rate of Debt" />
            </span>
            <input
              type="number"
              value={dRet}
              onChange={(e) => setDRet(e.target.value)}
              placeholder="7"
            />
          </label>

          <label>
            <span className="input-label">
              Gold CAGR (%)<TooltipIcon text="Compound Anual Growth Rate of Gold" />
            </span>
            <input
              type="number"
              value={gRet}
              onChange={(e) => setGRet(e.target.value)}
              placeholder="8"
            />
          </label>
        </div>

        <button
          className="calculate-button"
          onClick={() => setCalculated(true)}
          disabled={!valid}
        >
          Calculate Plan
        </button>
      </section>

      {calculated && valid && (
        <section className="results-section">
          <h2 className="results-title">Your Plan Results</h2>

          <div className="summary-grid">
            <div>
              <strong>Final Corpus</strong>
              <br />₹{final.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>CAGR</strong>
              <br />{cagr}%
            </div>
            <div>
              <strong>Allocation</strong>
              <br />
              Equity {Math.round(mix.equity * 100)}%, Debt {Math.round(mix.debt *
                100)}%, Gold {Math.round(mix.gold * 100)}%, Cash {Math.round(mix.cash * 100)}%
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
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              Growth Curve
            </button>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="90%" height={300}>
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              ) : (
                <LineChart data={projection} margin={{ top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: "Year", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#108E66"
                    name="Projected Corpus"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              <li>Historical returns don’t guarantee future performance—review annually.</li>
              <li>Equity can be volatile—ensure your horizon matches your risk appetite.</li>
              <li>Tax rules and market conditions change over time—consult advisors as needed.</li>
              <li>Maintain an emergency fund & insurance before higher-risk allocations.</li>
            </ul>
          </div>
        </section>
      )}

      <style jsx>{`
        /* Container */
        .container {
          width: 100%;
          padding: 2rem;
          background: #FCFFFE;
          color: #272B2A;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          margin-bottom: 1rem;
        }
        .back-button {
          background: #108e66;
          color: #FCFFFE;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Titles & Text */
        .title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        /* Explanation Box */
        .explanation {
          
          border-left: 4px solid #108e66;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        .explanation p {
          margin: 0;
          line-height: 1.5;
        }
        .explanation strong {
          color: #272B2A;
        }

        /* Form Section */
        .form-section {
          background: #FCFFFE;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .input-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:1rem; margin-bottom:1rem;
          }
        label {
          display: block;
        }
        .input-label {
          display: flex;
          align-items: center;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        input,
        select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #272A2A;
          border-radius: 4px;
          font-size: 1rem;
        }
        .converter {
          font-size: 0.9rem;
          color: #272B2A;
          margin-top: 0.25rem;
        }
        .calculate-button {
          display: block;
          width: 100%;
          background: #108e66;
          color: #FCFFFE;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }
        .calculate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Results Section */
        .results-section {
          background: #FCFFFE;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
        }
        .results-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .chart-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #272A2A;
          background: transparent;
          cursor: pointer;
          border-radius: 4px;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #FCFFFE;
          border-color: #108e66;
        }
        .chart-container {
          margin: 1rem 0 2rem;
          display: flex;
          justify-content: center;
          
        }

        /* Disclaimer */
        
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
          .input-grid {
            grid-template-columns: 1fr;
          }
          .summary-grid {
            grid-template-columns: 1fr;
          } 
            .chart-container {
            margin: 1.5rem 0;
        }
      `}</style>

      {/* Global Poppins */}
      <style jsx global>{`
        body, input, select, button {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </main>
  );
}
