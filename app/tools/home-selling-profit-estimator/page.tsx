// File: /app/tools/home-selling-profit-estimator/page.tsx
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

/* ─── Helpers & Data ────────────────────────────────────────────── */
const CII_TABLE: Record<string, number> = {
  "2004-05": 113,
  "2005-06": 117,
  "2006-07": 122,
  "2007-08": 129,
  "2008-09": 137,
  "2009-10": 148,
  "2010-11": 167,
  "2011-12": 184,
  "2012-13": 200,
  "2013-14": 220,
  "2014-15": 240,
  "2015-16": 254,
  "2016-17": 264,
  "2017-18": 272,
  "2018-19": 280,
  "2019-20": 289,
  "2020-21": 301,
  "2021-22": 317,
  "2022-23": 331,
  "2023-24": 348,
};
const getCII = (fy: string) => CII_TABLE[fy] || 1;

const numberToWords = (num: number) => {
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
  const h = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + h(n % 100) : "");
    if (n < 100000) return h(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + h(n % 1000) : "");
    if (n < 10000000) return h(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + h(n % 100000) : "");
    return h(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + h(n % 10000000) : "");
  };
  return h(Math.round(Math.abs(num)));
};
const numberToWordsPercent = (v: number) =>
  `${numberToWords(Math.round(v))} percent`;

/* ─── Tooltip Icon ─────────────────────────────────────────────── */
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
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #108e66;
          color: #fcfffe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
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

