// File: /app/tools/home-renovation-budget-estimator/page.tsx

"use client";
import React, { useState, useEffect } from "react";
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

// Tooltip component
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tooltipIcon"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="info-icon">i</span>
      {show && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltipIcon {
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

// number→words helper
const numberToWords = (n: number): string => {
  if (!isFinite(n)) return "";
  const x = Math.round(Math.abs(n));
  if (x === 0) return "Zero";
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
  const toWords = (v: number): string => {
    if (v < 20) return ones[v];
    if (v < 100)
      return tens[Math.floor(v / 10)] + (v % 10 ? " " + ones[v % 10] : "");
    if (v < 1000)
      return (
        ones[Math.floor(v / 100)] +
        " Hundred" +
        (v % 100 ? " " + toWords(v % 100) : "")
      );
    if (v < 100000)
      return (
        toWords(Math.floor(v / 1000)) +
        " Thousand" +
        (v % 1000 ? " " + toWords(v % 1000) : "")
      );
    if (v < 10000000)
      return (
        toWords(Math.floor(v / 100000)) +
        " Lakh" +
        (v % 100000 ? " " + toWords(v % 100000) : "")
      );
    return (
      toWords(Math.floor(v / 10000000)) +
      " Crore" +
      (v % 10000000 ? " " + toWords(v % 10000000) : "")
    );
  };
  return toWords(x);
};
const wordsRupees = (v: number): string =>
  v > 0 ? `${numberToWords(v)} Rupees` : "";

// round to nearest hundred
const round100 = (v: number): number => Math.round(v / 100) * 100;

export default function HomeRenovationBudgetEstimator() {
  // inputs
  const [areaSqFt, setAreaSqFt] = useState(0);
  const [finishTier, setFinishTier] = useState("Standard");
  const [baseRate, setBaseRate] = useState(1800);
  const [bathrooms, setBathrooms] = useState(1);
  const [kitchens, setKitchens] = useState(1);
  const [bathCost, setBathCost] = useState(200000);
  const [kitchenCost, setKitchenCost] = useState(400000);
  const [labourPct, setLabourPct] = useState(40);
  const [contingencyPct, setContingencyPct] = useState(10);
  const [gstPct, setGstPct] = useState(18);
  const [errors, setErrors] = useState<string[]>([]);

  // results
  const [res, setRes] = useState<null | any>(null);
  const [chart, setChart] = useState<"pie" | "bar">("pie");

  // update baseRate when tier changes
  useEffect(() => {
    const map: Record<string, number> = {
      Basic: 1200,
      Standard: 1800,
      Premium: 2500,
    };
    setBaseRate(map[finishTier] || 1800);
  }, [finishTier]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (areaSqFt <= 0) errs.push("Enter valid area");
    if (baseRate <= 0) errs.push("Enter valid base rate");
    if (bathrooms < 0) errs.push("Enter bathrooms count");
    if (kitchens < 0) errs.push("Enter kitchens count");
    if (bathCost <= 0) errs.push("Enter valid bath cost");
    if (kitchenCost <= 0) errs.push("Enter valid kitchen cost");
    if (labourPct < 0) errs.push("Enter valid labour %");
    if (contingencyPct < 0) errs.push("Enter valid contingency %");
    if (gstPct < 0) errs.push("Enter valid GST %");
    setErrors(errs);
    return errs.length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    const baseCost = round100(areaSqFt * baseRate);
    const bathTotal = round100(bathrooms * bathCost);
    const kitchenTotal = round100(kitchens * kitchenCost);
    const materialsCost = round100(baseCost + bathTotal + kitchenTotal);
    const labourCost = round100(materialsCost * (labourPct / 100));
    const subTotal = materialsCost + labourCost;
    const contingency = round100(subTotal * (contingencyPct / 100));
    const gstAmount = round100((subTotal + contingency) * (gstPct / 100));
    const grandTotal = round100(subTotal + contingency + gstAmount);
    const costPerSqFt = Math.round(grandTotal / areaSqFt);
    setRes({
      baseCost,
      bathTotal,
      kitchenTotal,
      materialsCost,
      labourCost,
      subTotal,
      contingency,
      gstAmount,
      grandTotal,
      costPerSqFt,
    });
  };

  // chart data
  const pieData = res
    ? [
        { name: "Materials", value: res.materialsCost },
        { name: "Labour", value: res.labourCost },
        { name: "Contingency", value: res.contingency },
        { name: "GST", value: res.gstAmount },
      ]
    : [];
  const barData = res
    ? [
        { name: "Cost/sq ft", value: res.costPerSqFt },
        { name: "Total Budget", value: res.grandTotal },
      ]
    : [];

  // insights
  // const insights: string[] = [];
  // if (res) {
  //   if (contingencyPct < 10)
  //     insights.push(
  //       `Your contingency is only ${contingencyPct} %. Industry norm is 10–15 %; consider increasing buffer.`
  //     );
  //   else if (contingencyPct > 15)
  //     insights.push(
  //       `Your contingency is ${contingencyPct} %, above typical 10–15 %; you may reduce buffer to save cost.`
  //     );
  //   if (finishTier === "Premium") {
  //     const stdDelta = round100((2500 - 1800) * areaSqFt);
  //     insights.push(
  //       `Opting for Standard finish saves approx ₹${stdDelta} vs Premium.`
  //     );
  //   }
  //   const labourFrac = Math.round((res.labourCost / res.materialsCost) * 100);
  //   if (labourFrac > 45)
  //     insights.push(
  //       "Labour >45 % of materials cost—negotiate or get multiple quotes."
  //     );
  // }

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>
      <h1 className="title">How Much Will My Home Renovation Cost?</h1>
      <p className="description">
        Estimate realistic renovation budgets—materials, labour, contingency &
        GST—for Indian homes.
      </p>
      <div className="explanation">
        <p>
          Input your <strong>area</strong>, <strong>finish quality</strong>, and
          room counts. Adjust <strong>labour</strong>,{" "}
          <strong>contingency</strong>, and <strong>GST</strong> settings to
          tailor your estimate.
        </p>
        <p>
          Get a <strong>breakdown</strong>, interactive <strong>charts</strong>,
          and <strong>insights</strong> to plan smartly before you start
          remodeling.
        </p>
      </div>
      <section className="card">
        <h2 className="card-title">Property & Scope</h2>
        <div className="grid">
          <label>
            <span className="input-label">
              Carpet Area (sq ft)
              <TooltipIcon text="Enter total carpet area" />
            </span>
            <input
              type="number"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(+e.target.value)}
              placeholder="e.g. 1200"
            />
            <small className="converter">{wordsRupees(areaSqFt)}</small>
          </label>
          <label>
            <span className="input-label">
              Finish Quality
              <TooltipIcon text="Basic/Standard/Premium" />
            </span>
            <select
              value={finishTier}
              onChange={(e) => setFinishTier(e.target.value)}
            >
              <option>Basic</option>
              <option>Standard</option>
              <option>Premium</option>
            </select>
          </label>
          <label>
            <span className="input-label">
              Bathrooms to Upgrade
              <TooltipIcon text="No. of bathrooms incl. tiling & fittings" />
            </span>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(+e.target.value)}
              placeholder="e.g. 2"
            />
          </label>
          <label>
            <span className="input-label">
              Kitchens to Upgrade
              <TooltipIcon text="Modular/full remodel count" />
            </span>
            <input
              type="number"
              value={kitchens}
              onChange={(e) => setKitchens(+e.target.value)}
              placeholder="e.g. 1"
            />
          </label>
        </div>
      </section>
      <section className="card">
        <h2 className="card-title">Cost Settings</h2>
        <div className="grid">
          <label>
            <span className="input-label">
              Base Cost per sq ft (₹)
              <TooltipIcon text="Auto‑sets from tier, editable" />
            </span>
            <input
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(+e.target.value)}
              placeholder="e.g. 1800"
            />
          </label>
          <label>
            <span className="input-label">
              Bathroom Cost (₹/unit)
              <TooltipIcon text="Plumbing + fixtures" />
            </span>
            <input
              type="number"
              value={bathCost}
              onChange={(e) => setBathCost(+e.target.value)}
              placeholder="e.g. 200000"
            />
          </label>
          <label>
            <span className="input-label">
              Kitchen Cost (₹/unit)
              <TooltipIcon text="Cabinets + appliances" />
            </span>
            <input
              type="number"
              value={kitchenCost}
              onChange={(e) => setKitchenCost(+e.target.value)}
              placeholder="e.g. 400000"
            />
          </label>
          <label>
            <span className="input-label">
              Labour % of Materials
              <TooltipIcon text="Typical 35‑45 %" />
            </span>
            <input
              type="number"
              value={labourPct}
              onChange={(e) => setLabourPct(+e.target.value)}
              placeholder="e.g. 40"
            />
          </label>
          <label>
            <span className="input-label">
              Contingency %<TooltipIcon text="Buffer for overruns" />
            </span>
            <input
              type="number"
              value={contingencyPct}
              onChange={(e) => setContingencyPct(+e.target.value)}
              placeholder="e.g. 10"
            />
          </label>
          <label>
            <span className="input-label">
              GST %<TooltipIcon text="Goods & Services Tax" />
            </span>
            <input
              type="number"
              value={gstPct}
              onChange={(e) => setGstPct(+e.target.value)}
              placeholder="e.g. 18"
            />
          </label>
        </div>
      </section>
      {errors.length > 0 && <div className="error">{errors.join(", ")}</div>}
      <button className="calculate-button" onClick={calculate}>
        Calculate Renovation Budget
      </button>
      {res && (
        <section className="card results">
          <h2 className="card-title">Results</h2>
          <div className="summary-grid">
            <div>
              <strong>Materials Cost</strong>
              <br />₹{res.materialsCost.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Labour Cost</strong>
              <br />₹{res.labourCost.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Contingency</strong>
              <br />₹{res.contingency.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>GST Amount</strong>
              <br />₹{res.gstAmount.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Total Budget</strong>
              <br />₹{res.grandTotal.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Cost per sq ft</strong>
              <br />₹{res.costPerSqFt}
            </div>
          </div>
          <div className="chart-toggle">
            <button
              className={chart === "pie" ? "active" : ""}
              onClick={() => setChart("pie")}
            >
              Pie Chart
            </button>
            <button
              className={chart === "bar" ? "active" : ""}
              onClick={() => setChart("bar")}
            >
              Bar Chart
            </button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chart === "pie" ? (
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
                      <Cell
                        key={i}
                        fill={["#108e66", "#272a2b", "#108e66", "#272a2b"][i]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                </PieChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <h3>Cost Breakdown Table</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Cost (₹)</th>
                  <th>Cost per sq ft</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Base Build</td>
                  <td>₹{res.baseCost.toLocaleString("en-IN")}</td>
                  <td>₹{Math.round(res.baseCost / areaSqFt)}</td>
                </tr>
                <tr>
                  <td>Bathrooms</td>
                  <td>₹{res.bathTotal.toLocaleString("en-IN")}</td>
                  <td>₹{Math.round(res.bathTotal / areaSqFt)}</td>
                </tr>
                <tr>
                  <td>Kitchens</td>
                  <td>₹{res.kitchenTotal.toLocaleString("en-IN")}</td>
                  <td>₹{Math.round(res.kitchenTotal / areaSqFt)}</td>
                </tr>
                <tr>
                  <td>Labour</td>
                  <td>₹{res.labourCost.toLocaleString("en-IN")}</td>
                  <td>₹{Math.round(res.labourCost / areaSqFt)}</td>
                </tr>
                <tr>
                  <td>Contingency</td>
                  <td>₹{res.contingency.toLocaleString("en-IN")}</td>
                  <td>–</td>
                </tr>
                <tr>
                  <td>GST</td>
                  <td>₹{res.gstAmount.toLocaleString("en-IN")}</td>
                  <td>–</td>
                </tr>
                <tr>
                  <td>
                    <strong>Grand Total</strong>
                  </td>
                  <td>
                    <strong>₹{res.grandTotal.toLocaleString("en-IN")}</strong>
                  </td>
                  <td>
                    <strong>₹{res.costPerSqFt}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="disc">
            <h2>Important considerations</h2>
            <ul>
              <li>
                Estimates are based on average material and labor costs;
                regional prices may vary.
              </li>
              <li>
                Unexpected repairs or changes during renovation can increase
                costs.
              </li>
              <li>
                Include a contingency buffer of 10–20% for unforeseen expenses.
              </li>
              <li>
                Permit, design, or architect fees may apply depending on the
                project scope.
              </li>
              <li>
                DIY efforts can reduce labor costs but may impact quality or
                timelines.
              </li>
              <li>
                High-end finishes and appliances can significantly raise your
                total budget.
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* styles */}
      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
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
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #555;
        }
        .explanation {
          background: #fcfffe;
          padding: 1rem;
          border-left: 4px solid #108e66;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }
        .explanation p {
          margin: 0.5rem 0;
          line-height: 1.4;
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
          display: flex;
          flex-direction: column;
        }
        .input-label {
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        input,
        select {
          margin-top: 0.3rem;
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
          text-align: center;
          margin-bottom: 1rem;
        }
        .calculate-button {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
        }
        .results .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .results .summary-grid > div {
          border: 1px solid #108e66;
          border-radius: 6px;
          text-align: center;
          padding: 0.75rem;
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
          font-size: 0.9rem;
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
