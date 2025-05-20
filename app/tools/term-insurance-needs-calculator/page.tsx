// File: /app/tools/term-insurance-needs-calculator/page.tsx

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

// Tooltip component
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tooltip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="info-icon">i</span>
      {show && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltip {
          position: relative;
          display: inline-block;
          vertical-align: middle;
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
          cursor: default;
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

// Number→Words helper (Indian)
const numberToWords = (num: number): string => {
  if (!num && num !== 0) return "";
  const n = Math.round(Math.abs(num));
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
  const helper = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100)
      return tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "");
    if (x < 1000)
      return (
        ones[Math.floor(x / 100)] +
        " Hundred" +
        (x % 100 ? " " + helper(x % 100) : "")
      );
    if (x < 100000)
      return (
        helper(Math.floor(x / 1000)) +
        " Thousand" +
        (x % 1000 ? " " + helper(x % 1000) : "")
      );
    if (x < 10000000)
      return (
        helper(Math.floor(x / 100000)) +
        " Lakh" +
        (x % 100000 ? " " + helper(x % 100000) : "")
      );
    return (
      helper(Math.floor(x / 10000000)) +
      " Crore" +
      (x % 10000000 ? " " + helper(x % 10000000) : "")
    );
  };
  return helper(n);
};

// Round to nearest ₹50,000
const round50k = (x: number) => Math.round(x / 50000) * 50000;

