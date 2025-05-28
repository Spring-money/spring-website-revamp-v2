// File: /app/calculators/balanceTransfer/page.tsx
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

/* ───────────────── Types ───────────────── */
interface Inputs {
  balance: string;
  remYears: string;
  currRate: string;
  currEmi: string;
  newRate: string;
  newYears: string;
  procFee: string;
  financeFee: string; // "true" | "false"
  prepay: string;
}
interface Results {
  emiOld: number;
  emiNew: number;
  intOld: number;
  costNew: number;
  savings: number;
  breakeven: number | null;
  tenureDiff: number;
  roi: number | null;
  balSeries: { m: number; old: number; new: number }[];
  barSeries: { name: string; value: number }[];
}

/* ───────────────── Tooltip Icon ───────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="tooltipIcon"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="info-icon">i</span>
      {hover && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltipIcon {
          position: relative;
          display: inline-block;
          margin-left: 5px;
          cursor: pointer;
          vertical-align: middle;
        }
        .info-icon {
          display: inline-block;
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          font-size: 0.6rem;
          width: 14px;
          height: 14px;
          text-align: center;
          line-height: 14px;
          font-weight: bold;
        }
        .tooltiptext {
          visibility: visible;
          width: 220px;
          background-color: #108e66;
          color: #fcfffe;
          text-align: left;
          border-radius: 4px;
          padding: 6px 8px;
          position: absolute;
          z-index: 1000;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          line-height: 1.2;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .tooltiptext::after {
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

/* ───────────────── Number-to-Words Helpers ───────────────── */
const toWords = (n: number): string => {
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

const wordsRupees = (v: string) =>
  v && !isNaN(+v) && +v > 0 ? `${toWords(+v)} rupees` : "";

/* ───────────────── Main Component ───────────────── */
const BalanceTransfer: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    balance: "",
    remYears: "5",
    currRate: "14",
    currEmi: "",
    newRate: "10.5",
    newYears: "5",
    procFee: "0",
    financeFee: "false",
    prepay: "0",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);

  const [chart, setChart] = useState<"balance" | "cost">("balance");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    Object.entries(inputs).forEach(([k, v]) => {
      if (v === "" && k !== "currEmi") e[k as keyof Inputs] = "Required";
      else if (v !== "" && isNaN(Number(v)) && k !== "financeFee")
        e[k as keyof Inputs] = "Number only";
      else if (+v < 0) e[k as keyof Inputs] = "Must be positive";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Core Calculation ── */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const B = +inputs.balance,
      n1 = +inputs.remYears * 12,
      n2 = +inputs.newYears * 12,
      r1 = +inputs.currRate / 1200,
      r2 = +inputs.newRate / 1200,
      F = +inputs.procFee,
      financeFee = inputs.financeFee === "true",
      extra = +inputs.prepay;

    /* Current EMI (or given EMI) */
    const calcEmi = (P: number, r: number, n: number) =>
      (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const emiOld = Math.round(
      inputs.currEmi ? +inputs.currEmi : calcEmi(B, r1, n1)
    );

    /* Interest left if you stay */
    let bal = B,
      intOld = 0;
    for (let t = 1; t <= n1 && bal > 0; t++) {
      const int = bal * r1;
      const prin = emiOld - int;
      bal -= prin;
      intOld += int;
    }

    /* New loan principal (fee financed?) */
    const P2 = financeFee ? B + F : B;
    let emiNew = calcEmi(P2, r2, n2);
    emiNew += extra;
    emiNew = Math.round(emiNew);

    /* Amortise new loan */
    bal = P2;
    let intNew = 0,
      monthsPaid = 0;
    const balSeries: { m: number; old: number; new: number }[] = [];
    for (let t = 1; t <= n2 && bal > 0; t++) {
      const int = bal * r2;
      const prin = emiNew - int;
      bal -= prin;
      intNew += int;
      monthsPaid = t;
      balSeries.push({
        m: t,
        old:
          (B * (Math.pow(1 + r1, n1) - Math.pow(1 + r1, t))) /
          (Math.pow(1 + r1, n1) - 1),
        new: Math.max(0, bal),
      });
    }

    const totalCostNew = intNew + (financeFee ? 0 : F);
    const savings = Math.round(intOld - totalCostNew);
    const tenureDiff = n1 - monthsPaid;
    const breakeven =
      savings > 0
        ? balSeries.find((x) => x.old - x.new > F)?.m ?? null
        : null;
    const roi =
      F > 0 && savings > 0 ? Math.round((savings / F) * 10) / 10 : null;

    const barSeries = [
      { name: "Stay – Interest", value: Math.round(intOld) },
      { name: "Transfer – All Cost", value: Math.round(totalCostNew) },
    ];

    setResults({
      emiOld,
      emiNew,
      intOld: Math.round(intOld),
      costNew: Math.round(totalCostNew),
      savings,
      breakeven,
      tenureDiff,
      roi,
      balSeries,
      barSeries,
    });
    setTimeout(() => setBusy(false), 400);
  };

  const COLORS = ["#272a2b", "#108e66"];

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="container">
      {/* nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Balance-Transfer Savings Calculator</h1>
      <p className="description">
        Compare your current loan with a balance-transfer offer to see if
        switching really saves you money.
      </p>

      {/* explanation card */}
      <div className="meaning-card">
        <p>
          <strong>Balance Transfer:</strong> Move an existing loan to a new
          lender at a lower rate to cut interest outgo. This calculator weighs
          the savings against processing fees and tenure reset.
        </p>
      </div>

      {/* input card */}
      <div className="card">
        <h2 className="section-title">Current Loan</h2>
        <div className="input-group">
          {/* outstanding balance */}
          <label>
            <span className="input-label">
              Outstanding Balance (₹)
              <TooltipIcon text="Principal left on present loan." />
            </span>
            <input
              name="balance"
              type="number"
              placeholder="e.g., 1,50,000"
              value={inputs.balance}
              onChange={onChange}
            />
            {errors.balance && <span className="error">{errors.balance}</span>}
            <span className="words">{wordsRupees(inputs.balance)}</span>
          </label>

          {/* remaining years */}
          <label>
            <span className="input-label">
              Remaining Tenure (Years)
              <TooltipIcon text="Months left ÷ 12." />
            </span>
            <input
              name="remYears"
              type="number"
              placeholder="e.g., 5"
              value={inputs.remYears}
              onChange={onChange}
            />
          </label>

          {/* current rate */}
          <label>
            <span className="input-label">
              Current Rate (% pa)
              <TooltipIcon text="Existing reducing-balance interest rate." />
            </span>
            <input
              name="currRate"
              type="number"
              step="0.01"
              placeholder="e.g., 14.5"
              value={inputs.currRate}
              onChange={onChange}
            />
          </label>

          {/* current EMI optional */}
          <label>
            <span className="input-label">
              Current EMI (₹) (optional)
              <TooltipIcon text="Leave blank to auto-estimate." />
            </span>
            <input
              name="currEmi"
              type="number"
              placeholder="e.g., 3,500"
              value={inputs.currEmi}
              onChange={onChange}
            />
            <span className="words">{wordsRupees(inputs.currEmi)}</span>
          </label>
        </div>

        <h2 className="section-title">Transfer Offer</h2>
        <div className="input-group">
          {/* new rate */}
          <label>
            <span className="input-label">
              New Rate (% pa)
              <TooltipIcon text="Promotional / new lender rate." />
            </span>
            <input
              name="newRate"
              type="number"
              step="0.01"
              placeholder="e.g., 10.5"
              value={inputs.newRate}
              onChange={onChange}
            />
          </label>

          {/* new tenure */}
          <label>
            <span className="input-label">
              New Tenure (Years)
              <TooltipIcon text="Reset tenure you prefer." />
            </span>
            <input
              name="newYears"
              type="number"
              placeholder="e.g., 5"
              value={inputs.newYears}
              onChange={onChange}
            />
          </label>

          {/* processing fee */}
          <label>
            <span className="input-label">
              Processing Fee (₹)
              <TooltipIcon text="Set 0 if waived." />
            </span>
            <input
              name="procFee"
              type="number"
              placeholder="e.g., 2,500"
              value={inputs.procFee}
              onChange={onChange}
            />
            <span className="words">{wordsRupees(inputs.procFee)}</span>
          </label>

          {/* finance fee select */}
          <label>
            <span className="input-label">
              Finance the Fee?
              <TooltipIcon text="Add fee to principal instead of paying cash." />
            </span>
            <select
              name="financeFee"
              value={inputs.financeFee}
              onChange={onChange}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>

          {/* pre-pay extra EMI */}
          <label>
            <span className="input-label">
              Extra EMI Payment (₹/mo)
              <TooltipIcon text="Optional extra you’ll prepay each month." />
            </span>
            <input
              name="prepay"
              type="number"
              placeholder="e.g., 1,000"
              value={inputs.prepay}
              onChange={onChange}
            />
            <span className="words">{wordsRupees(inputs.prepay)}</span>
          </label>
        </div>

        <button
          className="calculate-button"
          onClick={calculate}
          disabled={busy}
        >
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ───────── Results ───────── */}
      {results && (
        <div className="card">
          <h2 className="section-title">Savings Snapshot</h2>

          <div className="summary-card">
            <div className="summary-item">
              <strong>Current EMI:</strong> ₹
              {results.emiOld.toLocaleString("en-IN")} (
              {toWords(results.emiOld)})
            </div>
            <div className="summary-item">
              <strong>New EMI:</strong> ₹
              {results.emiNew.toLocaleString("en-IN")} (
              {toWords(results.emiNew)})
            </div>
            <div className="summary-item">
              <strong>Interest to Stay:</strong> ₹
              {results.intOld.toLocaleString("en-IN")} (
              {toWords(results.intOld)})
            </div>
            <div className="summary-item">
              <strong>Total Cost to Transfer:</strong> ₹
              {results.costNew.toLocaleString("en-IN")} (
              {toWords(results.costNew)})
            </div>
            <div className="summary-item">
              <strong>Net Savings:</strong>{" "}
              <span
                style={{ color: results.savings > 0 ? "#108e66" : "red" }}
              >
                ₹{results.savings.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="summary-item">
              <strong>Breakeven:</strong>{" "}
              {results.breakeven ? `${results.breakeven} months` : "–"}
            </div>
            <div className="summary-item">
              <strong>Tenure Change:</strong>{" "}
              {results.tenureDiff >= 0 ? "-" : "+"}
              {Math.abs(results.tenureDiff)} months
            </div>
            {results.roi && (
              <div className="summary-item">
                <strong>ROI on Fee:</strong> {results.roi.toFixed(1)} ×
              </div>
            )}
          </div>

          {/* chart toggle */}
          <div className="toggle">
            <button
              onClick={() => setChart("balance")}
              className={chart === "balance" ? "active" : ""}
            >
              Balance Pay-off
            </button>
            <button
              onClick={() => setChart("cost")}
              className={chart === "cost" ? "active" : ""}
            >
              Stay vs Transfer Cost
            </button>
          </div>

          <div className="chart-explanation">
            {chart === "balance" ? (
              <p>
                <strong>Balance Pay-off Chart:</strong> Outstanding balance if
                you stay (black) versus transfer (green).
              </p>
            ) : (
              <p>
                <strong>Cost Comparison Chart:</strong> Total interest & fees
                staying vs transferring.
              </p>
            )}
          </div>

          {/* charts */}
          {chart === "balance" ? (
            <div className="chart-container">
              <ResponsiveContainer width="95%" height={240}>
                <AreaChart
                  data={results.balSeries}
                  margin={{ top: 20, right: 10, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="m" tickFormatter={(m) => `M${m}`} />
                  <YAxis
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                    tick={{ fill: "#272b2a", fontSize: 12 }}
                  />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="old"
                    name="Stay"
                    stroke="#272a2b"
                    fill="#272a2b"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="new"
                    name="Transfer"
                    stroke="#108e66"
                    fill="#108e66"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="95%" height={220}>
                <BarChart
                  data={results.barSeries}
                  margin={{ top: 20, right: 10, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                    tick={{ fill: "#272b2a", fontSize: 12 }}
                  />
                  <RechartsTooltip />
                  <Bar dataKey="value">
                    {results.barSeries.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* disclaimer */}
          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                Future rate resets, pre-payment penalties and GST on fees can
                alter the savings.
              </li>
              <li>Verify numbers with both current & new lenders.</li>
              <li>
                Calculator assumes rates remain unchanged for simplicity; real
                savings may vary.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ───────── Styles ───────── */}
      <style jsx>{`
        .container {
          padding: 1.25rem 1rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272b2a;
          max-width: 1200px;
          margin: 0 auto;
        }
        .top-nav {
          margin-bottom: 1rem;
        }
        .back-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .title {
          text-align: center;
          font-size: 2.3rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }
        .description {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .meaning-card {
          background: #fcfffe;
          border-left: 4px solid #108e66;
          padding: 0.8rem 1rem;
          border-radius: 6px;
          margin-bottom: 0.9rem;
          font-size: 0.95rem;
        }
        .card {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.3rem 0 0.8rem;
        }
        .input-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: 1.5rem;
          row-gap: 1.1rem;
          margin-bottom: 1.2rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
        }
        .input-label {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        input,
        select {
          padding: 0.5rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          font-size: 1rem;
          margin-top: 0.35rem;
        }
        .words {
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .error {
          color: red;
          font-size: 0.8rem;
        }
        .calculate-button {
          width: 100%;
          margin-top: 1.3rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
        }
        .summary-card {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.65rem;
          background: #fcfffe;
          border: 1px solid #272b2a;
          border-radius: 8px;
          padding: 0.9rem 1rem;
          margin-bottom: 0.9rem;
        }
        .summary-item {
          font-size: 1rem;
        }
        .toggle {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        .toggle button {
          background: #ffffff;
          border: 1px solid #108e66;
          padding: 0.4rem 0.9rem;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-explanation {
          background: #fcfffe;
          border-left: 4px solid #108e66;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .chart-container {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }
        .disclaimer {
          background: #fcfffe;
          border: 1px solid #272b2a;
          border-radius: 4px;
          padding: 0.9rem 1rem;
          font-size: 0.9rem;
          margin-top: 1.2rem;
        }
        .disclaimer ul {
          margin: 0;
          padding-left: 1.3rem;
        }
        .disclaimer li {
          margin-bottom: 0.5rem;
        }

        /* ───────── Mobile tweaks ───────── */
        @media (max-width: 768px) {
          .container {
            padding: 1rem 0.6rem;
          }
          .input-group {
            grid-template-columns: 1fr;
          }
          .summary-card {
            grid-template-columns: 1fr;
          }
          .toggle {
            flex-direction: column;
            gap: 0.4rem;
          }
          .toggle button {
            width: 100%;
          }
          .chart-container {
            margin: 0 -0.4rem 1rem;
          }
        }
      `}</style>

      {/* hide number spinners */}
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

export default BalanceTransfer;
