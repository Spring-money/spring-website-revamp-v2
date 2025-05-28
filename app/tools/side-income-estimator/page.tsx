/*  /app/tools/side-income-estimator/page.tsx
    Side-Hustle Profit Calculator — Spring Money Theme
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
  Cell,
} from "recharts";

/* ───────────────── Types ───────────────── */
type Maybe<T> = T | "";
interface Inputs {
  startupCost: Maybe<string>;
  revenue0: Maybe<string>;
  growthRate: Maybe<string>;
  hoursPerWeek: Maybe<string>;
  taxRate: Maybe<string>;
  softwareCost?: Maybe<string>;
  inventoryCost?: Maybe<string>;
  marketingCost?: Maybe<string>;
  otherCost?: Maybe<string>;
  hourlyAlt?: Maybe<string>;
}

interface MonthRow {
  month: number;
  revenue: number;
  expenses: number;
  timeCost: number;
  net: number;
  cumNet: number;
}

interface Results {
  monthlyNet: number;
  annualNet: number;
  profitMargin: number;
  effectiveHourly: number;
  breakEven: string;
  roi: number;
  lineData: { month: number; revenue: number; net: number }[];
  barData: { name: string; value: number }[];
  table: MonthRow[];
}

/* ───────────────── Tooltip Icon ───────────────── */
const Tip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="i">i</span>
      {open && <span className="box">{text}</span>}
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
          background: #108e66;
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

/* ───────────────── Helpers ───────────────── */
const toNum = (v: Maybe<string>): number => Number(v ?? 0);

