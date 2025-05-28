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

/* ───────── Tooltip icon ───────── */
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

/* ───────── Number-to-words helpers ───────── */
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
  const h = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + h(n % 100) : "");
    if (n < 100000)
      return h(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + h(n % 1000) : "");
    if (n < 10000000)
      return h(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + h(n % 100000) : "");
    return h(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + h(n % 10000000) : "");
  };
  return h(num);
};
const numberToWordsPercent = (v: number) =>
  `${numberToWords(Math.floor(v))}${v % 1 ? " point " + numberToWords(Math.round((v % 1) * 100)) : ""} percent`;

/* ───────── Component ───────── */
export default function MortgageInterestSavingCalculator() {
  /* ---------- inputs ---------- */
  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [tenureYears, setTenureYears] = useState("");
  const [prepayAmount, setPrepayAmount] = useState("");
  const [prepayMonth, setPrepayMonth] = useState("");
  const [error, setError] = useState<string | null>(null);

  /* ---------- results ---------- */
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

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  /* ---------- calculation ---------- */
  const calculate = () => {
    setError(null);
    const P = parseFloat(loanAmount);
    const r = parseFloat(annualRate) / 100 / 12;
    const n = Math.round((parseFloat(tenureYears) || 0) * 12);
    const preAmt = parseFloat(prepayAmount) || 0;
    const pm = parseInt(prepayMonth) || 0;

    if ([P, r, n].some((v) => isNaN(v) || v <= 0) || pm < 1 || pm > n) {
      return setError("Please enter valid inputs and ensure prepayment month ≤ total months");
    }

    /* original amortisation */
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalIntOrig = EMI * n - P;

    let balance = P;
    let interestPaidBefore = 0;
    const origBalances: { month: number; balance: number }[] = [{ month: 0, balance: P }];
    for (let m = 1; m < pm; m++) {
      const interest = balance * r;
      const principal = EMI - interest;
      balance -= principal;
      interestPaidBefore += interest;
      origBalances.push({ month: m, balance });
    }

    const balanceAfter = balance - preAmt;
    const n2 = Math.log(EMI / (EMI - balanceAfter * r)) / Math.log(1 + r);

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
      ...origBalances.map((b) => ({ month: b.month, balance: Math.round(b.balance), scenario: "Original" })),
      ...newBalances.map((b) => ({ month: b.month, balance: Math.round(b.balance), scenario: "After Prepay" })),
    ]);

    setCalculated(true);
  };

  /* ---------- UI ---------- */
  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much Interest Will I Save by Prepaying?</h1>
      <p className="description">
        See how a one-time part-prepayment reduces your total home-loan interest and tenure.
      </p>

      <div className="explanation">
        <p>
          <strong>Mortgage Interest Savings:</strong> Estimate the benefit of a lump-sum prepayment. Mortgages are front-loaded
          with interest; paying extra early slashes the overall cost.
        </p>
      </div>

      {error && <p className="error">{error}</p>}

      {/* ── form card ── */}
      <section className="card form">
        <div className="grid">
          {[
            ["Loan Amount (₹)", loanAmount, setLoanAmount, "Principal borrowed", "e.g. 5,000,000"],
            ["Annual Rate (%)", annualRate, setAnnualRate, "Home-loan rate p.a.", "e.g. 7.5"],
            ["Tenure (Years)", tenureYears, setTenureYears, "Loan duration", "e.g. 20"],
            ["Prepayment Amount (₹)", prepayAmount, setPrepayAmount, "One-time extra payment", "e.g. 200,000"],
            ["Prepayment Month (#)", prepayMonth, setPrepayMonth, "Month after EMI start", "e.g. 12"],
          ].map(([lbl, val, setter, tip, ph]) => (
            <div key={lbl as string}>
              <label>
                {String(lbl)} <TooltipIcon text={tip as string} />
              </label>
              <input
                type="number"
                value={val as string}
                onChange={(e) => (setter as any)(e.target.value)}
                placeholder={ph as string}
              />
              {val && (
                <small className="converter">
                  {(lbl as string).includes("Rate")
                    ? numberToWordsPercent(+val)
                    : lbl === "Prepayment Month (#)"
                    ? numberToWords(+val) + " Months"
                    : numberToWords(+val) + " Rupees"}
                </small>
              )}
            </div>
          ))}
        </div>

        <button className="calculate-button" onClick={calculate}>
          Calculate My Savings
        </button>
      </section>

      {/* ── results ── */}
      {calculated && (
        <>
          <section className="card results">
            <div className="summary">
              {[
                ["Original Interest", `₹${fmt(totalInterestOrig)}`],
                ["After Prepay", `₹${fmt(totalInterestNew)}`],
                ["Saved", `₹${fmt(interestSaved)}`],
                ["Orig Tenure", `${origMonths} mo`],
                ["New Tenure", `${newMonths} mo`],
                ["Months Saved", `${monthsSaved}`],
              ].map(([k, v]) => (
                <div key={k}>
                  <strong>{k}</strong>
                  <br />
                  {v}
                </div>
              ))}
            </div>

            <div className="chart-card">
              <div className="chart-toggle">
                <button className={chartType === "bar" ? "active" : ""} onClick={() => setChartType("bar")}>
                  Bar Chart
                </button>
                <button className={chartType === "line" ? "active" : ""} onClick={() => setChartType("line")}>
                  Line Chart
                </button>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  {chartType === "bar" ? (
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                      <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                      <Legend />
                      <Bar dataKey="value" name="Interest" fill="#108e66" />
                    </BarChart>
                  ) : (
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                      <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="#272a2b" strokeWidth={2} name="Outstanding" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="disc">
            <h2>Important considerations</h2>
            <ul>
              <li>EMI remains unchanged; prepayment shrinks tenure only.</li>
              <li>Assumes monthly compounding at the stated rate.</li>
              <li>All figures rounded to the nearest rupee.</li>
            </ul>
          </section>
        </>
      )}

      {/* ───────── styles ───────── */}
      <style jsx>{`
        .container {
          
          margin: 0 auto;
          padding-top: 2rem;
          padding-left: 0rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
        }
        .top-nav {
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
          margin-bottom: 1.4rem;
          color: #555;
        }
        .explanation {
          background: #fcfffe;
          border-left: 4px solid #108e66;
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
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
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        label {
          font-size: 0.9rem;
          font-weight: 500;
          display: block;
          margin-bottom: 0.25rem;
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
          display: block;
        }
        .calculate-button {
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
          border: 1px solid #272a2b;
          border-radius: 4px;
          padding: 1rem;
          font-size: 0.9rem;
        }
        .disc ul {
          margin: 0;
          padding-left: 1.4rem;
        }

        /* ───────── Mobile tweaks ───────── */
        @media (max-width: 680px) {
          .container {
            padding: 1rem;
          }
          .form .grid {
            grid-template-columns: 1fr;
          }
          .results .summary {
            flex-direction: column;
            align-items: center;
          }
          .chart-toggle {
            flex-direction: column;
            gap: 0.5rem;
          }
          .chart-toggle button {
            width: 100%;
          }
          .chart-container {
            margin: 0 -0.4rem 1rem;
          }
        }
      `}</style>

      {/* hide number spinners */}
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
    </main>
  );
}
