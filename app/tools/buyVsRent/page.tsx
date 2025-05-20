"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// -----------------------
// Interfaces
// -----------------------
interface CalculatorInputs {
  propertyPrice: string;
  downPayment: string;
  loanTenure: string;
  interestRate: string;
  propertyAppreciation: string;
  incomeTaxBracket: string;
  maxTaxDeduction: string;
  currentMonthlyRent: string;
  rentInflation: string;
  investmentReturn: string;
}

interface Results {
  emi: string;
  totalEmiPaid: string;
  taxBenefit: string;
  finalHomeValue: string;
  buyingNetWorth: string;
  totalRentPaid: string;
  rentingNetWorth: string;
  decision: string;
  buyingData: Array<{ year: number; netWorth: number; annualCost: number }>;
  rentingData: Array<{ year: number; netWorth: number; annualRent: number }>;
}

// -----------------------
// Tooltip Component
// -----------------------
const Tooltip: React.FC<{ text: string }> = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <span
      className="tooltip"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="info-icon">i</span>
      {isHovered && <span className="tooltiptext">{text}</span>}
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

// -----------------------
// Number to Words Helpers
// -----------------------
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
      return (
        tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "")
      );
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

// -----------------------
// Main Component
// -----------------------
const BuyVsRentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    propertyPrice: "",
    downPayment: "",
    loanTenure: "",
    interestRate: "",
    propertyAppreciation: "",
    incomeTaxBracket: "",
    maxTaxDeduction: "",
    currentMonthlyRent: "",
    rentInflation: "",
    investmentReturn: "",
  });
  const [errors, setErrors] = useState<Partial<CalculatorInputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs: Partial<CalculatorInputs> = {};
    Object.entries(inputs).forEach(([k, v]) => {
      if (!v.trim() || isNaN(Number(v))) errs[k as keyof CalculatorInputs] = "Invalid";
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const calculate = () => {
    if (!validate()) return;
    setIsCalculating(true);
    const P = parseFloat(inputs.propertyPrice);
    const D = parseFloat(inputs.downPayment);
    const T = parseFloat(inputs.loanTenure);
    const r = parseFloat(inputs.interestRate)/100;
    const a = parseFloat(inputs.propertyAppreciation)/100;
    const tb = parseFloat(inputs.incomeTaxBracket)/100;
    const md = parseFloat(inputs.maxTaxDeduction);
    const rent0 = parseFloat(inputs.currentMonthlyRent);
    const ri = parseFloat(inputs.rentInflation)/100;
    const ir = parseFloat(inputs.investmentReturn)/100;

    // EMI
    const L = P - D;
    const mrate = r/12;
    const n = T*12;
    const EMI = (L*mrate*Math.pow(1+mrate,n))/(Math.pow(1+mrate,n)-1);
    const totalEMI = EMI*n;
    const interestPaid = totalEMI - L;
    const taxB = Math.min(interestPaid*tb, md);
    const homeVal = P*Math.pow(1+a,T);
    const buyNW = homeVal - (D+totalEMI) + taxB;

    // Rent & invest
    let rentPaid = 0, rentNW = 0;
    const buyData: Results["buyingData"] = [], rentData: Results["rentingData"] = [];

    for(let i=0;i<T;i++){
      const year = i+1;
      const yrRent = rent0*12*Math.pow(1+ri,i);
      rentPaid += yrRent;
      const buyCost = EMI*12;
      const saved = buyCost - yrRent;
      rentNW += saved*Math.pow(1+ir,T-i);
      const hv = P*Math.pow(1+a,year);
      const paid = EMI*12*year;
      const taxPart = taxB*(year/T);
      buyData.push({ year, netWorth: +(hv - (D+paid) + taxPart).toFixed(2), annualCost: +buyCost.toFixed(2) });
      rentData.push({ year, netWorth: +rentNW.toFixed(2), annualRent: +yrRent.toFixed(2) });
    }

    const decision = buyNW>rentNW
      ? "Buying yields higher wealth"
      : rentNW>buyNW
      ? "Renting & investing yields higher wealth"
      : "Both are comparable";

    setResults({
      emi: EMI.toFixed(2),
      totalEmiPaid: totalEMI.toFixed(2),
      taxBenefit: taxB.toFixed(2),
      finalHomeValue: homeVal.toFixed(2),
      buyingNetWorth: buyNW.toFixed(2),
      totalRentPaid: rentPaid.toFixed(2),
      rentingNetWorth: rentNW.toFixed(2),
      decision,
      buyingData: buyData,
      rentingData: rentData,
    });
    setTimeout(()=>setIsCalculating(false),300);
  };

  // chart data
  const combined = results?.buyingData.map((b,i)=>( {
    year: b.year,
    "Buying NW": b.netWorth,
    "Renting NW": results.rentingData[i].netWorth
  }));

  return (
    <main className="container">
      {/* Top nav */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Should I Buy or Rent a Home?</h1>
      <p className="description">
        Enter your details below to compare <strong>home-ownership</strong> vs. <strong>rent-and-invest</strong> 
        over your loan tenure.
      </p>

      {/* Explanation */}
      <div className="explanation">
        <p>
          <strong>Buying vs. Renting:</strong> This tool factors in your <em>EMI</em>, <em>property appreciation</em>, 
          and <em>tax deductions</em> when buying—versus <em>rent inflation</em> and <em>investment returns</em> 
          on your savings when renting.
        </p>
        <p>
          Over your chosen <strong>loan tenure</strong>, you'll see year-by-year <strong>net worth</strong> and 
          <strong>cashflows</strong> for both scenarios. Use this to visualize which approach may 
          <strong>build more wealth</strong>—then weigh flexibility and maintenance before you decide.
        </p>
      </div>

      {/* Form */}
      <section className="form-container">
        <h2 className="section-title">Buying Details</h2>
        <div className="input-grid">
          {[
            { name:"propertyPrice", label:"Property Price (₹)", placeholder:"e.g., ₹75,00,000 INR", tip:"Total cost of the home" },
            { name:"downPayment",   label:"Down Payment (₹)",   placeholder:"e.g., ₹15,00,000 INR", tip:"Upfront payment" },
            { name:"loanTenure",    label:"Loan Tenure (yrs)",   placeholder:"e.g., 20",       tip:"Duration in years" },
            { name:"interestRate",  label:"Interest Rate (%)",   placeholder:"e.g., 7.5%",     tip:"Annual interest rate" },
            { name:"propertyAppreciation", label:"Appreciation (%)", placeholder:"e.g., 3%",      tip:"Yearly home value growth" },
            { name:"incomeTaxBracket",     label:"Tax Bracket (%)",   placeholder:"e.g., 30%",     tip:"For interest deduction" },
            { name:"maxTaxDeduction",      label:"Max Deduction (₹)", placeholder:"e.g., ₹2,00,000 INR",  tip:"Upper limit" },
          ].map(f => (
            <label key={f.name}>
              <span className="input-label">
                {f.label}
                <Tooltip text={f.tip} />
              </span>
              <input
                type="number"
                name={f.name}
                value={(inputs as any)[f.name]}
                onChange={handleInputChange}
                placeholder={f.placeholder}
                className="pr-6"
              />
              <small className="converter">
                {((inputs as any)[f.name] && numberToWords(Number((inputs as any)[f.name]))) || ""} 
                {f.placeholder.endsWith("%")?" percent":" Rupees"}
              </small>
              {errors[f.name as keyof CalculatorInputs] && (
                <small className="error">Invalid</small>
              )}

            </label>
          ))}
        </div>

        <hr className="divider" />

        <h2 className="section-title">Renting Details</h2>
        <div className="input-grid">
          {[
            { name:"currentMonthlyRent", label:"Monthly Rent (₹)", placeholder:"e.g., 20,000", tip:"Your current rent" },
            { name:"rentInflation",      label:"Rent Inflation (%)", placeholder:"e.g., 5%", tip:"Yearly increase" },
            { name:"investmentReturn",   label:"Investment Return (%)", placeholder:"e.g., 8%", tip:"On saved difference" },
          ].map(f => (
            <label key={f.name}>
              <span className="input-label">
                {f.label}
                <Tooltip text={f.tip} />
              </span>
              <input
                type="number"
                name={f.name}
                value={(inputs as any)[f.name]}
                onChange={handleInputChange}
                placeholder={f.placeholder}
              />
              <small className="converter">
                {((inputs as any)[f.name] && numberToWords(Number((inputs as any)[f.name]))) || ""} 
                {f.label.endsWith("%")?" percent":" Rupees"}
              </small>
              {errors[f.name as keyof CalculatorInputs] && (
                <small className="error">Invalid</small>
              )}
            </label>
          ))}
        </div>

        <button
          className="calculate-button"
          onClick={calculate}
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating…" : "Calculate"}
        </button>
      </section>

      {/* Results */}
      {results && (
        <section className="results-container">
          <h2 className="results-title">Comparison Results</h2>
          <div className="decision-banner">
            <strong>{results.decision}</strong>
          </div>

          {/* Net Worth Chart */}
          {combined && (
            <div className="chart-container">
              <ResponsiveContainer width="90%" height={300}>
                <LineChart data={combined} margin={{ top:20,right:30,left:50,bottom:20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value:"Year", position:"insideBottom", offset:-5 }} />
                  <YAxis tickFormatter={v=>v.toLocaleString("en-IN")} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Buying NW" stroke="#108e66" strokeWidth={2} />
                  <Line type="monotone" dataKey="Renting NW" stroke="#525ecc" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Yearly Table */}
          <h3 className="results-subtitle">Year-wise Breakdown</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Buying Net Worth (₹)</th>
                  <th>Renting Net Worth (₹)</th>
                  <th>Annual EMI (₹)</th>
                  <th>Annual Rent (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.buyingData.map((b,i) => (
                  <tr key={b.year}>
                    <td>{b.year}</td>
                    <td>{b.netWorth.toLocaleString("en-IN")}</td>
                    <td>{results.rentingData[i].netWorth.toLocaleString("en-IN")}</td>
                    <td>{b.annualCost.toLocaleString("en-IN")}</td>
                    <td>{results.rentingData[i].annualRent.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>Maintenance & repairs are extra for homeowners.</li>
              <li>Flexibility and mobility favor renting.</li>
              <li>Market volatility affects both property and investments.</li>
              <li>Your personal time horizon may tilt the decision.</li>
            </ul>
            <p>Please consult a financial advisor before making any major decision.</p>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #FCFFFE;
          color: #272B2A;
        }
        .top-nav { margin-bottom:1rem; }
        .back-button {
          background:#108e66; color:#FCFFFE;
          border:none; padding:.5rem 1rem;
          border-radius:4px; cursor:pointer;
          font-family:"Poppins",sans-serif;
        }
        .title {
          text-align:center; font-size:2.5rem; font-weight:700;
          margin-bottom:.5rem;
        }
        .description {
          text-align:center; font-size:1.1rem;
          margin-bottom:1.5rem;
        }
        .explanation {
          background:#FCFFFE; padding:1rem;
          border-radius:8px; margin-bottom:1.5rem;
          border-left:4px solid #108e66;
        }
        .explanation p { margin:.5rem 0; line-height:1.5; }
        .form-container {
          background:#FCFFFE; padding:2rem;
          border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);
          margin-bottom:2rem;
        }
        .section-title { font-size:1.5rem; font-weight:600; margin:1rem 0; }
        .input-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:1rem; margin-bottom:1rem;
        }
        label { display:flex; flex-direction:column; }
        .input-label { font-weight:500; display:flex; align-items:center; }
        input {
          margin-top:.3rem; padding:.5rem;
          border:1px solid #272B2A; border-radius:4px;
          font-size:1rem; background:#FCFFFE; color:#272B2A;
        }
        .converter {
          font-size:.85rem; color:#272B2A; opacity:.7;
          margin-top:.25rem;
        }
        .error { color:red; font-size:.8rem; }
        .divider {
          border:none; border-top:1px solid #ccc;
          margin:2rem 0;
        }
        .calculate-button {
          width:100%; padding:.75rem; font-size:1rem;
          background:#108e66; color:#FCFFFE; border:none;
          border-radius:4px; cursor:pointer;
        }
        .calculate-button:disabled { opacity:.6; cursor:not-allowed; }
        .results-container {
          background:#FCFFFE; padding:2rem;
          border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);
        }
        .results-title { text-align:center; font-size:1.8rem; font-weight:600; margin-bottom:1rem; }
        .decision-banner {
          background:#108e66; color:#FCFFFE;
          padding:.75rem; border-radius:4px; text-align:center;
          margin-bottom:1.5rem;
        }
        .chart-container { margin:2rem 0; display:flex; justify-content:center; }
        .results-subtitle { font-size:1.3rem; font-weight:600; margin:2rem 0 1rem; }
        .table-wrap { overflow-x:auto; }
        table {
          width:100%; border-collapse:collapse;
          margin-bottom:1.5rem;
        }
        th,td {
          border:1px solid #272B2A; padding:.5rem;
          text-align:center; font-size:.9rem;
        }
        th { background:#108e66; color:#FCFFFE; position:sticky; top:0; }
        .disclaimer {
          background:#FCFFFE; border:1px solid #ccc; padding:1rem;
          border-radius:4px; font-size:.9rem;
        }
        .disclaimer h4 { margin-top:0; }
        .disclaimer ul { padding-left:1.2rem; }
        .disclaimer li { margin-bottom:.5rem; }
        @media (max-width:768px) {
          .input-grid { grid-template-columns:1fr; }
        }
      `}</style>
    </main>
  );
};

export default BuyVsRentCalculator;
