// File: /app/tools/mortgage-interest-saving-calculator/page.tsx

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

// -----------------------
// Tooltip icon component
// -----------------------
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
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.6rem;
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

// -----------------------
// Number‐to‐words (Indian)
// -----------------------
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

export default function MortgageInterestSavingCalculator() {
  // Inputs
  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [tenureYears, setTenureYears] = useState("");
  const [prepayAmount, setPrepayAmount] = useState("");
  const [prepayMonth, setPrepayMonth] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Results
  const [totalInterestOrig, setTotalInterestOrig] = useState(0);
  const [totalInterestNew, setTotalInterestNew] = useState(0);
  const [interestSaved, setInterestSaved] = useState(0);
  const [origMonths, setOrigMonths] = useState(0);
  const [newMonths, setNewMonths] = useState(0);
  const [monthsSaved, setMonthsSaved] = useState(0);
  const [barData, setBarData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [calculated, setCalculated] = useState(false);

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const calculate = () => {
    setError(null);
    const P = parseFloat(loanAmount);
    const r = parseFloat(annualRate) / 100 / 12;
    const n = Math.round((parseFloat(tenureYears) || 0) * 12);
    const preAmt = parseFloat(prepayAmount) || 0;
    const pm = parseInt(prepayMonth) || 0;

    if ([P, r, n].some((v) => isNaN(v) || v <= 0) || pm < 1 || pm > n) {
      return setError(
        "Please enter valid inputs and ensure prepayment month ≤ total months"
      );
    }

    // Original EMI & interest
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalIntOrig = EMI * n - P;

    // Amortize to before prepayment
    let balance = P;
    let interestPaidBefore = 0;
    const origBalances: { month: number; balance: number }[] = [
      { month: 0, balance: P },
    ];
    for (let m = 1; m < pm; m++) {
      const interest = balance * r;
      const principal = EMI - interest;
      balance -= principal;
      interestPaidBefore += interest;
      origBalances.push({ month: m, balance });
    }

    // After prepayment
    const balanceAfter = balance - preAmt;
    const n2 = Math.log(EMI / (EMI - balanceAfter * r)) / Math.log(1 + r);

    // Interest after prepayment
    let interestAfter = 0;
    let bal2 = balanceAfter;
    const newBalances: { month: number; balance: number }[] = [];
    for (let m = 1; m <= Math.ceil(n2); m++) {
      const interest = bal2 * r;
      const principal = EMI - interest;
      bal2 -= principal;
      interestAfter += interest;
      newBalances.push({ month: pm - 1 + m, balance: bal2 });
    }

    const totalIntNew = interestPaidBefore + interestAfter;
    const saved = totalIntOrig - totalIntNew;
    const msaved = n - (pm - 1) - n2;

    setTotalInterestOrig(Math.round(totalIntOrig));
    setTotalInterestNew(Math.round(totalIntNew));
    setInterestSaved(Math.round(saved));
    setOrigMonths(n);
    setNewMonths(Math.round(pm - 1 + n2));
    setMonthsSaved(Math.round(msaved));

    setBarData([
      { name: "Original Interest", value: Math.round(totalIntOrig) },
      { name: "After Prepay Interest", value: Math.round(totalIntNew) },
    ]);
    setLineData([
      ...origBalances.map((b) => ({
        month: b.month,
        balance: Math.round(b.balance),
        scenario: "Original",
      })),
      ...newBalances.map((b) => ({
        month: b.month,
        balance: Math.round(b.balance),
        scenario: "After Prepay",
      })),
    ]);

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

      <h1 className="title">How Much Interest Will I Save by Prepaying?</h1>
      <p className="description">
        See how a one-time part-prepayment reduces your total home-loan interest
        and tenure.
      </p>
      <div className="explanation">
        <p>
          <strong>Mortgage Interest Savings:</strong> This calculator estimates
          how much interest you can save over the life of your loan by making{" "}
          <strong>prepayments</strong> or choosing a{" "}
          <strong>shorter tenure</strong>.
        </p>
        <p>
          Mortgages are typically structured so that interest payments are
          front-loaded—meaning you pay more interest in the early years. By{" "}
          <strong>paying extra towards the principal</strong> early on, you
          reduce the loan balance faster, resulting in significant{" "}
          <strong>long-term savings</strong>.
        </p>
        <p>
          Use this tool to compare your current repayment schedule with
          scenarios like <strong>lump-sum prepayments</strong> or{" "}
          <strong>increased monthly payments</strong>. It shows total interest
          saved and how much sooner your loan can be closed.
        </p>
      </div>

      {error && <p className="error">{error}</p>}

      <section className="card form">
        <div className="grid">
          {/* Loan Amount */}
          <div>
            <label>
              Loan Amount (₹)
              <TooltipIcon text="Principal borrowed" />
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g. 5,000,000"
            />
            {loanAmount && (
              <small className="converter">
                {numberToWords(+loanAmount)} Rupees
              </small>
            )}
          </div>
          {/* Annual Rate */}
          <div>
            <label>
              Annual Rate (%)
              <TooltipIcon text="Home-loan rate p.a." />
            </label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="e.g. 7.5"
            />
            {annualRate && (
              <small className="converter">
                {numberToWordsPercent(+annualRate)}
              </small>
            )}
          </div>
          {/* Tenure */}
          <div>
            <label>
              Tenure (Years)
              <TooltipIcon text="Loan duration" />
            </label>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(e.target.value)}
              placeholder="e.g. 20"
            />
            {tenureYears && (
              <small className="converter">
                {numberToWords(+tenureYears)} Years
              </small>
            )}
          </div>
          {/* Prepayment Amount */}
          <div>
            <label>
              Prepayment Amount (₹)
              <TooltipIcon text="One-time extra payment" />
            </label>
            <input
              type="number"
              value={prepayAmount}
              onChange={(e) => setPrepayAmount(e.target.value)}
              placeholder="e.g. 200,000"
            />
            {prepayAmount && (
              <small className="converter">
                {numberToWords(+prepayAmount)} Rupees
              </small>
            )}
          </div>
          {/* Prepayment Month */}
          <div>
            <label>
              Prepayment Month (#)
              <TooltipIcon text="Month after EMI start" />
            </label>
            <input
              type="number"
              value={prepayMonth}
              onChange={(e) => setPrepayMonth(e.target.value)}
              placeholder="e.g. 12"
            />
            {prepayMonth && (
              <small className="converter">
                {numberToWords(+prepayMonth)} Months
              </small>
            )}
          </div>
        </div>

        <button className="calculate-button" onClick={calculate}>
          Calculate My Savings
        </button>
      </section>

      {calculated && (
        <>
          <section className="card results">
            <div className="summary">
              <div>
                <strong>Original Interest</strong>
                <br />₹{fmt(totalInterestOrig)}
              </div>
              <div>
                <strong>After Prepay</strong>
                <br />₹{fmt(totalInterestNew)}
              </div>
              <div>
                <strong>Saved</strong>
                <br />₹{fmt(interestSaved)}
              </div>
              <div>
                <strong>Orig Tenure (mo)</strong>
                <br />
                {origMonths}
              </div>
              <div>
                <strong>New Tenure (mo)</strong>
                <br />
                {newMonths}
              </div>
              <div>
                <strong>Months Saved</strong>
                <br />
                {monthsSaved}
              </div>
            </div>

            <div className="chart-card">
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
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  {chartType === "bar" ? (
                    <BarChart data={barData} margin={{ top: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                      <RechartsTooltip
                        formatter={(v: number) => `₹${fmt(v)}`}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#108e66" name="Interest" />
                    </BarChart>
                  ) : (
                    <LineChart data={lineData} margin={{ top: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        label={{
                          value: "Month",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                      <RechartsTooltip
                        formatter={(v: number) => `₹${fmt(v)}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        name="Outstanding Balance"
                        stroke="#272a2b"
                        strokeWidth={2}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="disc">
            <h2>Important considerations</h2>
            <ul>
              <li>EMI remains unchanged; prepayment reduces tenure only.</li>
              <li>
                Ensure Prepayment Month ≤{" "}
                <strong>{(parseFloat(tenureYears) || 0) * 12}</strong>.
              </li>
              <li>Assumes monthly compounding at the input rate.</li>
              <li>
                All amounts are rounded to the nearest rupee; percentages to two
                decimals.
              </li>
            </ul>
          </section>
        </>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
          margin: auto;
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
        }
        .top-nav {
          text-align: left;
          margin-bottom: 1rem;
        }
        .back-button {
          background: #108e66;
          color: #fcfffe;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
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
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .form .grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(2, 1fr);
          margin-bottom: 1rem;
        }
        label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .converter {
          font-size: 0.8rem;
          color: #444;
          margin-top: 0.25rem;
        }
        .calculate-button {
          display: block;
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .results .summary {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .results .summary > div {
          min-width: 140px;
          padding: 0.75rem;
          border: 1px solid #108e66;
          border-radius: 6px;
          text-align: center;
          font-weight: 500;
        }
        .chart-card {
          border-top: 1px solid #e0e0e0;
          padding-top: 1rem;
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
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          height: 280px;
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
          .results .summary {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </main>
  );
}
