/*  /app/tools/debt-to-income-ratio-calculator/page.tsx
    Debt-to-Income Ratio Calculator — Spring Money Theme
---------------------------------------------------------------- */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ───────────────── Types ───────────────── */
interface Inputs {
  grossIncome: string;
  debtMortgage: string;
  debtCar: string;
  debtPersonalLoan: string;
  debtCreditCard: string;
  debtOther: string;
}
interface DebtBreak {
  label: string;
  amount: number;
  pct: number;
}
interface Results {
  totalDebt: number;
  dti: number;
  classification: "Excellent" | "Good" | "Fair" | "High Risk";
  breakdown: DebtBreak[];
}

/* ───────────────── Tooltip Icon ───────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tooltipIcon"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="info-icon">i</span>
      {show && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltipIcon {
          position: relative;
          display: inline-block;
          margin-left: 5px;
          cursor: pointer;
        }
        .info-icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          font-size: 0.6rem;
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          text-align: center;
          line-height: 14px;
          font-weight: bold;
        }
        .tooltiptext {
          position: absolute;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          background: #fcfffe;
          color: #272a2b;
          border: 1px solid #108e66;
          border-radius: 4px;
          padding: 6px 8px;
          font-size: 0.75rem;
          width: 220px;
          z-index: 1000;
          line-height: 1.2;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .tooltiptext::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -4px;
          border-width: 4px;
          border-style: solid;
          border-color: #fcfffe transparent transparent transparent;
        }
      `}</style>
    </span>
  );
};

/* ───────────────── Number-to-Words Helper ───────────────── */
const numberToWords = (n: number): string => {
  if (!isFinite(n)) return "";
  n = Math.round(Math.abs(n));
  if (n === 0) return "Zero";
  const o = [
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
  const t = [
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
  if (n < 20) return o[n];
  if (n < 100)
    return `${t[Math.floor(n / 10)]}${n % 10 ? " " + o[n % 10] : ""}`;
  if (n < 1000)
    return `${o[Math.floor(n / 100)]} Hundred${
      n % 100 ? " " + numberToWords(n % 100) : ""
    }`;
  if (n < 100000)
    return `${numberToWords(Math.floor(n / 1000))} Thousand${
      n % 1000 ? " " + numberToWords(n % 1000) : ""
    }`;
  if (n < 10000000)
    return `${numberToWords(Math.floor(n / 100000))} Lakh${
      n % 100000 ? " " + numberToWords(n % 100000) : ""
    }`;
  return `${numberToWords(Math.floor(n / 10000000))} Crore${
    n % 10000000 ? " " + numberToWords(n % 10000000) : ""
  }`;
};

/* ───────────────── Custom Tooltips for Charts ───────────────── */
const PieTT = ({ active, payload }: any) =>
  active && payload?.length ? (
    <div className="tt">
      <p className="b">{payload[0].payload.name}</p>
      <p>₹{payload[0].value.toLocaleString("en-IN")}</p>
      <p>{payload[0].payload.pct.toFixed(1)} % of income</p>
      <style jsx>{`
        .tt {
          background: #fcfffe;
          border: 1px solid #108e66;
          padding: 8px;
          border-radius: 4px;
        }
        .b {
          font-weight: 600;
          margin-bottom: 4px;
          color: #272a2b;
        }
      `}</style>
    </div>
  ) : null;

const BarTT = ({ active, payload }: any) =>
  active && payload?.length ? (
    <div className="tt">
      <p className="b">{payload[0].payload.name}</p>
      <p>₹{payload[0].value.toLocaleString("en-IN")}</p>
      <style jsx>{`
        .tt {
          background: #fcfffe;
          border: 1px solid #108e66;
          padding: 8px;
          border-radius: 4px;
        }
        .b {
          font-weight: 600;
          margin-bottom: 4px;
          color: #272a2b;
        }
      `}</style>
    </div>
  ) : null;

/* ───────────────── Main Component ───────────────── */
const DebtToIncomeCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    grossIncome: "",
    debtMortgage: "",
    debtCar: "",
    debtPersonalLoan: "",
    debtCreditCard: "",
    debtOther: "",
  });
  const [errors, setErrors] = useState<Partial<Inputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"pie" | "bar">("pie");

  /*  handle input change  */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /*  validation  */
  const validate = () => {
    const e: Partial<Inputs> = {};
    Object.entries(inputs).forEach(([k, v]) => {
      if (v === "" || isNaN(Number(v)) || Number(v) < 0)
        e[k as keyof Inputs] = "Invalid";
    });
    if (!e.grossIncome && Number(inputs.grossIncome) === 0)
      e.grossIncome = "Must be > 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /*  calculation  */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const gross = +inputs.grossIncome;
    const items = [
      { label: "Mortgage / Rent EMI", amount: +inputs.debtMortgage },
      { label: "Car Loan EMI", amount: +inputs.debtCar },
      { label: "Personal Loan EMI", amount: +inputs.debtPersonalLoan },
      { label: "Credit Card Payment", amount: +inputs.debtCreditCard },
      { label: "Other Debts", amount: +inputs.debtOther },
    ];
    const totalDebt = items.reduce((s, i) => s + i.amount, 0);
    const dti = Math.round((totalDebt / gross) * 100);
    const classification =
      dti < 20
        ? "Excellent"
        : dti <= 35
        ? "Good"
        : dti <= 40
        ? "Fair"
        : "High Risk";
    const breakdown = items.map((i) => ({
      ...i,
      pct: (i.amount / gross) * 100,
    }));
    setResults({ totalDebt, dti, classification, breakdown });
    setTimeout(() => setBusy(false), 400);
  };

  /*  chart data  */
  const pieData =
    results?.breakdown
      .filter((b) => b.amount > 0)
      .map((b) => ({
        name: b.label, // label for legend & tooltip
        value: b.amount, // 🔹 required by Recharts Pie
        pct: b.pct, // keep % for tooltip
      })) || [];

  const barData = results
    ? [
        { name: "Total Debt", amount: results.totalDebt },
        { name: "Income", amount: +inputs.grossIncome },
      ]
    : [];

  const PIE_COLORS = ["#108e66", "#0b7252", "#07563e", "#053b2b", "#03211a"];

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="container">
      {/* nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Debt-to-Income Ratio Calculator</h1>
      <p className="description">
        Quickly gauge what share of your income services debt and how lenders
        may view you.
      </p> 
      <div className="explanation">
  <p>
    <strong>Debt-to-Income (DTI) Ratio:</strong> This calculator helps you evaluate your <strong>financial health</strong>
    by calculating your <strong>debt-to-income ratio</strong>—a key metric lenders use to assess your
    <strong>loan eligibility</strong> and <strong>repayment capacity</strong>.
  </p>
  <p>
    By entering your <strong>monthly debt payments</strong> and <strong>gross monthly income</strong>, the calculator shows
    your DTI as a percentage. A <strong>lower DTI</strong> indicates better financial stability, while a
    <strong>higher DTI</strong> may signal a need for debt management or impact loan approvals.
  </p>
</div>


      {/* form */}
      <div className="card">
        <h2 className="section-title">Monthly Income &amp; Debt Details</h2>
        <div className="input-group">
          {/* income */}
          <label>
            <span className="input-label">
              Gross Monthly Income (₹)
              <TooltipIcon text="Income before taxes & deductions." />
            </span>
            <input
              name="grossIncome"
              type="number"
              value={inputs.grossIncome}
              onChange={onChange}
              placeholder="e.g., 1,00,000"
            />
            <span className="words">
              {inputs.grossIncome && numberToWords(+inputs.grossIncome)} Rupees
            </span>
            {errors.grossIncome && (
              <span className="error">{errors.grossIncome}</span>
            )}
          </label>

          {/* debts */}
          {[
            [
              "debtMortgage",
              "Mortgage / Rent EMI (₹)",
              "Monthly home-loan EMI or rent.",
            ],
            ["debtCar", "Car Loan EMI (₹)", "Monthly car-loan EMI."],
            [
              "debtPersonalLoan",
              "Personal Loan EMI (₹)",
              "Monthly personal-loan EMI.",
            ],
            [
              "debtCreditCard",
              "Credit Card Minimum Payment (₹)",
              "Sum of minimum card dues.",
            ],
            ["debtOther", "Other Debt Payments (₹)", "Any other fixed EMI."],
          ].map(([k, lbl, tip]) => {
            const v = (inputs as any)[k];
            return (
              <label key={k}>
                <span className="input-label">
                  {lbl}
                  <TooltipIcon text={tip} />
                </span>
                <input
                  name={k}
                  type="number"
                  value={v}
                  onChange={onChange}
                  placeholder={
                    k === "debtMortgage" ? "e.g., 30,000" :
                    k === "debtCar" ? "e.g., 15,000" :
                    k === "debtPersonalLoan" ? "e.g., 5,000" :
                    k === "debtCreditCard" ? "e.g., 5,000" :
                    k === "debtOther" ? "e.g., 5,000" :
                    ""
                  }
                />
                <span className="words">{v && numberToWords(+v)} Rupees</span>
                {errors[k as keyof Inputs] && (
                  <span className="error">{errors[k as keyof Inputs]}</span>
                )}
              </label>
            );
          })}
        </div>

        <button
          className="calculate-button"
          onClick={calculate}
          disabled={busy}
        >
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* results */}
      {results && (
        <div className="card">
          <h2 className="section-title">Results Snapshot</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Total Monthly Debt:</strong> ₹
              {results.totalDebt.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>DTI Ratio:</strong>{" "}
              <span
                style={{
                  color:
                    results.classification === "High Risk"
                      ? "red"
                      : results.classification === "Fair"
                      ? "#ff8c00"
                      : "#108e66",
                }}
              >
                {results.dti} %
              </span>
            </div>
            <div className="summary-item">
              <strong>Risk Level:</strong> {results.classification}
            </div>
          </div>

          {/* graph description */}
          <div className="chart-note">
            <p>
              <strong>Pie Chart</strong> shows how each debt type eats into your
              income. <br />
              <strong>Bar Chart</strong> compares your total monthly debt
              against your income. Toggle below to switch views.
            </p>
          </div>

          {/* toggle */}
          <div className="toggle">
            <button
              onClick={() => setChart("pie")}
              className={chart === "pie" ? "active" : ""}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setChart("bar")}
              className={chart === "bar" ? "active" : ""}
            >
              Debt vs Income
            </button>
          </div>

          {/* charts */}
          {chart === "pie" ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={(d) =>
                      `${d.name}: ₹${d.value.toLocaleString("en-IN")}`
                    }
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <RechartsTooltip content={PieTT} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip content={BarTT} />
                  <Legend />
                  <Bar dataKey="amount" fill="#108e66" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* debt table */}
          <h2 className="section-title">Debt Breakdown</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Debt Type</th>
                  <th>Monthly (₹)</th>
                  <th>% of Income</th>
                </tr>
              </thead>
              <tbody>
                {results.breakdown.map((b) => (
                  <tr key={b.label}>
                    <td>{b.label}</td>
                    <td>{b.amount.toLocaleString("en-IN")}</td>
                    <td>{b.pct.toFixed(1)} %</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>{results.totalDebt.toLocaleString("en-IN")}</strong>
                  </td>
                  <td>
                    <strong>{results.dti} %</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* important considerations */}
          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>Include all fixed monthly obligations for accuracy.</li>
              <li>
                Lenders may add the EMI of a new loan you apply for when
                computing DTI.
              </li>
              <li>
                This tool is illustrative—consult a professional before big
                decisions.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ───────── Styles ───────── */}
      <style jsx>{`
        .container {
          padding: 1.5rem 1rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
          width: 100%;
          margin: 0 auto;
        }
        .top-nav {
          margin-bottom: 1rem;
        }
        .back-button {
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
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }
        .description {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 0.9rem;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.3rem 0 0.8rem;
        }

        /* uniform inputs */
        .input-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.05rem 1.5rem;
          margin-bottom: 1.2rem;
        }
        .input-label {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        .input-group input {
          width: 100%;
          height: 42px;
          padding: 0.55rem 0.5rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          font-size: 1rem;
          margin-top: 0.35rem;
          background: #fcfffe;
          box-sizing: border-box;
        }
        .words {
          font-size: 0.8rem;
          margin-top: 2px;
          color: #272a2b;
        }
        .error {
          color: red;
          font-size: 0.8rem;
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

        .calculate-button {
          width: 100%;
          margin-top: 1.2rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
        }

        /* summary */
        .summary-card {
          background: #fcfffe;
          padding: 0.9rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          display: grid;
          gap: 0.65rem;
        }
        .summary-item {
          font-size: 1rem;
        }

        /* chart explanation  */
        .chart-note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 8px;
          margin-bottom: 0.8rem;
          font-size: 0.9rem;
        }

        /* toggle */
        .toggle {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin: 1rem 0;
        }
        .toggle button {
          background: #fff;
          border: 1px solid #272a2b;
          padding: 0.4rem 0.9rem;
          cursor: pointer;
          border-radius: 20px;
          font-weight: 500;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }

        .chart-container {
          margin-bottom: 1rem;
        }

        /* table */
        .table-wrap {
          overflow-x: auto;
          border: 1px solid #272a2b;
          border-radius: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #272a2b;
          padding: 0.5rem;
          text-align: center;
          color: #272a2b;
        }
        th {
          background: #108e66;
          color: #fcfffe;
          position: sticky;
          top: 0;
        }

        .disclaimer {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }
        .disclaimer h4 {
          margin: 0 0 0.5rem;
        }
        .disclaimer ul {
          margin: 0;
          padding-left: 1.4rem;
        }
        .disclaimer li {
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .input-group {
            grid-template-columns: 1fr;
          }
          .summary-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* global spinner hide */}
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
    </div>
  );
};

export default DebtToIncomeCalculator;
