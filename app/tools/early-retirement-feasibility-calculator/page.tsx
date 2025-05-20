/*  /app/tools/early-retirement-feasibility-calculator/page.tsx
    Early Retirement Feasibility Calculator — Spring Money Theme
---------------------------------------------------------------- */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ───────── Types ───────── */
interface Inputs {
  currentAge: string;
  retireAge: string;
  currentSavings: string;
  monthlyContribution: string;
  returnRate: string;
  inflationRate: string;
  monthlyExpensesRetire: string;
  lifeExpectancy: string;
}

interface YearRow {
  year: number;
  age: number;
  start: number;
  interest: number;
  withdrawal: number;
  end: number;
}

interface Results {
  corpusRetire: number;
  annualExpense: number;
  sustainYears: number;
  feasible: boolean;
  extraYears: number;
  rows: YearRow[];
  insight: string;
}

/* ───────── Number → Words (Indian style) ───────── */
const words = (n: number): string => {
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

const wordsPercent = (v: number) =>
  Number.isInteger(v)
    ? `${words(v)} percent`
    : `${words(Math.floor(v))} point ${words(
        Math.round((v - Math.floor(v)) * 10)
      )} percent`;

/* ───────── Tooltip ───────── */
const Tip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="i">i</span>
      {show && <span className="box">{text}</span>}
      <style jsx>{`
        .tip {
          position: relative;
          margin-left: 6px;
          cursor: pointer;
        }
        .i {
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          font-size: 0.6rem;
          line-height: 14px;
          text-align: center;
          font-weight: 700;
          display: inline-block;
        }
        .box {
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
          white-space: pre-wrap;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .box::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -4px;
          border: 4px solid transparent;
          border-top-color: #fcfffe;
        }
      `}</style>
    </span>
  );
};

