"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

/* ──────────────────────────────────
   Tooltip “i” icon
   ────────────────────────────────── */
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
          margin-left: 4px;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          font-size: 0.6rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tooltiptext {
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background: #108e66;
          color: #fcfffe;
          padding: 6px 8px;
          font-size: 0.75rem;
          border-radius: 4px;
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

/* ──────────────────────────────────
   Number → Words (Indian grouping)
   ────────────────────────────────── */
const numberToWords = (num: number): string => {
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

/* ──────────────────────────────────
   Tax-slab helper
   ────────────────────────────────── */
type Slab = { limit: number; rate: number };
const slabCalc = (income: number, slabs: Slab[]): number => {
  let tax = 0,
    remaining = income;
  for (let i = slabs.length - 1; i >= 0; i--) {
    const slab = slabs[i];
    const prevLimit = i > 0 ? slabs[i - 1].limit : 0;
    if (income > prevLimit) {
      const taxable = Math.min(remaining, slab.limit - prevLimit);
      tax += taxable * slab.rate;
      remaining -= taxable;
    }
  }
  return tax;
};

/* ──────────────────────────────────
   Component
   ────────────────────────────────── */
export default function AdvanceTaxCalculator() {
  /* ---------- inputs ---------- */
  const [grossIncome, setGrossIncome] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [totalDeduct, setTotalDeduct] = useState("");
  const [tdsPaid, setTdsPaid] = useState("");
  const [advPaid, setAdvPaid] = useState("");
  const [regime, setRegime] = useState<"Old" | "New">("Old");
  const [fy, setFy] = useState("2024-25");

  /* ---------- validation & state ---------- */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [computed, setComputed] = useState(false);

  const [taxable, setTaxable] = useState(0);
  const [rawTax, setRawTax] = useState(0);
  const [taxWithCess, setTaxWithCess] = useState(0);
  const [netPayable, setNetPayable] = useState(0);
  const [instSchedule, setInstSchedule] = useState<
    { due: string; target: number; paid: number; shortfall: number }[]
  >([]);
  const [interest234B, setInterest234B] = useState(0);
  const [interest234C, setInterest234C] = useState(0);
  const [dueNow, setDueNow] = useState(0);
  const [chartView, setChartView] = useState<"bar" | "line">("bar");
  const [chartData, setChartData] = useState<any[]>([]);

  /* ---------- utils ---------- */
  const fmt = (v: number) =>
    v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  /* ---------- validation ---------- */
  const validate = (): boolean => {
    const vals = { grossIncome, otherIncome, totalDeduct, tdsPaid, advPaid };
    const errs: Record<string, string> = {};
    Object.entries(vals).forEach(([k, v]) => {
      if (v === "") errs[k] = "Required";
      else if (isNaN(Number(v)) || Number(v) < 0) errs[k] = "Invalid";
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  /* ---------- next due-index ---------- */
  const getNextDue = (): number => {
    const d = new Date();
    const m = d.getMonth(),
      day = d.getDate();
    if (m < 5 || (m === 5 && day <= 15)) return 0; // 15 Jun
    if (m < 8 || (m === 8 && day <= 15)) return 1; // 15 Sep
    if (m < 11 || (m === 11 && day <= 15)) return 2; // 15 Dec
    return 3; // 15 Mar
  };

  /* ---------- main calc ---------- */
  const calculate = () => {
    if (!validate()) return;

    const G = +grossIncome,
      O = +otherIncome,
      D = +totalDeduct,
      T = +tdsPaid,
      A = +advPaid;

    const taxInc = G + O - D;
    setTaxable(taxInc);

    const slabsOld: Slab[] = [
      { limit: 250_000, rate: 0 },
      { limit: 500_000, rate: 0.05 },
      { limit: 1_000_000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];
    const slabsNew: Slab[] = [
      { limit: 300_000, rate: 0 },
      { limit: 600_000, rate: 0.05 },
      { limit: 900_000, rate: 0.1 },
      { limit: 1_200_000, rate: 0.15 },
      { limit: 1_500_000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    const raw = slabCalc(taxInc, regime === "Old" ? slabsOld : slabsNew);
    setRawTax(raw);

    let twc = raw * 1.04; // +4 % cess
    const rebateCap = regime === "New" ? 700_000 : 500_000;
    if (taxInc <= rebateCap) twc = 0;
    twc = Math.round(twc);
    setTaxWithCess(twc);

    const net = Math.round(twc - T - A);
    setNetPayable(net);

    const percents = [0.15, 0.45, 0.75, 1.0];
    let remainingPaid = A;
    const sched = percents.map((p, i) => {
      const target = Math.round(p * twc);
      const paid = Math.min(remainingPaid, target);
      remainingPaid -= paid;
      const shortfall = Math.max(0, target - paid);
      return {
        due: ["15 Jun", "15 Sep", "15 Dec", "15 Mar"][i],
        target,
        paid,
        shortfall,
      };
    });
    setInstSchedule(sched);

    let i234B = 0,
      i234C = 0;
    if (net > 10_000) {
      const remMon = 12 - new Date().getMonth();
      i234B = Math.round(net * 0.01 * remMon);
      i234C = sched.reduce((sum, row, idx) => {
        if (row.shortfall > 0 && getNextDue() > idx) {
          const months = getNextDue() - idx;
          return sum + Math.round(row.shortfall * 0.01 * months);
        }
        return sum;
      }, 0);
    }
    setInterest234B(i234B);
    setInterest234C(i234C);

    const next = getNextDue();
    const dueAmt = Math.max(0, sched[next].target - sched[next].paid);
    setDueNow(dueAmt + i234B + i234C);

    const cdata = sched.map((row) => ({
      due: row.due,
      Scheduled: row.target,
      Paid: row.paid,
      Outstanding: Math.round(twc - (row.paid + T)),
    }));
    setChartData(cdata);

    setComputed(true);
  };

  /* ---------- ui ---------- */
  return (
    <main className="container">
      <Link href="/tools">
        <button className="back">Back to Dashboard</button>
      </Link>

      <h1 className="title">How Much Advance Tax Do I Owe?</h1>
      <p className="description">
        Estimate your quarterly advance-tax instalments under old / new regime
        for FY {fy}.
      </p>
      <div className="explanation">
  <p>
    <strong>Advance Tax Calculator:</strong> Advance tax refers to the income tax that is paid in advance instead of a lump sum payment at year-end. It is applicable when your estimated tax liability for the financial year is <strong>₹10,000 or more</strong>.
  </p>
  <p>
    This calculator helps you estimate your <strong>advance tax liability</strong> based on your expected income, deductions, and applicable tax slabs. It is especially useful for <strong>freelancers</strong>, <strong>business owners</strong>, and individuals with <strong>non-salaried income</strong> like rent, capital gains, or interest. Payments are made in installments as per the <em>advance tax schedule</em> set by the Income Tax Department.
  </p>
</div>


      {/* INPUTS */}
      <section className="card inputs">
        <h2 className="section-title">Income &amp; Deductions</h2>
        <div className="grid">
          {[
            {
              label: "Gross Income (₹)",
              key: "grossIncome",
              val: grossIncome,
              set: setGrossIncome,
              tip: "Annual salary or business income",
              ph: "e.g. 12,50,000",
            },
            {
              label: "Other Income (₹)",
              key: "otherIncome",
              val: otherIncome,
              set: setOtherIncome,
              tip: "FD interest, rent, capital gains",
              ph: "e.g. 50,000",
            },
            {
              label: "Total Deductions (₹)",
              key: "totalDeduct",
              val: totalDeduct,
              set: setTotalDeduct,
              tip: "80C / 80D / HRA etc.",
              ph: "e.g. 1,75,000",
            },
            {
              label: "TDS / TCS Paid (₹)",
              key: "tdsPaid",
              val: tdsPaid,
              set: setTdsPaid,
              tip: "As per Form 26AS",
              ph: "e.g. 1,10,000",
            },
            {
              label: "Advance Tax Paid (₹)",
              key: "advPaid",
              val: advPaid,
              set: setAdvPaid,
              tip: "Earlier instalments this FY",
              ph: "e.g. 45,000",
            },
          ].map((f) => (
            <label key={f.key}>
              <span>
                {f.label}
                <TooltipIcon text={f.tip} />
              </span>
              <input
                type="number"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.ph}
              />
              {errors[f.key] && (
                <small className="error">{errors[f.key]}</small>
              )}
              {f.val && (
                <small className="converter">
                  {numberToWords(+f.val)} Rupees
                </small>
              )}
            </label>
          ))}

          {/* Regime select */}
          <label>
            <span>
              Regime <TooltipIcon text="Old vs New tax slabs" />
            </span>
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value as any)}
            >
              <option>Old</option>
              <option>New</option>
            </select>
          </label>

          {/* FY input */}
          <label>
            <span>
              Financial Year <TooltipIcon text="Slab & due-date logic" />
            </span>
            <input
              type="text"
              value={fy}
              onChange={(e) => setFy(e.target.value)}
              placeholder="e.g. 2024-25"
            />
          </label>
        </div>
      </section>

      <button className="calc" onClick={calculate}>
        Calculate
      </button>

      {/* RESULTS */}
      {computed && (
        <section className="card results">
          <h2 className="section-title">Results</h2>
          <div className="summary">
            {[
              ["Total Tax + Cess", taxWithCess],
              ["Net Payable", netPayable],
              ["Interest u/s 234B", interest234B],
              ["Interest u/s 234C", interest234C],
              ["Due This Instalment", dueNow],
            ].map(([lbl, val]) => (
              <div key={lbl}>
                <strong>{lbl}</strong>
                <br />₹{fmt(val as number)}
              </div>
            ))}
          </div>

          {/* Chart toggle */}
          <div className="chart-toggle">
            <button
              className={chartView === "bar" ? "active" : ""}
              onClick={() => setChartView("bar")}
            >
              Bar
            </button>
            <button
              className={chartView === "line" ? "active" : ""}
              onClick={() => setChartView("line")}
            >
              Line
            </button>
          </div>

          {/* Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartView === "bar" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="due" />
                  <YAxis tickFormatter={(v) => `₹${fmt(v as number)}`} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                  <Bar dataKey="Scheduled" stackId="a" fill="#108E66" />
                  <Bar dataKey="Paid" stackId="a" fill="#272A2B" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="due" />
                  <YAxis tickFormatter={(v) => `₹${fmt(v as number)}`} />
                  <RechartsTooltip
                    formatter={(v: number, name: string) => [
                      `₹${fmt(v)}`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Outstanding"
                    stroke="#108E66"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Due Date</th>
                  <th>Target ₹</th>
                  <th>Paid ₹</th>
                  <th>Shortfall ₹</th>
                  <th>Interest ₹</th>
                </tr>
              </thead>
              <tbody>
                {instSchedule.map((row) => (
                  <tr key={row.due}>
                    <td>{row.due}</td>
                    <td>₹{fmt(row.target)}</td>
                    <td>₹{fmt(row.paid)}</td>
                    <td>₹{fmt(row.shortfall)}</td>
                    <td>
                      ₹
                      {fmt(
                        row.shortfall > 0 ? Math.round(row.shortfall * 0.01) : 0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insights */}
          <div className="disc">
            <h3>Important Considerations</h3>
            <ul>
              <li>
                Advance-tax instalments: 15 Jun (15 %), 15 Sep (45 %), 15 Dec
                (75 %), 15 Mar (100 %).
              </li>
              <li>
                Shortfall in any instalment → interest u/s 234C (1 % p.m.).
              </li>
              <li>
                <strong>Net tax payable &gt; ₹10,000</strong> → 234B interest
                applies if 90 % of tax not cleared by 31 Mar.
              </li>
              <li>
                New regime disallows most deductions (except employer NPS /
                EPF).
              </li>
              <li>
                No advance-tax if residual tax ≤ ₹10,000 (fully covered by TDS /
                TCS).
              </li>
              <li>Always match with Form 26AS before filing return.</li>
            </ul>
          </div>
        </section>
      )}

      {/* styles truncated for brevity  */}
      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
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
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
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
        .inputs .grid,
        .results .summary {
          display: grid;
          gap: 1rem;
        }
        .inputs .grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
        }
        input,
        select {
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
          font-size: 0.8rem;
        }
        .calc {
          width: 100%;
          padding: 0.75rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 2rem;
        }
        .results .summary {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          margin-bottom: 1rem;
        }
        .results .summary div {
          background: #fff;
          border: 1px solid #108e66;
          border-radius: 6px;
          text-align: center;
          padding: 0.75rem;
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
        .chart-container {
          width: 100%;
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

        @media (max-width: 600px) {
          .results .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
