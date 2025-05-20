// File: /app/tools/emi-vs-lump/page.tsx
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
  ResponsiveContainer,
  Legend,
} from "recharts";

// Tooltip icon aligned with label
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
          vertical-align: middle;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.7rem;
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

// Figures → Words (Indian)
const numberToWords = (n: number): string => {
  if (isNaN(n)) return "";
  const num = Math.round(Math.abs(n));
  if (num === 0) return "Zero ";
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
  return helper(num) + "";
};

// Round to nearest ₹100
const round100 = (x: number) => Math.round(x / 100) * 100;

export default function EmiVsLumpCalculator() {
  // Inputs
  const [price, setPrice] = useState("50000");
  const [discount, setDiscount] = useState("0");
  const [downPay, setDownPay] = useState("0");
  const [interest, setInterest] = useState("12");
  const [months, setMonths] = useState("12");
  const [procFee, setProcFee] = useState("0");
  const [invReturn, setInvReturn] = useState("6");
  const [errors, setErrors] = useState("");
  const [results, setResults] = useState<{
    netLump: number;
    emi: number;
    totalEmi: number;
    investable: number;
    extraEarn: number;
    netCostEmi: number;
  } | null>(null);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Validation
  const validate = () => {
    if (+price <= 0) return "Price must be positive.";
    if (+discount < 0 || +discount > +price) return "Invalid discount.";
    if (+downPay < 0 || +downPay > +price) return "Invalid down-payment.";
    if (+interest < 0) return "Interest cannot be negative.";
    if (+months <= 0) return "Months must be ≥1.";
    if (+procFee < 0) return "Fee cannot be negative.";
    if (+invReturn < 0) return "Return cannot be negative.";
    return "";
  };

  // Calculation
  const calculate = () => {
    const err = validate();
    if (err) {
      setErrors(err);
      return;
    }
    setErrors("");
    const P = +price,
      D = +discount,
      DP = +downPay;
    const r = +interest / 12 / 100;
    const m = +months,
      F = +procFee,
      g = +invReturn / 100;
    const netLump = round100(P - D);
    const principal = P - DP;
    const emiRaw =
      (principal * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
    const emi = +emiRaw.toFixed(2);
    const totalEmi = round100(emi * m + DP + F);
    const investable = round100(netLump - DP - F);
    const futureValue = investable * Math.pow(1 + g, m / 12);
    const extraEarn = round100(futureValue - investable);
    const netCostEmi = round100(totalEmi - extraEarn);
    setResults({ netLump, emi, totalEmi, investable, extraEarn, netCostEmi });
  };

  // Build chart & cashflow data
  const lineData = results
    ? Array.from({ length: +months + 1 }, (_, i) => {
        const cumEmi = i === 0 ? +downPay : +downPay + results.emi * i;
        return {
          month: i,
          "EMI Path": cumEmi,
          "Lump-Sum": results.netLump,
        };
      })
    : [];

  const barData = results
    ? [
        { name: "Lump-Sum", cost: results.netLump },
        { name: "EMI Path", cost: results.netCostEmi },
      ]
    : [];

  // Actionable Insights
  const threshold = (+invReturn + (+discount / +price) * 100).toFixed(2);
  const diff = results ? results.netCostEmi - results.netLump : 0;
  const negotiate = round100(Math.abs(diff));
  const perMonth = results ? Math.round(results.emi) : 0;

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn">Back to Dashboard</button>
        </Link>
      </div>
      <h1 className="title">Is EMI Cheaper Than Paying Upfront?</h1>
      <p className="desc">
        Compare your total outgo on EMI vs. a one-time payment after interest,
        fees, and opportunity cost.
      </p>
      <div className="explanation">
        <p>
          This tool helps you compare the <strong>total cost</strong> of buying
          an item through an <strong>EMI (Equated Monthly Installment)</strong>{" "}
          plan versus making a <strong>one-time payment</strong>.
        </p>
        <p>
          It factors in <strong>interest rates</strong>, <strong>tenure</strong>
          , and any <strong>processing fees</strong> associated with EMI to
          calculate the final payout. The goal is to help you decide if
          spreading payments is worth the extra cost or if a lump-sum purchase
          saves more in the long run.
        </p>
        <p>
          Use this when evaluating gadgets, appliances, vehicles, or any other
          high-value items offered with financing options.
        </p>
      </div>

      {errors && <p className="error">{errors}</p>}

      <section className="card">
        <h2>Product Details</h2>
        <div className="grid">
          <label>
            <div>
              {" "}
              Product Price (₹) <TooltipIcon text="Sticker price incl. GST" />
            </div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <small>{`${numberToWords(+price)} Rupees `}</small>
          </label>
          <label>
            <div>
              {" "}
              Cash Discount (₹){" "}
              <TooltipIcon text="Upfront discount or cashback" />
            </div>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <small>{`${numberToWords(+discount)} Rupees`}</small>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>EMI Details</h2>
        <div className="grid">
          <label>
            <div>
              {" "}
              Down-Payment (₹) <TooltipIcon text="Paid today before EMIs" />{" "}
            </div>
            <input
              type="number"
              value={downPay}
              onChange={(e) => setDownPay(e.target.value)}
            />
            <small>{`${numberToWords(+downPay)} Rupees `}</small>
          </label>
          <label>
            <div>
              {" "}
              Interest Rate (%) <TooltipIcon text="Annual reducing rate" />
            </div>
            <input
              type="number"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
            <small>{`${numberToWords(+interest)} %`}</small>
          </label>
          <label>
            <div>
              {" "}
              Tenure (Months) <TooltipIcon text="Number of instalments" />
            </div>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
            <small>{numberToWords(+months)} Months</small>
          </label>
          <label>
            <div>
              {" "}
              Processing Fee (₹) <TooltipIcon text="One-time lender/card fee" />{" "}
            </div>
            <input
              type="number"
              value={procFee}
              onChange={(e) => setProcFee(e.target.value)}
            />
            <small>{`${numberToWords(+procFee)} Rupees`}</small>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Opportunity Cost</h2>
        <div className="grid">
          <label>
            <div>
              {" "}
              Invest. Return (%){" "}
              <TooltipIcon text="Annual return if lump-sum invested" />{" "}
            </div>
            <input
              type="number"
              value={invReturn}
              onChange={(e) => setInvReturn(e.target.value)}
            />
            <small>{`${numberToWords(+invReturn)} %`}</small>
          </label>
        </div>
      </section>

      <button className="calc-btn" onClick={calculate}>
        Calculate
      </button>

      {results && (
        <section className="card results">
          <h2>Results</h2>
          <div className="outputs">
            <div>
              <strong>Lump-Sum Cost</strong>
              <br />₹{results.netLump.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total EMI Cost</strong>
              <br />₹{results.totalEmi.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Extra Earnings</strong>
              <br />₹{results.extraEarn.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Net EMI Cost</strong>
              <br />₹{results.netCostEmi.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Cheaper Option</strong>
              <br />
              {results.netCostEmi < results.netLump ? "EMI Path" : "Lump-Sum"}
            </div>
          </div>

          <div className="chart-toggle">
            <button
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              Cash-Flow
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Cost Compare
            </button>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "line" ? (
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Month",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      `₹${(v as number).toLocaleString("en-IN")}`
                    }
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend verticalAlign="top" />
                  <Line
                    type="monotone"
                    dataKey="EMI Path"
                    stroke="#108E66"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Lump-Sum"
                    stroke="#272A2B"
                    dot={false}
                  />
                </LineChart>
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
                  <Bar dataKey="cost" fill="#108E66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3>EMI Cash-Flow Table</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>EMI (₹)</th>
                  <th>Cumulative Paid</th>
                  <th>Investable Balance</th>
                </tr>
              </thead>
              <tbody>
                {lineData.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>
                      {row.month === 0
                        ? "—"
                        : `₹${results.emi.toLocaleString("en-IN")}`}
                    </td>
                    <td>₹{row["EMI Path"].toLocaleString("en-IN")}</td>
                    <td>
                      ₹
                      {(row.month === 0
                        ? results.investable
                        : Math.max(
                            0,
                            results.investable - results.emi * row.month
                          )
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="disc">
          <h3>Important Considerations</h3>

            <li>
              Break-even interest ≈ {threshold}%; above this EMI becomes
              costlier.
            </li>
            <li>
              Negotiation Tip: Reduce processing fee by ₹{negotiate} to level
              costs.
            </li>
            <li>
              Monthly EMI = ₹{perMonth.toLocaleString("en-IN")}—plan your budget
              accordingly.
            </li>
          </ul>
        </section>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
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
          font-weight: 500;
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
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        h2 {
          font-size: 1.25rem;
          font-weight: 600;
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
          font-weight: 500;
        }
        input {
          margin-top: 0.25rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        select {
          margin-top: 0.25rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        small {
          margin-top: 0.25rem;
          color: #444;
          font-size: 0.85rem;
        }
        .calc-btn {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 2rem;
        }
        .results .outputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .results .outputs > div {
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
          background: transparent;
          cursor: pointer;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
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
       
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