export default function TermInsuranceNeedsCalculator() {
  // Inputs
  const [age, setAge] = useState("");
  const [retAge, setRetAge] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [annualExpense, setAnnualExpense] = useState("");
  const [homeLoan, setHomeLoan] = useState("");
  const [otherLoan, setOtherLoan] = useState("");
  const [eduGoal, setEduGoal] = useState("");
  const [marriageGoal, setMarriageGoal] = useState("");
  const [existingCover, setExistingCover] = useState("");
  const [liquidAssets, setLiquidAssets] = useState("");
  const [inflation, setInflation] = useState("6");
  const [roi, setRoi] = useState("6");

  // State
  const [errors, setErrors] = useState<string>("");
  const [computed, setComputed] = useState(false);
  const [results, setResults] = useState<{
    yearsToSupport: number;
    incomeCover: number;
    expenseCover: number;
    baseCover: number;
    liabilityCover: number;
    goalCover: number;
    grossCover: number;
    existingCushion: number;
    netRequiredCover: number;
  } | null>(null);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [pieData, setPieData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [yearlyTable, setYearlyTable] = useState<any[]>([]);

  // Validation
  const validate = () => {
    const nums = [
      { label: "Age", val: age, min: 0 },
      { label: "Retirement Age", val: retAge, min: 1 },
      { label: "Income", val: annualIncome, min: 0 },
      { label: "Expenses", val: annualExpense, min: 0 },
      { label: "Home Loan", val: homeLoan, min: 0 },
      { label: "Other Loans", val: otherLoan, min: 0 },
      { label: "Education Goal", val: eduGoal, min: 0 },
      { label: "Marriage Goal", val: marriageGoal, min: 0 },
      { label: "Existing Cover", val: existingCover, min: 0 },
      { label: "Assets", val: liquidAssets, min: 0 },
      { label: "Inflation", val: inflation, min: 0 },
      { label: "Return Rate", val: roi, min: 0 },
    ];
    for (const n of nums) {
      if (n.val.trim() === "" || isNaN(+n.val) || +n.val < n.min) {
        return `Please enter a valid ${n.label}.`;
      }
    }
    if (+retAge <= +age) return "Retirement age must exceed current age.";
    return "";
  };

  // Calculate
  const calculate = () => {
    const err = validate();
    if (err) {
      setErrors(err);
      return;
    }
    setErrors("");
    const ageN = +age;
    const retN = +retAge;
    const yrs = retN - ageN;
    const inf = +inflation / 100;
    const r = +roi / 100;
    const incomeN = +annualIncome;
    const expenseN = +annualExpense;
    const homeN = +homeLoan;
    const otherN = +otherLoan;
    const eduN = +eduGoal;
    const marN = +marriageGoal;
    const existingN = +existingCover;
    const assetsN = +liquidAssets;

    // real rate & factor
    const realRate = (1 + r) / (1 + inf) - 1;
    const factor =
      Math.abs(realRate) < 1e-8
        ? yrs
        : (1 - Math.pow(1 + realRate, -yrs)) / realRate;

    // covers
    const incomeCover = incomeN * factor;
    const expenseCover = expenseN * factor;
    const baseCover = Math.max(incomeCover, expenseCover);
    const liabilityCover = homeN + otherN;
    const goalCover = eduN + marN;
    const grossCover = baseCover + liabilityCover + goalCover;
    const existingCushion = existingN + assetsN;
    let netRequiredCover = grossCover - existingCushion;
    if (netRequiredCover < 0) netRequiredCover = 0;

    // round to ₹50k
    const incC = round50k(incomeCover);
    const expC = round50k(expenseCover);
    const baseC = round50k(baseCover);
    const liabC = round50k(liabilityCover);
    const goalC = round50k(goalCover);
    const grossC = round50k(grossCover);
    const existC = round50k(existingCushion);
    const netC = round50k(netRequiredCover);

    setResults({
      yearsToSupport: yrs,
      incomeCover: incC,
      expenseCover: expC,
      baseCover: baseC,
      liabilityCover: liabC,
      goalCover: goalC,
      grossCover: grossC,
      existingCushion: existC,
      netRequiredCover: netC,
    });

    // pie data
    setPieData([
      { name: "Income Replacement", value: incC, color: "#108E66" },
      { name: "Liabilities", value: liabC, color: "#272A2B" },
      { name: "Goals", value: goalC, color: "#6ABF7B" },
    ]);

    // bar data
    setBarData([
      { name: "Existing Cushion", value: existC },
      { name: "Ideal Cover", value: grossC },
    ]);

    // yearly table
    const table = [];
    const annualChunk = Math.round(incC / yrs);
    for (let y = 1; y <= yrs; y++) {
      table.push({
        year: y,
        replaced: annualChunk,
        cumulative: annualChunk * y,
      });
    }
    setYearlyTable(table);

    setComputed(true);
  };

  // format ₹
  const fmt = (v: number) =>
    v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <main className="container">
      <Link href="/tools">
        <button className="back"> Back to Dashboard</button>
      </Link>

      <h1 className="title">How Much Term-Insurance Do I Need?</h1>
      <p className="description">
        Estimate your ideal life cover so your family can clear debts, maintain
        lifestyle, and meet goals if your income stops today.
      </p>
      <div className="explanation">
        <p>
          <strong>Term Insurance Needs Calculator:</strong> This tool estimates
          the ideal <strong>term insurance coverage</strong> you need to
          financially protect your dependents in case of an untimely demise.
        </p>
        <p>
          It factors in your <strong>current annual income</strong>,{" "}
          <strong>remaining working years</strong>,{" "}
          <strong>existing liabilities</strong> (like loans), and your family’s{" "}
          <strong>future living expenses and goals</strong> (like education or
          marriage).
        </p>
        <p>
          The goal is to ensure your family can maintain their lifestyle and
          meet essential needs even without your income, by covering both{" "}
          <strong>income replacement</strong> and{" "}
          <strong>debt repayment</strong>.
        </p>
      </div>

      {errors && <p className="error">{errors}</p>}

      <section className="card">
        <h2 className="section-title">Personal & Income Details</h2>
        <div className="grid">
          <label>
            Current Age <TooltipIcon text="Your present age" />
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 35"
            />
            <small className="converter">{numberToWords(+age)} Years</small>
          </label>
          <label>
            Retirement Age <TooltipIcon text="When income stops" />
            <input
              type="number"
              value={retAge}
              onChange={(e) => setRetAge(e.target.value)}
              placeholder="e.g. 60"
            />
            <small className="converter">{numberToWords(+retAge)} Years</small>
          </label>
          <label>
            Annual Income (₹){" "}
            <TooltipIcon text="Net salary or business income" />
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              placeholder="e.g. 1200000"
            />
            <small className="converter">
              {numberToWords(+annualIncome)} Rupees
            </small>
          </label>
          <label>
            Annual Expenses (₹) <TooltipIcon text="Yearly family living cost" />
            <input
              type="number"
              value={annualExpense}
              onChange={(e) => setAnnualExpense(e.target.value)}
              placeholder="e.g. 600000"
            />
            <small className="converter">
              {numberToWords(+annualExpense)} Rupees
            </small>
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Liabilities & Goals</h2>
        <div className="grid">
          <label>
            Home Loan Outstanding (₹) <TooltipIcon text="Remaining principal" />
            <input
              type="number"
              value={homeLoan}
              onChange={(e) => setHomeLoan(e.target.value)}
              placeholder="e.g. 2000000"
            />
            <small className="converter">
              {numberToWords(+homeLoan)} Rupees
            </small>
          </label>
          <label>
            Other Loans (₹){" "}
            <TooltipIcon text="Car / personal / education loans" />
            <input
              type="number"
              value={otherLoan}
              onChange={(e) => setOtherLoan(e.target.value)}
              placeholder="e.g. 300000"
            />
            <small className="converter">
              {numberToWords(+otherLoan)} Rupees
            </small>
          </label>
          <label>
            Education Goal (₹) <TooltipIcon text="Corpus needed today" />
            <input
              type="number"
              value={eduGoal}
              onChange={(e) => setEduGoal(e.target.value)}
              placeholder="e.g. 1000000"
            />
            <small className="converter">
              {numberToWords(+eduGoal)} Rupees
            </small>
          </label>
          <label>
            Marriage Goal (₹) <TooltipIcon text="Corpus needed today" />
            <input
              type="number"
              value={marriageGoal}
              onChange={(e) => setMarriageGoal(e.target.value)}
              placeholder="e.g. 500000"
            />
            <small className="converter">
              {numberToWords(+marriageGoal)} Rupees
            </small>
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Existing Cover & Assets</h2>
        <div className="grid">
          <label>
            Existing Life Cover (₹) <TooltipIcon text="Term / ULIP cover" />
            <input
              type="number"
              value={existingCover}
              onChange={(e) => setExistingCover(e.target.value)}
              placeholder="e.g. 5000000"
            />
            <small className="converter">
              {numberToWords(+existingCover)} Rupees
            </small>
          </label>
          <label>
            Liquid Assets (₹){" "}
            <TooltipIcon text="FDs, mutual funds, EPF, etc." />
            <input
              type="number"
              value={liquidAssets}
              onChange={(e) => setLiquidAssets(e.target.value)}
              placeholder="e.g. 200000"
            />
            <small className="converter">
              {numberToWords(+liquidAssets)} Rupees
            </small>
          </label>
          <label>
            Inflation Rate (%) <TooltipIcon text="Default 6%" />
            <input
              type="number"
              value={inflation}
              onChange={(e) => setInflation(e.target.value)}
              placeholder="e.g. 6"
            />
            <small className="converter">
              {numberToWords(+inflation)} percent
            </small>
          </label>
          <label>
            Return on Corpus (%) <TooltipIcon text="After-tax, default 6%" />
            <input
              type="number"
              value={roi}
              onChange={(e) => setRoi(e.target.value)}
              placeholder="e.g. 6"
            />
            <small className="converter">{numberToWords(+roi)} percent</small>
          </label>
        </div>
      </section>

      <button className="calc" onClick={calculate}>
        Calculate My Cover
      </button>

      {computed && results && (
        <section className="card results">
          <h2 className="section-title">Recommended Cover</h2>
          <div className="summary">
            <div>
              <strong>Ideal Sum-Assured</strong>
              <br />₹{fmt(results.grossCover)}
            </div>
            <div>
              <strong>Existing Cushion</strong>
              <br />₹{fmt(results.existingCushion)}
            </div>
            <div>
              <strong>Additional Cover</strong>
              <br />₹{fmt(results.netRequiredCover)}
            </div>
          </div>

          <div className="chart-toggle">
            <button
              className={chartType === "pie" ? "active" : ""}
              onClick={() => setChartType("pie")}
            >
              Pie
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar
            </button>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                </PieChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `₹${fmt(v as number)}`} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                  <Bar dataKey="value" name="Cover" fill="#108E66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="section-title">Year-wise Income Replacement</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Replacement (₹)</th>
                  <th>Cumulative (₹)</th>
                </tr>
              </thead>
              <tbody>
                {yearlyTable.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>₹{fmt(r.replaced)}</td>
                    <td>₹{fmt(r.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Important Considerations */}
          <section className="disc">
            <h2>Important Considerations</h2>
            <ul>
              <li>
                <strong>Assumptions:</strong> We’ve assumed a constant inflation
                rate and investment return — real‐world rates may vary.
              </li>
              <li>
                <strong>Goal Estimates:</strong> Education & marriage corpus
                figures should be based on your personal plans and timelines.
              </li>
              <li>
                <strong>Existing Cover:</strong> Double-check all existing
                policies, riders & cash values before trusting the “cushion”
                number.
              </li>
              <li>
                <strong>Health & Age:</strong> Premiums and eligibility depend
                on your health profile and exact age — this is a rough estimate.
              </li>
              <li>
                <strong>Professional Advice:</strong> Always consult a qualified
                financial advisor or insurance specialist before purchasing a
                policy.
              </li>
              <li>
                <strong>Estimate Only:</strong> This calculator provides an
                indicative sum-assured. Your insurer’s policy will define the
                actual cover.
              </li>
            </ul>
          </section>
        </section>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: "Poppins", sans-serif;
        }
        .back {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .title {
          font-size: 2rem;
          font-weight: 600;
          text-align: center;
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
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          font-size: 0.9rem;
        }
        input {
          width: 100%;
          margin-top: 0.25rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .converter {
          font-size: 0.85rem;
          color: #444;
          margin-top: 0.25rem;
        }
        .calc {
          width: 100%;
          padding: 0.75rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        .results .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .results .summary div {
          background: #fcfffe;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          font-weight: 500;
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
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart {
          height: 300px;
          margin-bottom: 1rem;
        }
        .table-wrap {
          overflow-x: auto;
          margin-bottom: 1rem;
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
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
