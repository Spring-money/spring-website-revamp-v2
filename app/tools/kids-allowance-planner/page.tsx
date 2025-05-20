// File: /app/tools/kids-allowance-planner/page.tsx

"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
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

// ➤ Tooltip icon
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState<boolean>(false);
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
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
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

// ➤ Number→Words (Indian)
const numberToWords = (num: number): string => {
  num = Math.abs(Math.round(num));
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

const numberToWordsPercent = (v: number): string => {
  const ip = Math.floor(v),
    dp = Math.round((v - ip) * 100);
  return dp
    ? `${numberToWords(ip)} point ${numberToWords(dp)} percent`
    : `${numberToWords(ip)} percent`;
};

export default function KidsAllowancePlanner() {
  // ───── Inputs ─────────────────────────
  const [numKids, setNumKids] = useState<string>("1");
  const [frequency, setFrequency] = useState<"Weekly" | "Monthly">("Weekly");
  const [baseAllowance, setBaseAllowance] = useState<string>("");
  const [numChores, setNumChores] = useState<string>("1");
  const [choreNames, setChoreNames] = useState<string[]>([""]);
  const [choreRewards, setChoreRewards] = useState<string[]>([""]);
  const [choreCounts, setChoreCounts] = useState<string[]>([""]);
  const [savePct, setSavePct] = useState<string>("");
  const [returnRate, setReturnRate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // keep chore arrays in sync
  useEffect(() => {
    const n = Math.max(0, parseInt(numChores) || 0);
    setChoreNames((a: string[]) =>
      a.length < n ? [...a, ...Array(n - a.length).fill("")] : a.slice(0, n)
    );
    setChoreRewards((a: string[]) =>
      a.length < n ? [...a, ...Array(n - a.length).fill("")] : a.slice(0, n)
    );
    setChoreCounts((a: string[]) =>
      a.length < n ? [...a, ...Array(n - a.length).fill("")] : a.slice(0, n)
    );
  }, [numChores]);

  // ───── Results ────────────────────────
  const [baseOutflow, setBaseOutflow] = useState(0);
  const [choreOutflow, setChoreOutflow] = useState(0);
  const [totalOutflow, setTotalOutflow] = useState(0);
  const [savingsPortion, setSavingsPortion] = useState(0);
  const [spendablePortion, setSpendablePortion] = useState(0);
  const [annualOutflow, setAnnualOutflow] = useState(0);
  const [futureSavings, setFutureSavings] = useState<number>();
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [calculated, setCalculated] = useState(false);

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // Calculate button handler
  const handleCalculate = (): void => {
    setError(null);
    const nk = parseInt(numKids);
    const ba = parseFloat(baseAllowance);
    const nc = parseInt(numChores);
    const sp = parseFloat(savePct) || 0;
    const rr = parseFloat(returnRate) || 0;
    if (isNaN(nk) || nk < 1) return setError("Enter a valid number of kids.");
    if (isNaN(ba) || ba < 0) return setError("Enter a valid base allowance.");
    if (isNaN(nc) || nc < 0)
      return setError("Enter a valid number of chore types.");

    // chore outflow
    let co = 0;
    for (let i = 0; i < nc; i++) {
      const r = parseFloat(choreRewards[i]) || 0;
      const c = parseInt(choreCounts[i]) || 0;
      co += r * c;
    }

    const bOut = nk * ba;
    const tot = bOut + co;
    const sPort = (sp / 100) * tot;
    const spend = tot - sPort;
    const periods = frequency === "Monthly" ? 12 : 52;
    const annual = tot * periods;

    // project savings if needed
    let fut: number | undefined;
    if (sPort > 0 && rr > 0) {
      const mRate = rr / 100 / periods;
      let fv = 0;
      for (let t = 1; t <= periods; t++) {
        fv = (fv + sPort) * (1 + mRate);
      }
      fut = Math.round(fv);
    }

    setBaseOutflow(bOut);
    setChoreOutflow(co);
    setTotalOutflow(tot);
    setSavingsPortion(sPort);
    setSpendablePortion(spend);
    setAnnualOutflow(annual);
    setFutureSavings(fut);
    setCalculated(true);
  };

  // chart data
  const pieData = [
    { name: "Base", value: baseOutflow },
    { name: "Chores", value: choreOutflow },
    { name: "Savings", value: savingsPortion },
  ];
  const barData = [
    { name: `Per ${frequency}`, value: totalOutflow },
    { name: "Annual", value: annualOutflow },
  ];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Plan Your Kids' Allowance</h1>
      <p className="description">
        Define base & chore rewards, allocate savings, and see your outflow.
      </p>
      <div className="explanation">
        <p>
          <strong>Kids Allowance Planner:</strong> This tool helps parents or
          guardians plan and manage a regular allowance for children. It
          encourages financial literacy by simulating how kids can earn, save,
          or spend money responsibly.
        </p>
        <p>
          You can define a weekly or monthly allowance, assign chores with
          optional rewards, and track savings goals. This fosters healthy money
          habits and opens conversations about budgeting, effort-based rewards,
          and smart spending.
        </p>
      </div>

      <section className="card form-card">
        <div className="row">
          <div className="field">
            <label>
              Number of Kids
              <TooltipIcon text="How many children receive allowance" />
            </label>
            <input
              type="number"
              min="1"
              value={numKids}
              onChange={(e) => setNumKids(e.target.value)}
              placeholder="Enter number of kids"
            />
          </div>
          <div className="field">
            <label>
              Frequency
              <TooltipIcon text="Weekly or Monthly" />
            </label>
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as "Weekly" | "Monthly")
              }
              aria-label="Allowance frequency"
            >
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>
              Base Allowance per Kid (₹)
              <TooltipIcon text="Fixed amount each period" />
            </label>
            <input
              type="number"
              value={baseAllowance}
              onChange={(e) => setBaseAllowance(e.target.value)}
              placeholder="Enter base allowance"
            />
            {baseAllowance && (
              <small className="converter">
                {numberToWords(+baseAllowance)} Rupees
              </small>
            )}
          </div>
          <div className="field">
            <label>
              Number of Chore Types
              <TooltipIcon text="Different chores you'll reward" />
            </label>
            <input
              type="number"
              min="0"
              value={numChores}
              onChange={(e) => setNumChores(e.target.value)}
              aria-label="Number of Chore Types"
              placeholder="Enter number of chore types"
            />
          </div>
        </div>

        {parseInt(numChores) > 0 && (
          <>
            <h2 className="subheading">Chore Details</h2>
            {[...Array(parseInt(numChores) || 0)].map((_, i) => (
              <div className="row" key={i}>
                <div className="field">
                  <label>Chore {i + 1} Name</label>
                  <input
                    type="text"
                    value={choreNames[i] ?? ""}
                    onChange={(e) => {
                      const a = [...choreNames];
                      a[i] = e.target.value;
                      setChoreNames(a);
                    }}
                    placeholder={`Chore ${i + 1} name`}
                  />
                </div>
                <div className="field">
                  <label>Reward per Completion (₹)</label>
                  <input
                    type="number"
                    value={choreRewards[i] ?? ""}
                    onChange={(e) => {
                      const a = [...choreRewards];
                      a[i] = e.target.value;
                      setChoreRewards(a);
                    }}
                    placeholder="Reward per completion"
                  />
                </div>
                <div className="field">
                  <label>Expected Completions per {frequency}</label>
                  <input
                    type="number"
                    value={choreCounts[i] ?? ""}
                    onChange={(e) => {
                      const a = [...choreCounts];
                      a[i] = e.target.value;
                      setChoreCounts(a);
                    }}
                    placeholder={`Completions per ${frequency}`}
                  />
                </div>
              </div>
            ))}
          </>
        )}

        <h2 className="subheading">Savings Allocation (Optional)</h2>
        <div className="row">
          <div className="field">
            <label>
              % of Allowance to Save
              <TooltipIcon text="Portion routed to savings" />
            </label>
            <input
              type="number"
              placeholder="e.g. 20"
              value={savePct}
              onChange={(e) => setSavePct(e.target.value)}
            />
            {savePct && (
              <small className="converter">
                {numberToWordsPercent(+savePct)}
              </small>
            )}
          </div>
          <div className="field">
            <label>
              Expected Annual Return on Savings (%)
              <TooltipIcon text="If invested" />
            </label>
            <input
              type="number"
              placeholder="e.g. 6"
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value)}
            />
            {returnRate && (
              <small className="converter">
                {numberToWordsPercent(+returnRate)}
              </small>
            )}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn" onClick={handleCalculate}>
          Calculate Plan
        </button>
      </section>

      {calculated && (
        <section className="card results-card">
          <h2 className="section-title">Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <strong>Base Outflow</strong>
              <div>₹{fmt(baseOutflow)}</div>
            </div>
            <div className="summary-item">
              <strong>Chore Outflow</strong>
              <div>₹{fmt(choreOutflow)}</div>
            </div>
            <div className="summary-item">
              <strong>Total per {frequency}</strong>
              <div>₹{fmt(totalOutflow)}</div>
            </div>
            <div className="summary-item">
              <strong>Savings Portion</strong>
              <div>₹{fmt(savingsPortion)}</div>
            </div>
            <div className="summary-item">
              <strong>Spendable Portion</strong>
              <div>₹{fmt(spendablePortion)}</div>
            </div>
            <div className="summary-item">
              <strong>Annual Outflow</strong>
              <div>₹{fmt(annualOutflow)}</div>
              {futureSavings !== undefined && (
                <small>(₹{fmt(futureSavings)} projected)</small>
              )}
            </div>
          </div>

          <h2 className="section-title">Visualization</h2>
          <div className="chart-toggle">
            <button
              className={chartType === "pie" ? "active" : ""}
              onClick={() => setChartType("pie")}
            >
              Breakdown
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Period vs Annual
            </button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={["#108e66", "#272a2b", "#108e66"][i]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip formatter={(v) => `₹${fmt(v as number)}`} />
                </PieChart>
              ) : (
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={fmt} />
                  <RechartsTooltip formatter={(v) => `₹${fmt(v as number)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="disc">
            <h3>Points to Consider</h3>
            <ul>
              <li>
                <strong>Age Appropriateness:</strong> Tailor the amount and
                frequency based on the childs age and maturity level.
              </li>
              <li>
                <strong>Financial Literacy:</strong> Use allowance as a tool to
                teach budgeting, saving, and smart spending habits.
              </li>
              <li>
                <strong>Purpose of Allowance:</strong> Decide if it is for basic
                expenses, rewards, or learning financial responsibility.
              </li>
              <li>
                <strong>Consistency:</strong> Stick to a regular schedule to
                build trust and financial discipline.
              </li>
              <li>
                <strong>Flexibility:</strong> Adjust based on changing needs or
                lessons learned through experience.
              </li>
              <li>
                <strong>Link to Chores (Optional):</strong> Decide whether the
                allowance is earned through chores or given unconditionally.
              </li>
              <li>
                <strong>Parental Controls:</strong> Monitor spending and guide
                kids on making wise financial decisions.
              </li>
            </ul>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
          margin: auto;
          padding: 2rem 1rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: Poppins, sans-serif;
        }
        .top-nav {
          margin-bottom: 1rem;
        }
        .back-button {
          background: #108e66;
          color: #fcfffe;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .description {
          text-align: center;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(39, 43, 42, 0.05);
        }
        .form-card {
          padding: 2rem 1.5rem;
        }
        .row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .field label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .field input,
        .field select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #272a2b;
          border-radius: 6px;
          font-size: 1rem;
        }
        .converter {
          margin-top: 0.25rem;
          font-size: 0.9rem;
          color: #272a2b;
        }
        .subheading {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
        }
        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
        .btn {
          display: block;
          margin: 1rem auto 0;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        .results-card {
          padding: 2rem 1.5rem;
        }
        .section-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .summary-item {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 1rem;
          text-align: center;
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
          border: 1px solid #272a2b;
          border-radius: 6px;
          background: transparent;
          font-weight: 500;
          cursor: pointer;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          height: 300px;
          margin-left: 1rem;
          margin-: 1rem;
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
        @media (max-width: 768px) {
          .row,
          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
