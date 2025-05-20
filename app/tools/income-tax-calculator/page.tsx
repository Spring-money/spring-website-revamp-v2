// app/tools/income-tax-calculator/page.tsx
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

type AgeGroup = "Below 60" | "60–79" | "80+";
type ResStatus = "Resident" | "Non-Resident";
type CityType = "Metro" | "Non-Metro";
type Regime = "Old" | "New";

interface Inputs {
  ageGroup: AgeGroup;
  residentialStatus: ResStatus;
  cityType: CityType;
  taxRegime: Regime;
  basicSalary: string;
  hraAllowance: string;
  hraExemption: string;
  ltaAllowance: string;
  ltaExemption: string;
  specialAllowance: string;
  interestIncome: string;
  rentalIncome: string;
  capitalGains: string;
  businessIncome: string;
  otherIncome: string;
  section80C: string;
  section80D: string;
  section80E: string;
  section80TTA: string;
  homeLoanInterest: string;
}

interface Results {
  grossIncome: number;
  exemptions: number;
  deductions: number;
  taxableIncome: number;
  oldTax: number;
  newTax: number;
  chosenTax: number;
  rebateOld: number;
  rebateNew: number;
  cessOld: number;
  cessNew: number;
  distribution: { name: string; value: number }[];
}

const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tooltipIcon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="info-icon">i</span>
      {open && <span className="tooltiptext">{text}</span>}
      <style jsx>{`
        .tooltipIcon {
          position: relative;
          display: inline-block;
          margin-left: 4px;
          cursor: pointer;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          font-size: 0.6rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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

const numberToWords = (num: number): string => {
  if (isNaN(num)) return "";
  num = Math.round(Math.abs(num));
  if (num === 0) return "Zero";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  const helper = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n/100)] +
        " Hundred" +
        (n%100 ? " " + helper(n%100) : "")
      );
    if (n < 100000)
      return (
        helper(Math.floor(n/1000)) +
        " Thousand" +
        (n%1000 ? " " + helper(n%1000) : "")
      );
    if (n < 10000000)
      return (
        helper(Math.floor(n/100000)) +
        " Lakh" +
        (n%100000 ? " " + helper(n%100000) : "")
      );
    return (
      helper(Math.floor(n/10000000)) +
      " Crore" +
      (n%10000000 ? " " + helper(n%10000000) : "")
    );
  };
  return helper(num);
};

const IncomeTaxCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    ageGroup: "Below 60",
    residentialStatus: "Resident",
    cityType: "Metro",
    taxRegime: "Old",
    basicSalary: "",
    hraAllowance: "",
    hraExemption: "",
    ltaAllowance: "",
    ltaExemption: "",
    specialAllowance: "",
    interestIncome: "",
    rentalIncome: "",
    capitalGains: "",
    businessIncome: "",
    otherIncome: "",
    section80C: "",
    section80D: "",
    section80E: "",
    section80TTA: "",
    homeLoanInterest: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = ev.target;
    setInputs(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const fields: (keyof Inputs)[] = [
      "basicSalary","hraAllowance","hraExemption","ltaAllowance","ltaExemption",
      "specialAllowance","interestIncome","rentalIncome","capitalGains",
      "businessIncome","otherIncome","section80C","section80D",
      "section80E","section80TTA","homeLoanInterest"
    ];
    let ok = true;
    const newErr: Partial<Record<keyof Inputs, string>> = {};
    fields.forEach(f => {
      const v = inputs[f]?.trim() || "";
      if (!v || isNaN(+v) || +v < 0) {
        newErr[f] = "Enter a valid number";
        ok = false;
      }
    });
    setErrors(newErr);
    return ok;
  };

  const calculate = () => {
    if (!validate()) return;
    setLoading(true);

    // parse inputs
    const vals: Record<keyof Inputs, number> = Object.fromEntries(
      Object.entries(inputs).map(([k, v]) => [k, parseFloat(v) || 0])
    ) as any;

    const grossIncome =
      vals.basicSalary +
      vals.hraAllowance +
      vals.ltaAllowance +
      vals.specialAllowance +
      vals.interestIncome +
      vals.rentalIncome +
      vals.capitalGains +
      vals.businessIncome +
      vals.otherIncome;

    const exemptions = vals.hraExemption + vals.ltaExemption;
    const deductions =
      75000 +
      vals.section80C +
      vals.section80D +
      vals.section80E +
      vals.section80TTA +
      vals.homeLoanInterest;

    const taxableIncome = Math.max(0, grossIncome - exemptions - deductions);

    // slab calculators
    const slabOld = (ti: number) => {
      let tax = 0;
      if (ti > 250000) tax += (Math.min(ti, 500000) - 250000) * 0.05;
      if (ti > 500000) tax += (Math.min(ti, 1000000) - 500000) * 0.2;
      if (ti > 1000000) tax += (ti - 1000000) * 0.3;
      return tax;
    };
    const slabNew = (ti: number) => {
      let tax = 0;
      if (ti > 400000) tax += (Math.min(ti, 800000) - 400000) * 0.05;
      if (ti > 800000) tax += (Math.min(ti, 1200000) - 800000) * 0.1;
      if (ti > 1200000) tax += (Math.min(ti, 1600000) - 1200000) * 0.15;
      if (ti > 1600000) tax += (Math.min(ti, 2000000) - 1600000) * 0.2;
      if (ti > 2000000) tax += (Math.min(ti, 2400000) - 2000000) * 0.25;
      if (ti > 2400000) tax += (ti - 2400000) * 0.3;
      return tax;
    };

    const oldRaw = slabOld(taxableIncome);
    const newRaw = slabNew(taxableIncome);

    const rebateOld = taxableIncome <= 500000 ? Math.min(oldRaw, 12500) : 0;
    const rebateNew = taxableIncome <= 700000 ? Math.min(newRaw, 25000) : 0;

    const taxedOld = Math.max(0, oldRaw - rebateOld);
    const taxedNew = Math.max(0, newRaw - rebateNew);

    const cessOld = taxedOld * 0.04;
    const cessNew = taxedNew * 0.04;

    const oldTax = taxedOld + cessOld;
    const newTax = taxedNew + cessNew;
    const chosenTax = inputs.taxRegime === "Old" ? oldTax : newTax;

    const distribution = [
      {
        name: "Salary",
        value:
          vals.basicSalary +
          vals.hraAllowance +
          vals.ltaAllowance +
          vals.specialAllowance,
      },
      {
        name: "Other Income",
        value:
          vals.interestIncome +
          vals.rentalIncome +
          vals.capitalGains +
          vals.businessIncome +
          vals.otherIncome,
      },
    ];

    setResults({
      grossIncome,
      exemptions,
      deductions,
      taxableIncome,
      oldTax,
      newTax,
      chosenTax,
      rebateOld,
      rebateNew,
      cessOld,
      cessNew,
      distribution,
    });

    setTimeout(() => setLoading(false), 300);
  };

  const COLORS = ["#108e66", "#272b2a"];

  return (
    <div className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">How Much Income Tax Will I Pay?</h1>
      <p className="description">
        Compare your Old vs New Regime liability for FY 2025–26.
      </p>

      {/* Form */}
      <div className="form-container">
        <h2 className="section-title">Personal Details</h2>
        <div className="input-group">
          {(
            [
              ["ageGroup", "Age Group", "Select your age bracket", ["Below 60","60–79","80+"] as AgeGroup[]],
              ["residentialStatus","Residential Status","Resident or Non-Resident",["Resident","Non-Resident"] as ResStatus[]],
              ["cityType","City Type","Metro or Non-Metro for HRA",["Metro","Non-Metro"] as CityType[]],
              ["taxRegime","Tax Regime","Choose Old or New",["Old","New"] as Regime[]],
            ] as [keyof Inputs, string, string, string[]][]
          ).map(([key,label,tip,opts]) => (
            <label key={key}>
              <span className="input-label">
                {label}
                <TooltipIcon text={tip} />
              </span>
              <select
                name={key}
                value={inputs[key] as string}
                onChange={handleChange}
              >
                {opts.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <h2 className="section-title">Income Details</h2>
        <div className="input-group">
          {(
            [
              ["basicSalary","Basic Salary","Your basic pay"],
              ["hraAllowance","HRA Allowance","House Rent Allowance received"],
              ["hraExemption","HRA Exemption","HRA exempt per rules"],
              ["ltaAllowance","LTA Allowance","Leave Travel Allowance received"],
              ["ltaExemption","LTA Exemption","LTA exempt per rules"],
              ["specialAllowance","Special Allowance","Other allowances"],
              ["interestIncome","Interest Income","Bank/FD interest"],
              ["rentalIncome","Rental Income","Rent from property"],
              ["capitalGains","Capital Gains","Profits on asset sale"],
              ["businessIncome","Business Income","Self-employment income"],
              ["otherIncome","Other Income","Other sources"],
            ] as [keyof Inputs, string, string][]
          ).map(([key,label,tip]) => (
            <label key={key}>
              <span className="input-label">
                {label}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={key}
                value={inputs[key] as string}
                onChange={handleChange}
                placeholder={
                  key === "basicSalary" ? "e.g., 5,00,000" :
                  key === "hraAllowance" ? "e.g., 12,000" :
                  key === "hraExemption" ? "e.g., 8,000" :
                  key === "ltaAllowance" ? "e.g., 5,000" :
                  key === "ltaExemption" ? "e.g., 4,000" :
                  key === "specialAllowance" ? "e.g., 10,000" :
                  key === "interestIncome" ? "e.g., 8,000" :
                  key === "rentalIncome" ? "e.g., 1,20,000" :
                  key === "capitalGains" ? "e.g., 15,000" :
                  key === "businessIncome" ? "e.g., 2,00,000" :
                  key === "otherIncome" ? "e.g., 3,000" :
                  ""
                }
              />
              {!!inputs[key] && (
                <span className="converter">
                  {numberToWords(+inputs[key]!)} Rupees
                </span>
              )}
              {errors[key] && <span className="error">{errors[key]}</span>}
            </label>
          ))}
        </div>

        <h2 className="section-title">Deductions</h2>
        <div className="input-group">
          {(
            [
              ["section80C","Section 80C","Max ₹1.5 L investments"],
              ["section80D","Section 80D","Health insurance"],
              ["section80E","Section 80E","Edu loan interest"],
              ["section80TTA","Section 80TTA","Savings account interest"],
              ["homeLoanInterest","Home Loan Interest","Section 24(b) interest"],
            ] as [keyof Inputs, string, string][]
          ).map(([key,label,tip]) => (
            <label key={key}>
              <span className="input-label">
                {label}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={key}
                value={inputs[key] as string}
                onChange={handleChange}
                placeholder={
                  key === "homeLoanInterest" ? "e.g., 12,000" :
                  ""
                }
              />
              {!!inputs[key] && (
                <span className="converter">
                  {numberToWords(+inputs[key]!)} Rupees
                </span>
              )}
              {errors[key] && <span className="error">{errors[key]}</span>}
            </label>
          ))}
        </div>

        <button
          className="calculate-button"
          onClick={calculate}
          disabled={loading}
        >
          {loading ? "Calculating…" : "Calculate My Tax"}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="results-container">
          <h2 className="results-title">Your Tax Summary</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Gross Income:</strong> ₹
              {results.grossIncome.toLocaleString("en-IN")} (
              {numberToWords(results.grossIncome)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Exemptions:</strong> ₹
              {results.exemptions.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>Deductions:</strong> ₹
              {results.deductions.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>Taxable Income:</strong> ₹
              {results.taxableIncome.toLocaleString("en-IN")}
            </div>
            <div className="summary-item">
              <strong>{inputs.taxRegime} Regime Tax:</strong> ₹
              {results.chosenTax.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="chart-explanation">
            <p>
              Toggle between <strong>Bar Chart</strong> (Old vs New tax) and{" "}
              <strong>Pie Chart</strong> (Income split).
            </p>
          </div>

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

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart
                  data={[
                    { name: "Old Regime", value: results.oldTax },
                    { name: "New Regime", value: results.newTax },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    domain={[0, "dataMax"]}
                    tickFormatter={v => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip formatter={(v: number) => "₹" + v.toLocaleString("en-IN")} />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" name="Tax Payable" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={results.distribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label={(entry) =>
                      `${entry.name}: ₹${entry.value.toLocaleString("en-IN")}`
                    }
                  >
                    {results.distribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <RechartsTooltip
                    formatter={(v: number) => "₹" + v.toLocaleString("en-IN")}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                {inputs.taxRegime === "Old"
                  ? "Boost 80C investments to cut Old Regime tax."
                  : "New Regime has fewer deductions—plan accordingly."}
              </li>
              <li>Max out your HRA & LTA exemptions.</li>
              <li>Top up PPF/EPF under 80C for extra savings.</li>
            </ul>
            
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          background: #fcfffe;
          color: #272b2a;
          font-family: "Poppins", sans-serif;
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
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .form-container,
        .results-container {
          background: #fcfffe;
          border: 1px solid #272b2a;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
        }
        .input-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
        }
        .input-label {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        input,
        select {
          padding: 0.5rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          font-size: 1rem;
        }
        .converter {
          margin-top: 0.25rem;
          font-size: 0.8rem;
          color: #272b2a;
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
          border-radius: 4px;
          padding: 0.75rem;
          width: 100%;
          margin-top: 1rem;
          font-size: 1rem;
          cursor: pointer;
        }
        .calculate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .results-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .summary-card {
          display: grid;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .summary-item {
          font-size: 1rem;
        }
        .chart-explanation {
          background: #fcfffe;
          border-left: 4px solid #108e66;
          padding: 0.75rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .chart-toggle button {
          border: 1px solid #272b2a;
          background: transparent;
          padding: 0.5rem 1rem;
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
        .disclaimer {
          background: #fcfffe;
          border: 1px solid #272b2a;
          border-radius: 8px;
          padding: 1rem;
        }
        .disclaimer h4 {
          margin: 0 0 0.5rem;
          font-weight: 600;
        }
        .disclaimer ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .disclaimer li {
          margin-bottom: 0.4rem;
        }
        .cta-link {
          color: #108e66;
          font-weight: 600;
        }
        @media (max-width: 600px) {
          .input-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default IncomeTaxCalculator;
