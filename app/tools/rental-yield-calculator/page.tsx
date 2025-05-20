// File: /app/tools/rental-yield-calculator/page.tsx

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

// Tooltip Component
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

// Number‐to‐Words Helpers
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
const numberToWordsPercent = (v: number): string => {
  const rounded = Math.round(v * 100) / 100;
  const [intPart, decPart] = rounded.toString().split(".").map(Number);
  return decPart
    ? `${numberToWords(intPart)} point ${numberToWords(decPart)} percent`
    : `${numberToWords(intPart)} percent`;
};

export default function RentalYieldCalculator() {
  // Inputs
  const [propertyValue, setPropertyValue] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [propTax, setPropTax] = useState("");
  const [agentFeeRate, setAgentFeeRate] = useState("");
  const [vacancyRate, setVacancyRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Results
  const [grossAnnualRent, setGrossAnnualRent] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [grossYield, setGrossYield] = useState(0);
  const [netYield, setNetYield] = useState(0);
  const [agentFees, setAgentFees] = useState(0);
  const [vacancyLoss, setVacancyLoss] = useState(0);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  // Chart data
  const barData = [
    { name: "Gross Rent", value: grossAnnualRent },
    { name: "Expenses", value: totalExpenses },
    { name: "Net Income", value: netIncome },
  ];
  const pieData = [
    { name: "Maintenance", value: parseFloat(maintenance) || 0 },
    { name: "Property Tax", value: parseFloat(propTax) || 0 },
    { name: "Agent Fees", value: agentFees },
    { name: "Vacancy Loss", value: vacancyLoss },
  ];
  const COLORS = ["#108E66", "#272A2B", "#108E66", "#272A2B"];

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // Calculate
  const calculate = () => {
    setError(null);
    const PV = parseFloat(propertyValue);
    const MR = parseFloat(monthlyRent);
    const M = parseFloat(maintenance) || 0;
    const PT = parseFloat(propTax) || 0;
    const AFR = parseFloat(agentFeeRate);
    const VR = parseFloat(vacancyRate);
    if ([PV, MR, AFR, VR].some((x) => isNaN(x) || x < 0) || PV <= 0) {
      setError("Please enter valid positive numbers.");
      return;
    }
    const GAR = MR * 12;
    const AF = GAR * (AFR / 100);
    const VL = GAR * (VR / 100);
    const TE = M + PT + AF + VL;
    const NI = GAR - TE;
    const GY = +((GAR / PV) * 100).toFixed(2);
    const NY = +((NI / PV) * 100).toFixed(2);

    setGrossAnnualRent(Math.round(GAR));
    setAgentFees(Math.round(AF));
    setVacancyLoss(Math.round(VL));
    setTotalExpenses(Math.round(TE));
    setNetIncome(Math.round(NI));
    setGrossYield(GY);
    setNetYield(NY);
  };

  return (
    <main className="container">
      {/* Back to Dashboard */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">What Rental Yield Can I Earn?</h1>
      <p className="desc">
        Estimate your gross and net rental yield after all expenses and vacancy
        losses.
      </p>
      <div className="explanation">
        <p>
          <strong>Rental Yield:</strong> This calculator estimates the{" "}
          <strong>annual return</strong> on your real estate investment based on
          the <strong>rental income</strong> you earn and the{" "}
          <strong>total cost of the property</strong>.
        </p>
        <p>
          It computes both the <strong>gross yield</strong> (before expenses)
          and optionally the <strong>net yield</strong> (after deducting costs
          like maintenance, taxes, and vacancy periods) to give a clearer
          picture of your rental profitability.
        </p>
        <p>
          Rental yield is a key metric for real estate investors to evaluate
          whether a property generates sufficient income relative to its value
          and helps compare investment options across locations or asset types.
        </p>
      </div>

      {/* Input Card */}
      <section className="card">
        <h2 className="card-title">Property &amp; Rent Details</h2>
        <div className="grid">
          <label>
            <span className="lbl">
              Property Value (₹)
              <TooltipIcon text="Current market price" />
            </span>
            <input
              type="number"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              placeholder="e.g. 5,000,000"
            />
            {propertyValue && (
              <small className="conv">
                {numberToWords(+propertyValue)} Rupees
              </small>
            )}
          </label>
          <label>
            <span className="lbl">
              Monthly Rent (₹)
              <TooltipIcon text="Expected rent per month" />
            </span>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              placeholder="e.g. 25,000"
            />
            {monthlyRent && (
              <small className="conv">
                {numberToWords(+monthlyRent)} Rupees
              </small>
            )}
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Annual Expenses &amp; Rates</h2>
        <div className="grid">
          <label>
            <span className="lbl">
              Maintenance (₹ p.a.)
              <TooltipIcon text="Upkeep & society charges" />
            </span>
            <input
              type="number"
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              placeholder="e.g. 12,000"
            />
          </label>
          <label>
            <span className="lbl">
              Property Tax (₹ p.a.)
              <TooltipIcon text="Municipal/panchayat tax" />
            </span>
            <input
              type="number"
              value={propTax}
              onChange={(e) => setPropTax(e.target.value)}
              placeholder="e.g. 5,000"
            />
          </label>
          <label>
            <span className="lbl">
              Agent Fee (%)
              <TooltipIcon text="% of annual rent" />
            </span>
            <input
              type="number"
              value={agentFeeRate}
              onChange={(e) => setAgentFeeRate(e.target.value)}
              placeholder="e.g. 2"
            />
            {agentFeeRate && (
              <small className="conv">
                {numberToWordsPercent(+agentFeeRate)}
              </small>
            )}
          </label>
          <label>
            <span className="lbl">
              Vacancy Rate (%)
              <TooltipIcon text="% of year vacant" />
            </span>
            <input
              type="number"
              value={vacancyRate}
              onChange={(e) => setVacancyRate(e.target.value)}
              placeholder="e.g. 5"
            />
            {vacancyRate && (
              <small className="conv">
                {numberToWordsPercent(+vacancyRate)}
              </small>
            )}
          </label>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      <button className="btn" onClick={calculate}>
        Calculate Yield
      </button>

      {/* Results Card */}
      {grossAnnualRent > 0 && (
        <section className="card results">
          <h2 className="card-title">Results</h2>
          <div className="summary">
            <div>
              <strong>Gross Rent</strong>
              <br />₹{fmt(grossAnnualRent)}
            </div>
            <div>
              <strong>Expenses</strong>
              <br />₹{fmt(totalExpenses)}
            </div>
            <div>
              <strong>Net Income</strong>
              <br />₹{fmt(netIncome)}
            </div>
            <div>
              <strong>Gross Yield</strong>
              <br />
              {grossYield}%
            </div>
            <div>
              <strong>Net Yield</strong>
              <br />
              {netYield}%
            </div>
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
                  <YAxis tickFormatter={(v) => `₹${fmt(v as number)}`} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#108E66" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="table-title">5-Year Cashflow (no escalation)</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Gross Rent</th>
                  <th>Expenses</th>
                  <th>Net Income</th>
                  <th>Cumulative Net</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => {
                  const yr = i + 1,
                    cum = netIncome * yr;
                  return (
                    <tr key={yr}>
                      <td>{yr}</td>
                      <td>₹{fmt(grossAnnualRent)}</td>
                      <td>₹{fmt(totalExpenses)}</td>
                      <td>₹{fmt(netIncome)}</td>
                      <td>₹{fmt(cum)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <section className="disc">
            <h2>Important considerations</h2>
            <ul>
              <li>
                This estimate assumes no rent escalation; adjust calculations if
                you plan to raise rent annually.
              </li>
              <li>
                Vacancy and agent fees can drastically reduce net yield—aim to
                minimize vacancy and negotiate commissions.
              </li>
              <li>
                Maintenance and property tax fluctuate—track your actual costs
                for accurate budgeting.
              </li>
              <li>
                Inflation and market trends affect yields; revisit your
                assumptions every year.
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
          text-align: left;
          margin-bottom: 1rem;
        }
        .back-btn {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .desc {
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
        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
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
        .lbl {
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .conv {
          font-size: 0.8rem;
          color: #555;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
        .btn {
          display: block;
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 2rem;
        }
        .results .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .results .summary > div {
          font-weight: 500;
        }
        .toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
        }
        .table-title {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .table-wrap {
          overflow-x: auto;
          margin-bottom: 1.5rem;
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
          font-weight: 600;
        }
        .consid ul {
          list-style: disc inside;
          margin: 0;
          padding-left: 1rem;
        }
        .consid li {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          line-height: 1.4;
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
