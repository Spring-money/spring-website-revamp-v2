// File: /app/tools/pf-withdrawal-calculator/page.tsx

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

// -----------------------
// Number-to-Words (Indian)
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

// -----------------------
// Percent-to-Words
// -----------------------
const numberToWordsPercent = (value: number): string => {
  if (Number.isInteger(value)) return numberToWords(value) + " percent";
  const intPart = Math.floor(value);
  const decimalPart = Math.round((value - intPart) * 10);
  return `${numberToWords(intPart)} point ${numberToWords(
    decimalPart
  )} percent`;
};

// -----------------------
// Tooltip Component
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
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: bold;
          cursor: default;
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
          white-space: nowrap;
          font-size: 0.75rem;
          z-index: 10;
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

// -----------------------
// PF Withdrawal Calculator
// -----------------------
export default function PFWithdrawalCalculator() {
  const [currentBalance, setCurrentBalance] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [empRate, setEmpRate] = useState("");
  const [erRate, setErRate] = useState("");
  const [salaryIncrRate, setSalaryIncrRate] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [empContrib, setEmpContrib] = useState(0);
  const [erContrib, setErContrib] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0);
  const [finalCorpus, setFinalCorpus] = useState(0);
  const [cashflow, setCashflow] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const calculate = () => {
    setError(null);
    const CB = parseFloat(currentBalance);
    const CA = parseInt(currentAge, 10);
    const RA = parseInt(retirementAge, 10);
    const MS = parseFloat(monthlySalary);
    const ER = parseFloat(empRate) / 100;
    const PR = parseFloat(erRate) / 100;
    const SR = parseFloat(salaryIncrRate) / 100;
    const IR = parseFloat(interestRate) / 100 / 12;

    if ([CB, CA, RA, MS, ER, PR, SR, IR].some((v) => isNaN(v) || v < 0)) {
      return setError("Please enter valid positive numbers for all fields.");
    }
    if (RA <= CA)
      return setError("Retirement age must be greater than current age.");

    const totalMonths = (RA - CA) * 12;
    let corpus = CB;
    let totalEmp = 0,
      totalEr = 0;
    const yearly: any[] = [];

    for (let m = 0; m < totalMonths; m++) {
      const yearIdx = Math.floor(m / 12);
      const currSal = MS * Math.pow(1 + SR, yearIdx);
      const eC = currSal * ER;
      const rC = currSal * PR;
      totalEmp += eC;
      totalEr += rC;
      corpus = corpus * (1 + IR) + eC + rC;
      if ((m + 1) % 12 === 0) {
        const year = CA + yearIdx + 1;
        yearly.push({
          year,
          empContrib: Math.round(totalEmp),
          erContrib: Math.round(totalEr),
          interest: Math.round(corpus - CB - totalEmp - totalEr),
          endBalance: Math.round(corpus),
        });
      }
    }

    setEmpContrib(Math.round(totalEmp));
    setErContrib(Math.round(totalEr));
    setInterestEarned(Math.round(corpus - CB - totalEmp - totalEr));
    setFinalCorpus(Math.round(corpus));
    setCashflow(yearly);
  };

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much Will I Get from My PF?</h1>
      <p className="description">
        Estimate your total PF corpus at retirement and the lump‑sum
        withdrawable amount.
      </p>
      <div className="explanation">
        <p>
          <strong>Provident Fund (PF) Withdrawal:</strong> This calculator helps
          estimate the total amount you can withdraw from your{" "}
          <strong>EPF (Employees Provident Fund)</strong> account based on your
          contribution, employers share, and interest accrued over time.
        </p>
        <p>
          It factors in your current <strong>PF balance</strong>,{" "}
          <strong>monthly contributions</strong>, and an assumed{" "}
          <strong>annual interest rate</strong> to project your withdrawal value
          at a certain point in time.
        </p>
        <p>
          This is especially useful when planning for{" "}
          <strong>resignation, retirement</strong>, or{" "}
          <strong>major expenses</strong> like education, home purchase, or
          medical needs, subject to EPF withdrawal rules and eligibility
          criteria.
        </p>
      </div>

      <section className="card">
        <h2 className="card-title">Inputs</h2>
        <div className="grid-2">
          {[
            [
              "Current EPF Balance (₹)",
              currentBalance,
              setCurrentBalance,
              numberToWords,
              "e.g. 2,50,000",
            ],
            ["Current Age (Years)", currentAge, setCurrentAge, null, "e.g. 30"],
            [
              "Retirement Age (Years)",
              retirementAge,
              setRetirementAge,
              null,
              "e.g. 60",
            ],
            [
              "Monthly Basic Salary (₹)",
              monthlySalary,
              setMonthlySalary,
              numberToWords,
              "e.g. 50,000",
            ],
            [
              "Employee Contribution Rate (%)",
              empRate,
              setEmpRate,
              numberToWordsPercent,
              "e.g. 12",
            ],
            [
              "Employer Contribution Rate (%)",
              erRate,
              setErRate,
              numberToWordsPercent,
              "e.g. 12",
            ],
            [
              "Annual Salary Increase (%)",
              salaryIncrRate,
              setSalaryIncrRate,
              numberToWordsPercent,
              "e.g. 8",
            ],
            [
              "PF Interest Rate (% p.a.)",
              interestRate,
              setInterestRate,
              numberToWordsPercent,
              "e.g. 8.10",
            ],
          ].map(([label, val, setter, conv, ph]: any) => (
            <div key={label as string} className="field">
              <label className="field-label">
                {label as string}
                <TooltipIcon text={label as string} />
              </label>
              <input
                type="number"
                value={val as string}
                onChange={(e) => setter(e.target.value)}
                placeholder={ph as string}
                className="field-input"
              />
              {val && conv && <div className="field-conv">{conv(+val)} </div>}
            </div>
          ))}
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button className="btn-primary" onClick={calculate}>
          Calculate My PF Corpus
        </button>
      </section>

      {finalCorpus > 0 && (
        <section className="results">
          <h2 className="results-title">Results</h2>
          <div className="summary-grid">
            {[
              ["Employee Contribution", empContrib],
              ["Employer Contribution", erContrib],
              ["Interest Earned", interestEarned],
              ["Final PF Corpus", finalCorpus],
            ].map(([lbl, val]) => (
              <div key={lbl as string} className="summary-card">
                <strong>{lbl as string}</strong>
                <div className="summary-amount">₹{fmt(val as number)}</div>
                <div className="summary-words">
                  ({numberToWords(val as number)} Rupees)
                </div>
              </div>
            ))}
          </div>

          <div className="toggle">
            <button
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              Growth Over Time
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Contrib vs Interest
            </button>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "line" ? (
                <LineChart
                  data={cashflow}
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => fmt(v as number)} />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="endBalance"
                    stroke="#108E66"
                    name="End Balance"
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={[
                    { name: "Contributions", val: empContrib + erContrib },
                    { name: "Interest", val: interestEarned },
                  ]}
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => fmt(v as number)} />
                  <RechartsTooltip formatter={(v) => `₹${fmt(v as number)}`} />
                  <Legend />
                  <Bar dataKey="val" fill="#108E66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="table-title">Year‑Wise Cashflow</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Emp Contrib</th>
                  <th>Er Contrib</th>
                  <th>Interest</th>
                  <th>End Balance</th>
                </tr>
              </thead>
              <tbody>
                {cashflow.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>₹{fmt(r.empContrib)}</td>
                    <td>₹{fmt(r.erContrib)}</td>
                    <td>₹{fmt(r.interest)}</td>
                    <td>₹{fmt(r.endBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="disc">
            <h3>Important Considerations</h3>
            <ul>
              <li>
                Assumes fixed salary growth and PF rates; real‑world changes
                will alter results.
              </li>
              <li>
                Monthly compounding is assumed; EPFO credit dates may vary.
              </li>
              <li>Excludes voluntary PF or pension schemes.</li>
              <li>Update PF rate annually as EPFO revises rates.</li>
              <li>
                For diversification, consider NPS or other retirement
                instruments.
              </li>
            </ul>
          </section>
        </section>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
          margin: auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: "Poppins", sans-serif;
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
          font-weight: 500;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          color: #555;
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
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .field-label {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        .field-input {
          padding: 0.6rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .field-input:focus {
          outline: 2px solid #108e66;
          border-color: transparent;
        }
        .field-conv {
          font-size: 0.85rem;
          color: #444;
          margin-top: 0.25rem;
        }
        .error-msg {
          color: red;
          text-align: center;
          margin: 0.75rem 0;
        }
        .btn-primary {
          background: #108e66;
          color: #fcfffe;
          border: none;
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
        }
        .results {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #fcfffe;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .results-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .summary-card {
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          font-weight: 500;
        }
        .summary-amount {
          font-size: 1.2rem;
          margin: 0.25rem 0;
        }
        .summary-words {
          font-size: 0.85rem;
          color: #444;
        }
        .toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #272a2b;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
        }
        .table-title {
          text-align: center;
          font-size: 1.25rem;
          margin: 1.5rem 0 0.75rem;
        }
        .table-wrap {
          overflow-x: auto;
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
        }
        th {
          background: #108e66;
          color: #fcfffe;
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
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }

        /* Tooltip styles */
        .tooltip {
          position: relative;
          display: inline-block;
          margin-left: 6px;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
          cursor: default;
        }
        .tooltiptext {
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background: #108e66;
          color: #fcfffe;
          padding: 4px 8px;
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
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #108e66 transparent transparent transparent;
        }
      `}</style>
    </main>
  );
}
