// File: /app/tools/college-savings-planner/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Number→Words Helpers ─────────────────────────────────────────────
const numberToWords = (num: number): string => {
  num = Math.round(Math.abs(num));
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
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + helper(n % 100) : "")
      );
    if (n < 100000)
      return (
        helper(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + helper(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        helper(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + helper(n % 100000) : "")
      );
    return (
      helper(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + helper(n % 10000000) : "")
    );
  };
  return helper(num);
};
const numberToWordsPercent = (v: number): string => {
  const ip = Math.floor(v),
    dp = Math.round((v - ip) * 100);
  return dp
    ? `${numberToWords(ip)} point ${numberToWords(dp)} percent`
    : `${numberToWords(ip)} percent`;
};

// ─── Tooltip Icon ─────────────────────────────────────────────────────
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
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #108e66;
          color: #fcfffe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
          cursor: default;
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
          z-index: 1000;
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

export default function CollegeSavingsPlanner() {
  // ─── Inputs ─────────────────────────────────────────────────────────
  const [childAge, setChildAge] = useState("");
  const [startAge, setStartAge] = useState("");
  const [presentCost, setPresentCost] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ─── Results & Chart Data ───────────────────────────────────────────
  const [yearsToCollege, setYearsToCollege] = useState(0);
  const [futureCost, setFutureCost] = useState(0);
  const [corpus, setCorpus] = useState(0);
  const [monthlySIP, setMonthlySIP] = useState(0);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [calculated, setCalculated] = useState(false);
  const [barData, setBarData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);

  const fmtNum = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const handleCalculate = () => {
    setError(null);
    const age = parseInt(childAge, 10);
    const start = parseInt(startAge, 10);
    const cost = parseFloat(presentCost);
    const inf = parseFloat(inflationRate) / 100;
    const ret = parseFloat(returnRate) / 100;
    if (isNaN(age) || age < 0) return setError("Enter a valid current age.");
    if (isNaN(start) || start <= age)
      return setError("Start age must be > current age.");
    if (isNaN(cost) || cost <= 0)
      return setError("Enter a valid present cost.");
    if (isNaN(inf) || inf < 0) return setError("Enter a valid inflation rate.");
    if (isNaN(ret) || ret < 0) return setError("Enter a valid return rate.");

    const yrs = start - age;
    // future annual cost
    const fut = cost * Math.pow(1 + inf, yrs);
    // total corpus for 4 years
    let corp = 0;
    for (let k = 0; k < 4; k++) {
      corp += fut * Math.pow(1 + inf, k);
    }
    // monthly SIP
    const r = ret / 12;
    const n = yrs * 12;
    const sip = corp * (r / (Math.pow(1 + r, n) - 1));

    // chart data
    setBarData([
      { name: "Present Cost", value: cost },
      { name: "Future Annual Cost", value: fut },
    ]);
    const line: any[] = [];
    let acc = 0;
    for (let m = 1; m <= n; m++) {
      acc = acc * (1 + r) + sip;
      if (m % 12 === 0) {
        line.push({
          year: m / 12,
          corpus: Math.round(acc),
          target: Math.round(corp),
        });
      }
    }
    setLineData(line);

    // save state
    setYearsToCollege(yrs);
    setFutureCost(Math.round(fut));
    setCorpus(Math.round(corp));
    setMonthlySIP(Math.round(sip));
    setChartType("bar");
    setCalculated(true);
  };

  return (
    <main className="container">
      {/* Top Nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      {/* Heading */}
      <h1 className="title">How Much to Save for College?</h1>
      <p className="description">
        Estimate future annual cost, total corpus for 4 years, and monthly SIP.
      </p>
      <div className="explanation">
  <p>
    <strong>College Saving Planner:</strong> This calculator helps you plan and estimate the <strong>total savings</strong>
    needed for your child’s <strong>higher education</strong> by the time they enroll. It takes into account the
    <strong>current cost of education</strong>, <strong>expected inflation</strong>, and your <strong>monthly contributions</strong>.
  </p>
  <p>
    Based on the number of years until college, your <strong>investment return rate</strong>, and contribution strategy,
    the calculator projects whether your savings will be <strong>sufficient</strong> or if you need to
    <strong>increase your monthly investments</strong> to reach your goal comfortably.
  </p>
</div>

      {/* Form */}
      <section className="form-container">
        <div className="input-grid">
          <label>
            Child’s Current Age
            <TooltipIcon text="Your child’s present age" />
            <input
              type="number"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              placeholder="e.g. 10"
            />
          </label>

          <label>
            College Start Age
            <TooltipIcon text="Age when college begins" />
            <input
              type="number"
              value={startAge}
              onChange={(e) => setStartAge(e.target.value)}
              placeholder="e.g. 18"
            />
          </label>

          <label>
            Present Annual Cost (₹)
            <TooltipIcon text="Today’s cost for one year" />
            <input
              type="number"
              value={presentCost}
              onChange={(e) => setPresentCost(e.target.value)}
              placeholder="e.g. 200000"
            />
            {presentCost && (
              <div className="converter">
                {numberToWords(+presentCost)} Rupees
              </div>
            )}
          </label>

          <label>
            Education Inflation (%)
            <TooltipIcon text="Expected annual inflation" />
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              placeholder="e.g. 6"
            />
            {inflationRate && (
              <div className="converter">
                {numberToWordsPercent(+inflationRate)}
              </div>
            )}
          </label>

          <label>
            Expected Return (%)
            <TooltipIcon text="Anticipated annual return" />
            <input
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value)}
              placeholder="e.g. 8"
            />
            {returnRate && (
              <div className="converter">
                {numberToWordsPercent(+returnRate)}
              </div>
            )}
          </label>
        </div>

        {error && <div className="error">{error}</div>}

        {/* ← now full-width */}
        <button className="calculate-button" onClick={handleCalculate}>
          Calculate Projection
        </button>
      </section>

      {/* Results */}
      {calculated && (
        <section className="results-container">
          <h2 className="results-title">Projection Results</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <strong>Years Until College</strong>
              <br />
              {yearsToCollege}
            </div>
            <div className="summary-item">
              <strong>Future Annual Cost</strong>
              <br />₹{fmtNum(futureCost)}
            </div>
            <div className="summary-item">
              <strong>Total Corpus Needed</strong>
              <br />₹{fmtNum(corpus)}
            </div>
            <div className="summary-item">
              <strong>Required Monthly SIP</strong>
              <br />₹{fmtNum(monthlySIP)}
            </div>
          </div>

          <div className="chart-toggle">
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Cost Comparison
            </button>
            <button
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              SIP Growth
            </button>
          </div>

          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={fmtNum} />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108E66" />
                </BarChart>
              ) : (
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: "Years",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis tickFormatter={fmtNum} />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="corpus"
                    stroke="#108E66"
                    name="Accumulated Corpus"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#272A2B"
                    strokeDasharray="5 5"
                    name="Target Corpus"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <section className="considerations">
            <h3>Important Considerations</h3>
            <ul>
              <li>Start early to maximize compounding benefits.</li>
              <li>
                Small changes in inflation significantly impact future cost.
              </li>
              <li>Adjust your SIP if assumptions change.</li>
              <li>Review and rebalance annually to stay on track.</li>
              <li>
                Consider a mix of equity & debt for better risk management.
              </li>
            </ul>
          </section>
        </section>
      )}

      <style jsx>{`
        .container {
          width: 100%;
          margin: auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          text-align: left;
          margin-bottom: 1rem;
        }
        .back-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1.5rem;
        }

        .form-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
        }
        .input-grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          font-size: 1rem;
          text-align: left;
        }
        .converter {
          margin-top: 0.25rem;
          font-size: 0.9rem;
          color: #272a2b;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }

        .calculate-button {
          width: 100%; /* ← full width */
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .results-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
        }
        .results-title {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .summary-item {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 1rem;
          text-align: center;
          font-weight: 500;
        }

        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .chart-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
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
        .chart {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
        }

        .considerations {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }
        .considerations h3 {
          margin-top: 0;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .considerations ul {
          padding-left: 1.2rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .input-grid,
          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
