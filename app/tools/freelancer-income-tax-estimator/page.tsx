"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Tooltip icon                                                      */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Number → words helper (up to crores)                              */
/* ------------------------------------------------------------------ */
const numberToWords = (num: number): string => {
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
  return helper(Math.round(Math.abs(num)));
};

/* ------------------------------------------------------------------ */
/*  Slab-wise tax helpers                                             */
/* ------------------------------------------------------------------ */
const slabTax = (income: number, slabs: [number, number][]): number => {
  let tax = 0,
    prev = 0;
  for (const [lim, rate] of slabs) {
    if (income <= prev) break;
    const amt = Math.min(income, lim) - prev;
    tax += amt * rate;
    prev = lim;
  }
  return tax;
};

/* FY-24 slabs */
const NEW_SLABS: [number, number][] = [
  [300000, 0],
  [600000, 0.05],
  [900000, 0.1],
  [1200000, 0.15],
  [1500000, 0.2],
  [Infinity, 0.3],
];
const OLD_SLABS: Record<string, [number, number][]> = {
  "<60": [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.2],
    [Infinity, 0.3],
  ],
  "60-79": [
    [300000, 0],
    [500000, 0.05],
    [1000000, 0.2],
    [Infinity, 0.3],
  ],
  ">=80": [
    [500000, 0],
    [1000000, 0.2],
    [Infinity, 0.3],
  ],
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */
export default function FreelancerTaxCalculator() {
  /* --------------- state --------------- */
  const [gross, setGross] = useState("");
  const [expenses, setExpenses] = useState("");
  const [use44, setUse44] = useState(false);
  const [sec80C, set80C] = useState("");
  const [sec80D, set80D] = useState("");
  const [sec80O, set80O] = useState("");
  const [resident, setResident] = useState(true);
  const [ageCat, setAgeCat] = useState("<60");
  const [applySurcharge, setApplySurcharge] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

  const [tiNew, setTiNew] = useState(0);
  const [tiOld, setTiOld] = useState(0);
  const [taxNew, setTaxNew] = useState(0);
  const [taxOld, setTaxOld] = useState(0);
  const [takeNew, setTakeNew] = useState(0);
  const [takeOld, setTakeOld] = useState(0);
  const [effNew, setEffNew] = useState(0);
  const [effOld, setEffOld] = useState(0);
  const [cheaper, setCheaper] = useState("");

  const [barData, setBarData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  /* --------------- calculate --------------- */
  const calculate = () => {
    setError(null);

    const GR = parseFloat(gross);
    if (!GR || GR < 0) return setError("Enter valid gross receipts");

    const E = parseFloat(expenses) || 0;

    /* Profit */
    let P = use44 && GR <= 5000000 ? GR * 0.5 : GR - E;
    if (P < 0) P = 0;

    /* -------- New Regime -------- */
    const TI_N = Math.max(0, P - 50000);
    let bNew = slabTax(TI_N, NEW_SLABS);

    // Rebate
    if (resident && TI_N <= 700000)
      bNew = Math.max(0, bNew - Math.min(bNew, 25000));

    /* -------- Old Regime -------- */
    const deductions =
      Math.min(parseFloat(sec80C) || 0, 150000) +
      Math.min(parseFloat(sec80D) || 0, resident ? 50000 : 25000) +
      (parseFloat(sec80O) || 0);

    const TI_O = Math.max(0, P - deductions);
    let bOld = slabTax(TI_O, OLD_SLABS[ageCat]);

    /* -------- Surcharge & Cess -------- */
    const sr =
      applySurcharge && TI_N > 5000000 ? (TI_N > 10000000 ? 0.15 : 0.1) : 0;
    bNew *= 1 + sr;
    bOld *= 1 + sr;

    bNew *= 1.04; // health & education cess
    bOld *= 1.04;

    /* -------- Final numbers -------- */
    const tNew = Math.round(bNew);
    const tOld = Math.round(bOld);

    setTaxNew(tNew);
    setTaxOld(tOld);
    setTiNew(Math.round(TI_N));
    setTiOld(Math.round(TI_O));

    const thN = Math.round(GR - (use44 ? 0 : E) - tNew);
    const thO = Math.round(GR - E - tOld);
    setTakeNew(thN);
    setTakeOld(thO);

    setEffNew(+((tNew / GR) * 100).toFixed(2));
    setEffOld(+((tOld / GR) * 100).toFixed(2));

    setCheaper(tNew < tOld ? "New Regime" : "Old Regime");

    /* Bar Chart */
    setBarData([
      { name: "New Regime", Tax: tNew, "Take Home": thN },
      { name: "Old Regime", Tax: tOld, "Take Home": thO },
    ]);

    /* Line Chart (tax vs income) */
    const ld: any[] = [];
    for (let i = 0; i <= 10; i++) {
      const inc = GR * (i / 10);
      const profitX =
        use44 && inc <= 5000000 ? inc * 0.5 : Math.max(0, inc - E);

      let tx = slabTax(Math.max(0, profitX - 50000), NEW_SLABS);
      if (resident && profitX - 50000 <= 700000)
        tx = Math.max(0, tx - Math.min(tx, 25000));
      tx *= 1 + sr;
      tx *= 1.04;
      ld.push({ income: Math.round(inc), tax: Math.round(tx) });
    }
    setLineData(ld);
    setCalculated(true);
  };

  /* ------------------------------------------------------------------ */
  /*                                JSX                                 */
  /* ------------------------------------------------------------------ */
  return (
    <main className="container">
      {/* ------------ Top Nav ------------ */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much Tax Will I Pay as a Freelancer?</h1>
      <p className="description">
        Quickly compare your FY&nbsp;2024-25 tax under the <strong>New</strong>{" "}
        and <strong>Old</strong> regimes.
      </p>
      <div className="explanation">
        <p>
          <strong>Freelancer Income Tax Estimator:</strong> This calculator
          helps freelancers estimate their <strong>income tax liability</strong>{" "}
          based on their total earnings and applicable deductions. It takes into
          account both <strong>business income</strong> and{" "}
          <strong>personal income</strong>, as well as{" "}
          <strong>eligible tax-saving investments</strong> to give you a more
          accurate estimate of your tax obligation.
        </p>
        <p>
          By entering your <strong>freelance earnings</strong>,{" "}
          <strong>expenses</strong>, and any applicable{" "}
          <strong>deductions</strong>, the calculator computes the expected{" "}
          <strong>tax payable</strong>. This helps you plan ahead for tax
          payments and optimize your tax-saving strategies throughout the year.
        </p>
      </div>


      {/* ------------ Income & Expenses ------------ */}
      <section className="card">
        <h2 className="card-title">Income&nbsp;&amp;&nbsp;Expenses</h2>
        <div className="grid-3">
          <div>
            <label>
              Annual Gross Receipts{" "}
              <TooltipIcon text="Invoices / sales before expenses" />
            </label>
            <input
              type="number"
              value={gross}
              onChange={(e) => setGross(e.target.value)}
              placeholder="e.g. 1,200,000"
            />
            {gross && (
              <small className="converter">
                {numberToWords(+gross)} Rupees
              </small>
            )}
          </div>

          <div>
            <label>
              Business Expenses <TooltipIcon text="Ignored if 44ADA" />
            </label>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="e.g. 200,000"
            />
            {expenses && (
              <small className="converter">
                {numberToWords(+expenses)} Rupees
              </small>
            )}
          </div>

          <div className="switch-row">
            <label>
              Opt for 44ADA?{" "}
              <TooltipIcon text="50 % deemed profit if turnover ≤ ₹50 L" />
            </label>
            <input
              type="checkbox"
              checked={use44}
              onChange={(e) => setUse44(e.target.checked)}
              aria-label="Opt for 44ADA"
            />
          </div>
        </div>
      </section>

      {/* ------------ Deductions ------------ */}
      <section className="card">
        <h2 className="card-title">Deductions (Old Regime)</h2>
        <div className="grid-3">
          <div>
            <label>
              80C Investments <TooltipIcon text="Maximum ₹1.5 L" />
            </label>
            <input
              type="number"
              value={sec80C}
              onChange={(e) => set80C(e.target.value)}
              placeholder="e.g. 150,000"
            />
          </div>
          <div>
            <label>
              80D Health Premium <TooltipIcon text="₹25k / ₹50k limit" />
            </label>
            <input
              type="number"
              value={sec80D}
              onChange={(e) => set80D(e.target.value)}
              placeholder="e.g. 20,000"
            />
          </div>
          <div>
            <label>
              Other 80-series <TooltipIcon text="80E, 80TTA, 80G…" />
            </label>
            <input
              type="number"
              value={sec80O}
              onChange={(e) => set80O(e.target.value)}
              placeholder="e.g. 50,000"
            />
          </div>
        </div>
      </section>

      {/* ------------ Settings ------------ */}
      <section className="card">
        <h2 className="card-title">Settings</h2>
        <div className="grid-3">
          <div>
            <label>
              Residential Status{" "}
              <TooltipIcon text="Rebate applies only to residents" />
            </label>
            <select
              value={resident ? "resident" : "non-resident"}
              onChange={(e) => setResident(e.target.value === "resident")}
              aria-label="Residential Status"
            >
              <option value="resident">Resident</option>
              <option value="non-resident">Non-Resident</option>
            </select>
          </div>
          <div>
            <label>
              Age Category <TooltipIcon text="Old-regime slabs vary with age" />
            </label>
            <select 
              value={ageCat} 
              onChange={(e) => setAgeCat(e.target.value)}
              aria-label="Age Category"
            >
              <option value="<60">Below&nbsp;60&nbsp;yrs</option>
              <option value="60-79">60–79&nbsp;yrs</option>
              <option value=">=80">80&nbsp;yrs&nbsp;and&nbsp;above</option>
            </select>
          </div>
          <div className="switch-row">
            <label>
              Apply Surcharge? <TooltipIcon text="Auto if taxable &gt; ₹50 L" />
            </label>
            <input
              type="checkbox"
              checked={applySurcharge}
              onChange={(e) => setApplySurcharge(e.target.checked)}
              aria-label="Apply Surcharge"
            />
          </div>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      {/* ------------ Calculate ------------ */}
      <button className="btn-primary" onClick={calculate}>
        Calculate My Tax
      </button>

      {/* ------------ Results ------------ */}
      {calculated && (
        <>
          <section className="card results">
            <h2 className="card-title">Comparison Results</h2>

            {/* Chart toggle */}
            <div className="chart-toggle">
              <button
                className={chartType === "bar" ? "active" : ""}
                onClick={() => setChartType("bar")}
              >
                Bar Chart
              </button>
              <button
                className={chartType === "line" ? "active" : ""}
                onClick={() => setChartType("line")}
              >
                Line Chart
              </button>
            </div>

            {/* Charts */}
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                {chartType === "bar" ? (
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                    <Legend />
                    <Bar dataKey="Tax" fill="#108E66" />
                    <Bar dataKey="Take Home" fill="#272A2B" />
                  </BarChart>
                ) : (
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="income"
                      tickFormatter={(v: number) =>
                        v === 0 ? "0" : `₹${fmt(v / 100000)} L`
                      }
                    />
                    <YAxis />
                    <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tax"
                      stroke="#108E66"
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Regime</th>
                  <th>Taxable&nbsp;Income</th>
                  <th>Tax&nbsp;Payable</th>
                  <th>Take&nbsp;Home</th>
                  <th>Effective&nbsp;Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>New</td>
                  <td>₹{fmt(tiNew)}</td>
                  <td>₹{fmt(taxNew)}</td>
                  <td>₹{fmt(takeNew)}</td>
                  <td>{effNew}%</td>
                </tr>
                <tr>
                  <td>Old</td>
                  <td>₹{fmt(tiOld)}</td>
                  <td>₹{fmt(taxOld)}</td>
                  <td>₹{fmt(takeOld)}</td>
                  <td>{effOld}%</td>
                </tr>
              </tbody>
            </table>

            <p className="insight">
              {cheaper === "New Regime"
                ? `✅  New regime saves you ₹${fmt(
                    Math.abs(taxOld - taxNew)
                  )} this year.`
                : `✅  Old regime saves you ₹${fmt(
                    Math.abs(taxOld - taxNew)
                  )} this year.`}
            </p>
          </section>

          {/* ------------ Important Considerations ------------ */}
          <div className=" disclaimer">
            <h4> Important Considerations</h4>

            <ul>
              <li>
                This tool uses FY&nbsp;2024-25 slabs. Future budgets may change
                rates and rebates.
              </li>
              <li>
                44ADA applies only if gross receipts do not exceed ₹50 lakh.
                Above that, actual profit is used.
              </li>
              <li>
                Health &amp; Education cess (4 %) and surcharge (10 % / 15 %)
                are included when the toggle is on.
              </li>
              <li>
                Deductions such as 80CCD(1B) NPS, HRA, or standard deduction in
                the old regime are <em>not</em> modelled here.
              </li>
              <li>
                Results are estimates for illustration. Consult a qualified tax
                professional for personalised advice.
              </li>
            </ul>
          </div>
        </>
      )}

      <style jsx>{`
        /* --------------- Layout --------------- */
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
        }
        .back-button {
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
          font-size: 2.25rem;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }
        .description {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          color: #555;
        }

        /* --------------- Cards --------------- */
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
          font-weight: 500;
        }

        /* --------------- Grid --------------- */
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        /* --------------- Inputs --------------- */
        label {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          display: block;
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
          justify-content: space-between;
          font-size: 0.9rem;
        }
        .switch-row input[type="checkbox"] {
          width: 1.2rem;
          height: 1.2rem;
          accent-color: #108e66;
        }
        .converter {
          font-size: 0.8rem;
          color: #444;
          margin-top: 0.25rem;
        }

        /* --------------- Buttons --------------- */
        .btn-primary {
          display: block;
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          text-align: center;
          padding: 0.75rem;
          border-radius: 6px;
          border: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 2rem;
        }

        /* --------------- Charts --------------- */
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .chart-toggle button {
          padding: 0.4rem 0.8rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fafafa;
          cursor: pointer;
          transition: background 0.2s;
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
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          height: 280px;
          margin-bottom: 1rem;
        }

        /* --------------- Tables --------------- */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .comparison-table th,
        .comparison-table td {
          padding: 0.6rem;
          border: 1px solid #ddd;
          text-align: center;
        }
        .comparison-table th {
          background: #108e66;
          color: #fcfffe;
        }

        /* --------------- Insight --------------- */
        .insight {
          text-align: center;
          padding: 0.75rem;
          border: 1px solid #108e66;
          border-radius: 6px;
          background: #f7fff9;
          font-weight: 500;
        }

        /* --------------- Disclaimer --------------- */

        .disclaimer {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #272b2a;
          border: 1px solid #272b2a;
          margin-top: 2rem;
        }
        .disclaimer h4 {
          margin-top: 0;
          color: #272b2a;
          margin-bottom: 0.5rem;
        }
        .disclaimer ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        .disclaimer li {
          margin-bottom: 0.5rem;
        }
        .disclaimer li:last-child {
          margin-bottom: 0;
        }

        /* --------------- Tooltip style (shared) --------------- */
        .tooltip {
          position: relative;
          display: inline-block;
          margin-left: 4px;
        }
        .tooltip .info-icon {
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
        }
        @media (max-width: 600px) {
          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
