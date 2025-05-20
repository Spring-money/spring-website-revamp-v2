// File: /app/tools/hra-exemption-calculator/page.tsx

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

// Tooltip icon
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
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.6rem;
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

// number ➜ words (Indian system)
const toWords = (n: number): string => {
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

export default function HraExemptionCalculator() {
  // inputs
  const [basicSalary, setBasicSalary] = useState("");
  const [da, setDa] = useState("");
  const [hraReceived, setHraReceived] = useState("");
  const [rentPaid, setRentPaid] = useState("");
  const [isMetro, setIsMetro] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // results
  const [calculated, setCalculated] = useState(false);
  const [headA, setHeadA] = useState(0);
  const [headB, setHeadB] = useState(0);
  const [headC, setHeadC] = useState(0);
  const [hraExempt, setHraExempt] = useState(0);
  const [hraTaxable, setHraTaxable] = useState(0);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  const validateAndCalculate = () => {
    setError(null);
    const B = parseFloat(basicSalary);
    const D = parseFloat(da);
    const H = parseFloat(hraReceived);
    const R = parseFloat(rentPaid);
    if ([B, D, H, R].some((v) => isNaN(v) || v < 0)) {
      setError("Please enter valid positive numbers for all fields.");
      return;
    }
    const salaryForHRA = B + D;
    const A = H;
    const Bp = Math.max(0, R - 0.1 * salaryForHRA);
    const C = (isMetro ? 0.5 : 0.4) * salaryForHRA;
    const exempt = Math.round(Math.min(A, Bp, C));
    const taxable = Math.round(H - exempt);

    setHeadA(Math.round(A));
    setHeadB(Math.round(Bp));
    setHeadC(Math.round(C));
    setHraExempt(exempt);
    setHraTaxable(taxable);
    setCalculated(true);
  };

  // chart data
  const pieData = [
    { name: "Exempted HRA", value: hraExempt },
    { name: "Taxable HRA", value: hraTaxable },
  ];
  const barData = [
    { name: "Actual HRA", value: headA },
    { name: "Rent - 10% Salary", value: headB },
    { name: "City % of Salary", value: headC },
  ];
  const COLORS = ["#108E66", "#272A2B"];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much HRA Can I Exempt?</h1>
      <p className="desc">
        Compute your tax-exempt HRA under Section 10(13A), choosing the least of
        three heads.
      </p>     <div className="explanation">
  <p>
    <strong>HRA Exemption Calculator:</strong> This calculator helps you estimate the <strong>tax-exempt portion</strong> of your <strong>House Rent Allowance (HRA)</strong> based on your salary, rent paid, and city of residence, as per <strong>Income Tax rules in India</strong>.
  </p>
  <p>
    By entering your <strong>basic salary</strong>, <strong>HRA received</strong>, <strong>actual rent paid</strong>, and <strong>city type</strong> (metro or non-metro), the calculator computes the amount of HRA that is <strong>tax-free</strong>. This helps you optimize your tax planning and understand your <strong>effective taxable income</strong>.
  </p>
</div>


      <section className="card">
        <h2 className="card-title">Salary & Rent Details</h2>
        <div className="grid">
          <div>
            <label>
              Basic Salary (p.a.) <TooltipIcon text="Your annual basic pay" />
            </label>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              placeholder="e.g. 600000"
            />
            {basicSalary && (
              <small className="converter">
                {toWords(+basicSalary)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Dearness Allowance (p.a.){" "}
              <TooltipIcon text="Annual DA included in salary" />
            </label>
            <input
              type="number"
              value={da}
              onChange={(e) => setDa(e.target.value)}
              placeholder="e.g. 50000"
            />
            {da && <small className="converter">{toWords(+da)} Rupees</small>}
          </div>
          <div>
            <label>
              HRA Received (p.a.){" "}
              <TooltipIcon text="Total annual HRA you get" />
            </label>
            <input
              type="number"
              value={hraReceived}
              onChange={(e) => setHraReceived(e.target.value)}
              placeholder="e.g. 240000"
            />
            {hraReceived && (
              <small className="converter">
                {toWords(+hraReceived)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Rent Paid (p.a.) <TooltipIcon text="Monthly rent × 12" />
            </label>
            <input
              type="number"
              value={rentPaid}
              onChange={(e) => setRentPaid(e.target.value)}
              placeholder="e.g. 180000"
            />
            {rentPaid && (
              <small className="converter">{toWords(+rentPaid)} Rupees</small>
            )}
          </div>
          <div className="switch-row">
            <label>
              Metro City?{" "}
              <TooltipIcon text="Delhi/Mumbai/Chennai/Kolkata = Yes" />
            </label>
            <input
              type="checkbox"
              checked={isMetro}
              onChange={(e) => setIsMetro(e.target.checked)}
              aria-label="Metro City"
              title="Metro City"
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn-primary" onClick={validateAndCalculate}>
          Calculate My HRA Exemption
        </button>
      </section>

      {calculated && (
        <section className="card results">
          <h2 className="card-title">Results &amp; Breakdown</h2>

          <div className="summary">
            <div>
              <strong>Exempted HRA</strong>
              <br />₹{hraExempt.toLocaleString("en-IN")}
              <br />({toWords(hraExempt)} Rupees)
            </div>
            <div>
              <strong>Taxable HRA</strong>
              <br />₹{hraTaxable.toLocaleString("en-IN")}
              <br />({toWords(hraTaxable)} Rupees)
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
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(v) =>
                      `₹${(v as number).toLocaleString("en-IN")}`
                    }
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108E66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="table-title">Year-Wise Illustration</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>HRA Received</th>
                  <th>Rent Paid</th>
                  <th>10% Salary</th>
                  <th>40/50% Salary</th>
                  <th>Exempted HRA</th>
                  <th>Taxable HRA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>₹{parseFloat(hraReceived).toLocaleString("en-IN")}</td>
                  <td>₹{parseFloat(rentPaid).toLocaleString("en-IN")}</td>
                  <td>
                    ₹
                    {Math.round(
                      0.1 * (parseFloat(basicSalary) + parseFloat(da))
                    ).toLocaleString("en-IN")}
                  </td>
                  <td>₹{headC.toLocaleString("en-IN")}</td>
                  <td>₹{hraExempt.toLocaleString("en-IN")}</td>
                  <td>₹{hraTaxable.toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <section className="disc">
        <h2>Important considerations</h2>
        <ul>
          <li>
            Exempt HRA is the least of: actual HRA, rent paid − 10% of
            (Basic+DA), or 40/50% of (Basic+DA).
          </li>
          <li>
            Ensure you have valid rent receipts for each month to claim
            exemption.
          </li>
          <li>
            If annual rent is more than ₹1 lakh, you must furnish landlord PAN
            when filing ITR.
          </li>
          <li>
            Metro limits use 50% of salary; non-metro use 40% per the Income-tax
            Act.
          </li>
          <li>
            Any shortfall between HRA received and exempt amount is fully
            taxable.
          </li>
        </ul>
      </section>
        </section>
      )}

     

      <style jsx>{`
        .container {
          width: 100%;
          margin: auto;
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
        }
        .top-nav {
          margin-bottom: 1rem;
          text-align: left;
        }
        .back-btn {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .desc {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          color: #555;
        }
        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .card-title {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        input,
        select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .switch-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
        }
        .switch-row input[type="checkbox"] {
          accent-color: #108e66;
          width: 1.2rem;
          height: 1.2rem;
        }
        .converter {
          font-size: 0.8rem;
          color: #444;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          text-align: center;
          margin: 0.5rem 0;
        }
        .btn-primary {
          display: block;
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
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
        .results .summary {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .results .summary > div {
          min-width: 200px;
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
          margin: 1rem 0;
        }
        .chart-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: transparent;
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
        }
        .table-title {
          text-align: center;
          font-size: 1.1rem;
          margin: 1rem 0 0.5rem;
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
          border: 1px solid #ccc;
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
