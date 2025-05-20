// File: /app/tools/charity-donation-tax-saving/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
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
          font-size: 0.7rem;
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
          padding: 6px 10px;
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
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #108e66 transparent transparent transparent;
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
const numberToWordsPercent = (v: number): string => {
  const i = Math.floor(v),
    d = Math.round((v - i) * 10);
  return d
    ? `${numberToWords(i)} point ${numberToWords(d)} percent`
    : `${numberToWords(i)} percent`;
};
const fmtNum = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ────────────────────── Main Component ────────────────────────
export default function CharityDonationTaxSaving() {
  // Inputs
  const [donationType, setDonationType] = useState("100_noLimit");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMode, setDonationMode] = useState("Non-Cash");
  const [agti, setAgti] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Results
  const [prelimDeduction, setPrelimDeduction] = useState(0);
  const [capAmount, setCapAmount] = useState<number | null>(null);
  const [eligibleDeduction, setEligibleDeduction] = useState(0);
  const [taxSaving, setTaxSaving] = useState(0);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    setError(null);
    const amt = parseFloat(donationAmount);
    const income = parseFloat(agti);
    const rate = parseFloat(taxRate) / 100;
    if (!amt || amt <= 0) return setError("Enter a valid donation amount");
    if (!income || income <= 0) return setError("Enter a valid AGTI");
    if (!rate || rate <= 0) return setError("Enter a valid tax rate");

    const rules: Record<string, { pct: number; capPct: number | null }> = {
      "100_noLimit": { pct: 1, capPct: null },
      "100_10pct": { pct: 1, capPct: 0.1 },
      "50_10pct": { pct: 0.5, capPct: 0.1 },
    };
    const { pct, capPct } = rules[donationType];
    const prelim = amt * pct;
    const cap = capPct !== null ? income * capPct : Infinity;
    let eligible = Math.min(prelim, cap);
    if (donationMode === "Cash") eligible = Math.min(eligible, 2000 * pct);
    const taxSave = eligible * rate;

    setPrelimDeduction(prelim);
    setCapAmount(capPct !== null ? cap : null);
    setEligibleDeduction(eligible);
    setTaxSaving(taxSave);
    setCalculated(true);
  };

  const barData = [
    { name: "Prelim", value: prelimDeduction },
    { name: "Cap", value: capAmount ?? prelimDeduction },
    { name: "Eligible", value: eligibleDeduction },
  ];
  const pieData = [
    { name: "Eligible", value: eligibleDeduction },
    {
      name: "Foregone",
      value: Math.max(prelimDeduction - eligibleDeduction, 0),
    },
  ];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much Tax Can You Save on Donations?</h1>
      <p className="description">
        Calculate your Section 80G deduction and tax savings on your charitable
        gifts.
      </p>
      <div className="explanation">
  <p>
    <strong>Charity Donation Tax Saving:</strong> This calculator estimates the <strong>tax deduction</strong> you can claim from
    <strong>eligible donations</strong> made to approved charitable institutions under relevant tax laws
    (like <strong>Section 80G</strong> in India).
  </p>
  <p>
    By entering the <strong>donation amount, donation type</strong>, and <strong>your taxable income</strong>,
    the calculator shows how much of your donation is <strong>deductible</strong> and the <strong>potential tax savings</strong>.
    This helps you maximize your giving while optimizing your tax liability.
  </p>
</div>

      <section className="card form-card">
        <div className="grid">
          <div>
            <label className="input-label">
              Donation Type <TooltipIcon text="80G category & limits" />
            </label>
            <select
              aria-label="Select donation type"
              value={donationType}
              onChange={(e) => setDonationType(e.target.value)}
            >
              <option value="100_noLimit">100% no limit</option>
              <option value="100_10pct">100% up to 10% of AGTI</option>
              <option value="50_10pct">50% up to 10% of AGTI</option>
            </select>
          </div>
          <div>
            <label className="input-label">
              Donation Amount (₹) <TooltipIcon text="Total donated" />
            </label>
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="e.g. 10,000"
            />
            {donationAmount && (
              <div className="converter">
                {numberToWords(+donationAmount)} Rupees
              </div>
            )}
          </div>
          <div>
            <label className="input-label">
              Mode of Donation{" "}
              <TooltipIcon text="Cash capped ₹2,000; non-cash uncapped" />
            </label>
            <select
              aria-label="Select donation mode"
              value={donationMode}
              onChange={(e) => setDonationMode(e.target.value)}
            >
              <option value="non-cash">Non-Cash</option>
              <option>Cash</option>
            </select>
          </div>
          <div>
            <label className="input-label">
              AGTI (₹) <TooltipIcon text="Your taxable income" />
            </label>
            <input
              type="number"
              value={agti}
              onChange={(e) => setAgti(e.target.value)}
              placeholder="e.g. 1,200,000"
            />
            {agti && (
              <div className="converter">{numberToWords(+agti)} Rupees</div>
            )}
          </div>
          <div>
            <label className="input-label">
              Tax Rate (%) <TooltipIcon text="Your top slab rate" />
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="e.g. 30"
            />
            {taxRate && (
              <div className="converter">{numberToWordsPercent(+taxRate)}</div>
            )}
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="primary-button" onClick={handleCalculate}>
          Calculate Tax Saving
        </button>
      </section>

      {calculated && (
        <section className="card results-card">
          <h2 className="section-title">Your Results</h2>
          <div className="grid summary-grid">
            <div>
              <strong>Prelim Deduction</strong>
              <br />₹{fmtNum(prelimDeduction)}
            </div>
            <div>
              <strong>AGTI Cap</strong>
              <br />
              {capAmount === null ? "No Limit" : `₹${fmtNum(capAmount)}`}
            </div>
            <div>
              <strong>Eligible Deduction</strong>
              <br />₹{fmtNum(eligibleDeduction)}
            </div>
            <div>
              <strong>Tax Saving</strong>
              <br />₹{fmtNum(taxSaving)}
            </div>
          </div>

          <div className="toggle-group">
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
            <button
              className={chartType === "pie" ? "active" : ""}
              onClick={() => setChartType("pie")}
            >
              Pie Chart
            </button>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={fmtNum} width={60} />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#108e66" />
                    <Cell fill="#272a2b" />
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
              <div className="disc">
          <h3 >Important Considrations</h3>
          <ul >
            <li>
              Cash donations qualify only up to ₹2,000; higher gifts require
              non-cash.
            </li>
            <li>
              100%-deduction categories have no AGTI cap—prioritize these.
            </li>
            <li>
              50%-deduction categories capped at 10% of AGTI—plan accordingly.
            </li>
            <li>Keep receipts & proofs for ITR filing.</li>
          </ul>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          width: 100%
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
        input,
        select {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        input:focus,
        select:focus {
          outline: none;
          border-color: #108e66;
        }
        .converter {
          font-size: 0.85rem;
          color: #444;
          margin-top: 0.3rem;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
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
        .primary-button {
          width: 100%;
          margin-top: 1.2rem;
          padding: 0.75rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
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
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
        }
        .points-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .points-list {
          list-style: disc inside;
          line-height: 1.5;
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
