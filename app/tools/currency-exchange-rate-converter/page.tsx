/*
  Place this file at: /app/tools/currencyExchangeConverter/page.tsx
  ---------------------------------------------------------------
  Currency Exchange Rate Converter
  • Next.js 13 app router ‑ client component (TypeScript)
  • Mirrors the custom CSS‑in‑JS UI of the Buy‑vs‑Rent calculator
  • Poppins font + brand colours (#108E66, #272A2B, #FCFFFE)
  • Currency dropdown shows flag + full name + ISO code
*/

"use client";

import React, { useState } from "react";
import Link from "next/link";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

/**************** Tooltip ****************/
const Tooltip: React.FC<{ text: string }> = ({ text }) => {
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
          margin-left: 6px;
          cursor: pointer;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          font-weight: bold;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tooltiptext {
          width: 220px;
          background: #108e66;
          color: #fcfffe;
          border-radius: 4px;
          padding: 6px 8px;
          position: absolute;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          line-height: 1.2;
          box-shadow: 0 2px 5px rgba(39, 43, 42, 0.2);
          z-index: 1000;
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

/************** Number‑to‑Words **************/
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

/**************** Currency Data ****************/
interface CurrencyOption {
  code: string;
  name: string;

}
const CURRENCIES: CurrencyOption[] = [
  { code: "INR", name: "Indian Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
];

/**************** Main Component ****************/
const CurrencyExchangeConverter: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [rate, setRate] = useState<number | null>(null);
  const [converted, setConverted] = useState<number | null>(null);
  const [updated, setUpdated] = useState("");
//   const [chart, setChart] = useState<"bar" | "pie">("bar");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatNumber = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const fetchRates = async () => {
    if (!amount || isNaN(+amount) || +amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data = await res.json();
      const r = data.rates[to];
      setRate(+r.toFixed(6));
      setConverted(Math.round(+amount * r));
      setUpdated(new Date(data.time_last_updated * 1000).toLocaleString());
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

//   const chartData = [
//     { name: from, value: +amount || 0 },
//     { name: to, value: converted || 0 },
//   ];

  return (
    <div className="container">
      {/* Top Nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>
      <h1 className="title">How Much Is My Money Worth In Another Currency?</h1>
      <p className="description">
        Convert amounts instantly with live exchange rates.
      </p>
      <div className="explanation">
  <p>
    <strong>Currency Exchange Rate Converter:</strong> This calculator allows you to quickly convert between
    <strong>two different currencies</strong> using the <strong>latest exchange rate</strong>. It’s ideal for
    <strong>travel planning</strong>, <strong>international shopping</strong>, or <strong>global business transactions</strong>.
  </p>
  <p>
    By selecting the <strong>source and target currencies</strong> and entering the <strong>amount</strong>, the
    calculator instantly provides the <strong>converted value</strong>. This helps ensure you make
    <strong>accurate and up-to-date financial decisions</strong> across borders.
  </p>
</div>


      {/* Input card */}
      <div className="form-container">
        <h2 className="section-title">Conversion Details</h2>
        <div className="input-group">
          <label>
            <span className="input-label">
              Amount <Tooltip text="Enter amount to convert" />
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 1000"
            />
            {amount && (
              <span className="converter">
                {numberToWords(parseFloat(amount))} {from}
              </span>
            )}
            {error && <span className="error">{error}</span>}
          </label>
          <label>
            <span className="input-label">
              From Currency <Tooltip text="Currency you have" />
            </span>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {CURRENCIES.map((o) => (
                <option
                  key={o.code}
                  value={o.code}
                >{` ${o.name} (${o.code})`}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="input-label">
              To Currency <Tooltip text="Currency you want" />
            </span>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {CURRENCIES.map((o) => (
                <option
                  key={o.code}
                  value={o.code}
                >{` ${o.name} (${o.code})`}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          className="calculate-button"
          onClick={fetchRates}
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert Now"}
        </button>
      </div>

      {/* Results */}
      {converted !== null && (
        <div className="results-container">
          <h2 className="results-title">Conversion Result</h2>
          <div className="decision-banner">
            <h3>
              {formatNumber(+amount)} {from} → {formatNumber(converted)} {to}
            </h3>
          </div>

          <div className="comparison-grid">
            <div className="comparison-column">
              <h3 className="comparison-title">Details</h3>
              <div className="result-card">
                <div className="result-item">
                  <div className="result-label">Exchange Rate</div>
                  <div className="result-value">
                    1 {from} = {rate} {to}
                  </div>
                </div>
                <div className="result-item">
                  <div className="result-label">Last Updated</div>
                  <div className="result-value">{updated}</div>
                </div>
                <div className="result-item highlight">
                  <div className="result-label">Converted Amount</div>
                  <div className="result-value">
                    {to} {formatNumber(converted)}
                  </div>
                  <div className="result-words">
                    {numberToWords(converted)} {to}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {/* <div className="chart-container">
            <button
              className="back-button"
              style={{ marginBottom: "1rem" }}
              onClick={() => setChart(chart === "bar" ? "pie" : "bar")}
            >
              Switch to {chart === "bar" ? "Pie" : "Bar"} Chart
            </button>
            <ResponsiveContainer width="90%" height={300}>
              {chart === "bar" ? (
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(v: any) => formatNumber(v)} />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#108e66" : "#272B2A"} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: any) => formatNumber(v)} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div> */}

          {/* CTA */}
          {/* <div className="wealth-difference">
            <p>Need personalised guidance on currency transfers?</p>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              className="back-button"
              style={{ marginTop: "0.5rem" }}
            >
              Get In Touch on WhatsApp
            </a>
          </div> */}
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272b2a;
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
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          font-size: 1.2rem;
          margin-bottom: 2rem;
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
        .form-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
        }
        .input-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 1rem;
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
          height: 38px;
          font-size: 1rem;
          color: #272b2a;
          background: #fcfffe;
        }
        .converter {
          font-size: 0.9rem;
          color: #272b2a;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }
        .calculate-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
          margin-top: 1rem;
        }
        .calculate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .results-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.1);
          margin-bottom: 2rem;
        }
        .results-title {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .decision-banner {
          background: #108E66;
          color: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .comparison-column {
          background: #fcfffe;
          border: 1px solid #272b2a;
          border-radius: 8px;
          overflow: hidden;
        }
        .comparison-title {
          margin: 0;
          padding: 0.75rem;
          text-align: center;
          font-size: 1.1rem;
          color: #fcfffe;
          background: #108e66;
        }
        .result-card {
          padding: 1rem;
        }
        .result-item {
          padding: 0.5rem 0;
          border-bottom: 1px solid #272b2a;
        }
        .result-item.highlight {
          border: 1px solid #108e66;
          border-radius: 4px;
          margin-top: 0.5rem;
          background: #fcfffe;
          padding: 0.75rem;
        }
        .result-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .result-value {
          font-size: 1.2rem;
          color: #272b2a;
        }
        .result-words {
          font-size: 0.8rem;
          color: #272b2a;
        }
        .chart-container {
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .wealth-difference {
          background: #fcfffe;
          padding: 1rem;
          border: 1px solid #108e66;
          border-radius: 4px;
          text-align: center;
          font-size: 1.1rem;
        }
        @media (max-width: 768px) {
          .input-group {
            grid-template-columns: 1fr;
          }
          .chart-container {
            margin: 1.5rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CurrencyExchangeConverter;
