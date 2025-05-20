// File: /app/tools/gst-calculator/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ---------------- Tooltip Icon ----------------
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
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #108e66;
          color: #fcfffe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
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

// ---------------- Number→Words Converter ----------------
const toWords = (n: number): string => {
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

export default function GstCalculator() {
  // Inputs
  const [amount, setAmount] = useState("");
  const [isInclusive, setIsInclusive] = useState(false);
  const [gstRate, setGstRate] = useState("18");
  const [supplyType, setSupplyType] = useState<"Intra" | "Inter">("Intra");
  const [error, setError] = useState<string | null>(null);

  // Results
  const [taxable, setTaxable] = useState(0);
  const [gst, setGst] = useState(0);
  const [gross, setGross] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [calculated, setCalculated] = useState(false);

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const calculate = () => {
    setError(null);
    const A = parseFloat(amount);
    const R = parseFloat(gstRate) / 100;
    if (isNaN(A) || A <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    let T: number, G: number;
    if (isInclusive) {
      T = A / (1 + R);
      G = A - T;
    } else {
      T = A;
      G = T * R;
    }
    const grossAmount = T + G;
    let c = 0,
      s = 0,
      i = 0;
    if (supplyType === "Intra") {
      c = G / 2;
      s = G / 2;
    } else {
      i = G;
    }
    setTaxable(Math.round(T));
    setGst(Math.round(G));
    setGross(Math.round(grossAmount));
    setCgst(Math.round(c));
    setSgst(Math.round(s));
    setIgst(Math.round(i));
    setCalculated(true);
  };

  const pieData = [
    { name: "Base", value: taxable },
    { name: "GST", value: gst },
  ];
  const pieColors = ["#272A2B", "#108E66"];

  const barData = [
    { name: "CGST", value: cgst },
    { name: "SGST", value: sgst },
    { name: "IGST", value: igst },
  ];

  return (
    <main className="container">
      {/* Back Link */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      {/* Header */}
      <h1 className="title">How Much GST Is in (or on) My Price?</h1>
      <p className="description">
        Add or remove GST from any price & see CGST+SGST (intra-state) or IGST
        (inter-state) breakdown.
      </p>
      <div className="explanation">
  <p>
    <strong>GST Calculator:</strong> This calculator helps you calculate the <strong>Goods and Services Tax (GST)</strong> on your products or services based on the <strong>applicable GST rate</strong> in your region. It allows you to estimate both <strong>GST payable</strong> and <strong>GST input credits</strong>.
  </p>
  <p>
    By entering the <strong>product/service price</strong> and selecting the <strong>GST rate</strong>, the calculator computes the <strong>total GST amount</strong> for your transaction. It also helps you understand how much GST you need to collect from customers and pay to the government.
  </p>
</div>

      {/* Input Card */}
      <section className="card">
        <h2 className="section-title">Enter Details</h2>
        <div className="grid">
          {/* Amount */}
          <div className="field">
            <label>
              Amount (₹)
              <TooltipIcon text="Either base price or GST-inclusive price" />
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1180"
            />
            {amount && <div className="converter">{toWords(+amount)} Rupees</div>}
          </div>

          {/* Inclusive / Exclusive */}
          <div className="field">
            <label>
              Price Type
              <TooltipIcon text="Inclusive if GST already in amount" />
            </label>
            <div className="radio-row">
              <label>
                <input
                  type="radio"
                  checked={!isInclusive}
                  onChange={() => setIsInclusive(false)}
                />
                Exclusive
              </label>
              <label>
                <input
                  type="radio"
                  checked={isInclusive}
                  onChange={() => setIsInclusive(true)}
                />
                Inclusive
              </label>
            </div>
          </div>

          {/* GST Rate */}
          <div className="field">
            <label>
              GST Rate (%)
              <TooltipIcon text="Choose from 0,5,12,18,28%" />
            </label>
            <select
              aria-label="GST Rate"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
            >
              {["0", "5", "12", "18", "28"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Supply Type */}
          <div className="field">
            <label>
              Supply Type
              <TooltipIcon text="Intra-state → CGST+SGST; Inter-state → IGST" />
            </label>
            <div className="radio-row">
              <label>
                <input
                  type="radio"
                  checked={supplyType === "Intra"}
                  onChange={() => setSupplyType("Intra")}
                />
                Intra
              </label>
              <label>
                <input
                  type="radio"
                  checked={supplyType === "Inter"}
                  onChange={() => setSupplyType("Inter")}
                />
                Inter
              </label>
            </div>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn" onClick={calculate}>
          Calculate GST
        </button>
      </section>

      {/* Results */}
      {calculated && (
        <>
          <section className="card results">
            <h2 className="section-title">Results</h2>

            <table className="result-table">
              <tbody>
                <tr>
                  <th>Taxable Value</th>
                  <td>₹{fmt(taxable)}</td>
                </tr>
                <tr>
                  <th>Total GST</th>
                  <td>₹{fmt(gst)}</td>
                </tr>
                <tr>
                  <th>CGST @{+gstRate / 2}%</th>
                  <td>₹{fmt(cgst)}</td>
                </tr>
                <tr>
                  <th>SGST @{+gstRate / 2}%</th>
                  <td>₹{fmt(sgst)}</td>
                </tr>
                <tr>
                  <th>IGST @{gstRate}%</th>
                  <td>₹{fmt(igst)}</td>
                </tr>
                <tr>
                  <th>Invoice Total</th>
                  <td>₹{fmt(gross)}</td>
                </tr>
                <tr>
                  <th>Effective GST %</th>
                  <td>{((gst / taxable) * 100).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>

            <div className="chart-toggle">
              <button
                className={chartType === "pie" ? "active" : ""}
                onClick={() => setChartType("pie")}
              >
                Pie Chart
              </button>
              <button
                className={chartType === "bar" ? "active" : ""}
                onClick={() => setChartType("bar")}
              >
                Bar Chart
              </button>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                {chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={pieColors[i]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `₹${fmt(v as number)}`} />
                    <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                    <Legend />
                    <Bar dataKey="value" fill="#108e66" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            <p className="insight">
              {supplyType === "Intra"
                ? `At ${gstRate}% GST you pay ₹${fmt(gst)} total (₹${fmt(
                    cgst
                  )} CGST + ₹${fmt(sgst)} SGST).`
                : `IGST applies: charge ₹${fmt(igst)} at ${gstRate}%.`}
            </p>
          </section>

          <section className="disc">
            <h2>Important Considerations</h2>
            <ul>
              <li>All values rounded to the nearest rupee.</li>
              <li>
                Inclusive price backed out by <code>A / (1 + R)</code>.
              </li>
              <li>CGST/SGST split only for intra-state supplies.</li>
              <li>IGST only for inter-state supplies.</li>
              <li>Minor rounding differences may occur on small amounts.</li>
            </ul>
          </section>
        </>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
          margin: auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: Poppins, sans-serif;
        }
        .top-nav {
          margin-bottom: 1.5rem;
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
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1.5rem;
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
        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .field label {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          display: block;
          font-weight: 500;
        }
        .field input,
        .field select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }
        .radio-row {
          display: flex;
          gap: 1rem;
          margin-top: 0.25rem;
        }
        .converter {
          font-size: 0.85rem;
          margin-top: 0.25rem;
          color: #444;
        }
        .error {
          color: red;
          text-align: center;
          margin: 0.5rem 0;
        }
        .btn {
          display: block;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        .results .result-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        .result-table th,
        .result-table td {
          padding: 0.6rem;
          border: 1px solid #ddd;
          text-align: left;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
        }
        .chart-toggle button {
          padding: 0.4rem 0.8rem;
          border: 1px solid #ccc;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          height: 280px;
          margin-bottom: 1rem;
        }
        .insight {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          font-weight: 500;
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
