// File: /app/tools/capital-gains-tax-calculator/page.tsx

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

// Tooltip Component
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
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.6rem;
          font-weight: bold;
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

// Number→Words (Indian)
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

// Fiscal Year helper
const getFiscalYear = (date: Date): number =>
  date.getMonth() >= 3 ? date.getFullYear() + 1 : date.getFullYear();

// CII Table (FY → index)
const CII: Record<number, number> = {
  2001: 100,
  2002: 105,
  2003: 109,
  2004: 113,
  2005: 117,
  2006: 122,
  2007: 129,
  2008: 137,
  2009: 148,
  2010: 153,
  2011: 160,
  2012: 180,
  2013: 200,
  2014: 220,
  2015: 240,
  2016: 254,
  2017: 264,
  2018: 272,
  2019: 289,
  2020: 301,
  2021: 317,
  2022: 331,
  2023: 348,
  2024: 348,
};

// Main Component
export default function CapitalGainsCalculator() {
  // Inputs
  const [assetType, setAssetType] = useState("Real Estate");
  const [buyDate, setBuyDate] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [improvement, setImprovement] = useState("");
  const [sellExpenses, setSellExpenses] = useState("");
  const [sec54, setSec54] = useState("");
  const [sec54ec, setSec54ec] = useState("");
  const [taxSlab, setTaxSlab] = useState("30");
  const [applyCess, setApplyCess] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Results
  const [holdingYears, setHoldingYears] = useState(0);
  const [holdingMonths, setHoldingMonths] = useState(0);
  const [isLTCG, setIsLTCG] = useState(false);
  const [indexedCost, setIndexedCost] = useState(0);
  const [rawGain, setRawGain] = useState(0);
  const [exempt, setExempt] = useState(0);
  const [taxableGain, setTaxableGain] = useState(0);
  const [taxPayable, setTaxPayable] = useState(0);
  const [netProceeds, setNetProceeds] = useState(0);
  const [effRate, setEffRate] = useState(0);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [computed, setComputed] = useState(false);

  // Format helpers
  const fmtNum = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const fmtPct = (n: number) => n.toFixed(2);

  // Calculate
  const calculate = () => {
    setError(null);
    // parse
    const bp = parseFloat(buyPrice) || 0;
    const sp = parseFloat(sellPrice) || 0;
    const imp = parseFloat(improvement) || 0;
    const ex = parseFloat(sellExpenses) || 0;
    const s54 = parseFloat(sec54) || 0;
    const s54ec = parseFloat(sec54ec) || 0;
    if (!buyDate || !sellDate || bp <= 0 || sp <= 0) {
      return setError("Please enter valid dates and amounts.");
    }
    const bd = new Date(buyDate),
      sd = new Date(sellDate);
    if (sd <= bd) return setError("Sale date must be after purchase date.");
    // holding period
    const totalMonths =
      (sd.getFullYear() - bd.getFullYear()) * 12 +
      (sd.getMonth() - bd.getMonth());
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    setHoldingYears(y);
    setHoldingMonths(m);
    // classify
    const lt =
      assetType === "Real Estate" ? totalMonths > 36 : totalMonths > 12;
    setIsLTCG(lt);
    // indexation
    let cost = bp + imp + ex;
    if (
      lt &&
      (assetType === "Real Estate" || assetType === "Mutual Funds (Debt/Gold)")
    ) {
      const fyBuy = getFiscalYear(bd),
        fySell = getFiscalYear(sd);
      const idx =
        (CII[fySell] || CII[fySell - 1]) / (CII[fyBuy] || CII[fyBuy - 1]);
      cost = bp * idx + imp * idx + ex;
      setIndexedCost(Math.round(cost));
    } else {
      setIndexedCost(Math.round(cost));
    }
    // raw gain & exemptions
    const gain = sp - cost;
    setRawGain(Math.round(gain));
    let exm = 0;
    if (assetType === "Real Estate" && lt) {
      exm = Math.min(gain, s54 + s54ec);
    }
    setExempt(Math.round(exm));
    const tg = Math.max(0, gain - exm);
    setTaxableGain(Math.round(tg));
    // tax
    let tax = 0;
    if (lt) {
      if (assetType === "Equity Shares") {
        const tk = Math.max(0, tg - 100000);
        tax = tk * 0.1;
      } else {
        tax = tg * 0.2;
      }
    } else {
      tax = tg * (parseFloat(taxSlab) / 100);
    }
    // surcharge & cess
    if (applyCess) {
      const s = tax > 5000000 ? (tax > 10000000 ? 0.15 : 0.1) : 0;
      tax = tax * (1 + s) * 1.04;
    }
    tax = Math.round(tax);
    setTaxPayable(tax);
    // net & eff rate
    const net = sp - tax;
    setNetProceeds(Math.round(net));
    setEffRate(tg > 0 ? +((tax / tg) * 100).toFixed(2) : 0);
    setComputed(true);
  };

  // Chart data
  const barData = [
    { name: "Raw Gain", value: rawGain },
    { name: "Tax", value: taxPayable },
    { name: "Net Proceeds", value: netProceeds },
  ];
  const pieData = [
    { name: "Raw Gain", value: rawGain },
    { name: "Tax", value: taxPayable },
    { name: "Net", value: netProceeds },
  ];
  const COLORS = ["#108E66", "#272A2B", "#108E66"];

  return (
    <main className="container">
      {/* Back */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      {/* Header */}
      <h1 className="title">How Much Capital Gains Tax Will I Owe?</h1>
      <p className="description">
        Compute STCG or LTCG on Real Estate, Equity or Debt/Gold funds for FY
        2024-25.
      </p>
      <div className="explanation">
  <p>
    <strong>Capital Gains Tax:</strong> This calculator helps you estimate the <strong>tax payable</strong> on profits made from the sale of
    <strong> capital assets</strong> such as stocks, mutual funds, or real estate. It distinguishes between
    <strong> short-term</strong> and <strong>long-term gains</strong> based on the holding period and applies
    the applicable tax rates.
  </p>
  <p>
    By entering details like the <strong>purchase price, sale price, holding period</strong>, and
    <strong> asset type</strong>, the calculator determines whether your gain is <strong>tax-exempt</strong>,
    <strong>partially taxed</strong>, or subject to <strong>full capital gains tax</strong>. This helps you plan
    better for your post-sale net income.
  </p>
</div>


      {/* Inputs */}
      <section className="card">
        <h2 className="card-title">Asset Details</h2>
        <div className="grid">
          <div>
            <label>
              Asset Type{" "}
              <TooltipIcon text="Real Estate / Equity Shares / Mutual Funds (Debt/Gold)" />
            </label>
            <select
              aria-label="Select asset type"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option>Real Estate</option>
              <option>Equity Shares</option>
              <option>Mutual Funds (Debt/Gold)</option>
            </select>
          </div>
          <div>
            <label>
              Purchase Date <TooltipIcon text="Date of acquisition" />
            </label>
            <input
              type="date"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
              aria-label="Purchase date"
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div>
            <label>
              Sale Date <TooltipIcon text="Date of sale/transfer" />
            </label>
            <input
              type="date"
              value={sellDate}
              onChange={(e) => setSellDate(e.target.value)}
              aria-label="Sale date"
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div>
            <label>
              Purchase Price (₹){" "}
              <TooltipIcon text="Cost + stamp duty for property" />
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="e.g. 4,000,000"
            />
            {buyPrice && (
              <small className="converter">
                {numberToWords(+buyPrice)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Sale Price (₹) <TooltipIcon text="Net proceeds after TDS" />
            </label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="e.g. 5,200,000"
            />
            {sellPrice && (
              <small className="converter">
                {numberToWords(+sellPrice)} Rupees
              </small>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Allowable Costs</h2>
        <div className="grid">
          <div>
            <label>
              Improvement Cost (₹){" "}
              <TooltipIcon text="Capital improvements (prop only)" />
            </label>
            <input
              type="number"
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              placeholder="e.g. 200,000"
            />
          </div>
          <div>
            <label>
              Sale Expenses (₹) <TooltipIcon text="Brokerage, legal, etc." />
            </label>
            <input
              type="number"
              value={sellExpenses}
              onChange={(e) => setSellExpenses(e.target.value)}
              placeholder="e.g. 100,000"
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Exemptions &amp; Deductions</h2>
        <div className="grid">
          <div>
            <label>
              Section 54 Reinvestment (₹){" "}
              <TooltipIcon text="Prop only, reinvestment" />
            </label>
            <input
              type="number"
              value={sec54}
              onChange={(e) => setSec54(e.target.value)}
              placeholder="e.g. 400,000"
            />
          </div>
          <div>
            <label>
              Section 54EC Bonds (₹){" "}
              <TooltipIcon text="Prop only, notified bonds" />
            </label>
            <input
              type="number"
              value={sec54ec}
              onChange={(e) => setSec54ec(e.target.value)}
              placeholder="e.g. 200,000"
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Tax Settings</h2>
        <div className="grid">
          <div>
            <label>
              STCG Slab (%){" "}
              <TooltipIcon text="For short-term gains added to income" />
            </label>
            <select
              value={taxSlab}
              onChange={(e) => setTaxSlab(e.target.value)}
              aria-label="STCG Tax Slab"
            >
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
              <option>25</option>
              <option>30</option>
            </select>
          </div>
          <div className="switch-row">
            <label>
              Apply Surcharge &amp; Cess?{" "}
              <TooltipIcon text="Health & Education Cess 4 %; surcharge >₹50 L" />
            </label>
            <input
              type="checkbox"
              checked={applyCess}
              onChange={(e) => setApplyCess(e.target.checked)}
              aria-label="Apply Surcharge and Cess"
            />
          </div>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      <button className="calculate-button" onClick={calculate}>
        Calculate 
      </button>

      {/* Results */}
      {computed && (
        <section className="card results">
          <h2 className="card-title">Results</h2>

          {/* Summary */}
          <div className="summary">
            <div>
              <strong>Holding Period</strong>
              <br />
              {holdingYears} yrs {holdingMonths} mths
            </div>
            <div>
              <strong>Classification</strong>
              <br />
              {isLTCG ? "LTCG" : "STCG"}
            </div>
            <div>
              <strong>Indexed Cost Basis</strong>
              <br />₹{fmtNum(indexedCost)}
            </div>
            <div>
              <strong>Raw Gain</strong>
              <br />₹{fmtNum(rawGain)}
            </div>
            <div>
              <strong>Exemptions</strong>
              <br />₹{fmtNum(exempt)}
            </div>
            <div>
              <strong>Taxable Gain</strong>
              <br />₹{fmtNum(taxableGain)}
            </div>
            <div>
              <strong>Tax Payable</strong>
              <br />₹{fmtNum(taxPayable)}
            </div>
            <div>
              <strong>Net Proceeds</strong>
              <br />₹{fmtNum(netProceeds)}
            </div>
            <div>
              <strong>Effective Rate</strong>
              <br />
              {fmtPct(effRate)}%
            </div>
          </div>

          {/* Chart Toggle */}
          <div className="chart-toggle">
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

          {/* Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `₹${fmtNum(v as number)}`} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmtNum(v)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#108E66" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: number) => `₹${fmtNum(v)}`} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Indexation Table */}
          {isLTCG && (
            <div className="table-wrap">
              <h3>Indexation Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>FY Bought</th>
                    <th>CII Buy</th>
                    <th>FY Sold</th>
                    <th>CII Sell</th>
                    <th>Factor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{getFiscalYear(new Date(buyDate))}</td>
                    <td>{CII[getFiscalYear(new Date(buyDate))]}</td>
                    <td>{getFiscalYear(new Date(sellDate))}</td>
                    <td>{CII[getFiscalYear(new Date(sellDate))]}</td>
                    <td>
                      {(
                        (CII[getFiscalYear(new Date(sellDate))] || 0) /
                        (CII[getFiscalYear(new Date(buyDate))] || 1)
                      ).toFixed(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Insight */}
          <p className="insight">
            {isLTCG
              ? `You have ₹${fmtNum(rawGain)} of LTCG; tax payable ₹${fmtNum(
                  taxPayable
                )}.`
              : `You have ₹${fmtNum(rawGain)} of STCG taxed at your slab rate.`}
          </p>


          {/* Points to Consider */}
      <div className="points">
        <h3>Important considrations</h3>
        <ul>
          <li>
            This calculator uses FY 2024-25 rates and CII tables under Indian
            tax law.
          </li>
          <li>Always round all monetary values to the nearest rupee.</li>
          <li>Figures-to-words conversion helps avoid input mistakes.</li>
          <li>Ensure dates are accurate to classify STCG vs LTCG correctly.</li>
          <li>
            Select the proper asset type—indexation applies only to real estate
            and debt/gold funds.
          </li>
          <li>SLAB rate applies only to STCG added to your total income.</li>
          <li>
            Surcharge &amp; cess are auto-applied if the gain exceeds ₹ 50 lakh.
          </li>
          <li>
            Charts provide visual breakdowns—toggle between bar and pie for
            insight.
          </li>
          <li>
            Refer to a tax professional for any complex exemptions (e.g.,
            Sections 54, 54EC).
          </li>
        </ul>
      </div>
        </section>
      )}

     

      

      {/* Styles */}
      <style jsx>{`
        .container {
          width: 100%;
          margin: auto;
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
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
        }
        .title {
          text-align: center;
          font-size: 2.25rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .description {
          text-align: center;
          font-size: 1rem;
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
        .card-title {
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
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          display: block;
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
        .switch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        .switch-row input {
          width: 1.2rem;
          height: 1.2rem;
          accent-color: #108e66;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
        .calculate-button {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 2rem;
        }
        .results .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .results .summary > div {
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
          margin-bottom: 1rem;
        }
        .chart-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          background: transparent;
          border-radius: 4px;
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
        .insight {
          text-align: center;
          font-weight: 500;
          color: #108e66;
          margin-top: 1rem;
        }
       
       
        .points {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem
        
        }
        .points ul {
          margin: 0;
          padding-left: 1.4rem;
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
