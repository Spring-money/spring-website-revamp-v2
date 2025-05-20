/*  /app/tools/ctc-vs-inhand/page.tsx
    CTC vs In-Hand Salary Calculator – Spring Money
---------------------------------------------------------------- */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ──────────────────────────
   Interfaces
────────────────────────── */
interface CalculatorInputs {
  annualCTC: string; // Annual CTC (INR)
  bonusPercentage: string; // Bonus % of CTC
  monthlyProfessionalTax: string; // Monthly professional tax
  monthlyEmployerPF: string; // Monthly employer PF contribution
  monthlyEmployeePF: string; // Monthly employee PF contribution
  additionalMonthlyDeductions: string; // Any other monthly deductions
  /* Optional */
  incomeTaxSlab?: string; // Income-tax slab %
  hraAllowances?: string; // HRA / other exempt allowances (INR)
}

interface SalaryBreakdown {
  grossAnnualSalary: number;
  annualBonus: number;
  totalMonthlyDeductions: number;
  totalAnnualDeductions: number;
  takeHomeAnnualBeforeTax: number;
  takeHomeMonthlyBeforeTax: number;
  taxPaid?: number;
  finalTakeHomeAnnual?: number;
  finalTakeHomeMonthly?: number;
}

interface Results {
  breakdown: SalaryBreakdown;
}

/* For Recharts */
interface ChartData {
  name: string;
  value: number;
}
interface BarData {
  name: string;
  monthly: number;
}

/* ──────────────────────────
   Tooltip Icon
────────────────────────── */
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
          margin-left: 5px;
          cursor: pointer;
        }
        .info-icon {
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          font-size: 0.6rem;
          width: 14px;
          height: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .tooltiptext {
          visibility: visible;
          width: 220px;
          background: #108e66;
          color: #fcfffe;
          padding: 6px 8px;
          border-radius: 4px;
          position: absolute;
          z-index: 1000;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          line-height: 1.2;
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

/* ──────────────────────────
   Utils
────────────────────────── */
const numberToWords = (num: number): string => {
  if (isNaN(num)) return "";
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
  const helper = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100)
      return `${tens[Math.floor(n / 10)]}${n % 10 ? " " + ones[n % 10] : ""}`;
    if (n < 1000)
      return `${ones[Math.floor(n / 100)]} Hundred${
        n % 100 ? " " + helper(n % 100) : ""
      }`;
    if (n < 100000)
      return `${helper(Math.floor(n / 1000))} Thousand${
        n % 1000 ? " " + helper(n % 1000) : ""
      }`;
    if (n < 10000000)
      return `${helper(Math.floor(n / 100000))} Lakh${
        n % 100000 ? " " + helper(n % 100000) : ""
      }`;
    return `${helper(Math.floor(n / 10000000))} Crore${
      n % 10000000 ? " " + helper(n % 10000000) : ""
    }`;
  };
  return helper(Math.round(Math.abs(num)));
};
const toWordsRupees = (n: number) => `${numberToWords(n)} Rupees`;

