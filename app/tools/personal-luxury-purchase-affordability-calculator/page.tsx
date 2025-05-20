// File: /app/tools/personal-luxury-purchase-affordability-calculator/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ───────────────────────── Tooltip Icon ─────────────────────────
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="tooltip"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="info-icon">i</span>
      {hover && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltip {
          position: relative;
          display: inline-block;
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
          font-size: 0.65rem;
          font-weight: bold;
          cursor: pointer;
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

// ───────────────────────── Number → Words ────────────────────────
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
    "Ten",
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
const fmtNum = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const fmtPct = (n: number) => n.toFixed(1);

// ────────────────────── Main Component ────────────────────────
export default function LuxuryAffordabilityCalculator() {
  // Inputs
  const [income, setIncome] = useState("");
  const [essentials, setEssentials] = useState("");
  const [savingsCommitment, setSavingsCommitment] = useState("");
  const [cost, setCost] = useState("");
  const [timelineMonths, setTimelineMonths] = useState("");
  const [investReturn, setInvestReturn] = useState("");

  // Results
  const [error, setError] = useState<string | null>(null);
  const [discretionary, setDiscretionary] = useState(0);
  const [monthsNeeded, setMonthsNeeded] = useState(0);
  const [requiredMonthly, setRequiredMonthly] = useState(0);
  const [pctOfDiscretionary, setPctOfDiscretionary] = useState(0);
  const [pctOfIncome, setPctOfIncome] = useState(0);
  const [verdict, setVerdict] = useState("");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [cashflow, setCashflow] = useState<
    {
      month: number;
      allocation: number;
      cumulative: number;
      remaining: number;
    }[]
  >([]);

  const handleCalculate = () => {
    setError(null);
    const inc = parseFloat(income);
    const ess = parseFloat(essentials) || 0;
    const sav = parseFloat(savingsCommitment) || 0;
    const c = parseFloat(cost);
    const tl = parseInt(timelineMonths, 10);
    if (!inc || inc <= 0) return setError("Enter a valid monthly income");
    if (ess < 0) return setError("Enter valid essential expenses");
    if (sav < 0) return setError("Enter valid savings commitments");
    if (!c || c <= 0) return setError("Enter a valid desired cost");
    if (!tl || tl <= 0) return setError("Enter a valid timeline in months");

    const disc = inc - ess - sav;
    if (disc <= 0) return setError("No discretionary income available");

    const mNeeded = Math.ceil(c / disc);
    const reqMonthly = c / tl;
    const pctDisc = (reqMonthly / disc) * 100;
    const pctInc = (reqMonthly / inc) * 100;
    const verdictText = mNeeded <= tl ? "Affordable" : "Not Affordable Yet";

    const table = [];
    for (let m = 1; m <= Math.min(mNeeded, 120); m++) {
      const cum = reqMonthly * m;
      table.push({
        month: m,
        allocation: reqMonthly,
        cumulative: cum,
        remaining: Math.max(c - cum, 0),
      });
    }

    setDiscretionary(disc);
    setMonthsNeeded(mNeeded);
    setRequiredMonthly(reqMonthly);
    setPctOfDiscretionary(pctDisc);
    setPctOfIncome(pctInc);
    setVerdict(verdictText);
    setCashflow(table);
  };

  const barData = [
    { name: "Required", value: requiredMonthly },
    { name: "Discretionary", value: discretionary },
  ];

  return (
    <main className="container">
      {/* Back to Dashboard */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Can I Afford This Luxury Purchase?</h1>
      <p className="description">
        Decide if and when you can save up for a big non-essential purchase
        based on your budget.
      </p>
      <div className="explanation">
        <p>
          <strong>Luxury Purchase Affordability:</strong> This tool helps you
          assess whether a <strong>non-essential big purchase</strong> like a
          car, gadget, or vacation is financially wise, based on your current{" "}
          <strong>savings, income, and financial goals</strong>.
        </p>
        {/* <p>
          It encourages you to consider the <strong>opportunity cost</strong> of
          the purchase—what that money could become if invested instead—and
          whether it aligns with your{" "}
          <strong>budget, emergency fund, and future planning</strong>. The goal
          is to help you spend consciously without compromising financial
          health.
        </p> */}
      </div>

      {/* Input Form */}
      <section className="card form-card">
        <div className="grid">
          {[
            {
              label: "Net Monthly Income (₹)",
              tooltip: "Take-home pay after taxes & deductions",
              value: income,
              set: setIncome,
              placeholder: "e.g. ₹75,000 INR",
            },
            {
              label: "Essential Expenses (₹)",
              tooltip: "Rent, groceries, EMIs, insurance, etc.",
              value: essentials,
              set: setEssentials,
              placeholder: "e.g. ₹30,000 INR",
            },
            {
              label: "Savings Commitments (₹)",
              tooltip: "SIPs, EMIs, emergency funds",
              value: savingsCommitment,
              set: setSavingsCommitment,
              placeholder: "e.g. ₹10,000 INR",
            },
            {
              label: "Desired Cost (₹)",
              tooltip: "Price of the luxury item",
              value: cost,
              set: setCost,
              placeholder: "e.g. ₹1,50,000 INR",
            },
            {
              label: "Timeline (Months)",
              tooltip: "Months until purchase",
              value: timelineMonths,
              set: setTimelineMonths,
              placeholder: "e.g. 12",
            },
            {
              label: "Expected Return (%)",
              tooltip: "If you invest your savings (optional)",
              value: investReturn,
              set: setInvestReturn,
              placeholder: "e.g. 8",
            },
          ].map((f, i) => (
            <div key={i} className="field">
              <label className="input-label">
                {f.label} <TooltipIcon text={f.tooltip} />
              </label>
              <input
                type="number"
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
              />
              {f.value && (
                <div className="converter">
                  {numberToWords(+f.value)}
                  {f.label.includes("%") ? " percent" : " Rupees"}
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <div className="error">{error}</div>}

        <button className="primary-button" onClick={handleCalculate}>
          Calculate
        </button>
      </section>

      {/* Results */}
      {verdict && (
        <section className="card results-card">
          <h2 className="section-title">Your Results</h2>
          <div className="grid summary-grid">
            <div>
              <strong>Discretionary Income</strong>
              <br />₹{fmtNum(discretionary)}
            </div>
            <div>
              <strong>Months Needed</strong>
              <br />
              {monthsNeeded}
            </div>
            <div>
              <strong>Req. Monthly</strong>
              <br />₹{fmtNum(requiredMonthly)}
            </div>
            <div>
              <strong>% of Discretionary</strong>
              <br />
              {fmtPct(pctOfDiscretionary)}%
            </div>
            <div>
              <strong>% of Income</strong>
              <br />
              {fmtPct(pctOfIncome)}%
            </div>
            <div>
              <strong>Verdict</strong>
              <br />
              {verdict}
            </div>
          </div>

          <div className="toggle-group">
            <button
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              Line Chart
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "line" ? (
                <LineChart data={cashflow}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Month",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis tickFormatter={fmtNum} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmtNum(v)}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    name="Cumulative Saved"
                    stroke="#108e66"
                  />
                  {/* FIX: use dataKey here, not data */}
                  <Line
                    type="monotone"
                    dataKey={() => +cost}
                    name="Target Cost"
                    stroke="#272a2b"
                    dot={false}
                  />
                </LineChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={fmtNum} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmtNum(v)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="disc">
            <h3>Important Consi</h3>
            <ul>
              <li>
                If discretionary income ≤ 0, reduce essentials or commitments.
              </li>
              <li>
                Extending timeline lowers monthly need but delays purchase.
              </li>
              <li>Investing may speed up saving but carries market risk.</li>
              <li>
                Keep luxury spend under ~10% of income for financial health.
              </li>
            </ul>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
          margin: 0 auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272b2a;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          margin-bottom: 1rem;
          text-align: left;
        }
        .back-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
          padding: 1.5rem;
        }
        .form-card .grid,
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .input-label {
          font-weight: 500;
          display: flex;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        input:focus {
          border-color: #108e66;
          outline: none;
        }
        .converter {
          font-size: 0.85rem;
          color: #444;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          text-align: center;
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
        .primary-button {
          display: block;
          width: 100%;
          margin-top: 1.5rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .summary-grid > div {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
        }
        .toggle-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
        }
        .toggle-group button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fafafa;
          cursor: pointer;
        }
        .toggle-group .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-wrapper {
          max-width: 600px;
          margin: 0 auto 1.5rem;
          height: 300px;
          overflow-x: hidden;
        }
        .points-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .points-list {
          list-style: disc inside;
          line-height: 1.5;
          color: #272b2a;
        }
        .points-list li {
          margin-bottom: 0.5rem;
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

        @media (max-width: 600px) {
          .form-card .grid,
          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
