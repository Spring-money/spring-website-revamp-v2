/*  /app/tools/stock-returns-calculator/page.tsx
    Stock Returns Calculator — Spring Money Theme
---------------------------------------------------------------- */
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
} from "recharts";

/* ───────── Types ───────── */
interface Inputs {
  purchasePrice: string;
  salePrice: string;
  shares: string;
  purchaseDate: string;
  saleDate: string;
  dividends: string;
}

interface Results {
  totalCost: number;
  totalProceeds: number;
  absReturnValue: number;
  absReturnPct: number;
  cagr: number;
  yearsHeld: number;
  insight: string;
}

/* ───────── Tooltip ───────── */
const Tip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="i">i</span>
      {show && <span className="box">{text}</span>}
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
          background: #fcfffe;
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

/* ───────── Number → Words ───────── */
const words = (n: number): string => {
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

const wordsPercent = (v: number): string => {
  if (!isFinite(v)) return "";
  if (Number.isInteger(v)) return `${words(v)} percent`;
  const int = Math.floor(v);
  const dec = Math.round((v - int) * 10);
  return `${words(int)} point ${words(dec)} percent`;
};

/* ───────── Component ───────── */
const StockReturnsCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: "",
    salePrice: "",
    shares: "",
    purchaseDate: "",
    saleDate: "",
    dividends: "0",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);

  /* input handler */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* validation */
  const ok = (v: string) => v !== "" && !isNaN(+v) && +v >= 0;
  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    ["purchasePrice", "salePrice", "shares"].forEach((k) => {
      if (!ok(inputs[k as keyof Inputs])) e[k as keyof Inputs] = "Required";
    });
    if (!inputs.purchaseDate) e.purchaseDate = "Required";
    if (!inputs.saleDate) e.saleDate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* calculation */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const pp = +inputs.purchasePrice,
      sp = +inputs.salePrice,
      sh = +inputs.shares,
      div = +inputs.dividends;

    const cost = pp * sh;
    const proceeds = sp * sh + div;
    const abs = proceeds - cost;
    const absPct = (abs / cost) * 100;

    const years =
      (new Date(inputs.saleDate).getTime() -
        new Date(inputs.purchaseDate).getTime()) /
      (1000 * 60 * 60 * 24) /
      365;
    const cagr = (Math.pow(proceeds / cost, 1 / years) - 1) * 100;

    setResults({
      totalCost: Math.round(cost),
      totalProceeds: Math.round(proceeds),
      absReturnValue: Math.round(abs),
      absReturnPct: +absPct.toFixed(2),
      cagr: +cagr.toFixed(2),
      yearsHeld: +years.toFixed(2),
      insight: `Your ₹${cost.toLocaleString(
        "en-IN"
      )} became ₹${proceeds.toLocaleString("en-IN")} over ${years.toFixed(
        2
      )} years, a CAGR of ${cagr.toFixed(2)}%.`,
    });
    setTimeout(() => setBusy(false), 300);
  };

  const chartData = results
    ? [
        { name: "Investment", value: results.totalCost },
        { name: "Proceeds", value: results.totalProceeds },
      ]
    : [];

  const conv = (k: keyof Inputs, v: string): string => {
    if (!v) return "";
    const num = +v;
    if (!isFinite(num)) return "";
    switch (k) {
      case "purchasePrice":
      case "salePrice":
      case "dividends":
        return `${words(num)} Rupees`;
      case "shares":
        return `${words(num)} Shares`;
      default:
        return "";
    }
  };

  /* ───────── JSX ───────── */
  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Stock Returns Calculator</h1>
      <p className="sub">
        Compute absolute and annualized returns on your stock investment.
      </p>
      <div className="explanation-box">
  <p>
    <strong>Stock Return Calculator:</strong> This tool helps you calculate the return on investment (ROI) of your stock investments based on the purchase price, current market price, and the number of shares you own.
  </p>
  <p>
    By entering the <strong>initial investment</strong>, the <strong>current price</strong> of the stock, and the <strong>number of shares</strong> you own, this calculator computes your <strong>total returns</strong> and <strong>percentage gain/loss</strong>. It gives you a clearer picture of how your stock portfolio has performed.
  </p>
  <p>
    The <strong>ROI</strong> can help you determine the effectiveness of your investment strategy and make better decisions moving forward. Its essential to track your stock returns regularly to understand how market changes impact your portfolio.
  </p>