/* ──────────────────────────
   Main Component
────────────────────────── */
const CTCvsInHandCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    annualCTC: "",
    bonusPercentage: "",
    monthlyProfessionalTax: "",
    monthlyEmployerPF: "",
    monthlyEmployeePF: "",
    additionalMonthlyDeductions: "",
    incomeTaxSlab: "",
    hraAllowances: "",
  });
  const [errors, setErrors] = useState<Partial<CalculatorInputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  /* ------- handlers ------- */
  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const req = [
      "annualCTC",
      "bonusPercentage",
      "monthlyProfessionalTax",
      "monthlyEmployerPF",
      "monthlyEmployeePF",
      "additionalMonthlyDeductions",
    ];
    const newErr: Partial<CalculatorInputs> = {};
    req.forEach((k) => {
      const v = inputs[k as keyof CalculatorInputs];
      if (!v || isNaN(+v) || +v < 0)
        newErr[k as keyof CalculatorInputs] = "Enter valid number";
    });
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  /* ------- calculate ------- */
  const calc = () => {
    if (!validate()) return;
    setCalculating(true);

    const annualCTC = +inputs.annualCTC;
    const bonusPerc = +inputs.bonusPercentage / 100;
    const monthlyProfTax = +inputs.monthlyProfessionalTax;
    const monthlyErPF = +inputs.monthlyEmployerPF;
    const monthlyEePF = +inputs.monthlyEmployeePF;
    const addMonthlyDed = +inputs.additionalMonthlyDeductions;
    const taxSlab = inputs.incomeTaxSlab ? +inputs.incomeTaxSlab / 100 : 0;
    const hraAllow = inputs.hraAllowances ? +inputs.hraAllowances : 0;

    const annualBonus = annualCTC * bonusPerc;
    const grossAnnualSalary = annualCTC - annualBonus;
    const totalMonthlyDed =
      monthlyProfTax + monthlyErPF + monthlyEePF + addMonthlyDed;
    const totalAnnualDed = totalMonthlyDed * 12;
    const takeHomeAnnualBTax = grossAnnualSalary - totalAnnualDed + annualBonus;
    const takeHomeMonthlyBTax = takeHomeAnnualBTax / 12;

    let taxPaid = 0,
      finalAnnual = takeHomeAnnualBTax,
      finalMonthly = takeHomeMonthlyBTax;
    if (taxSlab > 0) {
      const taxable = grossAnnualSalary - hraAllow;
      taxPaid = taxable * taxSlab;
      finalAnnual = takeHomeAnnualBTax - taxPaid;
      finalMonthly = finalAnnual / 12;
    }

    setResults({
      breakdown: {
        grossAnnualSalary,
        annualBonus,
        totalMonthlyDeductions: totalMonthlyDed,
        totalAnnualDeductions: totalAnnualDed,
        takeHomeAnnualBeforeTax: takeHomeAnnualBTax,
        takeHomeMonthlyBeforeTax: takeHomeMonthlyBTax,
        ...(taxSlab > 0
          ? {
              taxPaid,
              finalTakeHomeAnnual: finalAnnual,
              finalTakeHomeMonthly: finalMonthly,
            }
          : {}),
      },
    });
    setTimeout(() => setCalculating(false), 600);
  };

  /* ----------------- pie / bar data ----------------- */
  const PIE_COLORS = ["#108e66", "#525ECC", "#272B2A", "#108e66", "#525ECC"];
  const pieData: ChartData[] = results
    ? (() => {
        const {
          grossAnnualSalary,
          annualBonus,
          totalAnnualDeductions,
          takeHomeAnnualBeforeTax,
          taxPaid = 0,
        } = results.breakdown;
        const net = taxPaid
          ? results.breakdown.finalTakeHomeAnnual || takeHomeAnnualBeforeTax
          : takeHomeAnnualBeforeTax;
        return [
          { name: "Gross Salary (excl. Bonus)", value: grossAnnualSalary },
          { name: "Bonus", value: annualBonus },
          { name: "Deductions", value: totalAnnualDeductions },
          { name: "Tax (If any)", value: taxPaid },
          { name: "Net In-Hand", value: net },
        ];
      })()
    : [];

  const barData: BarData[] = results
    ? (() => {
        const {
          totalMonthlyDeductions,
          taxPaid = 0,
          takeHomeMonthlyBeforeTax,
          finalTakeHomeMonthly,
        } = results.breakdown;
        const net = taxPaid
          ? finalTakeHomeMonthly || takeHomeMonthlyBeforeTax
          : takeHomeMonthlyBeforeTax;
        return [
          { name: "Gross Monthly", monthly: +inputs.annualCTC / 12 },
          { name: "Monthly Deductions", monthly: totalMonthlyDeductions },
          { name: "Net In-Hand", monthly: net },
        ];
      })()
    : [];

  /* ================= RENDER ================= */
  return (
    <div className="container">
      {/* back */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">CTC vs In-Hand Salary Calculator</h1>
      <p className="description">
        Enter your CTC details to see your estimated monthly take-home pay.
      </p>
      <div className="explanation">
        <p>
          <strong>CTC vs In-Hand Salary:</strong> This calculator helps you break down your <strong>Cost-to-Company (CTC)</strong> into your actual <strong>monthly take-home pay</strong> by accounting for bonuses, PF contributions, professional tax, and other deductions.
        </p>
        <p>
          Understand the difference between your total CTC and what you actually receive in your bank account each month. Use this tool to plan your finances, negotiate offers, and avoid surprises in your payslip.
        </p>
      </div>

      {/* ---------- FORM ---------- */}
      <div className="form-container">
        <h2 className="section-title">Salary & Deductions</h2>
        <div className="input-group">
          {/* Annual CTC */}
          <label>
            <span className="input-label">
              Annual CTC (INR){" "}
              <TooltipIcon text="Total cost-to-company per year." />
            </span>
            <input
              type="number"
              name="annualCTC"
              value={inputs.annualCTC}
              onChange={handle}
              placeholder="e.g., 12,00,000"
            />
            {errors.annualCTC && (
              <span className="error">{errors.annualCTC}</span>
            )}
          </label>

          {/* Bonus % */}
          <label>
            <span className="input-label">
              Bonus % of CTC{" "}
              <TooltipIcon text="Annual performance / festive bonus percentage." />
            </span>
            <input
              type="number"
              name="bonusPercentage"
              value={inputs.bonusPercentage}
              onChange={handle}
              placeholder="e.g., 15"
            />
            {errors.bonusPercentage && (
              <span className="error">{errors.bonusPercentage}</span>
            )}
          </label>

          {/* Prof Tax */}
          <label>
            <span className="input-label">
              Monthly Professional Tax (INR){" "}
              <TooltipIcon text="Deducted by some state governments." />
            </span>
            <input
              type="number"
              name="monthlyProfessionalTax"
              value={inputs.monthlyProfessionalTax}
              onChange={handle}
              placeholder="e.g., 200"
            />
            {errors.monthlyProfessionalTax && (
              <span className="error">{errors.monthlyProfessionalTax}</span>
            )}
          </label>

          {/* Employer PF */}
          <label>
            <span className="input-label">
              Employer PF (INR / month){" "}
              <TooltipIcon text="Company's EPF contribution each month." />
            </span>
            <input
              type="number"
              name="monthlyEmployerPF"
              value={inputs.monthlyEmployerPF}
              onChange={handle}
              placeholder="e.g., 1,800"
            />
            {errors.monthlyEmployerPF && (
              <span className="error">{errors.monthlyEmployerPF}</span>
            )}
          </label>

          {/* Employee PF */}
          <label>
            <span className="input-label">
              Employee PF (INR / month){" "}
              <TooltipIcon text="Your share of EPF deducted from salary." />
            </span>
            <input
              type="number"
              name="monthlyEmployeePF"
              value={inputs.monthlyEmployeePF}
              onChange={handle}
              placeholder="e.g., 1,800"
            />
            {errors.monthlyEmployeePF && (
              <span className="error">{errors.monthlyEmployeePF}</span>
            )}
          </label>

          {/* Other deductions */}
          <label>
            <span className="input-label">
              Other Monthly Deductions (INR){" "}
              <TooltipIcon text="Insurance premiums, loan EMIs, etc." />
            </span>
            <input
              type="number"
              name="additionalMonthlyDeductions"
              value={inputs.additionalMonthlyDeductions}
              onChange={handle}
              placeholder="e.g., 2,000"
            />
            {errors.additionalMonthlyDeductions && (
              <span className="error">
                {errors.additionalMonthlyDeductions}
              </span>
            )}
          </label>
        </div>

        {/* Optional */}
        <h2 className="section-title">Optional: Tax & Allowances</h2>
        <div className="input-group">
          <label>
            <span className="input-label">
              Income-Tax Slab (%){" "}
              <TooltipIcon text="Your highest tax slab (old regime)." />
            </span>
            <input
              type="number"
              name="incomeTaxSlab"
              value={inputs.incomeTaxSlab}
              onChange={handle}
              placeholder="e.g., 20"
            />
          </label>
          <label>
            <span className="input-label">
              HRA / Exempt Allowances (INR){" "}
              <TooltipIcon text="Tax-free allowances like HRA, LTA, etc." />
            </span>
            <input
              type="number"
              name="hraAllowances"
              value={inputs.hraAllowances}
              onChange={handle}
              placeholder="e.g., 50,000"
            />
          </label>
        </div>

        <button
          className="calculate-button"
          onClick={calc}
          disabled={calculating}
        >
          {calculating ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ---------- RESULTS ---------- */}
      {results && (
        <div className="results-container">
          <h2 className="results-title">Salary Breakdown</h2>
          <div className="summary-card">
            {(
              [
                [
                  "Gross Annual (excl. Bonus)",
                  results.breakdown.grossAnnualSalary,
                ],
                ["Annual Bonus", results.breakdown.annualBonus],
                ["Annual Deductions", results.breakdown.totalAnnualDeductions],
                [
                  "Take-Home Annual (pre-tax)",
                  results.breakdown.takeHomeAnnualBeforeTax,
                ],
                [
                  "Take-Home Monthly (pre-tax)",
                  results.breakdown.takeHomeMonthlyBeforeTax,
                ],
              ] as [string, number][]
            ).map(([label, val]) => (
              <div className="summary-item" key={label}>
                <strong>{label}:</strong> ₹{val.toLocaleString("en-IN")} (
                {toWordsRupees(val)})
              </div>
            ))}
            {results.breakdown.taxPaid !== undefined && (
              <>
                <div className="summary-item">
                  <strong>Estimated Tax Paid:</strong> ₹
                  {results.breakdown.taxPaid.toLocaleString("en-IN")} (
                  {toWordsRupees(results.breakdown.taxPaid)})
                </div>
                <div className="summary-item">
                  <strong>Final Take-Home (Annual):</strong> ₹
                  {results.breakdown.finalTakeHomeAnnual!.toLocaleString(
                    "en-IN"
                  )}{" "}
                  ({toWordsRupees(results.breakdown.finalTakeHomeAnnual!)})
                </div>
                <div className="summary-item">
                  <strong>Final Take-Home (Monthly):</strong> ₹
                  {results.breakdown.finalTakeHomeMonthly!.toLocaleString(
                    "en-IN"
                  )}{" "}
                  ({toWordsRupees(results.breakdown.finalTakeHomeMonthly!)})
                </div>
              </>
            )}
          </div>

          {/* Chart toggle */}
          <h2 className="results-title">Visual Comparison</h2>
          <div className="chart-toggle">
            <button
              onClick={() => setChartType("pie")}
              className={chartType === "pie" ? "active" : ""}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={chartType === "bar" ? "active" : ""}
            >
              Bar Chart
            </button>
          </div>

          {chartType === "pie" ? (
            <PieChartContainer data={pieData} colors={PIE_COLORS} />
          ) : (
            <BarChartContainer data={barData} />
          )}

          {/* footnote */}
          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>This is an estimate based on the inputs provided.</li>
              <li>
                Actual take-home may vary with changing tax laws or allowances.
              </li>
              <li>
                Consult your HR or a tax professional for personalised advice.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ---- styles ---- */}
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
          margin-bottom: 1.5rem;
        }
        .form-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin: 1rem 0;
        }
        .input-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 1rem;
        }
        input {
          padding: 0.5rem;
          margin-top: 0.4rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          font-size: 1rem;
        }
        .error {
          color: red;
          font-size: 0.8rem;
        }
        .calculate-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          width: 100%;
        }
        .calculate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .results-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .results-title {
          text-align: center;
          font-size: 1.6rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .summary-card {
          display: grid;
          gap: 0.7rem;
          margin-bottom: 1.3rem;
        }
        .summary-item {
          font-size: 1rem;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
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
        .chart-toggle button {
          background: transparent;
          border: 1px solid #272b2a;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          margin: 1rem 0 2rem;
        }
        .disclaimer {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #272b2a;
          font-size: 0.9rem;
        }
        ul {
          margin: 0;
          padding-left: 1.3rem;
        }
        li {
          margin-bottom: 0.4rem;
        }
        @media (max-width: 768px) {
          .input-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

/* ---------- Chart components ---------- */
const PieChartContainer: React.FC<{ data: ChartData[]; colors: string[] }> = ({
  data,
  colors,
}) => (
  <div className="chart-container">
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <RechartsTooltip
          formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
        />
        <Legend verticalAlign="bottom" />
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const BarChartContainer: React.FC<{ data: BarData[] }> = ({ data }) => (
  <div className="chart-container">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
        <RechartsTooltip
          formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
        />
        <Legend />
        <Bar dataKey="monthly" fill="#108e66" name="Amount (Monthly)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default CTCvsInHandCalculator;
