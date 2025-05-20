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

/* ────────────────────────────────────
   Tooltip "i" Icon
   ──────────────────────────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tooltip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="info-icon">i</span>
      {open && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltip {
          position: relative;
          display: inline-block;
          margin-left: 6px;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          font-size: 0.6rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
        }
        .tooltiptext {
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background: #108e66;
          color: #fcfffe;
          white-space: nowrap;
          border-radius: 4px;
          padding: 6px 8px;
          font-size: 0.75rem;
          z-index: 100;
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

/* ────────────────────────────────────
   Number → Words (Indian system)
   ──────────────────────────────────── */
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

/* ────────────────────────────────────
   Helpers
   ──────────────────────────────────── */
const parseNum = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};
const fmt = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

/* ────────────────────────────────────
   Component
   ──────────────────────────────────── */
export default function Section80CCalculator() {
  /* ---------- state ---------- */
  const [ppf, setPpf] = useState("");
  const [epf, setEpf] = useState("");
  const [elss, setElss] = useState("");
  const [lifeIns, setLifeIns] = useState("");
  const [nsc, setNsc] = useState("");
  const [homeLoan, setHomeLoan] = useState("");
  const [tuition, setTuition] = useState("");
  const [other80c, setOther80c] = useState("");
  const [taxSlab, setTaxSlab] = useState("30");
  const [error, setError] = useState<string | null>(null);

  const [totalContrib, setTotalContrib] = useState(0);
  const [eligibleDeduction, setEligibleDeduction] = useState(0);
  const [taxSavings, setTaxSavings] = useState(0);
  const [netIncomeReduction, setNetIncomeReduction] = useState(0);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  /* ---------- calculate ---------- */
  const calculate = () => {
    setError(null);
    const vals = [
      parseNum(ppf),
      parseNum(epf),
      parseNum(elss),
      parseNum(lifeIns),
      parseNum(nsc),
      parseNum(homeLoan),
      parseNum(tuition),
      parseNum(other80c),
    ];
    if (vals.some((v) => v < 0)) return setError("Enter non-negative amounts.");

    const total = vals.reduce((a, b) => a + b, 0);
    const eligible = Math.min(total, 150000);
    const slabRate = parseFloat(taxSlab) / 100;
    const savings = Math.round(eligible * slabRate);

    setTotalContrib(Math.round(total));
    setEligibleDeduction(Math.round(eligible));
    setTaxSavings(savings);
    setNetIncomeReduction(Math.round(eligible));
  };

  /* ---------- chart data ---------- */
  const barData = [
    { name: "PPF", value: parseNum(ppf) },
    { name: "EPF", value: parseNum(epf) },
    { name: "ELSS", value: parseNum(elss) },
    { name: "Life Ins.", value: parseNum(lifeIns) },
    { name: "NSC / FD", value: parseNum(nsc) },
    { name: "Home Loan", value: parseNum(homeLoan) },
    { name: "Tuition", value: parseNum(tuition) },
    { name: "Other", value: parseNum(other80c) },
  ];
  const pieData = [
    { name: "Deductible", value: eligibleDeduction },
    { name: "Non-Deductible", value: Math.max(0, totalContrib - eligibleDeduction) },
  ];
  const COLORS = ["#108e66", "#272a2b"];

  /* ---------- ui ---------- */
  return (
    <div className="container">
      {/* top nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much Can I Save Under Section 80C?</h1>
      <p className="subtitle">
        Estimate your eligible deductions (up to ₹1.5 L) and resulting tax
        savings.
      </p>

      {/* investment inputs */}
      <div className="card">
        <h2 className="card-title">Your 80C Investments</h2>
        <div className="grid">
          {[
            {
              label: "PPF Contribution (₹)",
              val: ppf,
              set: setPpf,
              tip: "Public Provident Fund deposits",
              ph: "e.g. ₹50,000 INR",
            },
            {
              label: "EPF Contribution (₹)",
              val: epf,
              set: setEpf,
              tip: "Employee Provident Fund",
              ph: "e.g. ₹60,000 INR",
            },
            {
              label: "ELSS / MF SIP (₹)",
              val: elss,
              set: setElss,
              tip: "Equity-linked savings scheme",
              ph: "e.g. ₹36,000 INR",
            },
            {
              label: "Life Insurance Premium (₹)",
              val: lifeIns,
              set: setLifeIns,
              tip: "Life-insurance premiums",
              ph: "e.g. ₹24,000 INR",
            },
            {
              label: "NSC / 5-yr FD (₹)",
              val: nsc,
              set: setNsc,
              tip: "National Savings Certificate or 5-yr tax FD",
              ph: "e.g. ₹10,000 INR",
            },
            {
              label: "Home Loan Principal (₹)",
              val: homeLoan,
              set: setHomeLoan,
              tip: "Principal repaid during FY",
              ph: "e.g. ₹1,20,000 INR",
            },
            {
              label: "Tuition Fees (₹)",
              val: tuition,
              set: setTuition,
              tip: "Education fee (max 2 kids)",
              ph: "e.g. ₹45,000 INR",
            },
            {
              label: "Other 80C (₹)",
              val: other80c,
              set: setOther80c,
              tip: "Sukanya, stamp duty, etc.",
              ph: "e.g. ₹8,000 INR",
            },
          ].map(({ label, val, set, tip, ph }) => (
            <label key={label} className="field">
              <span className="field-title">
                {label}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={ph}
              />
              {val && (
                <span className="converter">
                  {numberToWords(parseNum(val))} Rupees
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* tax profile */}
      <div className="card">
        <h2 className="card-title">Your Tax Profile</h2>
        <label className="field single">
          <span className="field-title">
            Marginal Tax Slab (%)
            <TooltipIcon text="Choose your slab" />
          </span>
          <select value={taxSlab} onChange={(e) => setTaxSlab(e.target.value)}>
            <option value="5">5 %</option>
            <option value="20">20 %</option>
            <option value="30">30 %</option>
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <button className="btn-primary" onClick={calculate}>
        Calculate
      </button>

      {/* results */}
      {totalContrib > 0 && (
        <div className="results card">
          <h2 className="card-title">Your 80C Summary</h2>
          <div className="summary">
            {[
              ["Total Contributions", totalContrib],
              ["Eligible Deduction", eligibleDeduction],
              ["Tax Savings", taxSavings],
              ["Income Reduced", netIncomeReduction],
            ].map(([lbl, val]) => (
              <div key={lbl} className="summary-item">
                <strong>{lbl}</strong>
                <div className="amt">₹{fmt(val as number)}</div>
                <div className="words">
                  ({numberToWords(val as number)} Rupees)
                </div>
              </div>
            ))}
          </div>

          <div className="toggle">
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

          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => fmt(v as number)} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              <li>Section 80C cap is ₹1.5 lakh per FY.</li>
              <li>Excess over cap is not deductible.</li>
              <li>Tax savings vary with your slab.</li>
              <li>Keep proofs of all investments.</li>
              <li>Diversify across instruments for balanced risk-return.</li>
            </ul>
          </div>
        </div>
      )}

      {/* styles */}
      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: 'Poppins', sans-serif;
          background: #fcfffe;
          color: #272b2a;
        }
        .back-btn {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          margin: 0.4rem 0 0.6rem;
        }
        .subtitle {
          text-align: center;
          margin-bottom: 1.8rem;
        }
        .card {
          background: #fcfffe;
          padding: 1.75rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.08);
          margin-bottom: 1.75rem;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .field-title {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 0.9rem;
        }
        input,
        select {
          padding: 0.55rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          font-size: 1rem;
        }
        .converter {
          font-size: 0.85rem;
          margin-top: 0.2rem;
          color: #444;
        }
        .error {
          color: red;
          text-align: center;
          margin: 0.8rem 0;
        }
        .btn-primary {
          background: #108e66;
          color: #fcfffe;
          border: none;
          width: 100%;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .results {
          margin-top: 2rem;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 1rem;
          margin-bottom: 1.4rem;
        }
        .summary-item {
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.9rem;
          text-align: center;
        }
        .summary-item .amt {
          font-size: 1.2rem;
          margin: 0.25rem 0;
        }
        .summary-item .words {
          font-size: 0.8rem;
          color: #555;
        }
        .toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .toggle button {
          padding: 0.45rem 1rem;
          border: 1px solid #272b2a;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
        }
        .toggle button.active {
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
          .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
