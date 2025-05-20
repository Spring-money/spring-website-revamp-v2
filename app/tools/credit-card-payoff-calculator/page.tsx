/*  /app/tools/credit-card-payoff-calculator/page.tsx
    Credit-Card Pay-off Calculator — Spring Money Theme
---------------------------------------------------------------- */
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
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ───────────────── Types ───────────────── */
type Mode = "payment" | "months";

interface Inputs {
  balance: string;
  apr: string;
  monthlyPayment: string;
  payoffMonths: string;
}
interface ScheduleRow {
  m: number;
  balStart: number;
  payment: number;
  interest: number;
  principal: number;
  balEnd: number;
}
interface Results {
  monthlyPayment: number;
  payoffMonths: number;
  totalInterest: number;
  totalPaid: number;
  schedule: ScheduleRow[];
  suggestion: string;
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

/* ───────────────── Number-to-Words ───────────────── */
const toWords = (n: number): string => {
  if (!isFinite(n)) return "";
  n = Math.round(Math.abs(n));
  if (n === 0) return "Zero";
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
  const h = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100)
      return `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`;
    if (x < 1000)
      return `${ones[Math.floor(x / 100)]} Hundred${
        x % 100 ? " " + h(x % 100) : ""
      }`;
    if (x < 100000)
      return `${h(Math.floor(x / 1000))} Thousand${
        x % 1000 ? " " + h(x % 1000) : ""
      }`;
    if (x < 10000000)
      return `${h(Math.floor(x / 100000))} Lakh${
        x % 100000 ? " " + h(x % 100000) : ""
      }`;
    return `${h(Math.floor(x / 10000000))} Crore${
      x % 10000000 ? " " + h(x % 10000000) : ""
    }`;
  };
  return h(n);
};

