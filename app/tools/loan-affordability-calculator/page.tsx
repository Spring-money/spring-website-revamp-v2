/*  /app/calculators/loanAffordability/page.tsx
    Loan-Affordability Calculator — Spring Money Theme
---------------------------------------------------------------- */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

/* ───────────────── Types ───────────────── */
interface Inputs {
  income: string;
  otherEmi: string;
  foir: string;
  buffer: string;
  tenure: string;
  rate: string;
  charges: string;
}
interface Results {
  maxEmi: number;
  loanEligible: number;
  foirFinal: number;
  freeIncome: number;
  bufferFinal: number;
}

/* ───────────────── Tooltip Icon ───────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="tooltipIcon"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="info-icon">i</span>
      {hover && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltipIcon {
          position: relative;
          display: inline-block;
          margin-left: 5px;
          cursor: pointer;
          vertical-align: middle;
        }
        .info-icon {
          display: inline-block;
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          font-size: 0.6rem;
          width: 14px;
          height: 14px;
          text-align: center;
          line-height: 14px;
          font-weight: bold;
        }
        .tooltiptext {
          visibility: visible;
          width: 220px;
          background-color: #108e66;
          color: #fcfffe;
          text-align: left;
          border-radius: 4px;
          padding: 6px 8px;
          position: absolute;
          z-index: 1000;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          line-height: 1.2;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          opacity: 1;
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

/* ───────────────── Number-to-Words Helpers ───────────────── */
const toWords = (n: number): string => {
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
    if (x < 20) return o[x];
    if (x < 100)
      return `${t[Math.floor(x / 10)]}${x % 10 ? " " + o[x % 10] : ""}`;
    if (x < 1000)
      return `${o[Math.floor(x / 100)]} Hundred${
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
const toWordsPercent = (v: number) =>
  Number.isNaN(v) ? "" : `${toWords(Math.round(v))} percent`;

/* ───────────────── Component ───────────────── */
const LoanAffordability: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    income: "",
    otherEmi: "0",
    foir: "40",
    buffer: "5",
    tenure: "5",
    rate: "12",
    charges: "0",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    Object.entries(inputs).forEach(([k, v]) => {
      if (v === "" || isNaN(Number(v)) || Number(v) < 0)
        e[k as keyof Inputs] = "Enter a valid number";
    });
    if (+inputs.foir < 20 || +inputs.foir > 60) e.foir = "20 – 60 % allowed";
    if (+inputs.buffer > 20) e.buffer = "Max 20 %";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    setBusy(true);
    const I = +inputs.income,
      E0 = +inputs.otherEmi,
      f = +inputs.foir / 100,
      b = +inputs.buffer / 100,
      n = +inputs.tenure * 12,
      r = +inputs.rate / 100 / 12;

    const maxEmiAllowed = I * f,
      safetyCut = I * b,
      MaxEMI = Math.max(0, maxEmiAllowed - E0 - safetyCut);
    let LoanElig = 0;
    if (MaxEMI > 0) {
      LoanElig = (MaxEMI * ((1 + r) ** n - 1)) / (r * (1 + r) ** n);
    }
    const FOIR_final = ((E0 + MaxEMI) / I) * 100,
      bufferFinal = 100 - FOIR_final,
      freeIncome = I - E0 - MaxEMI;

    setResults({
      maxEmi: Math.round(MaxEMI),
      loanEligible: Math.round(LoanElig),
      foirFinal: +FOIR_final.toFixed(2),
      freeIncome: Math.round(freeIncome),
      bufferFinal: +bufferFinal.toFixed(2),
    });
    setTimeout(() => setBusy(false), 300);
  };

  const SLICE = ["#525ecc", "#108e66", "#ff9f00"];
  const chartData = results
    ? [
        { name: "Existing EMIs", value: +inputs.otherEmi },
        { name: "New EMI", value: results.maxEmi },
        { name: "Free Income", value: results.freeIncome },
      ]
    : [];

  return (
    <div className="container">
      {/* nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Loan-Affordability Calculator</h1>
      <p className="description">
        Estimate the biggest loan you can safely handle without busting
        your&nbsp;FOIR / DTI.
      </p>

      {/* explanation */}
      <div className="explanation">
        <p>
          <strong>Loan Affordability Calculator:</strong> This tool estimates
          the <strong>maximum loan amount</strong> you can comfortably afford
          based on your income, expenses, interest rate, and loan tenure.
        </p>
        <p>
          It uses a safe <strong>debt-to-income ratio</strong> to ensure your
          monthly EMI stays within manageable limits, helping you avoid
          over-borrowing or financial strain.
        </p>
        <p>
          Adjust the values to explore how changes in{" "}
          <strong>monthly income</strong>, <strong>existing obligations</strong>
          , or <strong>interest rates</strong> impact your borrowing capacity.
        </p>
      </div>

      {/* form */}
      <div className="card">
        {/* Income Details */}
        <h2 className="section-title">Income Details</h2>
        <div className="input-group">
          <label>
            <span className="input-label">
              Net Monthly Income (₹)
              <TooltipIcon text="Your in-hand salary or business income after tax." />
            </span>
            <input
              type="number"
              name="income"
              value={inputs.income}
              onChange={onChange}
              placeholder="e.g., 75,000"
            />
            {inputs.income && (
              <span className="converter">
                {toWords(+inputs.income)} Rupees
              </span>
            )}
            {errors.income && <span className="error">{errors.income}</span>}
          </label>
          <label>
            <span className="input-label">
              Existing EMIs (₹) (Optional)
              <TooltipIcon text="Car, education, credit-card EMIs, etc." />
            </span>
            <input
              type="number"
              name="otherEmi"
              value={inputs.otherEmi}
              onChange={onChange}
              placeholder="0"
            />
            {inputs.otherEmi && (
              <span className="converter">
                {toWords(+inputs.otherEmi)} Rupees
              </span>
            )}
            {errors.otherEmi && (
              <span className="error">{errors.otherEmi}</span>
            )}
          </label>
        </div>

        {/* Lender Limits */}
        <h2 className="section-title">Lender Limits</h2>
        <div className="input-group">
          <label>
            <span className="input-label">
              FOIR / DTI Limit (%)
              <TooltipIcon text="Max % of income banks allow for EMIs (35–55 %)." />
            </span>
            <input
              type="number"
              name="foir"
              value={inputs.foir}
              onChange={onChange}
              placeholder="e.g., 40"
            />
            {errors.foir && <span className="error">{errors.foir}</span>}
          </label>
          <label>
            <span className="input-label">
              Safety Buffer (%)
              <TooltipIcon text="% of income you want left after all EMIs." />
            </span>
            <input
              type="number"
              name="buffer"
              value={inputs.buffer}
              onChange={onChange}
              placeholder="e.g., 5"
            />
            {errors.buffer && <span className="error">{errors.buffer}</span>}
          </label>
        </div>

        {/* Loan Parameters */}
        <h2 className="section-title">Loan Parameters</h2>
        <div className="input-group">
          <label>
            <span className="input-label">
              Tenure (Years)
              <TooltipIcon text="1–30 years" />
            </span>
            <input
              type="number"
              name="tenure"
              value={inputs.tenure}
              onChange={onChange}
              placeholder="e.g., 5"
            />
          </label>
          <label>
            <span className="input-label">
              Interest Rate (% p.a.)
              <TooltipIcon text="Nominal reducing-balance rate." />
            </span>
            <input
              type="number"
              step="0.01"
              name="rate"
              value={inputs.rate}
              onChange={onChange}
              placeholder="e.g., 12"
            />
          </label>
          <label>
            <span className="input-label">
              Processing Charges (₹) (Optional)
              <TooltipIcon text="Up-front fees that may be financed." />
            </span>
            <input
              type="number"
              name="charges"
              value={inputs.charges}
              onChange={onChange}
              placeholder="0"
            />
          </label>
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
          <h2 className="section-title">What You Can Afford</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Affordable EMI:</strong> ₹
              {results.maxEmi.toLocaleString("en-IN")} (
              {toWords(results.maxEmi)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Eligible Loan:</strong> ₹
              {results.loanEligible.toLocaleString("en-IN")} (
              {toWords(results.loanEligible)} Rupees)
            </div>
            <div className="summary-item">
              <strong>FOIR After Loan:</strong> {results.foirFinal.toFixed(1)} %
              ({toWordsPercent(results.foirFinal)})
            </div>
            <div className="summary-item">
              <strong>Income Left:</strong> ₹
              {results.freeIncome.toLocaleString("en-IN")} (
              {toWords(results.freeIncome)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Buffer Achieved:</strong> {results.bufferFinal.toFixed(1)}{" "}
              % ({toWordsPercent(results.bufferFinal)})
            </div>
          </div>

          <div className="chart-explanation">
            <p>
              Bar chart splits your income into existing EMIs, the new EMI
              head-room, and the free cash you'll still have.
            </p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="90%" height={260}>
              <BarChart
                data={chartData}
                margin={{ left: 60, right: 30, top: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="value" name="₹ per month">
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={SLICE[i % SLICE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                Assumes interest rate stays constant over the entire tenure.
              </li>
              <li>
                FOIR and buffer thresholds vary by lender—check your bank for
                exact limits.
              </li>
              <li>
                Processing fees and insurance increase upfront cost; include
                them if financed.
              </li>
              <li>
                This is illustrative. Lenders will assess credit & income before
                sanctioning.
              </li>
            </ul>
            <p>
              Please consult your banker or a qualified financial advisor before
              borrowing.
            </p>
          </div>

          <p className="tip-note">
            <strong>Tip:</strong> Keeping FOIR under 40 % and a six-month
            emergency fund can boost approval odds and reduce borrowing stress.
          </p>
        </div>
      )}

      {/* styles */}
      <style jsx>{`
        .container {
          padding: 1.25rem 1rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272b2a;
          max-width: 100%;
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
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .explanation {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.4rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
        }
        .explanation p {
          margin: 0.4rem 0;
          line-height: 1.45;
        }
        .card {
          background: #ffffff;
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
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          column-gap: 1.5rem;
          row-gap: 1.1rem;
          margin-bottom: 1.2rem;
        }
        .input-label {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
        }
        input {
          padding: 0.5rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          font-size: 1rem;
          margin-top: 0.35rem;
        }
        .converter {
          font-size: 0.8rem;
          color: #272b2a;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          font-size: 0.8rem;
        }
        .calculate-button {
          width: 100%;
          margin-top: 1.3rem;
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
          margin-bottom: 0.9rem;
          display: grid;
          gap: 0.65rem;
          border: 1px solid #272b2a;
        }
        .summary-item {
          font-size: 1rem;
        }
        .chart-explanation {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          text-align: center;
          font-size: 0.9rem;
        }
        .chart-container {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }
        .disclaimer {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #272b2a;
          border: 1px solid #272b2a;
          margin-top: 1.5rem;
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
        .tip-note {
          background: #e7f9e7;
          border-left: 4px solid #108e66;
          padding: 0.8rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          margin-top: 1rem;
        }
        .cta {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .ctaBtn {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        @media (max-width: 768px) {
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

export default LoanAffordability;
