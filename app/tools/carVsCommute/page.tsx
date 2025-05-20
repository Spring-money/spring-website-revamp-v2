"use client";
import React, { useState, useRef } from "react";
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
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─────────────────────────────────────────
// Utility: Number → Words (Indian system)
// ─────────────────────────────────────────
function numberToWords(num: number): string {
  const units = [
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
  ];
  const teens = [
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
  if (num === 0) return "Zero";
  const conv = (n: number): string => {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
    if (n < 1000)
      return (
        units[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + conv(n % 100) : "")
      );
    if (n < 100000)
      return (
        conv(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + conv(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        conv(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + conv(n % 100000) : "")
      );
    return (
      conv(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + conv(n % 10000000) : "")
    );
  };
  return conv(Math.round(Math.abs(num)));
}
const numberToWordsPercent = (v: number): string => {
  const ip = Math.floor(v),
    dp = Math.round((v - ip) * 10);
  return dp
    ? `${numberToWords(ip)} point ${numberToWords(dp)} percent`
    : `${numberToWords(ip)} percent`;
};

// ─────────────────────────────────────────
// Tooltip Icon
// ─────────────────────────────────────────
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
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
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          z-index: 100;
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

// ─────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────
interface Inputs {
  carPrice: string;
  fuelEfficiency: string;
  fuelPrice: string;
  oneWayDistance: string;
  workingDays: string;
  annualMaintenance: string;
  annualInsurance: string;
  registrationTaxes: string;
  parkingTolls?: string;
  expectedResale: string;
  depreciationRate: string;
  dailyPublicFare: string;
  tripsPerDay: string;
}
interface YearlyCost {
  year: number;
  carCum: number;
  ptCum: number;
}
interface Results {
  totalCar: number;
  totalPT: number;
  savings: number;
  co2: number;
  yearWise: YearlyCost[];
}

// ─────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────
export default function BuyCarvsCommuteCalculator() {
  const analysisYears = 5;
  const [inputs, setInputs] = useState<Inputs>({
    carPrice: "",
    fuelEfficiency: "",
    fuelPrice: "",
    oneWayDistance: "",
    workingDays: "",
    annualMaintenance: "",
    annualInsurance: "",
    registrationTaxes: "",
    parkingTolls: "",
    expectedResale: "",
    depreciationRate: "",
    dailyPublicFare: "",
    tripsPerDay: "",
  });
  const [errors, setErrors] = useState<Partial<Inputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    const err: Partial<Inputs> = {};
    (
      [
        "carPrice",
        "fuelEfficiency",
        "fuelPrice",
        "oneWayDistance",
        "workingDays",
        "annualMaintenance",
        "annualInsurance",
        "registrationTaxes",
        "expectedResale",
        "depreciationRate",
        "dailyPublicFare",
        "tripsPerDay",
      ] as Array<keyof Inputs>
    ).forEach((f) => {
      if (!inputs[f] || isNaN(Number(inputs[f]))) err[f] = "Invalid";
    });
    setErrors(err);
    return !Object.keys(err).length;
  };
  const calculate = () => {
    if (!validate()) return;
    setLoading(true);
    // parse inputs...
    const cP = +inputs.carPrice,
      fe = +inputs.fuelEfficiency,
      fp = +inputs.fuelPrice;
    const d = +inputs.oneWayDistance,
      wd = +inputs.workingDays;
    const am = +inputs.annualMaintenance,
      ai = +inputs.annualInsurance;
    const rt = +inputs.registrationTaxes,
      pt = +(inputs.parkingTolls || "0");
    const er = +inputs.expectedResale,
      dr = +inputs.depreciationRate / 100;
    const pf = +inputs.dailyPublicFare,
      tp = +inputs.tripsPerDay;
    // commute
    const dailyKm = d * 2;
    // car costs
    const dailyFuel = (dailyKm / fe) * fp;
    const annualFuel = dailyFuel * wd * 12;
    const annualRec = am + ai + pt * 12;
    const depreciation = (cP - er) / analysisYears;
    const totalCar =
      cP + rt + (annualFuel + annualRec + depreciation) * analysisYears - er;
    // public transport
    const annualPT = pf * tp * wd * 12;
    const totalPT = annualPT * analysisYears;
    // yearwise
    const yw: YearlyCost[] = [];
    let cumCar = cP + rt,
      cumPT = 0;
    for (let y = 1; y <= analysisYears; y++) {
      cumCar += annualFuel + annualRec + depreciation;
      cumPT += annualPT;
      const finalCar = y === analysisYears ? cumCar - er : cumCar;
      yw.push({
        year: y,
        carCum: +finalCar.toFixed(2),
        ptCum: +cumPT.toFixed(2),
      });
    }
    // CO₂
    const annualFuelL = (dailyKm / fe) * wd * 12;
    const co2 = annualFuelL * 2.3;
    setResults({
      totalCar,
      totalPT,
      savings: totalCar - totalPT,
      co2,
      yearWise: yw,
    });
    setLoading(false);
  };

  const chartData = results
    ? results.yearWise.map((r) => ({
        year: r.year,
        "Car Cost": r.carCum,
        "PT Cost": r.ptCum,
      }))
    : [];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Buy a Car vs. Public Transport</h1>
      <p className="description">
        Compare the <strong>5-year total cost</strong> of car ownership vs
        public transport for your daily commute.
      </p>

      <div className="explanation">
        <p>
          <strong>Car Ownership:</strong> Includes purchase price,{" "}
          <strong>fuel</strong>, maintenance, insurance, depreciation, taxes
          &amp; parking/tolls.
        </p>
        <p>
          <strong>Public Transport:</strong> Your daily fare × trips per day ×
          working days. <strong>No vehicle overheads</strong>.
        </p>
      </div>

      <section className="form-container">
        <h2 className="section-title">Car Details</h2>
        <div className="input-grid">
        {[
  {
    name: "carPrice",
    label: "Car Price (₹)",
    placeholder: "e.g., 10,00,000",
    tip: "Total purchase price",
  },
  {
    name: "fuelEfficiency",
    label: "Fuel Efficiency (km/L)",
    placeholder: "e.g., 15",
    tip: "Vehicle mileage",
  },
  {
    name: "fuelPrice",
    label: "Fuel Price (₹/L)",
    placeholder: "e.g., 105",
    tip: "Current fuel rate",
  },
  {
    name: "oneWayDistance",
    label: "One-way Distance (km)",
    placeholder: "e.g., 12",
    tip: "Home→Work km",
  },
  {
    name: "workingDays",
    label: "Working Days/Month",
    placeholder: "e.g., 22",
    tip: "Commute days/mo",
  },
  {
    name: "annualMaintenance",
    label: "Annual Maintenance (₹)",
    placeholder: "e.g., 15,000",
    tip: "Yearly repairs",
  },
  {
    name: "annualInsurance",
    label: "Annual Insurance (₹)",
    placeholder: "e.g., 25,000",
    tip: "Yearly premium",
  },
  {
    name: "registrationTaxes",
    label: "Registration & Taxes (₹)",
    placeholder: "e.g., 75,000",
    tip: "One-time fees",
  },
  {
    name: "parkingTolls",
    label: "Parking/Toll (₹/mo) (Opt)",
    placeholder: "e.g., 2,000",
    tip: "Monthly parking/tolls",
  },
  {
    name: "expectedResale",
    label: "Resale Value (₹)",
    placeholder: "e.g., 3,50,000",
    tip: "Value after 5 yrs",
  },
  {
    name: "depreciationRate",
    label: "Depreciation (% p.a.)",
    placeholder: "e.g., 15%",
    tip: "Annual value drop",
  },


          ].map((f) => (
            <label key={f.name}>
              <span className="input-label">
                {f.label}
                <TooltipIcon text={f.tip} />
              </span>
              <input
                name={f.name}
                type="number"
                value={(inputs as any)[f.name]}
                onChange={onChange}
                placeholder={f.placeholder}
              />
              {(inputs as any)[f.name] && (
                <small className="converter">
                {((inputs as any)[f.name] && numberToWords(Number((inputs as any)[f.name]))) || ""} 
                {f.label.includes("%") ? "percent" : f.label.toLowerCase().includes("km") ?"Kilometers" : "Rupees"}
                </small>
              )}
              {errors[f.name as keyof Inputs] && (
                <small className="error">Invalid</small>
              )}
            </label>
          ))}
        </div>

        <hr className="divider" />

        <h2 className="section-title">Public Transport</h2>
        <div className="input-grid">
          {[
            {
              name: "dailyPublicFare",
              label: "Fare per Trip (₹)",
              tip: "Cost per trip",
            },
            { name: "tripsPerDay", label: "Trips per Day", tip: "Typically 2" },
          ].map((f) => (
            <label key={f.name}>
              <span className="input-label">
                {f.label}
                <TooltipIcon text={f.tip} />
              </span>
              <input
                name={f.name}
                type="number"
                value={(inputs as any)[f.name]}
                onChange={onChange}
              />
              {(inputs as any)[f.name] && (
                <small className="converter">
                  {numberToWords(+(inputs as any)[f.name])}{" "}
                  {f.label.includes("Fare") ? "Rupees" : "Trips"}
                </small>
              )}
              {errors[f.name as keyof Inputs] && (
                <small className="error">Invalid</small>
              )}
            </label>
          ))}
        </div>

        <button
          className="calculate-button"
          onClick={calculate}
          disabled={loading}
        >
          {loading ? "Calculating…" : "Calculate"}
        </button>
      </section>

      {results && (
        <section className="results-container">
          <h2 className="results-title">5-Year Cost Summary</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Car Total:</strong> ₹
              {results.totalCar.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>PT Total:</strong> ₹
              {results.totalPT.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>Savings:</strong> ₹
              {results.savings.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="difference-block">
            <p>
              {results.totalCar < results.totalPT ? (
                <>
                  Car cheaper by{" "}
                  <strong>
                    ₹
                    {(results.totalPT - results.totalCar).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </>
              ) : (
                <>
                  PT cheaper by{" "}
                  <strong>
                    ₹
                    {(results.totalCar - results.totalPT).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </>
              )}
            </p>
            <p>
              <strong>Recommendation:</strong>{" "}
              {results.totalCar < results.totalPT
                ? "Buy a car"
                : "Use public transport"}
              .
            </p>
          </div>

          <div className="chart-explanation">
            <p>Cumulative cost over 5 years. Hover for details.</p>
          </div>
          <div className="chart-toggle">
            <button
              onClick={() => setChartType("line")}
              className={chartType === "line" ? "active" : ""}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={chartType === "bar" ? "active" : ""}
            >
              Bar
            </button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="90%" height={300}>
              {chartType === "line" ? (
                <LineChart
                  data={chartData}
                  margin={{ top: 20, left: 50, right: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: "Year",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    tickFormatter={(v) => "₹" + v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) =>
                      "₹" + Math.round(v).toLocaleString("en-IN")
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Car Cost"
                    stroke="#108e66"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="PT Cost"
                    stroke="#525ECC"
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 20, left: 50, right: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    tickFormatter={(v) => "₹" + v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) =>
                      "₹" + Math.round(v).toLocaleString("en-IN")
                    }
                  />
                  <Legend />
                  <Bar dataKey="Car Cost" fill="#108e66" />
                  <Bar dataKey="PT Cost" fill="#525ECC" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="env-impact-container">
            <h2 className="results-title">Environmental Impact</h2>
            <p>
              Switching to PT saves roughly{" "}
              <strong>{Math.round(results.co2)} kg CO₂</strong> per year.
            </p>
          </div>

          <h3 className="results-subtitle">Year-wise Breakdown</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Car Cost (₹)</th>
                  <th>PT Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.yearWise.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{r.carCum.toLocaleString("en-IN")}</td>
                    <td>{r.ptCum.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>Resale value is subtracted only in year 5.</li>
              <li>CO₂ uses 2.3 kg/L fuel burn.</li>
              <li>Actual costs vary with usage &amp; rates.</li>
              <li>Consult a financial advisor before major purchases.</li>
            </ul>
          </div>
        </section>
      )}
      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: "Poppins", sans-serif;
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
        }
        .title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        .explanation {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
        }
        .explanation p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        .form-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
        }
        .input-grid {
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
        input {
          margin-top: 0.3rem;
          padding: 0.5rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          font-size: 1rem;
        }
        .converter {
          font-size: 0.85rem;
          color: rgba(39, 43, 42, 0.6);
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          font-size: 0.8rem;
        }
        .divider {
          border: none;
          border-top: 1px solid rgba(39, 43, 42, 0.2);
          margin: 2rem 0;
        }
        .calculate-button {
          width: 100%;
          height: 48px;
          margin-top: 1rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
        }
        .calculate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .results-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }
        .results-title {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .summary-card {
          display: grid;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .summary-item {
          font-size: 1rem;
        }
        .difference-block {
          background: #108e66;
          color: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        .chart-explanation {
          background: #fcfffe;
          border: 1px solid #108e66;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
        }
        .chart-toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          background: #fcfffe;
          color: #272b2a;
          cursor: pointer;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          margin: 2rem 0;
          display: flex;
          justify-content: center;
        }
        .env-impact-container {
          background: #fcfffe;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }
        .results-subtitle {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 2rem 0 1rem;
          text-align: center;
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
          border: 1px solid #272b2a;
          padding: 0.5rem;
          text-align: center;
          font-size: 0.9rem;
        }
        th {
          background: #108e66;
          color: #fcfffe;
          position: sticky;
          top: 0;
        }
        .disclaimer {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #272b2a;
          margin-top: 2rem;
        }
        .disclaimer h4 {
          margin-top: 0;
        }
        .disclaimer ul {
          padding-left: 1.2rem;
          margin: 0;
        }
        .disclaimer li {
          margin-bottom: 0.5rem;
        }
        @media (max-width: 768px) {
          .input-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
