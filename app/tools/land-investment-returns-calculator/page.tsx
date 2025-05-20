// File: /app/tools/land-investment-returns-calculator/page.tsx
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

// Tooltip icon
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

// Number‐to‐words (Indian)
const numberToWords = (num: number): string => {
  num = Math.round(Math.abs(num));
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
  return helper(num);
};

// XIRR via Newton–Raphson
function xirr(cashflows: { date: Date; amount: number }[]) {
  const dt0 = cashflows[0].date.getTime();
  const yrs = cashflows.map((cf) => ({
    t: (cf.date.getTime() - dt0) / (1000 * 60 * 60 * 24 * 365.25),
    amount: cf.amount,
  }));

  const npv = (r: number) =>
    yrs.reduce((sum, { t, amount }) => sum + amount / Math.pow(1 + r, t), 0);

  const deriv = (r: number) =>
    yrs.reduce(
      (sum, { t, amount }) => sum - (t * amount) / Math.pow(1 + r, t + 1),
      0
    );

  let rate = 0.1;
  for (let i = 0; i < 50; i++) {
    const f = npv(rate);
    const d = deriv(rate);
    if (Math.abs(f) < 1e-8) break;
    rate = rate - f / d;
  }
  return rate;
}

export default function LandInvestmentReturnCalculator() {
  // Inputs
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [cashFlows, setCashFlows] = useState<
    { date: string; amount: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // Results
  const [netGain, setNetGain] = useState(0);
  const [simpleROI, setSimpleROI] = useState(0);
  const [cagr, setCagr] = useState(0);
  const [irr, setIrr] = useState(0);
  const [timeline, setTimeline] = useState<
    { date: string; amount: number; cumulative: number }[]
  >([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [calculated, setCalculated] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const addCashFlow = () =>
    setCashFlows([...cashFlows, { date: "", amount: "" }]);
  const updateCashFlow = (i: number, f: "date" | "amount", v: string) => {
    const c = [...cashFlows];
    c[i][f] = v;
    setCashFlows(c);
  };
  const removeCashFlow = (i: number) => {
    const c = [...cashFlows];
    c.splice(i, 1);
    setCashFlows(c);
  };

  const calculate = () => {
    setError(null);
    const p = parseFloat(purchasePrice),
      cv = parseFloat(currentValue);
    const pd = new Date(purchaseDate),
      cd = new Date(currentDate);
    if (isNaN(p) || p <= 0) return setError("Enter valid purchase price");
    if (isNaN(cv) || cv <= 0) return setError("Enter valid current value");
    if (isNaN(pd.getTime()) || isNaN(cd.getTime()))
      return setError("Enter valid dates");
    if (cd <= pd) return setError("Current date must follow purchase date");

    // Build cashflow list
    const cfs: { date: Date; amount: number }[] = [{ date: pd, amount: -p }];
    cashFlows.forEach((cf) => {
      const d = new Date(cf.date),
        a = parseFloat(cf.amount);
      if (!isNaN(d.getTime()) && !isNaN(a)) cfs.push({ date: d, amount: a });
    });
    cfs.push({ date: cd, amount: cv });
    cfs.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Horizon in years
    const yrs = (cd.getTime() - pd.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    // Net gain
    const gain = Math.round(cfs.reduce((s, cf) => s + cf.amount, 0));
    setNetGain(gain);
    setSimpleROI(+((gain / p) * 100).toFixed(2));
    setCagr(+((Math.pow(cv / p, 1 / yrs) - 1) * 100).toFixed(2));
    setIrr(+(xirr(cfs) * 100).toFixed(2));

    // Chart data
    setBarData([
      { name: "Cost Basis", value: p },
      { name: "Net Gain", value: gain },
      { name: "Final Value", value: cv },
    ]);

    let cum = 0;
    const tl = cfs.map((cf) => {
      cum += cf.amount;
      return {
        date: cf.date.toISOString().slice(0, 10),
        amount: cf.amount,
        cumulative: cum,
      };
    });
    setTimeline(tl);

    setCalculated(true);
  };

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">What’s My Land Investment Return?</h1>
      <p className="desc">
        Compute net gain, simple ROI, CAGR and IRR—including any interim cash
        flows.
      </p>
      <div className="explanation">
        <p>
          <strong>Land Investment Returns:</strong> This calculator helps you
          estimate the potential <strong>profitability</strong> of investing in
          land by considering factors like <strong>purchase cost</strong>,{" "}
          <strong>annual appreciation</strong>, and{" "}
          <strong>holding duration</strong>.
        </p>
        <p>
          Land typically appreciates over time, especially in developing areas.
          This tool lets you simulate your lands value over a period and
          compare it with your <strong>initial investment</strong>, including
          optional costs like{" "}
          <strong>registration, taxes, and maintenance</strong>.
        </p>
        <p>
          Its a useful way to assess whether the investment aligns with your{" "}
          <strong>financial goals</strong> and how it compares with other asset
          classes such as equities or fixed deposits.
        </p>
      </div>

      {/* Core inputs */}
      <section className="card">
        <h2 className="card-title">Core Investment</h2>
        <div className="grid-2">
          <div>
            <label>
              Purchase Price (₹)
              <TooltipIcon text="Amount you paid for the land" />
            </label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g., 250000"
            />
            {purchasePrice && (
              <small className="converter">
                {numberToWords(+purchasePrice)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Purchase Date
              <TooltipIcon text="Date you acquired the land" />
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              
            />
          </div>
          <div>
            <label>
              Current Value (₹)
              <TooltipIcon text="Latest market or sale value" />
            </label>
            <input
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder="e.g., 300000"
            />
            {currentValue && (
              <small className="converter">
                {numberToWords(+currentValue)} Rupees
              </small>
            )}
          </div>
          <div>
            <label>
              Current Date
              <TooltipIcon text="Date of valuation or sale" />
            </label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Interim cash flows */}
      <section className="card">
        <h2 className="card-title">
          Interim Cash Flows (Optional)
          <TooltipIcon text="Payments or receipts between purchase and sale (e.g., development costs, lease income)" />
        </h2>

        {cashFlows.map((cf, i) => (
          <div key={i} className="grid-3 cf-row">
            <input
              type="date"
              value={cf.date}
              onChange={(e) => updateCashFlow(i, "date", e.target.value)}
            />
            <input
              type="number"
              value={cf.amount}
              placeholder="₹ amount"
              onChange={(e) => updateCashFlow(i, "amount", e.target.value)}
            />
            <button className="remove-btn" onClick={() => removeCashFlow(i)}>
              Remove
            </button>
          </div>
        ))}

        <button className="add-btn" onClick={addCashFlow}>
          + Add Cash Flow
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      <button className="btn-calc" onClick={calculate}>
        Calculate My Return
      </button>

      {calculated && (
        <section className="card results">
          <h2 className="card-title">Results Summary</h2>
          <div className="summary">
            <div>
              <strong>Net Gain</strong>
              <br />₹{fmt(netGain)}
            </div>
            <div>
              <strong>Simple ROI</strong>
              <br />
              {simpleROI}%
            </div>
            <div>
              <strong>CAGR</strong>
              <br />
              {cagr}%
            </div>
            <div>
              <strong>IRR</strong>
              <br />
              {irr}%
            </div>
          </div>

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

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#108E66" />
                </BarChart>
              ) : (
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#108E66"
                    name="Cumulative"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <h3 className="table-head">Cash Flow Table</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Flow (₹)</th>
                  <th>Cumulative (₹)</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>₹{fmt(r.amount)}</td>
                    <td>₹{fmt(r.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="disc">
            <h2>Points to Consider</h2>
            <ul>
              <li>
                This uses exact dates to compute the investment horizon for CAGR
                and IRR.
              </li>
              <li>
                IRR is solved via Newton–Raphson on all cash flows including
                purchase and sale.
              </li>
              <li>
                Simple ROI does not account for time value of money—refer to
                CAGR/IRR for annualized returns.
              </li>
              <li>
                Include all interim inflows (e.g., lease income) and outflows
                (e.g., development costs) to get an accurate IRR.
              </li>
            </ul>
          </section>
        </section>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
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
        .back-btn {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .desc {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #555;
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
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }
        .grid-2,
        .grid-3,
        .cf-row {
          display: grid;
          gap: 1rem;
        }
        .grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }
        .cf-row {
          grid-template-columns: 1fr 1fr auto;
          align-items: center;
        }
        label {
          font-size: 0.9rem;
          margin-bottom: 4px;
          display: block;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .remove-btn,
        .add-btn {
          padding: 0.5rem;
          border: 1px solid #ccc;
          background: #fafafa;
          border-radius: 4px;
          cursor: pointer;
        }
        .add-btn {
          margin-top: 0.5rem;
        }
        .converter {
          font-size: 0.85rem;
          color: #555;
          margin-top: 0.25rem;
        }
        .btn-calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        .error {
          color: red;
          text-align: center;
          margin: 1rem 0;
        }
        .results .summary {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
        .results .summary > div {
          flex: 1 1 150px;
          text-align: center;
          border: 1px solid #108e66;
          border-radius: 6px;
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
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
        }
        .chart-toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          height: 300px;
          margin-bottom: 1rem;
        }
        .table-head {
          text-align: center;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .table-wrap {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        th,
        td {
          border: 1px solid #ccc;
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
        @media (max-width: 600px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
