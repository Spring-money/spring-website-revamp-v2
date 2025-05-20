// File: /app/tools/gratuity-calculator/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Tooltip icon component
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="tooltip-icon">i</span>
      {show && <span className="tooltip-text">{text}</span>}
      <style jsx>{`
        .tooltip-wrapper {
          position: relative;
          display: inline-block;
          margin-left: 6px;
        }
        .tooltip-icon {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #108e66;
          color: #fcfffe;
          font-size: 0.7rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
        }
        .tooltip-text {
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
          z-index: 10;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .tooltip-text::after {
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

// Number → words (Indian)
const numberToWords = (n: number): string => {
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
  return helper(Math.round(Math.abs(n)));
};

export default function GratuityCalculator() {
  // Inputs
  const [empType, setEmpType] = useState<
    "Government" | "Covered" | "NotCovered"
  >("Covered");
  const [salary, setSalary] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [actual, setActual] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Chart toggle
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  // Results
  const [Y, setY] = useState(0);
  const [statutory, setStatutory] = useState(0);
  const [exemptLimit, setExemptLimit] = useState(0);
  const [exemptAmt, setExemptAmt] = useState(0);
  const [taxable, setTaxable] = useState(0);
  const [calculated, setCalculated] = useState(false);

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const calculate = () => {
    setError(null);
    const s = parseFloat(salary),
      y = parseInt(years, 10),
      m = parseInt(months, 10) || 0;
    if (isNaN(s) || s <= 0 || isNaN(y) || y < 0 || m < 0 || m > 11) {
      return setError("Please enter valid positive numbers in all fields.");
    }
    // Years counted
    const yearsCounted =
      empType === "Covered" ? y + (m >= 6 ? 1 : 0) : y + m / 12;
    setY(Number(yearsCounted.toFixed(2)));

    // Statutory formula
    let grat =
      empType === "Covered" || empType === "Government"
        ? s * (15 / 26) * yearsCounted
        : s * 0.5 * yearsCounted;
    grat = Math.round(grat);
    setStatutory(grat);

    // Exemption limit
    const limit = empType === "Government" ? grat : 20_00_000;
    setExemptLimit(limit);

    // Exempt & taxable
    const received = actual ? parseFloat(actual) : grat;
    const exempted = Math.min(grat, limit, received);
    setExemptAmt(exempted);
    setTaxable(Math.max(0, received - exempted));

    setCalculated(true);
  };

  // Chart data
  const pieData = [
    { name: "Exempt", value: exemptAmt },
    { name: "Taxable", value: taxable },
  ];
  const barData = [
    { name: "Statutory", value: statutory },
    {
      name: "Ceiling",
      value: empType === "Government" ? statutory : 20_00_000,
    },
  ];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much Gratuity Will I Get When I Leave?</h1>
      <p className="desc">
        Estimate your lump-sum gratuity under the Payment of Gratuity Act, and
        see tax-free vs taxable portions.
      </p>
      <div className="explanation">
  <p>
    <strong>Gratuity Calculator:</strong> This calculator helps you estimate the <strong>gratuity amount</strong> you are eligible to receive based on your <strong>years of service</strong> and <strong>final drawn salary</strong>, in accordance with applicable labor laws.
  </p>
  <p>
    By entering your <strong>last drawn salary</strong>, <strong>years of service</strong>, and any applicable <strong>statutory rules</strong>,
    the calculator computes your expected gratuity. It gives you an idea of how much you might receive as a lump sum payment when you retire or leave your current job.
  </p>
</div>


      <section className="card form">
        <div className="grid">
          {/* Employment category */}
          <fieldset>
            <legend>Employment Category</legend>
            {["Government", "Covered", "NotCovered"].map((type, key) => (
              <div key={type} className="radio-row">
                <input
                  type="radio"
                  name="empType"
                  id={type}
                  checked={empType === type}
                  onChange={() => setEmpType(type as any)}
                />
                <label htmlFor={type}>
                  {type === "Government"
                    ? "Government"
                    : type === "Covered"
                    ? "Private (Covered)"
                    : "Private (Not Covered)"}
                </label>
              </div>
            ))}
          </fieldset>

          {/* Salary */}
          <label>
            <span>
              Monthly Basic + DA (₹)
              <TooltipIcon text="Used in formula: last drawn salary" />
            </span>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 60,000"
            />
            {salary && (
              <small className="converter">
                {numberToWords(+salary)} Rupees
              </small>
            )}
          </label>

          {/* Years */}
          <label>
            <span>
              Completed Years of Service{" "}
              <TooltipIcon text="Full years served" />
            </span>
            <input
              type="number"
              min="0"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 12"
            />
          </label>

          {/* Months */}
          <label>
            <span>
              Extra Months of Service{" "}
              <TooltipIcon text="≥6 months rounds up for covered" />
            </span>
            <input
              type="number"
              min="0"
              max="11"
              disabled={empType === "Government"}
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="e.g. 7"
            />
          </label>

          {/* Actual received */}
          <label>
            <span>
              Actual Gratuity Received (Optional)
              <TooltipIcon text="Override statutory amount if known" />
            </span>
            <input
              type="number"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              placeholder="e.g. 415385"
            />
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn-calc" onClick={calculate}>
          Calculate Gratuity
        </button>
      </section>

      {calculated && (
        <section className="card results">
          <h2 className="section-title">Gratuity Summary</h2>

          <div className="summary">
            <div>
              <strong>Years Counted:</strong>
              <br />
              {Y} yrs
            </div>
            <div>
              <strong>Statutory Gratuity:</strong>
              <br />₹{fmt(statutory)}
            </div>
            <div>
              <strong>Exemption Limit:</strong>
              <br />₹{fmt(exemptLimit)}
            </div>
            <div>
              <strong>Tax-Free Portion:</strong>
              <br />₹{fmt(exemptAmt)}
            </div>
            <div>
              <strong>Taxable Portion:</strong>
              <br />₹{fmt(taxable)}
            </div>
          </div>

          <div className="chart-toggle">
            <button
              className={chartType === "pie" ? "active" : ""}
              onClick={() => setChartType("pie")}
            >
              Pie Chart
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
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
                    outerRadius={100}
                    label
                  />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                </PieChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `₹${fmt(v as number)}`} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="table-title">Worked Example</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Category</th>
                  <th>Service</th>
                  <th>Salary</th>
                  <th>Gratuity</th>
                  <th>Exempt</th>
                  <th>Taxable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Your Case</td>
                  <td>
                    {empType === "Government"
                      ? "Government"
                      : empType === "Covered"
                      ? "Private (Covered)"
                      : "Private (Not Covered)"}
                  </td>
                  <td>
                    {years}y {months}m
                  </td>
                  <td>₹{fmt(+salary)}</td>
                  <td>₹{fmt(statutory)}</td>
                  <td>₹{fmt(exemptAmt)}</td>
                  <td>₹{fmt(taxable)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="insight">
            {taxable === 0
              ? "Your entire gratuity is tax-free."
              : `₹${fmt(taxable)} of your gratuity is taxable.`}
          </p>

          <section className="points">
            <h3>Important Considerations</h3>
            <ul>
              <li>
                Covered employees round up ≥6 months to 1 year; others use exact
                fraction.
              </li>
              <li>
                Formula: Govt/Covered → salary × (15/26) × years; Not Covered →
                ½ × salary × years.
              </li>
              <li>
                Government gratuity is fully exempt; private is capped at ₹20
                lakh lifetime.
              </li>
              <li>
                If you know your actual received amount, enter it to compute the
                taxable balance.
              </li>
              <li>All values are rounded to the nearest rupee.</li>
            </ul>
          </section>
        </section>
      )}

      <style jsx>{`
        .container {
          width: 100%;
          margin: auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          text-align: left;
          margin-bottom: 1rem;
        }
        .back-btn {
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
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .desc {
          text-align: center;
          font-size: 1rem;
          color: #555;
          margin-bottom: 1.5rem;
        }

        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .form .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        fieldset {
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 1rem;
          grid-column: span 2;
        }
        legend {
          font-weight: 600;
        }
        .radio-row {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .radio-row input {
          accent-color: #108e66;
        }
        .radio-row label {
          margin: 0;
          font-size: 0.9rem;
        }

        label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        input,
        select {
          width: 100%;
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .converter {
          font-size: 0.8rem;
          color: #555;
          margin-top: 0.25rem;
        }
        .btn-calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 1rem;
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
          text-align: center;
          margin-top: 0.5rem;
        }

        .results .section-title {
          text-align: center;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        .summary {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .summary > div {
          flex: 1 1 140px;
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
          background: #fafafa;
          border-radius: 4px;
          cursor: pointer;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart {
          width: 100%;
          height: 300px;
          margin-bottom: 1rem;
        }

        .table-title {
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
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
          padding: 0.5rem;
          border: 1px solid #ccc;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fcfffe;
        }

        .insight {
          text-align: center;
          color: #108e66;
          font-weight: 500;
          margin-top: 1rem;
        }
        .points {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }
        }
        .points h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .points ul {
          padding-left: 1.2rem;
        }
        .points li {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        @media (max-width: 600px) {
          .form .grid {
            grid-template-columns: 1fr;
          }
          fieldset {
            grid-column: auto;
          }
          .summary {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
