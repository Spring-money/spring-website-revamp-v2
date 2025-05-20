"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
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

// Tooltip Icon
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
          z-index: 100;
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

// Number→Words Helper
const numberToWords = (n: number): string => {
  if (!isFinite(n)) return "";
  const num = Math.round(Math.abs(n));
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
  return helper(num);
};
const numberToWordsPercent = (v: number): string => {
  const ip = Math.floor(v),
    dp = Math.round((v - ip) * 10);
  return dp
    ? `${numberToWords(ip)} point ${numberToWords(dp)} percent`
    : `${numberToWords(ip)} percent`;
};

// Main Component
export default function PrivateSchoolCostEstimator() {
  // Inputs
  const [tuition, setTuition] = useState("150000");
  const [admission, setAdmission] = useState("50000");
  const [annualFee, setAnnualFee] = useState("20000");
  const [transport, setTransport] = useState("30000");
  const [supplies, setSupplies] = useState("15000");
  const [activities, setActivities] = useState("10000");
  const [years, setYears] = useState("12");
  const [inflation, setInflation] = useState("8");
  const [kids, setKids] = useState("1");
  const [discount, setDiscount] = useState("6");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Results
  const [results, setResults] = useState<any>(null);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Validate
  const validate = () => {
    const errs: Record<string, string> = {};
    const fields = {
      tuition,
      admission,
      annualFee,
      transport,
      supplies,
      activities,
      years,
      inflation,
      kids,
      discount,
    };
    Object.entries(fields).forEach(([k, v]) => {
      if (!v || isNaN(+v) || +v < 0) errs[k] = "Invalid";
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  // Calculate
  const calculate = () => {
    if (!validate()) return;
    const t = +tuition,
      a = +admission,
      af = +annualFee,
      tr = +transport,
      su = +supplies;
    const ac = +activities,
      Y = +years,
      inf = +inflation / 100,
      k = +kids,
      d = +discount / 100;
    const data: any[] = [];
    let cum = 0,
      sumNom = 0,
      sumPV = 0;
    for (let y = 0; y < Y; y++) {
      const f = Math.pow(1 + inf, y);
      const tuitionY = t * f;
      const annualFeeY = af * f;
      const transportY = tr * f;
      const suppliesY = su * f;
      const activitiesY = ac * f;
      const admissionY = y === 0 ? a : 0;
      const totalY =
        (tuitionY +
          annualFeeY +
          transportY +
          suppliesY +
          activitiesY +
          admissionY) *
        k;
      cum += totalY;
      const pvFactor = 1 / Math.pow(1 + d, y);
      sumPV += totalY * pvFactor;
      sumNom += totalY;
      data.push({ year: y + 1, total: Math.round(totalY / 1000) * 1000 });
    }
    const totalNom = Math.round(sumNom / 1000) * 1000;
    const totalPV = Math.round(sumPV / 1000) * 1000;
    const avgMonthly = Math.round(totalNom / (Y * 12));
    const costPerChild = Math.round(totalNom / k / 1000) * 1000;
    setResults({ totalNom, totalPV, avgMonthly, costPerChild, data });
  };

  const COLORS = ["#108E66", "#7FCF80", "#108E66"];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn">Back to Dashboard</button>
        </Link>
      </div>
      <h1 className="title">
        Can I Afford Private School for {kids} Child(ren)?
      </h1>
      <p className="desc">
        Estimate full K‑12 fees including extras over time with inflation and
        present‑value.
      </p>
      <div className="explanation">
        <p>
          <strong>Private School Cost Estimator:</strong> This tool estimates
          the total cost of sending your child to a private school by factoring
          in annual tuition, number of school years, and inflation.
        </p>
        <p>
          It helps you understand how{" "}
          <strong>tuition fees grow over time</strong> and what total expenses
          to expect from <strong>start to graduation</strong>. Use it to plan
          ahead and evaluate how much to budget or save for private education.
        </p>
      </div>

      <section className="card">
        <h2>Base Fees (₹ / year – present)</h2>
        <div className="grid">
          {[
            {
              label: "Tuition Fee",
              state: tuition,
              setter: setTuition,
              key: "tuition",
              tip: "Current annual tuition",
              ph: "e.g. 150000",
            },
            {
              label: "Admission / One‑time Fee",
              state: admission,
              setter: setAdmission,
              key: "admission",
              tip: "Payable once in first year",
              ph: "e.g. 50000",
            },
            {
              label: "Annual Misc. Fee",
              state: annualFee,
              setter: setAnnualFee,
              key: "annualFee",
              tip: "Lab, library etc.",
              ph: "e.g. 20000",
            },
          ].map((f) => (
            <label key={f.key}>
              <span>
                {f.label} <TooltipIcon text={f.tip} />
              </span>
              <input
                type="number"
                value={f.state}
                onChange={(e) => f.setter(e.target.value)}
                placeholder={f.ph}
              />
              <small className="conv">{numberToWords(+f.state)} Rupees</small>
              {errors[f.key] && <small className="err">Invalid</small>}
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Recurring Extras (₹ / year)</h2>
        <div className="grid">
          {[
            {
              label: "Transport",
              state: transport,
              setter: setTransport,
              key: "transport",
              tip: "Bus / cab charges",
              ph: "e.g. 30000",
            },
            {
              label: "Uniform & Books",
              state: supplies,
              setter: setSupplies,
              key: "supplies",
              tip: "Uniforms & textbooks",
              ph: "e.g. 15000",
            },
            {
              label: "Extracurriculars",
              state: activities,
              setter: setActivities,
              key: "activities",
              tip: "Sports & clubs",
              ph: "e.g. 10000",
            },
          ].map((f) => (
            <label key={f.key}>
              <span>
                {f.label} <TooltipIcon text={f.tip} />
              </span>
              <input
                type="number"
                value={f.state}
                onChange={(e) => f.setter(e.target.value)}
                placeholder={f.ph}
              />
              <small className="conv">{numberToWords(+f.state)} Rupees</small>
              {errors[f.key] && <small className="err">Invalid</small>}
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Assumptions & Settings</h2>
        <div className="grid">
          {[
            {
              label: "Years in School",
              state: years,
              setter: setYears,
              key: "years",
              tip: "Number of years to pay",
              ph: "e.g. 12",
            },
            {
              label: "Fee Inflation Rate (%)",
              state: inflation,
              setter: setInflation,
              key: "inflation",
              tip: "Expected increase",
              ph: "e.g. 8%",
            },
            {
              label: "Children Count",
              state: kids,
              setter: setKids,
              key: "kids",
              tip: "Number of kids",
              ph: "e.g. 1",
            },
            {
              label: "Discount Rate (%)",
              state: discount,
              setter: setDiscount,
              key: "discount",
              tip: "For PV calculation",
              ph: "e.g. 6%",
            },
          ].map((f) => (
            <label key={f.key}>
              <span>
                {f.label} <TooltipIcon text={f.tip} />
              </span>
              <input
                type="number"
                value={f.state}
                onChange={(e) => f.setter(e.target.value)}
                placeholder={f.ph}
              />
              <small className="conv">
                {f.key.endsWith("%")
                  ? numberToWordsPercent(+f.state)
                  : numberToWords(+f.state) +
                    (f.key === "kids" ? "" : " Rupees")}
              </small>
              {errors[f.key] && <small className="err">Invalid</small>}
            </label>
          ))}
        </div>
      </section>

      <button className="calc-btn" onClick={calculate}>
        Calculate
      </button>

      {results && (
        <section className="card results">
          <h2>Results</h2>
          <div className="summary">
            <div>
              <strong>Total Nominal Cost</strong>
              <br />₹{results.totalNom}
            </div>
            <div>
              <strong>Present‑Value Cost</strong>
              <br />₹{results.totalPV}
            </div>
            <div>
              <strong>Avg Monthly Spend</strong>
              <br />₹{results.avgMonthly}
            </div>
            <div>
              <strong>Cost per Child</strong>
              <br />₹{results.costPerChild}
            </div>
            <div>
              <strong>Cost in Words</strong>
              <br />
              {numberToWords(results.totalNom)} Rupees
            </div>
          </div>

          <div className="chart-toggle">
            <button
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              Line
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar
            </button>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "line" ? (
                <AreaChart
                  data={results.data}
                  margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#108E66"
                    fill="#108E66"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={results.data}
                  margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#108E66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3>Cash‑Flow Table</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Total Year Cost (₹)</th>
                  <th>Cumulative (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.data.map((r: any, i: number) => (
                  <tr key={i}>
                    <td>{r.year}</td>
                    <td>{r.total.toLocaleString("en-IN")}</td>
                    <td>
                      {results.data
                        .slice(0, i + 1)
                        .reduce((s: any, x: any) => s + x.total, 0)
                        .toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="insights">
            <h3>Important considrations</h3>
            <ul>
              <li>
                At {inflation}% inflation, fees will double roughly every 9
                years.
              </li>
              <li>
                Ask about sibling discounts to reduce ₹
                {Math.round((results.totalNom * 0.1) / 1000) * 1000} lakh of
                fees.
              </li>
              <li>
                Investing ₹{results.avgMonthly} monthly at 10% could offset ~70%
                of future fees.
              </li>
            </ul>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
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
        .top-nav {
          margin-bottom: 1rem;
        }
        .back-btn {
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
          margin-bottom: 0.5rem;
        }
        .desc {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }
        .card {
          background: #ffffff;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        h2 {
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
        }
        input,
        select {
          margin-top: 0.3rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .conv {
          margin-top: 0.25rem;
          font-size: 0.85rem;
          color: #272a2b;
          opacity: 0.7;
        }
        .err {
          color: red;
          font-size: 0.8rem;
        }
        .calc-btn {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
        }
        .results .summary {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .results .summary div {
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
          border-radius: 4px;
          cursor: pointer;
          background: transparent;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-wrap {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
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
        .insights {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        .insights ul {
          padding-left: 1.2rem;
        }
        .insights .cta {
          display: inline-block;
          margin-top: 1rem;
          background: #108e66;
          color: #fcfffe;
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .results .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
