// File: app/tools/home-office-setup-cost-estimator/page.tsx
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

// ───────────────────────── Tooltip Icon ─────────────────────────
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
          font-size: 0.65rem;
          font-weight: bold;
          cursor: pointer;
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
          z-index: 1000;
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

// ───────────────────────── Number → Words ────────────────────────
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
const fmtNum = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ────────────────────── Main Component ────────────────────────
export default function HomeOfficeSetupCostEstimator() {
  // One-time setup
  const [deskCost, setDeskCost] = useState("");
  const [chairCost, setChairCost] = useState("");
  const [computerCost, setComputerCost] = useState("");
  const [monitorCost, setMonitorCost] = useState("");
  const [peripheralsCost, setPeripheralsCost] = useState("");
  const [lightingCost, setLightingCost] = useState("");
  const [remodelCost, setRemodelCost] = useState("");
  const [miscSetupCost, setMiscSetupCost] = useState("");
  // Monthly
  const [internetCost, setInternetCost] = useState("");
  const [powerCost, setPowerCost] = useState("");
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const [softwareCost, setSoftwareCost] = useState("");
  // Stipend
  const [stipendPerMonth, setStipendPerMonth] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);
  const [totalSetupCost, setTotalSetupCost] = useState(0);
  const [monthlyOperatingCost, setMonthlyOperatingCost] = useState(0);
  const [firstYearCost, setFirstYearCost] = useState(0);
  const [monthsToBreakeven, setMonthsToBreakeven] = useState<number | null>(
    null
  );

  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  const calculate = () => {
    setError(null);
    const d = parseFloat(deskCost) || 0;
    const c = parseFloat(chairCost) || 0;
    const comp = parseFloat(computerCost) || 0;
    const m = parseFloat(monitorCost) || 0;
    const p = parseFloat(peripheralsCost) || 0;
    const l = parseFloat(lightingCost) || 0;
    const r = parseFloat(remodelCost) || 0;
    const ms = parseFloat(miscSetupCost) || 0;
    const i = parseFloat(internetCost) || 0;
    const pw = parseFloat(powerCost) || 0;
    const mt = parseFloat(maintenanceCost) || 0;
    const sw = parseFloat(softwareCost) || 0;
    const s = parseFloat(stipendPerMonth) || 0;

    if ([d, c, comp, m, p, l, r, ms, i, pw, mt, sw].some((v) => v < 0)) {
      return setError("Enter valid non-negative numbers.");
    }

    const setup = d + c + comp + m + p + l + r + ms;
    const monthlyOp = i + pw + mt + sw;
    const yearCost = setup + monthlyOp * 12;
    const breakeven = s > 0 ? Math.ceil(setup / s) : null;

    setTotalSetupCost(setup);
    setMonthlyOperatingCost(monthlyOp);
    setFirstYearCost(yearCost);
    setMonthsToBreakeven(breakeven);

    setBarData([
      { name: "One-time Setup", value: setup },
      { name: "Monthly Op.", value: monthlyOp },
      { name: "Annual Op.", value: monthlyOp * 12 },
    ]);
    setPieData([
      { name: "Setup", value: setup },
      { name: "Operating", value: monthlyOp * 12 },
    ]);

    setCalculated(true);
  };

  return (
    <main className="container">
      {/* back button */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Home-Office Setup Cost Estimator</h1>
      <p className="description">
        Calculate one-time furniture/equipment costs and ongoing monthly
        expenses for your WFH setup.
      </p>
      <div className="explanation">
        <p>
          <strong>Home Office Setup Cost Estimator:</strong> This calculator
          helps you estimate the <strong>total cost</strong> of setting up a{" "}
          <strong>functional home office</strong> by breaking down key expenses
          like <strong>furniture</strong>, <strong>electronics</strong>{" "}
        </p>
      </div>

      {/* form */}
      <div className="grid">
        <section className="card form-card">
          <h3 className="section-title">One-Time Setup Costs</h3>
          <div className="grid">
            {[
              {
                label: "Desk",
                v: deskCost,
                fn: setDeskCost,
                tip: "Cost of your desk",
                placeholder: "e.g., ₹1,000 INR",
              },
              {
                label: "Chair",
                v: chairCost,
                fn: setChairCost,
                tip: "Ergonomic chair",
                placeholder: "e.g., ₹800 INR",
              },
              {
                label: "Computer",
                v: computerCost,
                fn: setComputerCost,
                tip: "PC or laptop",
                placeholder: "e.g., ₹50,000 INR",
              },
              {
                label: "Monitor(s)",
                v: monitorCost,
                fn: setMonitorCost,
                tip: "Second display(s)",
                placeholder: "e.g., ₹20,000 INR",
              },
              {
                label: "Peripherals",
                v: peripheralsCost,
                fn: setPeripheralsCost,
                tip: "Keyboard/mouse/etc.",
                placeholder: "e.g., ₹2,000 INR",
              },
              {
                label: "Lighting",
                v: lightingCost,
                fn: setLightingCost,
                tip: "Desk lamp, bulbs",
                placeholder: "e.g., ₹2,000 INR",
              },
              {
                label: "Remodeling",
                v: remodelCost,
                fn: setRemodelCost,
                tip: "Painting/partition",
                placeholder: "e.g., ₹15,000 INR",
              },
              {
                label: "Misc Setup",
                v: miscSetupCost,
                fn: setMiscSetupCost,
                tip: "Printer, cables",
                placeholder: "e.g., 10000",
              },
            ].map(({ label, v, fn, tip ,placeholder}) => (
              <div key={label}>
                <label className="input-label">
                  {label} <TooltipIcon text={tip} />
                </label>
                <input
                  type="number"
                  value={v}
                  onChange={(e) => fn(e.target.value)}
                  placeholder={placeholder}
                />
                {v && (
                  <div className="converter">{numberToWords(+v)} Rupees</div>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="card form-card">
          <h2 className="section-title">Monthly Operating Costs</h2>
          <div className="grid">
            {[
              {
                label: "Internet",
                v: internetCost,
                fn: setInternetCost,
                tip: "Monthly data plan",
                placeholder: "e.g., 1000",
              },
              {
                label: "Electricity",
                v: powerCost,
                fn: setPowerCost,
                tip: "Extra power usage",
                placeholder: "e.g., 1000",
              },
              {
                label: "Maintenance",
                v: maintenanceCost,
                fn: setMaintenanceCost,
                tip: "Cleaning, upkeep",
                placeholder: "e.g., 5000",
              },
              {
                label: "Software",
                v: softwareCost,
                fn: setSoftwareCost,
                tip: "Subscriptions",
                placeholder: "e.g., 12000",
              },
            ].map(({ label, v, fn, tip ,placeholder }) => (
              <div key={label}>
                <label className="input-label">
                  {label} <TooltipIcon text={tip} />
                </label>
                <input
                  type="number"
                  value={v}
                  onChange={(e) => fn(e.target.value)}
                  placeholder={placeholder}
                />
                {v && (
                  <div className="converter">{numberToWords(+v)} Rupees</div>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="card form-card">
          <h2 className="section-title">Optional Stipend</h2>
          <div className="grid">
            <div>
              <label className="input-label">
                Stipend per Month <TooltipIcon text="Employer reimbursement" />
              </label>
              <input
                type="number"
                value={stipendPerMonth}
                onChange={(e) => setStipendPerMonth(e.target.value)}
                placeholder="0"
              />
              {stipendPerMonth && (
                <div className="converter">
                  {numberToWords(+stipendPerMonth)} Rupees
                </div>
              )}
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button className="primary-button" onClick={calculate}>
            Calculate Costs
          </button>
        </section>
      </div>

      {/* results */}
      {calculated && (
        <>
          <section className="card results-card">
            <h2 className="section-title">Summary</h2>
            <div className="grid summary-grid">
              <div>
                <strong>Total Setup</strong>
                <br />₹{fmtNum(totalSetupCost)}
              </div>
              <div>
                <strong>Monthly Op.</strong>
                <br />₹{fmtNum(monthlyOperatingCost)}
              </div>
              <div>
                <strong>1st-Year Total</strong>
                <br />₹{fmtNum(firstYearCost)}
              </div>
              <div>
                <strong>Breakeven Months</strong>
                <br />
                {monthsToBreakeven ?? "N/A"}
              </div>
            </div>

            <div className="toggle-group">
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

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "bar" ? (
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `₹${fmtNum(v as number)}`} />
                    <RechartsTooltip
                      formatter={(v) => `₹${fmtNum(v as number)}`}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#108e66" />
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
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#108e66" : "#272a2b"} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip
                      formatter={(v) => `₹${fmtNum(v as number)}`}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </section>

          <div className="disc">
            <h3 className="section-title"> Important Considerations</h3>
            <ul>
              <li>Prices vary by model—get multiple quotes.</li>
              <li>Negotiate internet & utilities annually.</li>
              <li>Stipends shorten payback period.</li>
              <li>Check tax deductions if used professionally.</li>
              <li>Budget +10% contingency for surprises.</li>
            </ul>
          </div>
        </>
      )}

      <style jsx>{`
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272b2a;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          margin-bottom: 1rem;
          text-align: left;
        }
        .back-button {
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
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .section-title{
        font-size:1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;

        }
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
          padding: 1.5rem;
        }
        .form-card .grid,
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
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

        .input-label {
          font-weight: 500;
          margin-bottom: 0.25rem;
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
        .converter {
          font-size: 0.85rem;
          color: #444;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
        .primary-button,
        .calculate-button {
          display: block;
          width: 100%;
          margin-top: 1rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .summary-grid > div {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          font-weight: 500;
        }
        .toggle-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
        }
        .toggle-group button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fafafa;
          cursor: pointer;
        }
        .toggle-group .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-wrapper {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
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
          .form-card .grid,
          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