</div>

      {/* form */}
      <div className="card">
        <h2 className="sect">Enter Details</h2>
        <div className="grid">
          {[
            [
              "purchasePrice",
              "Purchase Price (₹)",
              "e.g. 250",
              "Price per share when bought",
            ],
            [
              "salePrice",
              "Sale Price (₹)",
              "e.g. 420",
              "Price per share when sold",
            ],
            [
              "shares",
              "Number of Shares",
              "e.g. 100",
              "Total shares purchased",
            ],
            [
              "dividends",
              "Total Dividends (₹) (Optional)",
              "e.g. 2000",
              "Dividends received",
            ],
          ].map(([k, l, ph, tip]) => {
            const id = `input-${k}`;
            return (
              <div className="field" key={k}>
                <label htmlFor={id} className="lbl">
                  {l}
                  <Tip text={tip} />
                </label>
                <input
                  id={id}
                  name={k}
                  type="number"
                  value={inputs[k as keyof Inputs]}
                  onChange={onChange}
                  placeholder={ph}
                />
                <span className="conv">
                  {conv(k as keyof Inputs, inputs[k as keyof Inputs])}
                </span>
                {errors[k as keyof Inputs] && (
                  <span className="err">{errors[k as keyof Inputs]}</span>
                )}
              </div>
            );
          })}

          <div className="field">
            <label htmlFor="pdate" className="lbl">
              Purchase Date
              <Tip text="Date shares were bought" />
            </label>
            <input
              id="pdate"
              name="purchaseDate"
              type="date"
              value={inputs.purchaseDate}
              onChange={onChange}
            />
            {errors.purchaseDate && (
              <span className="err">{errors.purchaseDate}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="sdate" className="lbl">
              Sale Date
              <Tip text="Date shares were sold" />
            </label>
            <input
              id="sdate"
              name="saleDate"
              type="date"
              value={inputs.saleDate}
              onChange={onChange}
            />
            {errors.saleDate && <span className="err">{errors.saleDate}</span>}
          </div>
        </div>

        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate Returns"}
        </button>
      </div>

      {/* results */}
      {results && (
        <div className="card">
          <h2 className="sect">Summary</h2>
          <div className="summary">
            <div>
              <strong>Total Investment</strong>
              <br />₹{results.totalCost.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total Proceeds</strong>
              <br />₹{results.totalProceeds.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Absolute Return</strong>
              <br />₹{results.absReturnValue.toLocaleString("en-IN")} (
              {results.absReturnPct.toFixed(2)}%)
            </div>
            <div>
              <strong>CAGR</strong>
              <br />
              {results.cagr.toFixed(2)}%
            </div>
            <div>
              <strong>Holding Period</strong>
              <br />
              {results.yearsHeld.toFixed(2)} Years
            </div>
          </div>

          <div className="note">{results.insight}</div>

          {/* bar chart */}
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#272a2b" />
                <YAxis
                  stroke="#272a2b"
                  width={90}
                  tickFormatter={(v) => v.toLocaleString("en-IN")}
                />
                <RechartsTooltip
                  formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                />
                <Legend />
                <Bar dataKey="value" fill="#108e66" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              <li>Excludes brokerage, taxes, and transaction costs.</li>
              <li>Compare your CAGR with NIFTY or Sensex for context.</li>
              <li>Past returns do not guarantee future performance.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ───────── Styles ───────── */}
      <style jsx>{`
        .wrap {
          padding: 1.25rem 1rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
          max-width: 100%;
          margin: 0 auto;
        }
        .nav {
          margin-bottom: 1rem;
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
          font-size: 2.4rem;
          font-weight: 700;
          margin: 0.3rem 0;
        }
        .sub {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1.1rem;
        }
          .explanation-box {
          background: #FCFFFE;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
          color: #272B2A;
        }
        .explanation-box p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .sect {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.3rem 0 0.8rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem 1.4rem;
          margin-bottom: 1.1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .lbl {
          font-size: 0.9rem;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
        }
        input {
          padding: 0.55rem 0.6rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
          color: #272a2b;
          width: 100%;
          box-sizing: border-box;
        }
        .conv {
          font-size: 0.9rem;
          color: #272a2b;
          margin-top: 0.25rem;
        }
        .err {
          color: red;
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }
        .calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem 1.2rem;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.8rem;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          padding-left: 0.8rem;
        }
        .note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-bottom: 0.8rem;
        }
        .chart {
          margin-bottom: 1rem;
        }
        .disc {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }
        .disc h4 {
          margin: 0 0 0.5rem;
        }
        .disc ul {
          margin: 0;
          padding-left: 1.4rem;
        }
        .disc li {
          margin-bottom: 0.5rem;
        }
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
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

export default StockReturnsCalculator;