/* ─── Main Component ───────────────────────────────────────────── */
export default function HomeSellingProfitEstimator() {
  /* form state */
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseYear, setPurchaseYear] = useState("2017-18");
  const [improvementCost, setImprovementCost] = useState("");
  const [improvementYear, setImprovementYear] = useState("2017-18");
  const [salePrice, setSalePrice] = useState("");
  const [saleYear, setSaleYear] = useState("2023-24");
  const [transferExpenses, setTransferExpenses] = useState("");
  const [ltcgTaxRate, setLtcgTaxRate] = useState("20");
  const [error, setError] = useState<string | null>(null);

  /* results */
  const [indexedPurchase, setIndexedPurchase] = useState(0);
  const [indexedImprove, setIndexedImprove] = useState(0);
  const [totalIndexedCost, setTotalIndexedCost] = useState(0);
  const [grossGain, setGrossGain] = useState(0);
  const [ltcgTax, setLtcgTax] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [calculated, setCalculated] = useState(false);

  /* chart data */
  const [chartMode, setChartMode] = useState<"pie" | "bar">("pie");
  const [pieData, setPieData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);

  const fyOptions = Object.keys(CII_TABLE);
  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  /* ── calculation ─────────────────────────────────────────── */
  const handleCalculate = () => {
    setError(null);
    const Pp = parseFloat(purchasePrice);
    const Ic = parseFloat(improvementCost) || 0;
    const Sp = parseFloat(salePrice);
    const Te = parseFloat(transferExpenses) || 0;
    const Tr = parseFloat(ltcgTaxRate) / 100;

    if (!Pp || !Sp) {
      return setError("Please enter valid Purchase and Sale prices.");
    }

    const ciiP = getCII(purchaseYear),
      ciiI = getCII(improvementYear),
      ciiS = getCII(saleYear);

    const ip = Math.round(Pp * (ciiS / ciiP));
    const ii = Math.round(Ic * (ciiS / ciiI));
    const tic = ip + ii;
    const gg = Math.round(Sp - tic - Te);
    const tax = Math.round(Math.max(0, gg) * Tr);
    const np = gg - tax;

    setIndexedPurchase(ip);
    setIndexedImprove(ii);
    setTotalIndexedCost(tic);
    setGrossGain(gg);
    setLtcgTax(tax);
    setNetProfit(np);
    setCalculated(true);

    /* chart datasets */
    setPieData([
      { name: "Indexed Cost", value: tic, fill: "#A8D5BA" },
      { name: "Transfer Exp.", value: Te, fill: "#6ABF7B" },
      { name: "LTCG Tax", value: tax, fill: "#108E66" },
      { name: "Net Profit", value: np > 0 ? np : 0, fill: "#355C7D" },
    ]);
    setBarData([
      { label: "Sale Price", value: Sp, fill: "#108E66" },
      { label: "Indexed Cost", value: tic, fill: "#A8D5BA" },
      { label: "Transfer Exp.", value: Te, fill: "#6ABF7B" },
      { label: "LTCG Tax", value: tax, fill: "#F67280" },
      { label: "Net Profit", value: np, fill: "#355C7D" },
    ]);
  };

  /* ── UI ───────────────────────────────────────────────────── */
  return (
    <main className="container">
      {/* Top Nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      {/* Header */}
      <h1 className="title">What’s My Home Selling Profit?</h1>
      <p className="description">
        Estimate your net profit after indexation, improvements, expenses and LTCG tax.
      </p>
      <div className="explanation">
        <p>
          <strong>Home Selling Profit Estimator:</strong> Quickly gauge the{" "}
          <strong>net amount</strong> you’ll pocket once your property sells. We
          factor <strong>indexed cost inflation (CII)</strong>, allowable improvement
          indexation, <strong>transfer expenses</strong>, and long-term capital gains
          tax. Perfect for deciding how to reinvest or spend your proceeds.
        </p>
      </div>

      {/* Form */}
      <section className="card form-card">
        <div className="grid">
          {/* Purchase */}
          <div>
            <label>
              Purchase Price (₹) <TooltipIcon text="Original price paid" />
            </label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="5 000 000"
            />
            {purchasePrice && (
              <small className="converter">
                {numberToWords(+purchasePrice)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Purchase FY <TooltipIcon text="Financial year bought" />
            </label>
            <select
              value={purchaseYear}
              onChange={(e) => setPurchaseYear(e.target.value)}
            >
              {fyOptions.map((fy) => (
                <option key={fy}>{fy}</option>
              ))}
            </select>
          </div>

          {/* Improvement */}
          <div>
            <label>
              Improvement Cost (₹){" "}
              <TooltipIcon text="Capital improvements only" />
            </label>
            <input
              type="number"
              value={improvementCost}
              onChange={(e) => setImprovementCost(e.target.value)}
              placeholder="500 000"
            />
            {improvementCost && (
              <small className="converter">
                {numberToWords(+improvementCost)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Improvement FY <TooltipIcon text="FY of improvement spend" />
            </label>
            <select
              value={improvementYear}
              onChange={(e) => setImprovementYear(e.target.value)}
            >
              {fyOptions.map((fy) => (
                <option key={fy}>{fy}</option>
              ))}
            </select>
          </div>

          {/* Sale */}
          <div>
            <label>
              Sale Price (₹) <TooltipIcon text="Final agreement value" />
            </label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="12 000 000"
            />
            {salePrice && (
              <small className="converter">
                {numberToWords(+salePrice)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Sale FY <TooltipIcon text="FY in which registration happens" />
            </label>
            <select
              value={saleYear}
              onChange={(e) => setSaleYear(e.target.value)}
            >
              {fyOptions.map((fy) => (
                <option key={fy}>{fy}</option>
              ))}
            </select>
          </div>

          {/* Expenses & Tax */}
          <div>
            <label>
              Transfer Expenses (₹){" "}
              <TooltipIcon text="Brokerage, stamp duty…" />
            </label>
            <input
              type="number"
              value={transferExpenses}
              onChange={(e) => setTransferExpenses(e.target.value)}
              placeholder="300 000"
            />
            {transferExpenses && (
              <small className="converter">
                {numberToWords(+transferExpenses)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              LTCG Tax Rate (%) <TooltipIcon text="Normally 20 %" />
            </label>
            <input
              type="number"
              value={ltcgTaxRate}
              onChange={(e) => setLtcgTaxRate(e.target.value)}
              placeholder="20"
            />
            <small className="converter">
              {numberToWordsPercent(+ltcgTaxRate)}
            </small>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="calculate-button" onClick={handleCalculate}>
          Estimate My Profit
        </button>
      </section>

      {/* Results */}
      {calculated && (
        <>
          <section className="card results-card">
            <h2 className="section-title">Results</h2>
            <div className="summary-grid">
              {[
                { label: "Indexed Purchase Cost", value: indexedPurchase },
                { label: "Indexed Improvement", value: indexedImprove },
                { label: "Total Indexed Cost", value: totalIndexedCost },
                { label: "Gross Gain", value: grossGain },
                { label: "LTCG Tax", value: ltcgTax },
                { label: "Net Profit", value: netProfit },
              ].map(({ label, value }) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <br />₹{fmt(value)}
                </div>
              ))}
            </div>
          </section>

          {/* ── Charts (toggle) ───────────────────────────── */}
          <section className="card">
            <div className="chart-toggle">
              <button
                className={chartMode === "pie" ? "active" : ""}
                onClick={() => setChartMode("pie")}
              >
                Pie
              </button>
              <button
                className={chartMode === "bar" ? "active" : ""}
                onClick={() => setChartMode("bar")}
              >
                Bar
              </button>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={250}>
                {chartMode === "pie" ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(v: number) => `₹${fmt(v)}`}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `₹${fmt(v as number)}`} />
                    <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                    <Legend />
                    <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                      {barData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </section>

          {/* Considerations */}
          <section className="disc">
            <h2>Important considerations</h2>
            <ul>
              <li>Indexation uses CII values; keep FY selections updated.</li>
              <li>Only capital improvements qualify for indexation.</li>
              <li>Include all transfer expenses: brokerage, legal, stamp duty.</li>
              <li>Use Section 54 reinvestment to save further tax.</li>
              <li>Update CII table as new years become available.</li>
            </ul>
          </section>
        </>
      )}

      {/* Styles */}
      <style jsx>{`
        .container {
          width: 100%;
          margin: auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          text-align: left;
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
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .card {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 1.5rem;
          padding: 1.5rem;
        }
        .form-card .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        input,
        select {
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
          margin-top: 0.5rem;
        }
        .calculate-button {
          display: block;
          width: 100%;
          margin-top: 1rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .results-card .section-title {
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .summary-grid > div {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
        }
        /* Chart toggle */
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        .chart-toggle button {
          padding: 0.4rem 1.1rem;
          border: 1px solid #108e66;
          background: #fcfffe;
          color: #108e66;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .chart-toggle button:hover,
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
        }
        .chart-wrap {
          height: 260px;
          width: 100%;
        }
        /* DISC */
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
          line-height: 1.5;
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
