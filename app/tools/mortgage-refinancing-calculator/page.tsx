/*  /app/tools/mortgage-refinancing-calculator/page.tsx
    Mortgage Refinancing Calculator — Spring Money Theme
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
interface Inputs {
  currBalance: string;
  currRate: string;
  currTenure: string;
  newRate: string;
  newTenure: string;
  closingCosts: string;
  includeCostsInLoan: "false" | "true";
}
interface YearRow {
  year: number;
  emiCurr: number;
  emiNew: number;
  annualSavings: number;
  remainingCost: number;
}
interface Results {
  emiCurr: number;
  emiNew: number;
  monthlySavings: number;
  breakEvenMonths: number;
  totalInterestSaved: number;
  yearRows: YearRow[];
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
          line-height: 1.2;
          width: 220px;
          z-index: 1000;
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

/* ───────────────── Number-to-Words (Indian) ───────────────── */
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
const MortgageRefinanceCalc: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    currBalance: "",
    currRate: "",
    currTenure: "",
    newRate: "",
    newTenure: "",
    closingCosts: "",
    includeCostsInLoan: "false",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* validation (skip includeCostsInLoan) */
  const isPosNum = (v: string) => v !== "" && !isNaN(+v) && +v > 0;
  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    [
      "currBalance",
      "currRate",
      "currTenure",
      "newRate",
      "newTenure",
      "closingCosts",
    ].forEach((k) => {
      if (!isPosNum((inputs as any)[k])) e[k as keyof Inputs] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* calculation */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const PB = +inputs.currBalance;
    const rCurr = +inputs.currRate / 100 / 12;
    const nCurr = +inputs.currTenure * 12;
    const emiCurr =
      (PB * rCurr * Math.pow(1 + rCurr, nCurr)) /
      (Math.pow(1 + rCurr, nCurr) - 1);

    const costs = +inputs.closingCosts;
    const includeCosts = inputs.includeCostsInLoan === "true";
    const principalNew = PB + (includeCosts ? costs : 0);
    const rNew = +inputs.newRate / 100 / 12;
    const nNew = +inputs.newTenure * 12;
    const emiNew =
      (principalNew * rNew * Math.pow(1 + rNew, nNew)) /
      (Math.pow(1 + rNew, nNew) - 1);

    const monthlySavings = emiCurr - emiNew;
    const breakEvenMonths =
      monthlySavings > 0 ? costs / monthlySavings : Infinity;

    const totalPaidCurr = emiCurr * nCurr;
    const interestCurr = totalPaidCurr - PB;
    const totalPaidNew = emiNew * nNew;
    const interestNew = totalPaidNew - principalNew;
    const interestSaved = interestCurr - interestNew;

    /* year-wise table */
    const maxYears = Math.max(+inputs.currTenure, +inputs.newTenure);
    const yearRows: YearRow[] = [];
    let remainingCost = costs;
    for (let y = 1; y <= maxYears; y++) {
      const annualSav = (emiCurr - emiNew) * 12;
      remainingCost = Math.max(0, remainingCost - annualSav);
      yearRows.push({
        year: y,
        emiCurr: Math.round(emiCurr),
        emiNew: Math.round(emiNew),
        annualSavings: Math.round(annualSav),
        remainingCost: Math.round(remainingCost),
      });
    }

    const suggestion =
      monthlySavings > 0
        ? `You’ll save ₹${Math.round(monthlySavings).toLocaleString(
            "en-IN"
          )} per month and recoup costs in ≈ ${breakEvenMonths.toFixed(
            1
          )} months.`
        : "Refinancing increases your monthly payment — reconsider unless there are other benefits.";

    setResults({
      emiCurr: Math.round(emiCurr),
      emiNew: Math.round(emiNew),
      monthlySavings: Math.round(monthlySavings),
      breakEvenMonths: Math.round(breakEvenMonths),
      totalInterestSaved: Math.round(interestSaved),
      yearRows,
      suggestion,
    });
    setTimeout(() => setBusy(false), 400);
  };

  /* chart data */
  const lineData = results
    ? Array.from(
        { length: Math.max(+inputs.currTenure, +inputs.newTenure) * 12 },
        (_, i) => ({
          m: i + 1,
          Current: results.emiCurr,
          New: results.emiNew,
        })
      )
    : [];
  const barData = results
    ? [
        { name: "Closing Costs", value: +inputs.closingCosts },
        { name: "Total Interest Saved", value: results.totalInterestSaved },
      ]
    : [];

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="container">
      {/* nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Mortgage / Loan Refinancing Calculator</h1>
      <p className="description">
        Compare your current loan with a refinance offer to see monthly and
        lifetime savings & the break-even point.
      </p>
      <div className="explanation">
        <p>
          <strong>Mortgage Refinance Calculator:</strong> This tool helps you
          evaluate whether <strong>refinancing your existing mortgage</strong>{" "}
          is financially beneficial by comparing your current loan with a
          potential new loan.
        </p>
        <p>
          It takes into account your <strong>outstanding loan balance</strong>,
          current and new <strong>interest rates</strong>,{" "}
          <strong>remaining tenure</strong>, and{" "}
          <strong>refinancing costs</strong> like processing fees or penalties.
        </p>
        <p>
          The calculator shows your potential <strong>monthly savings</strong>,
          total <strong>interest saved</strong>, and the{" "}
          <strong>break-even point</strong> — how long it will take for the
          savings to cover the refinance costs.
        </p>
      </div>

      {/* form */}
      <div className="card">
        <h2 className="section-title">Existing Loan</h2>
        <div className="input-group">
          {[
            [
              "currBalance",
              "Current Outstanding Balance (₹)",
              "Remaining principal on current loan.",
              "e.g. 25,00,000",
            ],
            [
              "currRate",
              "Current Annual Rate (%)",
              "Interest rate you pay now (p.a.).",
              "e.g. 8.50",
            ],
            [
              "currTenure",
              "Remaining Tenure (Years)",
              "Years left on current loan.",
              "e.g. 12",
            ],
          ].map(([k, lbl, tip, ph]) => {
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
                  placeholder={ph as string}
                />
                {k === "currBalance" && v && (
                  <span className="words">{toWords(+v)} Rupees</span>
                )}
                {errors[k as keyof Inputs] && (
                  <span className="error">{errors[k as keyof Inputs]}</span>
                )}
              </label>
            );
          })}
        </div>

        <h2 className="section-title">Refinance Offer</h2>
        <div className="input-group">
          {[
            [
              "newRate",
              "New Annual Rate (%)",
              "Interest rate offered (p.a.).",
              "e.g. 7.25",
            ],
            [
              "newTenure",
              "New Loan Tenure (Years)",
              "Desired tenure for new loan.",
              "e.g. 15",
            ],
            [
              "closingCosts",
              "Closing Costs (₹)",
              "Fees & charges to refinance.",
              "e.g. 35,000",
            ],
          ].map(([k, lbl, tip, ph]) => {
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
                  placeholder={ph as string}
                />
                {k === "closingCosts" && v && (
                  <span className="words">{toWords(+v)} Rupees</span>
                )}
                {errors[k as keyof Inputs] && (
                  <span className="error">{errors[k as keyof Inputs]}</span>
                )}
              </label>
            );
          })}

          <label>
            <span className="input-label">
              Include Costs in Loan?
              <TooltipIcon text="Add closing costs into new principal instead of paying cash." />
            </span>
            <select
              name="includeCostsInLoan"
              value={inputs.includeCostsInLoan}
              onChange={onChange}
              className="select-input"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
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
          <h2 className="section-title">Savings Snapshot</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Current EMI:</strong> ₹
              {results.emiCurr.toLocaleString("en-IN")} (
              {toWords(results.emiCurr)} Rupees)
            </div>
            <div className="summary-item">
              <strong>New EMI:</strong> ₹
              {results.emiNew.toLocaleString("en-IN")} (
              {toWords(results.emiNew)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Monthly Savings:</strong> ₹
              {results.monthlySavings.toLocaleString("en-IN")} (
              {toWords(results.monthlySavings)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Break-Even:</strong> {results.breakEvenMonths.toFixed(1)}{" "}
              months (~
              {(results.breakEvenMonths / 12).toFixed(1)} yrs)
            </div>
            <div className="summary-item">
              <strong>Total Interest Saved:</strong> ₹
              {results.totalInterestSaved.toLocaleString("en-IN")} (
              {toWords(results.totalInterestSaved)} Rupees)
            </div>
          </div>

          <div className="chart-note">
            <p>
              <strong>Line Chart</strong> — monthly EMIs.{" "}
              <strong>Bar Chart</strong> — interest saved vs. closing costs.
            </p>
          </div>

          <div className="toggle">
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

          {chartType === "line" ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={260}>
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
                    dataKey="Current"
                    stroke="#272a2b"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="New"
                    stroke="#108e66"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <h2 className="section-title">Year-wise Cashflow</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>EMI (Current)</th>
                  <th>EMI (New)</th>
                  <th>Annual Savings</th>
                  <th>Remaining Cost</th>
                </tr>
              </thead>
              <tbody>
                {results.yearRows.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{r.emiCurr.toLocaleString("en-IN")}</td>
                    <td>{r.emiNew.toLocaleString("en-IN")}</td>
                    <td>{r.annualSavings.toLocaleString("en-IN")}</td>
                    <td>{r.remainingCost.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actionable">
            <p>{results.suggestion}</p>
          </div>

          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>Assumes fixed interest rates for both loans.</li>
              <li>
                Closing costs exclude any pre-payment penalties by your current
                lender.
              </li>
              <li>Verify all fees & terms with your bank before proceeding.</li>
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
          font-size: 1.05rem;
          margin-bottom: 0.9rem;
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
        .input-group input::placeholder {
          color: #a8a8a8;
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

export default MortgageRefinanceCalc;
