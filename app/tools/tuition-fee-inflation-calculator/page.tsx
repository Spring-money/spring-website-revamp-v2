// File: /app/tools/tuition-fee-inflation-calculator/page.tsx

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
          border-width: 4px;
          border-style: solid;
          border-color: #108e66 transparent transparent transparent;
        }
      `}</style>
    </span>
  );
};

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

export default function TuitionFeeInflationCalculator() {
  // ─── Inputs ─────────────────────────────────────────────────────────
  const [presentFee, setPresentFee] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [yearsUntil, setYearsUntil] = useState("");
  const [paymentYears, setPaymentYears] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ─── Results ────────────────────────────────────────────────────────
  const [futureFee, setFutureFee] = useState(0);
  const [totalCorpus, setTotalCorpus] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState<number | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [calculated, setCalculated] = useState(false);

  const fmtNum = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const handleCalculate = () => {
    setError(null);
    const P = parseFloat(presentFee);
    const i = parseFloat(inflationRate) / 100;
    const y = parseInt(yearsUntil, 10);
    const mY = parseInt(paymentYears, 10);
    const r = parseFloat(returnRate) / 100;

    if (isNaN(P) || P < 0) return setError("Enter a valid current fee.");
    if (isNaN(i) || i < 0) return setError("Enter a valid inflation rate.");
    if (isNaN(y) || y < 0) return setError("Enter valid years until tuition.");
    if (isNaN(mY) || mY < 1)
      return setError("Enter valid number of years of payments.");

    // future annual fee
    const fFee = P * Math.pow(1 + i, y);

    // total corpus needed
    let corpus = 0;
    for (let k = 0; k < mY; k++) {
      corpus += fFee * Math.pow(1 + i, k);
    }

    // monthly SIP if return rate given
    let sip: number | null = null;
    if (r > 0) {
      const monthlyR = r / 12;
      const n = y * 12;
      sip = corpus * (monthlyR / (Math.pow(1 + monthlyR, n) - 1));
    }

    setFutureFee(Math.round(fFee));
    setTotalCorpus(Math.round(corpus));
    setMonthlySavings(sip === null ? null : Math.round(sip));
    setCalculated(true);
  };

  // chart data
  const barData = [
    { name: "Present Fee", value: parseFloat(presentFee) || 0 },
    { name: "Future Fee", value: futureFee },
  ];
  const lineData = ((): { year: number; corpus: number }[] => {
    if (monthlySavings === null) return [];
    const data: any[] = [];
    let corpus = 0;
    const r = parseFloat(returnRate) / 100 / 12;
    const months = parseInt(yearsUntil, 10) * 12;
    for (let m = 1; m <= months; m++) {
      corpus = corpus * (1 + r) + (monthlySavings || 0);
      if (m % 12 === 0) data.push({ year: m / 12, corpus: Math.round(corpus) });
    }
    return data;
  })();

  return (
    <main className="container">
      {/* Top Nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      {/* Description Box */}

      {/* Heading */}
      <h1 className="title">How Much Will Tuition Fees Inflate?</h1>
      <p className="description">
        Project future fees, corpus needed, and optional monthly SIP.
      </p>

      <div className="explanation-box">
        <p>
          This calculator helps you estimate the{" "}
          <strong>future tuition fees</strong> based on current fees and
          inflation rates. It also calculates the <strong>total corpus</strong>{" "}
          needed for tuition payments over a set number of years, and an
          optional <strong>monthly SIP</strong> if you want to save for it.
        </p>
      </div>
      {/* Form */}
      <section className="form-container">
        <div className="input-grid">
          <label>
            Current Annual Fee (₹)
            <TooltipIcon text="Today's cost for one year" />
            <input
              type="number"
              value={presentFee}
              onChange={(e) => setPresentFee(e.target.value)}
              placeholder="e.g., 50,000"
              style={{ textAlign: "left" }}
            />
            {presentFee && (
              <div className="converter">
                {numberToWords(+presentFee)} Rupees
              </div>
            )}
          </label>

          <label>
            Inflation Rate (% p.a.)
            <TooltipIcon text="Expected yearly increase" />
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              placeholder="e.g., 6"
              style={{ textAlign: "left" }}
            />
            {inflationRate && (
              <div className="converter">
                {numberToWordsPercent(+inflationRate)}
              </div>
            )}
          </label>

          <label>
            Years Until First Tuition
            <TooltipIcon text="Years until payments start" />
            <input
              type="number"
              value={yearsUntil}
              onChange={(e) => setYearsUntil(e.target.value)}
              placeholder="e.g., 5"
              style={{ textAlign: "left" }}
            />
          </label>

          <label>
            Tuition Payment Years
            <TooltipIcon text="Number of annual payments" />
            <input
              type="number"
              value={paymentYears}
              onChange={(e) => setPaymentYears(e.target.value)}
              placeholder="e.g., 4"
              style={{ textAlign: "left" }}
            />
          </label>

          <label>
            Expected Return (% p.a.) <small>(optional)</small>
            <TooltipIcon text="For your savings SIP" />
            <input
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value)}
              placeholder="e.g., 8"
              style={{ textAlign: "left" }}
            />
            {returnRate && (
              <div className="converter">
                {numberToWordsPercent(+returnRate)}
              </div>
            )}
          </label>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="calculate-button" onClick={handleCalculate}>
          Calculate Projection
        </button>
      </section>

      {/* Results */}
      {calculated && (
        <section className="results-container">
          <h2 className="results-title">Results Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <strong>Future Annual Fee</strong>
              <br />₹{fmtNum(futureFee)}
            </div>
            <div className="summary-item">
              <strong>Total Corpus Needed</strong>
              <br />₹{fmtNum(totalCorpus)}
            </div>
            {monthlySavings !== null && (
              <div className="summary-item">
                <strong>Monthly SIP</strong>
                <br />₹{fmtNum(monthlySavings)}
              </div>
            )}
          </div>

          <div className="chart-toggle">
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
                  <Bar dataKey="value" fill="#108e66" />
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
                    strokeWidth={2}
                    name="Corpus over time"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <section className="disc">
            <h3>Important Considerations</h3>
            <ul>
              <li>
                Inflation and returns vary year-to-year—update assumptions
                annually.
              </li>
              <li>
                Assumes equal payment each year; some institutions vary fee
                hikes.
              </li>
              <li>
                Monthly SIP estimate uses constant return; markets can
                fluctuate.
              </li>
              <li>Starting early maximizes compounding—plan ahead.</li>
            </ul>
          </section>
        </section>
      )}

      {/* Styles */}
      <style jsx>{`
        .container {
          max-width:100%;
          margin:auto;
          padding:2rem;
          background:#FCFFFE;
          color:#272A2B;
          font-family:"Poppins",sans-serif;
        }
        .top-nav {
          text-align:left;
          margin-bottom:1rem;
        }
        .back-button {
          background:#108E66;
          color:#FCFFFE;
          border:none;
          padding:0.5rem 1rem;
          border-radius:4px;
          font-weight:500;
          cursor:pointer;
        }
        .description-box {
          background-color: #108E66;
          color: #FCFFFE;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        .description-box p {
          font-size: 1.1rem;
        }
        .title {
          text-align:center;
          font-size:2.5rem;
          font-weight:700;
          margin-bottom:0.25rem;
        }
          /* Updated Explanation Box Style */
        .explanation-box {
           background: #FCFFFE;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
          color: #272B2A;
        }

        
          position: absolute;
          top: 0;
          left: 0;
          width: 16px;
          height: 16px;
          background-color: #108e66;
          border-radius: 6px 0 0 0;
        }

        .explanation-box p {
           margin: 0.5rem 0;
          line-height: 1.5;
        }

        .explanation-box strong {
          font-weight: bold;
          // color: #108e66; /* Green text for emphasis */
        }

        .description {
          text-align:center;
          color:#555;
          margin-bottom:1.5rem;
        }
        .form-container {
          background:#FCFFFE;
          padding:2rem;
          border-radius:8px;
          box-shadow:0 2px 8px rgba(39,43,42,0.1);
          margin-bottom:2rem;
        }
        .input-grid {
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:1.5rem;
          margin-bottom:1.5rem;
        }
        label {
          display:block;
          font-weight:500;
          margin-bottom:0.5rem;
        }
        input {
          width:100%;
          padding:0.5rem;
          border:1px solid #272A2B;
          border-radius:4px;
          font-size:1rem;
          text-align:center;
        }
        .converter {
          margin-top:0.25rem;
          font-size:0.9rem;
          color:#272A2B;
        }
          
        .error {
          color:red;
          text-align:center;
          margin-bottom:1rem;
        }
        .calculate-button {
          display:block;
          margin:auto;
          background:#108E66;
          color:#FCFFFE;
          border:none;
          padding:0.75rem 1.5rem;
          border-radius:4px;
          font-size:1rem;
          font-weight:600;
          cursor:pointer;
        }
        .results-container {
          background:#FCFFFE;
          padding:2rem;
          border-radius:8px;
          box-shadow:0 2px 8px rgba(39,43,42,0.1);
          margin-bottom:2rem;
        }
        .results-title {
          text-align:center;
          font-size:1.8rem;
          font-weight:600;
          margin-bottom:1.5rem;
        }
        .summary-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
          gap:1rem;
          margin-bottom:2rem;
        }
        .summary-item {
          background:#F7FFF9;
          border:1px solid #108E66;
          border-radius:6px;
          padding:1rem;
          text-align:center;
          font-weight:500;
        }
        .chart-toggle {
          display:flex;
          justify-content:center;
          gap:1rem;
          margin-bottom:1.5rem;
        }
        .chart-toggle button {
          padding:0.5rem 1rem;
          border:1px solid #272A2B;
          background:transparent;
          border-radius:4px;
          cursor:pointer;
          font-weight:500;
          transition:all 0.2s;
        }
        .chart-toggle .active {
          background:#108E66;
          color:#FCFFFE;
          border-color:#108E66;
        }
        .chart {
          width:90%;
          height:300px;
           display: flex;
          justify-content: center;

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
        @media(max-width:768px) {
          .input-grid, .summary-grid {
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </main>
  );
}