/* ───────── Component ───────── */
const EarlyRetirementCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    currentAge: "",
    retireAge: "",
    currentSavings: "",
    monthlyContribution: "",
    returnRate: "",
    inflationRate: "",
    monthlyExpensesRetire: "",
    lifeExpectancy: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"line" | "area">("line");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ───────── Validation ───────── */
  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    (Object.keys(inputs) as (keyof Inputs)[]).forEach((k) => {
      if (!inputs[k] || +inputs[k] < 0) e[k] = "Required";
    });
    if (+inputs.retireAge <= +inputs.currentAge)
      e.retireAge = "Must exceed current age";
    if (+inputs.lifeExpectancy <= +inputs.retireAge)
      e.lifeExpectancy = "Must exceed retirement age";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ───────── Calculation ───────── */
  const simulate = (retAge: number): Results => {
    const curAge = +inputs.currentAge;
    const yearsToSave = retAge - curAge;

    const rAnnual = +inputs.returnRate / 100;
    const iAnnual = +inputs.inflationRate / 100;

    /* corpus at retirement */
    const fvExisting =
      +inputs.currentSavings * Math.pow(1 + rAnnual, yearsToSave);

    const rMonthly = rAnnual / 12;
    const nMonths = yearsToSave * 12;
    const fvCont =
      +inputs.monthlyContribution *
      ((Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly) *
      (1 + rMonthly);

    const corpusRetire = fvExisting + fvCont;

    /* first year expenses adjusted for inflation */
    const adjMonthly =
      +inputs.monthlyExpensesRetire * Math.pow(1 + iAnnual, yearsToSave);
    const withdrawal1 = adjMonthly * 12;

    /* simulate withdrawals */
    const rows: YearRow[] = [];

    let corpus = corpusRetire;
    let withdrawal = withdrawal1;
    const lifespanYears = +inputs.lifeExpectancy - retAge;
    let sustainYears = 0;

    for (let y = 1; y <= lifespanYears; y++) {
      const age = retAge + y - 1;
      const interest = corpus * rAnnual;
      const start = corpus;
      const end = start + interest - withdrawal;
      rows.push({
        year: y,
        age,
        start: Math.round(start),
        interest: Math.round(interest),
        withdrawal: Math.round(withdrawal),
        end: Math.round(end),
      });
      if (end <= 0) {
        sustainYears = y;
        break;
      }
      corpus = end;
      withdrawal *= 1 + iAnnual;
      sustainYears = y;
    }

    const feasible = sustainYears >= lifespanYears;

    /* if infeasible: quick loop to find extra years */
    let extraYears = 0;
    if (!feasible) {
      let tryAge = retAge + 1;
      while (tryAge <= +inputs.lifeExpectancy) {
        const res = simulateOnce(tryAge);
        if (res.feasible) {
          extraYears = tryAge - retAge;
          break;
        }
        tryAge++;
      }
    }

    const insight = feasible
      ? `Great! Your corpus lasts until age ${
          retAge + sustainYears
        }, beyond your expected life of ${inputs.lifeExpectancy}.`
      : `Funds run out in ${sustainYears} years. Delay retirement by ${extraYears} years or increase savings to bridge the gap.`;

    return {
      corpusRetire: Math.round(corpusRetire),
      annualExpense: Math.round(withdrawal1),
      sustainYears,
      feasible,
      extraYears,
      rows,
      insight,
    };

    /* helper for feasibility loop */
    function simulateOnce(testRetAge: number) {
      const backupInputs: Inputs = { ...inputs, retireAge: String(testRetAge) };
      const tmp = simulateFeasibilityOnly(backupInputs);
      return tmp;
    }
  };

  /* simpler helper returning feasibility only */
  const simulateFeasibilityOnly = (inp: Inputs): { feasible: boolean } => {
    const yearsSave = +inp.retireAge - +inp.currentAge;
    const rAnnual = +inp.returnRate / 100;
    const iAnnual = +inp.inflationRate / 100;

    const corp =
      +inp.currentSavings * Math.pow(1 + rAnnual, yearsSave) +
      +inp.monthlyContribution *
        ((Math.pow(1 + rAnnual / 12, yearsSave * 12) - 1) / (rAnnual / 12)) *
        (1 + rAnnual / 12);
    let withdraw =
      +inp.monthlyExpensesRetire * Math.pow(1 + iAnnual, yearsSave) * 12;
    let balance = corp;
    const span = +inp.lifeExpectancy - +inp.retireAge;
    for (let y = 0; y < span; y++) {
      balance = balance * (1 + rAnnual) - withdraw;
      if (balance <= 0) return { feasible: false };
      withdraw *= 1 + iAnnual;
    }
    return { feasible: true };
  };

  const calculate = () => {
    if (!validate()) return;
    setBusy(true);
    const res = simulate(+inputs.retireAge);
    setResults(res);
    setBusy(false);
  };

  /* ───────── chart data ───────── */
  const lineData = results
    ? results.rows.map((r) => ({ year: r.year, Corpus: r.end }))
    : [];
  const areaData = results
    ? results.rows.map((r) => ({
        year: r.year,
        Withdrawal: r.withdrawal,
        Interest: r.interest,
      }))
    : [];

  const conv = (k: keyof Inputs, v: string): string => {
    if (!v) return "";
    const num = +v;
    switch (k) {
      case "returnRate":
      case "inflationRate":
        return wordsPercent(num);
      case "currentAge":
      case "retireAge":
      case "lifeExpectancy":
        return `${words(num)} Years`;
      default:
        return `${words(num)} Rupees`;
    }
  };

  /* ───────── JSX ───────── */
  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Early Retirement Feasibility Calculator</h1>
      <p className="sub">
        See if your savings can support an early retirement and for how long.
      </p>    <div className="explanation">
  <p>
    <strong>Early Retirement Feasibility:</strong> This calculator helps you determine if your current <strong>savings, expenses,</strong> and <strong>investment strategy</strong> can support an <strong>early retirement</strong> goal.
    It uses your inputs to simulate how long your money will last based on <strong>withdrawal rates</strong> and <strong>market returns</strong>.
  </p>
  <p>
    By entering your <strong>retirement age target</strong>, <strong>expected expenses</strong>, <strong>investment return</strong>,
    and current <strong>retirement savings</strong>, the calculator projects whether youre on track—or if adjustments are needed
    to retire with <strong>confidence and stability</strong>.
  </p>
</div>


      <div className="card">
        <h2 className="sect">Savings Plan</h2>
        <div className="grid">
          {[
            [
              "currentAge",
              "Current Age (Years)",
              "e.g. 35",
              "Your present age",
            ],
            [
              "retireAge",
              "Planned Retirement Age",
              "e.g. 50",
              "Age you want to retire",
            ],
            [
              "currentSavings",
              "Current Savings (₹)",
              "e.g. 12,00,000",
              "Corpus already accumulated",
            ],
            [
              "monthlyContribution",
              "Monthly Contribution (₹)",
              "e.g. 25 000",
              "Amount you will save monthly",
            ],
            [
              "returnRate",
              "Expected Annual Return (%)",
              "e.g. 8",
              "Pre-retirement ROI",
            ],
            [
              "inflationRate",
              "Expected Inflation (%)",
              "e.g. 6",
              "Annual rise in expenses",
            ],
          ].map(([k, l, ph, tip]) => (
            <div className="field" key={k}>
              <label className="lbl">
                {l}
                <Tip text={tip} />
              </label>
              <input
                name={k}
                type="number"
                value={inputs[k as keyof Inputs]}
                onChange={onChange}
                placeholder={
                  k === "currentAge" ? "e.g., 35" :
                  k === "retireAge" ? "e.g., 50" :
                  k === "currentSavings" ? "e.g., 12,00,000" :
                  k === "monthlyExpense" ? "e.g., 40,000" :
                  k === "expectedReturn" ? "e.g., 8" :
                  k === "inflationRate" ? "e.g., 6" :
                  k === "yearsToRetire" ? "e.g., 15" :
                  ""
                }
              />
              <span className="conv">
                {conv(k as keyof Inputs, inputs[k as keyof Inputs])}
              </span>
              {errors[k as keyof Inputs] && (
                <span className="err">{errors[k as keyof Inputs]}</span>
              )}
            </div>
          ))}
        </div>

        <h2 className="sect">Retirement Spending</h2>
        <div className="grid">
          {[
            [
              "monthlyExpensesRetire",
              "Desired Monthly Expenses (₹)",
              "e.g. 60 000",
              "Living cost in retirement",
            ],
            [
              "lifeExpectancy",
              "Life Expectancy (Years)",
              "e.g. 90",
              "Age you expect to live to",
            ],
          ].map(([k, l, ph, tip]) => (
            <div className="field" key={k}>
              <label className="lbl">
                {l}
                <Tip text={tip} />
              </label>
              <input
                name={k}
                type="number"
                value={inputs[k as keyof Inputs]}
                onChange={onChange}
                placeholder={
                  k === "monthlyExpensesRetire" ? "e.g., 60,000" :
                  k === "lifeExpectancy" ? "e.g., 90" :
                  ""
                }
              />
              <span className="conv">
                {conv(k as keyof Inputs, inputs[k as keyof Inputs])}
              </span>
              {errors[k as keyof Inputs] && (
                <span className="err">{errors[k as keyof Inputs]}</span>
              )}
            </div>
          ))}
        </div>
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {results && (
        <div className="card">
          <h2 className="sect">Key Results</h2>
          <div className="summary">
            <div>
              <strong>Corpus at Retirement</strong>
              <br />₹{results.corpusRetire.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Inflation-Adjusted Annual Expenses</strong>
              <br />₹{results.annualExpense.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Years Corpus Lasts</strong>
              <br />
              {results.sustainYears}
            </div>
            <div>
              <strong>Feasible?</strong>
              <br />
              {results.feasible ? "Yes" : "No"}
            </div>
            {!results.feasible && (
              <div>
                <strong>Extra Saving Years Needed</strong>
                <br />
                {results.extraYears}
              </div>
            )}
          </div>

          <div className="note">{results.insight}</div>

          <div className="chart-toggle">
            <button
              onClick={() => setChart("line")}
              className={chart === "line" ? "active" : ""}
            >
              Corpus Trend
            </button>
            <button
              onClick={() => setChart("area")}
              className={chart === "area" ? "active" : ""}
            >
              Withdrawal vs Interest
            </button>
          </div>

          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              {chart === "line" ? (
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    stroke="#272a2b"
                    label={{
                      value: "Years after retirement",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Corpus"
                    stroke="#108e66"
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <AreaChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Withdrawal"
                    stackId="1"
                    stroke="#108e66"
                    fill="#108e66"
                  />
                  <Area
                    type="monotone"
                    dataKey="Interest"
                    stackId="1"
                    stroke="#0b6d50"
                    fill="#0b6d50"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="sect" style={{ marginTop: "1rem" }}>
            Year-wise Cash-Flow
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Age</th>
                  <th>Start Corpus</th>
                  <th>Interest</th>
                  <th>Withdrawal</th>
                  <th>End Corpus</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{r.age}</td>
                    <td>{r.start.toLocaleString("en-IN")}</td>
                    <td>{r.interest.toLocaleString("en-IN")}</td>
                    <td>{r.withdrawal.toLocaleString("en-IN")}</td>
                    <td>{r.end.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

       

          <div className="disc">
            <h4>Important Consideration</h4>
            <ul>
              <li>
                Returns and inflation are assumed constant; real values will
                vary.
              </li>
              <li>Taxes on withdrawals are not included in the simulation.</li>
              <li>
                Health-care costs can spike later in life—plan conservatively.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ───────── Styles ───────── */}
      <style jsx>{`
        .wrap {
          padding: 1.25rem 1rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
          width: 100%;
          margin: 0 auto;
        }
        .nav {
          margin-bottom: 1rem;
        }
        .back {
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
          font-size: 2.4rem;
          font-weight: 700;
          margin: 0.3rem 0;
        }
        .sub {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1.2rem;
        }

        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .sect {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.3rem 0 0.8rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem 1.4rem;
          margin-bottom: 1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .lbl {
          font-size: 0.9rem;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
        }
        input {
          padding: 0.55rem 0.6rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
          color: #272a2b;
          width: 100%;
          box-sizing: border-box;
        }
        .conv {
          font-size: 0.9rem;
          color: #272a2b;
          margin-top: 0.25rem;
        }
        .err {
          color: red;
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }

        .calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem 1.2rem;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.8rem;
        }  .explanation {
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

        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          padding-left: 0.8rem;
        }

        .note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 0.8rem;
        }
        .chart-toggle button {
          background: transparent;
          border: 1px solid #272a2b;
          padding: 0.4rem 0.9rem;
          border-radius: 4px;
          font-weight: 500;
          color: #272a2b;
          cursor: pointer;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }

        .chart {
          margin-bottom: 1rem;
        }

        .table-wrap {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #272a2b;
          border-radius: 6px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        th,
        td {
          border: 1px solid #272a2b;
          padding: 0.45rem;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fcfffe;
          position: sticky;
          top: 0;
        }

        .cta {
          text-align: center;
          margin: 1rem 0;
          font-size: 0.95rem;
        }
        .cta a {
          color: #108e66;
          font-weight: 600;
          text-decoration: none;
        }

        .disc {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }
        .disc h4 {
          margin: 0 0 0.5rem;
        }
        .disc ul {
          margin: 0;
          padding-left: 1.4rem;
        }
        .disc li {
          margin-bottom: 0.5rem;
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

export default EarlyRetirementCalculator;