const words1to19 = [
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
const tensWords = [
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
const spell = (n: number): string => {
  n = Math.round(Math.abs(n));
  if (n === 0) return "Zero";
  const h = (x: number): string => {
    if (x < 20) return words1to19[x];
    if (x < 100)
      return `${tensWords[Math.floor(x / 10)]}${
        x % 10 ? " " + words1to19[x % 10] : ""
      }`;
    if (x < 1000)
      return `${words1to19[Math.floor(x / 100)]} Hundred${
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

const spellPercent = (v: number) => `${spell(Math.round(v))} percent`;

/* ───────────────── Component ───────────────── */
const SideIncomeEstimator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    startupCost: "",
    revenue0: "",
    growthRate: "",
    hoursPerWeek: "",
    taxRate: "",
    softwareCost: "",
    inventoryCost: "",
    marketingCost: "",
    otherCost: "",
    hourlyAlt: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value.trim() }));

  /* ── validation ── */
  const must = [
    "startupCost",
    "revenue0",
    "growthRate",
    "hoursPerWeek",
    "taxRate",
  ] as const;

  const validate = () => {
    const err: Partial<Record<keyof Inputs, string>> = {};
    must.forEach((k) => {
      if (!inputs[k] || isNaN(+inputs[k]!) || +inputs[k]! <= 0)
        err[k] = "Required";
    });
    Object.entries(inputs).forEach(([k, v]) => {
      if (v && isNaN(+v)) err[k as keyof Inputs] = "Invalid number";
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ── core calc ── */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const startup = toNum(inputs.startupCost);
    const rev0 = toNum(inputs.revenue0);
    const g = toNum(inputs.growthRate) / 100;
    const tax = toNum(inputs.taxRate) / 100;
    const fixedExp =
      toNum(inputs.softwareCost || "") +
      toNum(inputs.inventoryCost || "") +
      toNum(inputs.marketingCost || "") +
      toNum(inputs.otherCost || "");

    const hoursMonth = toNum(inputs.hoursPerWeek || "") * (52 / 12);
    const timePrice = toNum(inputs.hourlyAlt || "");
    const timeCost = hoursMonth * timePrice;

    /* month loop */
    let cumNet = 0;
    let breakEven = -1;
    const table: MonthRow[] = [];
    const lineData: { month: number; revenue: number; net: number }[] = [];
    for (let m = 1; m <= 12; m++) {
      const revenue = rev0 * Math.pow(1 + g, m - 1);
      const gross = revenue - fixedExp - timeCost;
      const net = gross > 0 ? gross * (1 - tax) : gross;
      cumNet += net;
      if (breakEven === -1 && cumNet >= startup) breakEven = m;
      table.push({
        month: m,
        revenue: Math.round(revenue),
        expenses: Math.round(fixedExp),
        timeCost: Math.round(timeCost),
        net: Math.round(net),
        cumNet: Math.round(cumNet),
      });
      lineData.push({
        month: m,
        revenue: Math.round(revenue),
        net: Math.round(cumNet),
      });
    }

    const annualNet = table.reduce((s, r) => s + r.net, 0);
    const monthlyNet = annualNet / 12;
    const avgRev = table.reduce((s, r) => s + r.revenue, 0) / 12;
    const margin = avgRev ? (monthlyNet / avgRev) * 100 : 0;
    const effHourly = hoursMonth ? monthlyNet / hoursMonth : 0;
    const roi = startup ? (annualNet / startup) * 100 : 0;
    const taxPaid =
      annualNet > 0 ? Math.round((annualNet * tax) / (1 - tax)) : 0;

    const barData = [
      { name: "Tax Paid", value: taxPaid },
      { name: "Time Cost", value: Math.round(timeCost * 12) },
      { name: "Real Profit", value: Math.round(annualNet) },
    ];

    setResults({
      monthlyNet: Math.round(monthlyNet),
      annualNet: Math.round(annualNet),
      profitMargin: Math.round(margin * 100) / 100,
      effectiveHourly: Math.round(effHourly),
      breakEven: breakEven === -1 ? "> 12 months" : `${breakEven} months`,
      roi: Math.round(roi * 100) / 100,
      lineData,
      barData,
      table,
    });
    setTimeout(() => setBusy(false), 300);
  };

  const COLORS = ["#ff9f00", "#525ecc", "#108e66"];

  /* ── JSX ── */
  return (
    <div className="wrap">
      <header className="nav">
        <Link href="/tools">
          <button className="backBtn">Back to dashboard</button>
        </Link>
      </header>

      <h1 className="h1">Side-Hustle Profit Calculator</h1>
      <p className="tagline">
        Know exactly what your gig earns after expenses, tax &amp; the value of
        your time.
      </p>
      <div className="explanation">
        <p>
          <strong>Side Income Estimator:</strong> This tool helps you project
          potential earnings from part-time gigs, freelancing, or passive income
          streams like rentals or online businesses.
        </p>
        <p>
          Enter your <strong>expected monthly hours</strong>,{" "}
          <strong>hourly rate</strong>, and any{" "}
          <strong>fixed monthly costs</strong> (e.g., platform fees, software,
          utilities). The calculator estimates your{" "}
          <strong>net monthly side income</strong> and{" "}
          <strong>annual earnings</strong> after accounting for time investment
          and recurring costs.
        </p>
        <p>
          It is a useful way to evaluate whether a side hustle is financially
          worthwhile based on your available time and skill monetization
          potential.
        </p>
      </div>

      {/* ───────── form ───────── */}
      <section className="card">
        <h2 className="h2">Inputs</h2>
        <div className="grid">
          {(
            [
              [
                "startupCost",
                "One-time Start-up Cost (₹)",
                "Laptop, licences, equipment etc.",
                "e.g. 40,000",
              ],
              [
                "revenue0",
                "Revenue this month (₹)",
                "Sales before GST this month.",
                "e.g. 12,500",
              ],
              [
                "growthRate",
                "Monthly Revenue Growth (%)",
                "How fast sales grow each month.",
                "e.g. 5",
              ],
              [
                "softwareCost",
                "Software / SaaS (₹)",
                "Canva Pro, Adobe, hosting.",
                "e.g. 1,200",
              ],
              [
                "inventoryCost",
                "Materials / Inventory (₹)",
                "Stock, packaging, shipping boxes.",
                "e.g. 3,000",
              ],
              [
                "marketingCost",
                "Marketing / Ads (₹)",
                "Instagram, Google, Flyers.",
                "e.g. 2,000",
              ],
              [
                "otherCost",
                "Other Monthly Costs (₹)",
                "Rent, utilities, transport.",
                "e.g. 1,000",
              ],
              [
                "hoursPerWeek",
                "Hours worked each week",
                "Realistic time you'll spend.",
                "e.g. 10",
              ],
              [
                "hourlyAlt",
                "Alt. hourly rate (₹) (optional)",
                "What you'd earn elsewhere.",
                "e.g. 300",
              ],
              [
                "taxRate",
                "Effective Tax on Profit (%)",
                "Your slab or presumptive rate.",
                "e.g. 20",
              ],
            ] as const
          ).map(([k, lbl, tip, ph]) => {
            const val = inputs[k as keyof Inputs]!;
            const isPercent = k === "growthRate" || k === "taxRate";
            return (
              <label key={k} className="field">
                <span className="lbl">
                  {lbl}
                  <Tip text={tip} />
                </span>
                <input
                  name={k}
                  type="number"
                  inputMode="decimal"
                  placeholder={ph}
                  value={val}
                  onChange={onChange}
                />
                {val && (
                  <span className="helper">
                    {isPercent ? spellPercent(+val) : `${spell(+val)} Rupees`}
                  </span>
                )}
                {errors[k as keyof Inputs] && (
                  <span className="err">{errors[k as keyof Inputs]}</span>
                )}
              </label>
            );
          })}
        </div>
        <button className="calcBtn" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </section>

      {/* ───────── results ───────── */}
      {results && (
        <section className="card">
          <h2 className="h2">Snapshot</h2>
          <div className="summary">
            {(
              [
                ["Monthly Net", results.monthlyNet, "Rupees"],
                ["Annual Net", results.annualNet, "Rupees"],
                ["Profit Margin", `${results.profitMargin}%`, ""],
                ["Effective Pay / hr", results.effectiveHourly, "Rupees"],
                ["Break-even", results.breakEven, ""],
                ["ROI (1 yr)", `${results.roi}%`, ""],
              ] as const
            ).map(([t, v, suff]) => (
              <div key={t} className="sumItem">
                <strong>{t}:</strong>{" "}
                {typeof v === "number"
                  ? `₹${v.toLocaleString("en-IN")} ${suff}`
                  : v}
              </div>
            ))}
          </div>

          <div className="switch">
            <button
              onClick={() => setChartType("line")}
              className={chartType === "line" ? "active" : ""}
            >
              Line chart
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={chartType === "bar" ? "active" : ""}
            >
              Bar chart
            </button>
          </div>

          <div className="chartBox">
            <ResponsiveContainer width="100%" height={280}>
              {chartType === "line" ? (
                <LineChart data={results.lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    stroke="#525ecc"
                    dataKey="revenue"
                    name="Revenue"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    stroke="#108e66"
                    dataKey="net"
                    name="Cum. Profit"
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <BarChart data={results.barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" name="₹">
                    {results.barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="h3">12-month Cash-flow</h3>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  {[
                    "Month",
                    "Revenue",
                    "Expenses",
                    "Time Cost",
                    "Net",
                    "Cum. Net",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.table.map((r) => (
                  <tr key={r.month}>
                    <td>{r.month}</td>
                    <td>{r.revenue.toLocaleString("en-IN")}</td>
                    <td>{r.expenses.toLocaleString("en-IN")}</td>
                    <td>{r.timeCost.toLocaleString("en-IN")}</td>
                    <td>{r.net.toLocaleString("en-IN")}</td>
                    <td>{r.cumNet.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="disclaimer">
            <h4>Important</h4>
            <ul>
              <li>
                Assumes costs &amp; growth stay constant for 12 months. Update
                quarterly.
              </li>
              <li>Revenue should be exclusive of GST; remit GST separately.</li>
              <li>Tax rate is your effective slab or presumptive rate.</li>
              <li>
                Opportunity-cost of time is optional but gives a truer picture.
              </li>
              <li>
                Results are illustrative—consult a CA before investing big
                money.
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* ───────── styles ───────── */}
      <style jsx>{`
        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
          font-family: "Poppins", sans-serif;
          color: #272b2a;
          background: #fcfffe;
        }
        .nav {
          margin-bottom: 1rem;
        }
        .backBtn {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .h1 {
          text-align: center;
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }
        .tagline {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1.3rem;
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
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          margin-bottom: 2rem;
        }
        .h2 {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .field {
          position: relative;
          font-size: 0.95rem;
        }
        .lbl {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        input {
          width: 100%;
          height: 40px;
          padding: 0 0.6rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
        }
        input::placeholder {
          color: #aaa;
        }
        .helper {
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .err {
          color: red;
          font-size: 0.8rem;
        }
        .calcBtn {
          background: #108e66;
          color: #fff;
          border: none;
          padding: 0.8rem 1.6rem;
          border-radius: 4px;
          font-size: 1rem;
          margin-top: 1rem;
          cursor: pointer;
          width: 100%;
        }
        .summary {
          display: grid;
          gap: 0.7rem;
          border-left: 4px solid #108e66;
          padding-left: 1rem;
          margin-bottom: 1.2rem;
        }
        .sumItem {
          font-size: 1rem;
        }
        .switch {
          display: flex;
          gap: 0.7rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .switch button {
          padding: 0.4rem 1rem;
          border: 1px solid #272b2a;
          background: transparent;
          border-radius: 20px;
          cursor: pointer;
        }
        .switch .active {
          background: #108e66;
          color: #fff;
          border-color: #108e66;
        }
        .chartBox {
          margin-bottom: 1.5rem;
        }
        .h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .tableWrap {
          overflow-x: auto;
          border: 1px solid #272b2a;
          border-radius: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #272b2a;
          padding: 0.4rem;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fff;
          position: sticky;
          top: 0;
        }
        .disclaimer {
          background: #fcfffe;
          border: 1px solid #272b2a;
          border-radius: 4px;
          padding: 1rem;
          margin-top: 1.5rem;
          font-size: 0.9rem;
        }
        .disclaimer ul {
          margin: 0;
          padding-left: 1.2rem;
        }
        .disclaimer li {
          margin-bottom: 0.5rem;
        }

        /* ───────── mobile tweaks ───────── */
        @media (max-width: 700px) {
          .wrap {
            padding: 1rem;
          }
          .grid {
            grid-template-columns: 1fr;
          }
          .summary {
            border-left: none;
            padding-left: 0;
          }
          .sumItem {
            text-align: center;
          }
          .chartBox {
            margin-left: -0.5rem;
            margin-right: -0.5rem;
          }
          .switch {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      {/* hide number spinners */}
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
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

export default SideIncomeEstimator;
