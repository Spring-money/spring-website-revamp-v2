/*  /app/tools/monthly-budget-planner/page.tsx
    Monthly Budget Calculator – Spring Money
---------------------------------------------------------------- */
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

/* ──────────────────────────
   Type Definitions
────────────────────────── */
interface Inputs {
  /* Income */
  totalSalary: string;
  rentalIncome?: string;
  otherIncome?: string;
  /* Essentials */
  housing?: string;
  groceries: string;
  utilities: string;
  insurance: string;
  transport: string;
  medical: string;
  education?: string;
  /* Lifestyle */
  entertainment: string;
  shopping: string;
  travel?: string;
  personal: string;
  /* Savings */
  sip?: string;
  rdFd?: string;
  provident?: string;
  emergencyFund?: string;
}

interface Results {
  totalIncome: number;
  totalExpenses: number;
  essentialTotal: number;
  lifestyleTotal: number;
  savingsTotal: number;
  surplusDeficit: number;
  savingsRatio: number;
  expenseDistribution: { name: string; value: number }[];
  barData: { name: string; value: number }[];
  cashflow: { category: string; monthly: number; yearly: number }[];
}

/* ──────────────────────────
   Tooltip Icon
────────────────────────── */
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
          margin-left: 5px;
          cursor: pointer;
          vertical-align: middle;
        }
        .info-icon {
          display: inline-block;
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          font-size: 0.6rem;
          width: 14px;
          height: 14px;
          text-align: center;
          line-height: 14px;
          font-weight: bold;
        }
        .tooltiptext {
          visibility: visible;
          width: 220px;
          background-color: #108e66;
          color: #fcfffe;
          text-align: left;
          border-radius: 4px;
          padding: 6px 8px;
          position: absolute;
          z-index: 1000;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          line-height: 1.2;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
   Helper: number → words (Indian system)
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
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
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

/* ──────────────────────────
   Component
────────────────────────── */
const MonthlyBudgetCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    totalSalary: "",
    rentalIncome: "",
    otherIncome: "",
    housing: "",
    groceries: "",
    utilities: "",
    insurance: "",
    transport: "",
    medical: "",
    education: "",
    entertainment: "",
    shopping: "",
    travel: "",
    personal: "",
    sip: "",
    rdFd: "",
    provident: "",
    emergencyFund: "",
  });
  const [errors, setErrors] = useState<Partial<Inputs>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  /* generic change handler */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* validation (required fields) */
  const validate = () => {
    const must: (keyof Inputs)[] = [
      "totalSalary",
      "groceries",
      "utilities",
      "insurance",
      "transport",
      "medical",
      "entertainment",
      "shopping",
      "personal",
    ];
    const newErr: Partial<Inputs> = {};
    must.forEach((k) => {
      if (!inputs[k] || isNaN(+inputs[k]!) || +inputs[k]! < 0)
        newErr[k] = "Enter a valid number";
    });
    Object.entries(inputs).forEach(([k, v]) => {
      if (!newErr[k as keyof Inputs] && v && (isNaN(+v) || +v < 0))
        newErr[k as keyof Inputs] = "Enter a valid number";
    });
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  /* compute results */
  const calculate = () => {
    if (!validate()) return;
    setLoading(true);

    /* convert blank → 0 */
    const v = Object.fromEntries(
      Object.entries(inputs).map(([k, val]) => [k, val ? parseFloat(val) : 0])
    ) as Record<keyof Inputs, number>;

    const totalIncome = v.totalSalary + v.rentalIncome + v.otherIncome;
    const essentialTotal =
      v.housing +
      v.groceries +
      v.utilities +
      v.insurance +
      v.transport +
      v.medical +
      v.education;
    const lifestyleTotal =
      v.entertainment + v.shopping + v.travel + v.personal;
    const savingsTotal =
      v.sip + v.rdFd + v.provident + v.emergencyFund;
    const totalExpenses = essentialTotal + lifestyleTotal + savingsTotal;
    const surplusDeficit = totalIncome - totalExpenses;
    const savingsRatio = totalIncome ? (savingsTotal / totalIncome) * 100 : 0;

    const expenseDistribution = [
      { name: "Essential", value: essentialTotal },
      { name: "Lifestyle", value: lifestyleTotal },
      { name: "Savings", value: savingsTotal },
    ];
    const barData = [
      { name: "Income", value: totalIncome },
      { name: "Expenses", value: totalExpenses },
    ];
    const cashflow = [
      {
        category: "Income",
        monthly: totalIncome,
        yearly: totalIncome * 12,
      },
      {
        category: "Essentials",
        monthly: essentialTotal,
        yearly: essentialTotal * 12,
      },
      {
        category: "Lifestyle",
        monthly: lifestyleTotal,
        yearly: lifestyleTotal * 12,
      },
      {
        category: "Savings",
        monthly: savingsTotal,
        yearly: savingsTotal * 12,
      },
      {
        category: "Surplus / Deficit",
        monthly: surplusDeficit,
        yearly: surplusDeficit * 12,
      },
    ];

    setResults({
      totalIncome,
      totalExpenses,
      essentialTotal,
      lifestyleTotal,
      savingsTotal,
      surplusDeficit,
      savingsRatio,
      expenseDistribution,
      barData,
      cashflow,
    });
    setTimeout(() => setLoading(false), 350);
  };

  const PIE_COLORS = ["#108e66", "#272b2a", "#888888"];

  /* ------------------------------------------------------------------ */
  return (
    <div className="container">
      {/* Back button */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Monthly Budget Calculator</h1>
      <p className="description">
        Know exactly where your money goes every month.
      </p>
      <div className="explanation">
  <p>
    <strong>Monthly Budget Calculator:</strong> A monthly budget helps you plan and manage your income and expenses effectively. It gives you a clear view of your <strong>spending habits</strong> and helps identify areas to <strong>save or cut back</strong>.
  </p>
  <p>
    This calculator allows you to input your <strong>monthly income</strong> and categorize your <strong>expenses</strong> (like rent, groceries, utilities, etc.). It then shows you your <strong>total expenses</strong> and how much you have <strong>leftover or overspent</strong>, making it easier to take control of your finances.
  </p>
</div>

      {/* ─── Form ─── */}
      <div className="form-container">
        {/* ===== Income ===== */}
        <h2 className="section-title">Income</h2>
        <div className="input-group">
          {[
            [
              "totalSalary",
              "Total Monthly Salary (INR)",
              "Enter your take-home salary.",
              "e.g., 65,000",
            ],
            [
              "rentalIncome",
              "Rental Income (Optional)",
              "Income from property rent (if any).",
              "e.g., 12,000",
            ],
            [
              "otherIncome",
              "Other Income (Optional)",
              "Freelance, dividends, etc.",
              "e.g., 5,000",
            ],
          ].map(([k, lbl, tip, ph]) => (
            <label key={k}>
              <span className="input-label">
                {lbl}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={k}
                placeholder={ph}
                value={(inputs as any)[k]}
                onChange={handleChange}
              />
              {(inputs as any)[k] && (
                <span className="converter">
                  {numberToWords(+inputs[k as keyof Inputs]!)} Rupees
                </span>
              )}
              {errors[k as keyof Inputs] && (
                <span className="error">{errors[k as keyof Inputs]}</span>
              )}
            </label>
          ))}
        </div>

        {/* ===== Essential Expenses ===== */}
        <h2 className="section-title">Essential Expenses</h2>
        <div className="input-group">
          {[
            [
              "housing",
              "Rent / Home EMI (Optional)",
              "Monthly rent or housing loan.",
              "e.g., 15,000",
            ],
            [
              "groceries",
              "Groceries & Food (INR)",
              "Daily essentials & staples.",
              "e.g., 8,000",
            ],
            [
              "utilities",
              "Utilities (INR)",
              "Electricity, internet, gas, etc.",
              "e.g., 3,000",
            ],
            [
              "insurance",
              "Insurance Premiums (INR)",
              "Health, term or vehicle.",
              "e.g., 2,500",
            ],
            [
              "transport",
              "Transport / Fuel (INR)",
              "Fuel, metro, cab, bus.",
              "e.g., 4,000",
            ],
            [
              "medical",
              "Medical Expenses (INR)",
              "Medicines, doctor visits.",
              "e.g., 2,000",
            ],
            [
              "education",
              "Education Fees (Optional)",
              "School, college or courses.",
              "e.g., 3,500",
            ],
          ].map(([k, lbl, tip, ph]) => (
            <label key={k}>
              <span className="input-label">
                {lbl}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={k}
                placeholder={ph}
                value={(inputs as any)[k]}
                onChange={handleChange}
              />
              {(inputs as any)[k] && (
                <span className="converter">
                  {numberToWords(+inputs[k as keyof Inputs]!)} Rupees
                </span>
              )}
              {errors[k as keyof Inputs] && (
                <span className="error">{errors[k as keyof Inputs]}</span>
              )}
            </label>
          ))}
        </div>

        {/* ===== Lifestyle ===== */}
        <h2 className="section-title">Lifestyle Expenses</h2>
        <div className="input-group">
          {[
            [
              "entertainment",
              "Dining & Entertainment (INR)",
              "Restaurants, movies, OTT.",
              "e.g., 2,500",
            ],
            [
              "shopping",
              "Shopping (INR)",
              "Clothes, gadgets, gifts.",
              "e.g., 3,000",
            ],
            [
              "travel",
              "Travel & Vacations (Optional)",
              "Weekend trips or holidays.",
              "e.g., 5,000",
            ],
            [
              "personal",
              "Personal Care & Misc. (INR)",
              "Gym, salon, subscriptions.",
              "e.g., 1,500",
            ],
          ].map(([k, lbl, tip, ph]) => (
            <label key={k}>
              <span className="input-label">
                {lbl}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={k}
                placeholder={ph}
                value={(inputs as any)[k]}
                onChange={handleChange}
              />
              {(inputs as any)[k] && (
                <span className="converter">
                  {numberToWords(+inputs[k as keyof Inputs]!)} Rupees
                </span>
              )}
              {errors[k as keyof Inputs] && (
                <span className="error">{errors[k as keyof Inputs]}</span>
              )}
            </label>
          ))}
        </div>

        {/* ===== Savings ===== */}
        <h2 className="section-title">Savings & Investments (Optional)</h2>
        <div className="input-group">
          {[
            ["sip", "SIP / Mutual Funds", "Monthly mutual-fund SIP.", "e.g., 6000"],
            ["rdFd", "RD / FD", "Recurring or fixed deposits.", "e.g., 3000"],
            ["provident", "PPF / EPF / NPS", "Provident & pension.", "e.g., 5000"],
            ["emergencyFund", "Emergency Fund", "Buffer for rainy days.", "e.g., 4000"],
          ].map(([k, lbl, tip, ph]) => (
            <label key={k}>
              <span className="input-label">
                {lbl}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                name={k}
                placeholder={ph}
                value={(inputs as any)[k]}
                onChange={handleChange}
              />
              {(inputs as any)[k] && (
                <span className="converter">
                  {numberToWords(+inputs[k as keyof Inputs]!)} Rupees
                </span>
              )}
              {errors[k as keyof Inputs] && (
                <span className="error">{errors[k as keyof Inputs]}</span>
              )}
            </label>
          ))}
        </div>

        <button
          className="calculate-button"
          disabled={loading}
          onClick={calculate}
        >
          {loading ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ─── Results ─── */}
      {results && (
        <div className="results-container">
          <h2 className="results-title">Budget Snapshot</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Total Income:</strong> ₹
              {results.totalIncome.toLocaleString("en-IN")} (
              {numberToWords(results.totalIncome)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Total Expenses:</strong> ₹
              {results.totalExpenses.toLocaleString("en-IN")} (
              {numberToWords(results.totalExpenses)} Rupees)
            </div>
            <div className="summary-item">
              <strong>Surplus / Deficit:</strong> ₹
              {results.surplusDeficit.toLocaleString("en-IN")} (
              {numberToWords(Math.abs(results.surplusDeficit))} Rupees)
            </div>
            <div className="summary-item">
              <strong>Savings Ratio:</strong> {results.savingsRatio.toFixed(0)}%
            </div>
          </div>

          {/* suggestion banner */}
          <div
            className="suggestion-banner"
            style={{
              background: results.surplusDeficit >= 0 ? "#e7f9e7" : "#fff8e5",
              borderLeft: `4px solid ${
                results.surplusDeficit >= 0 ? "#108e66" : "#ff9f00"
              }`,
              padding: "0.8rem",
              borderRadius: "4px",
              marginBottom: "1.5rem",
            }}
          >
            {results.surplusDeficit >= 0 ? (
              <>
                Great! You have a monthly surplus of ₹
                {results.surplusDeficit.toLocaleString("en-IN")}. Consider
                boosting your emergency fund or investments.
              </>
            ) : (
              <>
                You’re overspending by ₹
                {Math.abs(results.surplusDeficit).toLocaleString("en-IN")}. Review
                lifestyle costs or increase income to balance the budget.
              </>
            )}
          </div>

          {/* chart explanation */}
          <div className="chart-explanation">
            <p>
              <strong>Pie Chart </strong>shows the split of essentials,
              lifestyle and savings.&nbsp;Switch to{" "}
              <strong>Bar Chart</strong> to compare total income against
              aggregate expenses.
            </p>
          </div>

          {/* chart toggle */}
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

          {/* chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={results.expenseDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {results.expenseDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                </PieChart>
              ) : (
                <BarChart data={results.barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" name="Amount" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* table */}
          <h2 className="results-title">Monthly ↔ Yearly Breakdown</h2>
          <div className="amortization-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Monthly (₹)</th>
                  <th>Yearly (₹)</th>
                </tr>
              </thead>
              <tbody>
                {results.cashflow.map((row) => (
                  <tr key={row.category}>
                    <td>{row.category}</td>
                    <td>{row.monthly.toLocaleString("en-IN")}</td>
                    <td>{row.yearly.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="disclaimer">
            <h4>Important Considerations</h4>
            <ul>
              <li>Figures are estimates and exclude taxes & inflation.</li>
              <li>
                Aim to keep essentials ≤ 50 % and savings ≥ 20 % of income.
              </li>
              <li>Review your budget every month for improvements.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ────────────────────────── Styles ────────────────────────── */}
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
          margin-bottom: 1rem;
        }
        /* Form container */
        .form-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
        }
        /* Input grid */
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
        .input-label {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        input {
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid #272b2a;
          border-radius: 4px;
          height: 38px;
          font-size: 1rem;
        }
        input::placeholder {
          color: #9ca3af;
          font-style: italic;
        }
        .converter {
          font-size: 0.85rem;
          color: #272b2a;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          font-size: 0.8rem;
        }
        .calculate-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.75rem 1.5rem;
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
        /* Results */
        .results-container {
          background: #fcfffe;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .results-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }
        .summary-card {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: grid;
          gap: 0.75rem;
          border: 1px solid #272b2a;
        }
        .summary-item {
          font-size: 1rem;
        }
        .chart-explanation {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          text-align: center;
          font-size: 0.95rem;
        }
        .chart-toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
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
        /* Table */
        .amortization-table {
          max-height: 400px;
          overflow-y: auto;
          border-radius: 8px;
          border: 1px solid #272b2a;
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
        }
        th {
          background: #108e66;
          color: #fcfffe;
          position: sticky;
          top: 0;
        }
        /* Disclaimer */
        .disclaimer {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #272b2a;
          border: 1px solid #272b2a;
          margin-top: 2rem;
        }
        .disclaimer h4 {
          margin: 0 0 0.5rem;
        }
        .disclaimer ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        .disclaimer li {
          margin-bottom: 0.4rem;
        }
        /* Responsive */
        @media (max-width: 768px) {
          .input-group {
            grid-template-columns: 1fr;
          }
          .chart-container {
            margin: 1.5rem 0;
          }
          .summary-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MonthlyBudgetCalculator;
