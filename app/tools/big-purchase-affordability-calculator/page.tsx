// File: /app/tools/big-purchase-affordability-calculator/page.tsx

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

// ─────────────────────────── Tooltip Icon ──────────────────────────
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
          border-width: 4px;
          border-style: solid;
          border-color: #108e66 transparent transparent transparent;
        }
      `}</style>
    </span>
  );
};

// ───────────────────────── Number → Words ───────────────────────────
const numberToWords = (num: number): string => {
  num = Math.abs(Math.round(num));
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
  const ip = Math.floor(v),
    dp = Math.round((v - ip) * 10);
  return dp === 0
    ? `${numberToWords(ip)} percent`
    : `${numberToWords(ip)} point ${numberToWords(dp)} percent`;
};

// ────────────────────── Main Component ────────────────────────────
export default function BigPurchaseAffordabilityCalculator() {
  // Inputs
  const [netIncome, setNetIncome] = useState("");
  const [existingEmis, setExistingEmis] = useState("");
  const [capacityRatio, setCapacityRatio] = useState("40");
  const [downPayment, setDownPayment] = useState("");
  const [tenureYears, setTenureYears] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Results
  const [maxEmi, setMaxEmi] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [capacityUsedPct, setCapacityUsedPct] = useState(0);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [amortTable, setAmortTable] = useState<any[]>([]);
  const [calculated, setCalculated] = useState(false);

  const fmtNum = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const fmtPct = (n: number) => n.toFixed(1);

  const handleCalculate = () => {
    setError(null);
    const income = parseFloat(netIncome);
    const existing = parseFloat(existingEmis);
    const capRatio = parseFloat(capacityRatio) / 100;
    const down = parseFloat(downPayment);
    const tenure = parseInt(tenureYears);
    const rate = parseFloat(annualInterestRate);
    if (!income || income <= 0)
      return setError("Enter a valid net monthly income");
    if (existing < 0) return setError("Enter valid existing EMIs");
    if (!(capRatio > 0 && capRatio <= 1))
      return setError("Enter a valid capacity ratio");
    if (down < 0) return setError("Enter a valid down-payment");
    if (!tenure || tenure <= 0) return setError("Enter a valid loan tenure");
    if (!(rate > 0)) return setError("Enter a valid interest rate");

    const emiBudget = income * capRatio - existing;
    if (emiBudget <= 0) return setError("No EMI capacity left");
    const r = rate / 100 / 12;
    const n = tenure * 12;
    const loan = (emiBudget * (1 - Math.pow(1 + r, -n))) / r;
    const totalPrice = loan + down;
    const usedPct = ((emiBudget + existing) / income) * 100;

    // Amortization first 12 months
    const table: any[] = [];
    let bal = loan;
    for (let m = 1; m <= 12; m++) {
      const interest = bal * r;
      const principal = emiBudget - interest;
      const endBal = bal - principal;
      table.push({
        month: m,
        begin: Math.round(bal),
        emi: Math.round(emiBudget),
        interest: Math.round(interest),
        principal: Math.round(principal),
        end: Math.round(endBal),
      });
      bal = endBal;
    }

    setMaxEmi(emiBudget);
    setLoanAmount(loan);
    setPurchasePrice(totalPrice);
    setCapacityUsedPct(usedPct);
    setAmortTable(table);
    setCalculated(true);
  };

  const barData = [
    { name: "Existing EMIs", value: parseFloat(existingEmis) || 0 },
    { name: "New EMI", value: maxEmi },
    {
      name: "Disposable",
      value:
        (parseFloat(netIncome) || 0) -
        ((parseFloat(existingEmis) || 0) + maxEmi),
    },
  ];
  const pieData = barData;

  return (
    <main className="container">
      {/* Top Nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      {/* Heading */}
      <h1 className="title">What Big Purchase Can I Afford?</h1>
      <p className="description">
        Determine your max EMI, loan amount & total purchase price.
      </p>
      <div className="explanation">
        <p>
          <strong>Big Purchase Affordability:</strong> This calculator helps you
          determine whether you can comfortably afford a{" "}
          <strong>large expense</strong>—such as a car, gadget, or
          vacation—without disrupting your financial stability. It compares the{" "}
          <strong>purchase cost</strong> against your{" "}
          <strong>monthly savings capacity</strong> and how quickly you could
          recover the amount.
        </p>
        <p>
          By factoring in your{" "}
          <strong>monthly income, essential expenses</strong>, and desired{" "}
          <strong>savings buffer</strong>, the calculator gives a realistic
          picture of whether the purchase is <em>affordable now</em>, should be
          <strong>delayed</strong>, or needs{" "}
          <strong>financial adjustment</strong>.
        </p>
      </div>

      {/* Form */}
      <section className="card form-card">
        <div className="grid">
          <div>
            <label className="input-label">
              Net Monthly Income (₹) <TooltipIcon text="Take-home pay" />
            </label>
            <input
              type="number"
              value={netIncome}
              onChange={(e) => setNetIncome(e.target.value)}
              placeholder="e.g. 50,000"
            />
            {netIncome && (
              <div className="converter">
                {numberToWords(+netIncome)} Rupees
              </div>
            )}
          </div>
          <div>
            <label className="input-label">
              Existing EMIs (₹) <TooltipIcon text="Current EMIs & debts" />
            </label>
            <input
              type="number"
              value={existingEmis}
              onChange={(e) => setExistingEmis(e.target.value)}
              placeholder="e.g. 10,000"
            />
            {existingEmis && (
              <div className="converter">
                {numberToWords(+existingEmis)} Rupees
              </div>
            )}
          </div>
          <div>
            <label className="input-label">
              EMI Capacity Ratio (%) <TooltipIcon text="% of income for EMIs" />
            </label>
            <input
              type="number"
              value={capacityRatio}
              onChange={(e) => setCapacityRatio(e.target.value)}
              placeholder="40"
            />
            <div className="converter">
              {numberToWordsPercent(+capacityRatio)}{" "}
            </div>
          </div>
          <div>
            <label className="input-label">
              Down-Payment (₹) <TooltipIcon text="Upfront amount" />
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="e.g. 100000"
            />
            {downPayment && (
              <div className="converter">
                {numberToWords(+downPayment)} Rupees
              </div>
            )}
          </div>
          <div>
            <label className="input-label">
              Loan Tenure (yrs) <TooltipIcon text="Loan duration" />
            </label>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(e.target.value)}
              placeholder="e.g. 5"
            />
            {tenureYears && (
              <div className="converter">
                {numberToWords(+tenureYears)} years
              </div>
            )}
          </div>
          <div>
            <label className="input-label">
              Interest Rate (% p.a.) <TooltipIcon text="Annual rate" />
            </label>
            <input
              type="number"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(e.target.value)}
              placeholder="e.g. 8"
            />
            <div className="converter">
              {numberToWordsPercent(+annualInterestRate)}{" "}
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="primary-button" onClick={handleCalculate}>
          Calculate Affordability
        </button>
      </section>

      {/* Results */}
      {calculated && (
        <section className="card results-card">
          <h2 className="section-title">Your Affordability Summary</h2>

          <div className="grid summary-grid">
            <div>
              <strong>Max EMI</strong>
              <br />₹{fmtNum(maxEmi)}
              <br />
              <small>({numberToWords(maxEmi)} Rupees)</small>
            </div>
            <div>
              <strong>Max Loan</strong>
              <br />₹{fmtNum(loanAmount)}
              <br />
              <small>({numberToWords(loanAmount)} Rupees)</small>
            </div>
            <div>
              <strong>Total Price</strong>
              <br />₹{fmtNum(purchasePrice)}
              <br />
              <small>({numberToWords(purchasePrice)} Rupees)</small>
            </div>
            <div>
              <strong>Capacity Used</strong>
              <br />
              {fmtPct(capacityUsedPct)}%<br />
              <small>({numberToWordsPercent(capacityUsedPct)})</small>
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
                  <YAxis tickFormatter={fmtNum} />
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
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={i === 1 ? "#272a2b" : "#108e66"} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <RechartsTooltip
                    formatter={(v) => `₹${fmtNum(v as number)}`}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="points-title">Amortization (First 12 Months)</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mo</th>
                  <th>Begin</th>
                  <th>EMI</th>
                  <th>Int</th>
                  <th>Prin</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {amortTable.map((r) => (
                  <tr key={r.month}>
                    <td>{r.month}</td>
                    <td>₹{fmtNum(r.begin)}</td>
                    <td>₹{fmtNum(r.emi)}</td>
                    <td>₹{fmtNum(r.interest)}</td>
                    <td>₹{fmtNum(r.principal)}</td>
                    <td>₹{fmtNum(r.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="disc">
            <ul>
              <h3>Important considerations</h3>

              <li>Keep Debt-to-Income ≤ 40% for lending guidelines.</li>
              <li>Higher down-payment lowers EMI and interest cost.</li>
              <li>Longer tenure reduces EMI but increases total interest.</li>
              <li>Maintain emergency funds before new debt.</li>
            </ul>
          </div>
        </section>
      )}

      {/* ───────────────────────── Styles ───────────────────────── */}
      <style jsx>{`
        .container {
          margin: auto;
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
          cursor: pointer;
          font-weight: 500;
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

        .card {
          background: #ffffff;
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
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        input:focus,
        select:focus {
          border-color: #108e66;
          outline: none;
        }
        .converter {
          margin-top: 0.25rem;
          font-size: 0.85rem;
          color: #444;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
        .primary-button {
          display: block;
          width: 100%;
          margin-top: 1.2rem;
          padding: 0.75rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          border-radius: 6px;
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
          margin: 1.5rem 0;
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
        .table-wrap {
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #272b2a;
          padding: 0.5rem;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fcfffe;
        }
        .points-title {
          font-size: 1.1rem;
          font-weight: 600;
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
        .points-list {
          list-style: disc inside;
          line-height: 1.5;
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