/* ───────────────── Main Component ───────────────── */
const CreditCardPayoff: React.FC = () => {
  const [mode, setMode] = useState<Mode>("payment");
  const [inputs, setInputs] = useState<Inputs>({
    balance: "",
    apr: "",
    monthlyPayment: "",
    payoffMonths: "",
  });
  const [errors, setErrors] = useState<Partial<Inputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ── Validation ── */
  const validNum = (v: string) => v !== "" && !isNaN(+v) && +v > 0;
  const validate = () => {
    const e: Partial<Inputs> = {};
    if (!validNum(inputs.balance)) e.balance = "Enter balance > 0";
    if (!validNum(inputs.apr)) e.apr = "Enter APR";
    if (mode === "payment") {
      if (!validNum(inputs.monthlyPayment)) e.monthlyPayment = "Enter payment";
    } else {
      if (!validNum(inputs.payoffMonths)) e.payoffMonths = "Enter months";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Calculation ── */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const B = +inputs.balance;
    const r = +inputs.apr / 100 / 12; // monthly rate
    let P: number, N: number;

    if (mode === "payment") {
      P = +inputs.monthlyPayment;
      if (P <= B * r) {
        setErrors({ monthlyPayment: "Payment too low to ever pay off" });
        setBusy(false);
        return;
      }
      N = Math.ceil(Math.log(P / (P - B * r)) / Math.log(1 + r));
    } else {
      N = Math.ceil(+inputs.payoffMonths);
      P = Math.ceil((B * (r * Math.pow(1 + r, N))) / (Math.pow(1 + r, N) - 1));
    }

    /* amortisation schedule */
    let remaining = B,
      totalInterest = 0;
    const schedule: ScheduleRow[] = [];
    for (let m = 1; m <= N; m++) {
      const interest = remaining * r;
      const principal = Math.min(P - interest, remaining);
      const endBal = Math.max(0, remaining - principal);
      schedule.push({
        m,
        balStart: Math.round(remaining),
        payment: Math.round(P),
        interest: Math.round(interest),
        principal: Math.round(principal),
        balEnd: Math.round(endBal),
      });
      totalInterest += interest;
      remaining = endBal;
      if (remaining <= 0) break;
    }
    totalInterest = Math.round(totalInterest);

    /* suggestion */
    let suggestion = "";
    if (schedule.length > 60) {
      suggestion =
        "Consider adding at least ₹1,000 extra per month to shave years off your payoff time.";
    } else if (schedule.length > 24) {
      suggestion =
        "Adding even ₹500 extra each month could save you a lot of interest.";
    } else {
      suggestion =
        "Great pace! Keep paying this amount to be debt-free on schedule.";
    }

    setResults({
      monthlyPayment: Math.round(P),
      payoffMonths: schedule.length,
      totalInterest,
      totalPaid: Math.round(B + totalInterest),
      schedule,
      suggestion,
    });
    setTimeout(() => setBusy(false), 400);
  };

  /* chart data */
  const lineData =
    results?.schedule.map((row) => ({ m: row.m, balance: row.balEnd })) || [];
  const barData =
    results?.schedule.map((row) => ({
      m: row.m,
      Interest: row.interest,
      Principal: row.principal,
    })) || [];
  const BAR_COLORS = ["#272a2b", "#108e66"];

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="container">
      {/* nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Credit-Card Pay-off Calculator</h1>
      <p className="description">
        Estimate how long it will take to clear your balance—or what payment you
        need for a target date.
      </p>
      <div className="explanation">
  <p>
    <strong>Credit Card Payoff:</strong> This calculator helps you plan how to <strong>eliminate credit card debt</strong> by
    estimating the time and total interest needed to pay off your balance based on your <strong>monthly payment</strong>
    and <strong>interest rate</strong>.
  </p>
  <p>
    By entering your <strong>outstanding balance</strong>, <strong>annual interest rate (APR)</strong>, and preferred
    <strong>monthly payment amount</strong>, the calculator shows how long it will take to become
    <strong>debt-free</strong> and how much <strong>interest</strong> you'll pay over time—empowering you to
    make smarter repayment decisions.
  </p>
</div>


      {/* form */}
      <div className="card">
        <h2 className="section-title">Card Details</h2>
        <div className="input-group">
          {/* balance */}
          <label>
            <span className="input-label">
              Outstanding Balance (₹)
              <TooltipIcon text="Current credit-card balance." />
            </span>
            <input
              name="balance"
              type="number"
              value={inputs.balance}
              onChange={onChange}
              placeholder="e.g., 75000"
            />
            <span className="words">
              {inputs.balance && toWords(+inputs.balance)} Rupees
            </span>
            {errors.balance && <span className="error">{errors.balance}</span>}
          </label>

          {/* apr */}
          <label>
            <span className="input-label">
              Annual Interest Rate (APR) (%)
              <TooltipIcon text="Card’s annual percentage rate." />
            </span>
            <input
              name="apr"
              type="number"
              step="0.01"
              value={inputs.apr}
              onChange={onChange}
              placeholder="e.g., 36"
            />
            <span className="words">
              {inputs.apr && toWords(Math.round(+inputs.apr))} percent
            </span>
            {errors.apr && <span className="error">{errors.apr}</span>}
          </label>

          {/* dropdown */}
          <label>
            <span className="input-label">
              Choose Pay-off Option
              <TooltipIcon text="Select whether you know the monthly amount or the deadline." />
            </span>
            <select
              className="select-input"
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="payment">Pay by Fixed Monthly Amount</option>
              <option value="months">Clear in Target Months</option>
            </select>
          </label>

          {/* conditional input */}
          {mode === "payment" ? (
            <label>
              <span className="input-label">
                Monthly Payment (₹)
                <TooltipIcon text="Amount you will pay each month." />
              </span>
              <input
                name="monthlyPayment"
                type="number"
                value={inputs.monthlyPayment}
                onChange={onChange}
                placeholder="e.g., 5000"
              />
              <span className="words">
                {inputs.monthlyPayment && toWords(+inputs.monthlyPayment)}{" "}
                Rupees
              </span>
              {errors.monthlyPayment && (
                <span className="error">{errors.monthlyPayment}</span>
              )}
            </label>
          ) : (
            <label>
              <span className="input-label">
                Desired Pay-off Time (Months)
                <TooltipIcon text="Number of months until balance is zero." />
              </span>
              <input
                name="payoffMonths"
                type="number"
                value={inputs.payoffMonths}
                onChange={onChange}
                placeholder="e.g., 18"
              />
              <span className="words">
                {inputs.payoffMonths && toWords(+inputs.payoffMonths)} Months
              </span>
              {errors.payoffMonths && (
                <span className="error">{errors.payoffMonths}</span>
              )}
            </label>
          )}
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
          <h2 className="section-title">Pay-off Summary</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Monthly Payment:</strong> ₹
              {results.monthlyPayment.toLocaleString("en-IN")} (
              {toWords(results.monthlyPayment)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Months to Pay-off:</strong> {results.payoffMonths} (
              {toWords(results.payoffMonths)} Months)
            </div>
            <div className="summary-item">
              <strong>Total Interest:</strong> ₹
              {results.totalInterest.toLocaleString("en-IN")} (
              {toWords(results.totalInterest)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Total Repaid:</strong> ₹
              {results.totalPaid.toLocaleString("en-IN")} (
              {toWords(results.totalPaid)} Rupees)
            </div>
          </div>

          {/* chart explanation */}
          <div className="chart-note">
            <p>
              <strong>Line Chart</strong> shows remaining balance each
              month.&nbsp;
              <strong>Bar Chart</strong> splits every payment into interest and
              principal. Use the toggle.
            </p>
          </div>

          {/* toggle */}
          <div className="toggle">
            <button
              onClick={() => setChartType("line")}
              className={chartType === "line" ? "active" : ""}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={chartType === "bar" ? "active" : ""}
            >
              Bar Chart
            </button>
          </div>

          {/* charts */}
          {chartType === "line" ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="m" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                    labelFormatter={(l) => `Month ${l}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#108e66"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} stackOffset="sign">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="m" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                    labelFormatter={(l) => `Month ${l}`}
                  />
                  <Legend />
                  <Bar dataKey="Interest" stackId="a" fill={BAR_COLORS[0]} />
                  <Bar dataKey="Principal" stackId="a" fill={BAR_COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* table */}
          <h2 className="section-title">Amortization Schedule</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Beg. Balance (₹)</th>
                  <th>Payment (₹)</th>
                  <th>Interest (₹)</th>
                  <th>Principal (₹)</th>
                  <th>End Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.schedule.map((r) => (
                  <tr key={r.m}>
                    <td>{r.m}</td>
                    <td>{r.balStart.toLocaleString("en-IN")}</td>
                    <td>{r.payment.toLocaleString("en-IN")}</td>
                    <td>{r.interest.toLocaleString("en-IN")}</td>
                    <td>{r.principal.toLocaleString("en-IN")}</td>
                    <td>{r.balEnd.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* suggestion */}
          <div className="actionable">
            <p>{results.suggestion}</p>
          </div>

          {/* disclaimer */}
          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                This assumes interest compounds monthly at the stated APR.
              </li>
              <li>
                Real-world issuer practices (daily compounding, changing APR)
                may differ.
              </li>
              <li>
                Paying more than this amount saves interest and shortens payoff
                time.
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
        .input-group input,
        .select-input {
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
        .error {
          color: red;
          font-size: 0.8rem;
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
        .chart-note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 8px;
          margin-bottom: 0.8rem;
          font-size: 0.9rem;
        }

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

        .table-wrap {
          max-height: 300px;
          overflow: auto;
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

        .actionable {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-top: 0.8rem;
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
    </div>
  );
};

export default CreditCardPayoff;
