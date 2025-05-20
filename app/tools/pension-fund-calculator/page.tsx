/*  /app/tools/pension-fund-calculator/page.tsx
    Pension-Fund Calculator — Spring Money Theme
    (v2 – with live “number-to-words” converters + graph explanation)
------------------------------------------------------------------- */
"use client";

import React, { useState } from "react";
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

/* ────────────────── Types ────────────────── */
interface Inputs {
  currentAge: string;
  retireAge: string;
  deferAge: string;
  existingCorpus: string;
  monthlyContrib: string;
  contribGrowth: string;
  expReturn: string;
  annuityRatio: string;
  annuityRate: string;
}

interface YearRow {
  age: number;
  startBal: number;
  contribYr: number;
  interest: number;
  endBal: number;
}

interface Results {
  projectedCorpus: number;
  totalInvest: number;
  gain: number;
  lumpSum: number;
  annuityCorpus: number;
  monthlyPension: number;
  years: YearRow[];
  suggestion: string;
}

/* ───────────────── Tooltip Icon ───────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="i">i</span>
      {hover && <span className="box">{text}</span>}
      <style jsx>{`
        .tip {
          position: relative;
          margin-left: 6px;
          cursor: pointer;
        }
        .i {
          background: #108e66;
          color: #fcfffe;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          font-size: 0.6rem;
          line-height: 14px;
          text-align: center;
          font-weight: 700;
          display: inline-block;
        }
        .box {
          position: absolute;
          bottom: 130%;
          left: 50%;
          transform: translateX(-50%);
          background: #fcfffe;
          color: #272a2b;
          border: 1px solid #108e66;
          border-radius: 4px;
          padding: 6px 8px;
          font-size: 0.75rem;
          line-height: 1.2;
          width: 220px;
          white-space: pre-wrap;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .box::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -4px;
          border: 4px solid transparent;
          border-top-color: #fcfffe;
        }
      `}</style>
    </span>
  );
};

/* ───────────────── Number➜Words helpers ───────────────── */
const words = (n: number): string => {
  if (!isFinite(n)) return "";
  n = Math.round(Math.abs(n));
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
  const h = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100)
      return `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`;
    if (x < 1000)
      return `${ones[Math.floor(x / 100)]} Hundred${
        x % 100 ? " " + h(x % 100) : ""
      }`;
    if (x < 100000)
      return `${h(Math.floor(x / 1000))} Thousand${
        x % 1000 ? " " + h(x % 1000) : ""
      }`;
    if (x < 10000000)
      return `${h(Math.floor(x / 100000))} Lakh${
        x % 100000 ? " " + h(x % 100000) : ""
      }`;
    return `${h(Math.floor(x / 10000000))} Crore${
      x % 10000000 ? " " + h(x % 10000000) : ""
    }`;
  };
  return h(n);
};

const wordsPercent = (v: number): string => {
  if (!isFinite(v)) return "";
  if (Number.isInteger(v)) return `${words(v)} percent`;
  const int = Math.floor(v);
  const dec = Math.round((v - int) * 10); // single-decimal precision
  return `${words(int)} point ${words(dec)} percent`;
};

/* ───────────────── Component ───────────────── */
const PensionFundCalculator: React.FC = () => {
  /* state */
  const [inputs, setInputs] = useState<Inputs>({
    currentAge: "",
    retireAge: "",
    deferAge: "",
    existingCorpus: "",
    monthlyContrib: "",
    contribGrowth: "0",
    expReturn: "",
    annuityRatio: "40",
    annuityRate: "6",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"line" | "bar">("line");

  /* input handler */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* helpers */
  const ok = (v: string) => v !== "" && !isNaN(+v) && +v >= 0;

  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    (Object.keys(inputs) as (keyof Inputs)[]).forEach((k) => {
      if (!ok(inputs[k]) && !(k === "contribGrowth" || k === "deferAge"))
        e[k] = "Required";
    });
    if (+inputs.retireAge <= +inputs.currentAge)
      e.retireAge = "Must exceed current age";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* calculation */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const curAge = +inputs.currentAge;
    const retAge = +inputs.retireAge;
    const yrs = retAge - curAge;
    const corpus0 = +inputs.existingCorpus;
    const mInit = +inputs.monthlyContrib;
    const g = +inputs.contribGrowth / 100;
    const rAnnual = +inputs.expReturn / 100;
    const rMonthly = rAnnual / 12;
    const annRatio = +inputs.annuityRatio / 100;
    const annRate = +inputs.annuityRate / 100;

    let corpus = corpus0;
    let mCont = mInit;
    let totalInvest = corpus0;
    const years: YearRow[] = [];

    for (let y = 1; y <= yrs; y++) {
      const age = curAge + y - 1;
      const startBal = corpus;
      let contribYr = 0;

      for (let m = 0; m < 12; m++) {
        corpus = corpus * (1 + rMonthly) + mCont;
        contribYr += mCont;
      }

      const endBal = corpus;
      const interest = endBal - startBal - contribYr;
      years.push({
        age,
        startBal: Math.round(startBal),
        contribYr: Math.round(contribYr),
        interest: Math.round(interest),
        endBal: Math.round(endBal),
      });

      totalInvest += contribYr;
      mCont = mCont * (1 + g); // raise contribution for next year
    }

    const projectedCorpus = Math.round(corpus);
    const lumpSum = Math.round(projectedCorpus * (1 - annRatio));
    const annuityCorpus = Math.round(projectedCorpus * annRatio);
    const monthlyPension = Math.round((annuityCorpus * annRate) / 12);

    setResults({
      projectedCorpus,
      totalInvest: Math.round(totalInvest),
      gain: Math.round(projectedCorpus - totalInvest),
      lumpSum,
      annuityCorpus,
      monthlyPension,
      years,
      suggestion:
        monthlyPension < 30000
          ? "📈  Consider increasing contribution or annuity ratio to boost pension."
          : "✅  Your projected pension looks healthy. Review asset allocation periodically.",
    });
    setTimeout(() => setBusy(false), 300);
  };

  /* chart data */
  const lineData = results
    ? results.years.map((r) => ({
        age: r.age + 1,
        corpus: r.endBal,
        invested: r.contribYr,
      }))
    : [];

  const barData = results
    ? [
        { name: "Lump-Sum", value: results.lumpSum },
        { name: "Annuity Corpus", value: results.annuityCorpus },
      ]
    : [];

  /* converter helper */
  const toWords = (k: keyof Inputs, val: string): string => {
    if (!val) return "";
    const num = Number(val);
    if (!isFinite(num)) return "";
    switch (k) {
      case "currentAge":
      case "retireAge":
        return `${words(num)} Years`;
      case "existingCorpus":
      case "monthlyContrib":
        return `${words(num)} Rupees`;
      case "contribGrowth":
      case "expReturn":
      case "annuityRatio":
      case "annuityRate":
        return wordsPercent(num);
      default:
        return "";
    }
  };

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="wrap">
      {/* nav */}
      <div className="nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      {/* header */}
      <h1 className="title">Pension-Fund Calculator</h1>
      <p className="sub">
        Project your retirement corpus and estimate monthly pension.
      </p>
      <div className="explanation">
  <p>
    <strong>Pension Funds Calculator:</strong> This tool helps you estimate how much your retirement savings will grow over time based on your current savings, regular contributions, and expected annual returns.
  </p>
  <p>
    It simulates the growth of your pension fund by compounding your <strong>initial savings</strong> and <strong>monthly contributions</strong> annually with your <strong>expected return rate</strong>. You can also factor in your desired <strong>retirement age</strong> to project the final corpus.
  </p>
</div>

      {/* inputs */}
      <div className="card">
        <h2 className="sect">Enter Details</h2>
        <div className="grid">
          {[
            [
              "currentAge",
              "Current Age (Years)",
              "e.g. 30",
              "Your present age",
            ],
            [
              "retireAge",
              "Retirement Age (Years)",
              "e.g. 60",
              "Age when you will retire",
            ],
            [
              "existingCorpus",
              "Existing Corpus (₹)",
              "e.g. 5 00 000",
              "Savings already accumulated",
            ],
            [
              "monthlyContrib",
              "Monthly Contribution (₹)",
              "e.g. 15 000",
              "Planned monthly investment",
            ],
            [
              "contribGrowth",
              "Contribution per Year (%)",
              "e.g. 5",
              "Annual % increase in contribution",
            ],
            [
              "expReturn",
              "Expected Annual Return (%)",
              "e.g. 10",
              "Pre-retirement ROI",
            ],
            [
              "annuityRatio",
              "Annuity Purchase Ratio (%)",
              "e.g. 40",
              "Corpus % to buy annuity",
            ],
            [
              "annuityRate",
              "Expected Annuity Rate (%)",
              "e.g. 6",
              "Annual payout rate from annuity",
            ],
          ].map(([k, l, ph, tip]) => (
            <div className="field" key={k}>
              <label className="lbl">
                {l}
                <TooltipIcon text={tip} />
              </label>
              <input
                name={k}
                type="number"
                value={inputs[k as keyof Inputs]}
                onChange={onChange}
                placeholder={ph}
              />
              <span className="converter">
                {toWords(k as keyof Inputs, inputs[k as keyof Inputs])}
              </span>
              {errors[k as keyof Inputs] && (
                <span className="err">{errors[k as keyof Inputs]}</span>
              )}
            </div>
          ))}
        </div>
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* results */}
      {results && (
        <div className="card">
          <h2 className="sect">Summary</h2>
          <div className="summary">
            <div>
              <strong>Projected Corpus @ {inputs.retireAge}</strong>
              <br />₹{results.projectedCorpus.toLocaleString("en-IN")}
              <br />({words(results.projectedCorpus)} Rupees)
            </div>
            <div>
              <strong>Total Invested</strong>
              <br />₹{results.totalInvest.toLocaleString("en-IN")}
              <br />({words(results.totalInvest)} Rupees)
            </div>
            <div>
              <strong>Total Gain</strong>
              <br />₹{results.gain.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Lump-Sum Withdrawal</strong>
              <br />₹{results.lumpSum.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Annuity Corpus</strong>
              <br />₹{results.annuityCorpus.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Monthly Pension</strong>
              <br />₹{results.monthlyPension.toLocaleString("en-IN")}
              <br />({words(results.monthlyPension)} Rupees)
            </div>
          </div>

          {/* graph description */}
          <div className="chart-expl">
            <p>
              The graphs below show how your retirement corpus builds up over
              your investment horizon. <strong>Line Chart</strong> tracks corpus
              growth year-by-year, whereas the
              <strong> Bar Chart</strong> splits that corpus at retirement into
              a lump-sum and an annuity portion. Hover on any point or bar for
              exact values.
            </p>
            {chart === "line" && (
              <p>
                <strong>Line Chart:</strong> Smooth trend of overall corpus.
              </p>
            )}
            {chart === "bar" && (
              <p>
                <strong>Bar Chart:</strong> Lump-sum vs. annuity corpus.
              </p>
            )}
          </div>

          {/* chart toggle */}
          <div className="toggle">
            <button
              onClick={() => setChart("line")}
              className={chart === "line" ? "active" : ""}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChart("bar")}
              className={chart === "bar" ? "active" : ""}
            >
              Corpus Split
            </button>
          </div>

          {/* charts */}
          <div className="chart">
            <ResponsiveContainer
              width="100%"
              height={chart === "line" ? 300 : 280}
            >
              {chart === "line" ? (
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="age"
                    stroke="#272a2b"
                    label={{
                      value: "Age",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    stroke="#272a2b"
                    width={90}
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="corpus"
                    name="Projected Corpus"
                    stroke="#108e66"
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#272a2b" />
                  <YAxis
                    stroke="#272a2b"
                    width={90}
                    tickFormatter={(v) => v.toLocaleString("en-IN")}
                  />
                  <RechartsTooltip
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#108e66" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* suggestion & disclaimer */}
          <div className="action">{results.suggestion}</div>
          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                Returns are assumed constant; actual market performance will
                differ.
              </li>
              <li>
                Tax implications on annuity and withdrawals are ignored here.
              </li>
              <li>
                Review contribution growth and asset allocation every year.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ───────────────── Styles ───────────────── */}
      <style jsx>{`
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
        .wrap {
          padding: 1.25rem 1rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
          max-width: 100%;
          margin: 0 auto;
        }
        .nav {
          margin-bottom: 1rem;
        }
        .back {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2.4rem;
          font-weight: 700;
          margin: 0.3rem 0;
        }
        .sub {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.4rem;
        }
        .sect {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.3rem 0 0.8rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem 1.4rem;
          margin-bottom: 1.1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .lbl {
          font-size: 0.9rem;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
        }
        .field input {
          padding: 0.55rem 0.6rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
          width: 100%;
          box-sizing: border-box;
          color: #272a2b;
        }
        .converter {
          font-size: 0.9rem;
          color: #272a2b;
          margin-top: 0.25rem;
        }
        .err {
          color: red;
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .calc {
          width: 100%;
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.8rem;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
          margin-bottom: 0.9rem;
          border-left: 4px solid #108e66;
          padding-left: 0.8rem;
        }
        .chart-expl {
          background: #fcfffe;
          padding: 1rem;
          border-left: 4px solid #108e66;
          border-radius: 8px;
          margin: 1rem 0;
          font-size: 0.95rem;
        }
        .toggle {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          margin: 1rem 0;
        }
        .toggle button {
          background: transparent;
          border: 1px solid #272a2b;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
          font-weight: 500;
          color: #272a2b;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart {
          margin-bottom: 1rem;
        }
        .action {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-top: 0.8rem;
        }
        .disc {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          border: 1px solid #272a2b;
          margin-top: 1.2rem;
        }
        .disc h4 {
          margin: 0 0 0.5rem;
        }
        .disc ul {
          margin: 0;
          padding-left: 1.4rem;
        }
        .disc li {
          margin-bottom: 0.5rem;
        }
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* global – hide number spinners */}
      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default PensionFundCalculator;
