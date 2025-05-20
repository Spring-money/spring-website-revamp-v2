/*  /app/tools/gold-investment-returns-calculator/page.tsx
    Gold Investment Returns Calculator — Spring Money Theme
    (v3 • centered “Calculate Returns” button + table null-safety fix)
---------------------------------------------------------------- */
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

/* ─────────── Types ─────────── */
type Mode = "Both" | "Lump-Sum" | "Gold SIP";

interface Inputs {
  mode: Mode;
  tenureYears: string;
  annualGrowthRate: string;
  lumpSumAmount: string;
  monthlyInvestment: string;
}

interface YearRow {
  year: number;
  lumpValue?: number;
  sipValue?: number;
  sipInvested?: number;
}

interface Results {
  lumpFV?: number;
  lumpGain?: number;
  lumpCAGR?: number;
  sipFV?: number;
  sipGain?: number;
  sipInvested?: number;
  rows: YearRow[];
  insight: string;
  recommend: string;
}

/* ─────────── Tooltip Icon ─────────── */
const Tip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="tip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="i">i</span>
      {show && <span className="box">{text}</span>}
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

/* ─────────── Number→Words helpers ─────────── */
const words = (n: number): string => {
  if (!isFinite(n)) return "";
  n = Math.round(Math.abs(n));
  if (n === 0) return "Zero";
  const o = [
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
  const t = [
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
    if (x < 20) return o[x];
    if (x < 100)
      return `${t[Math.floor(x / 10)]}${x % 10 ? " " + o[x % 10] : ""}`;
    if (x < 1000)
      return `${o[Math.floor(x / 100)]} Hundred${
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
const wordsPercent = (v: number) =>
  Number.isInteger(v)
    ? `${words(v)} percent`
    : `${words(Math.floor(v))} point ${words(
        Math.round((v - Math.floor(v)) * 10)
      )} percent`;

/* ─────────── Component ─────────── */
const GoldInvestmentReturnsCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    mode: "Both",
    tenureYears: "",
    annualGrowthRate: "",
    lumpSumAmount: "",
    monthlyInvestment: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>(
    {}
  );
  const [results, setResults] = useState<Results | null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"line" | "bar">("line");

  /* -------- input handlers -------- */
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  const ok = (v: string) => v !== "" && !isNaN(+v) && +v >= 0;

  const validate = (): boolean => {
    const e: Partial<Record<keyof Inputs, string>> = {};
    if (!ok(inputs.tenureYears)) e.tenureYears = "Required";
    if (!ok(inputs.annualGrowthRate)) e.annualGrowthRate = "Required";
    if (inputs.mode !== "Gold SIP" && !ok(inputs.lumpSumAmount))
      e.lumpSumAmount = "Required";
    if (inputs.mode !== "Lump-Sum" && !ok(inputs.monthlyInvestment))
      e.monthlyInvestment = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* -------- calculation -------- */
  const calculate = () => {
    if (!validate()) return;
    setBusy(true);

    const t = +inputs.tenureYears;
    const r = +inputs.annualGrowthRate / 100;
    const P_lump = +inputs.lumpSumAmount;
    const Pm = +inputs.monthlyInvestment;
    const i = r / 12,
      n = t * 12;

    const res: Results = { rows: [], insight: "", recommend: "" };

    /* lump-sum */
    if (inputs.mode !== "Gold SIP") {
      const FV_lump = P_lump * Math.pow(1 + r, t);
      res.lumpFV = Math.round(FV_lump);
      res.lumpGain = Math.round(FV_lump - P_lump);
      res.lumpCAGR = +(Math.pow(FV_lump / P_lump, 1 / t) - 1) * 100;
    }

    /* sip */
    if (inputs.mode !== "Lump-Sum") {
      const FV_sip = Pm * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      res.sipFV = Math.round(FV_sip);
      res.sipInvested = Math.round(Pm * n);
      res.sipGain = Math.round(FV_sip - Pm * n);
    }

    /* rows */
    for (let y = 1; y <= t; y++) {
      const row: YearRow = { year: y };
      if (res.lumpFV !== undefined) row.lumpValue = P_lump * Math.pow(1 + r, y);
      if (res.sipFV !== undefined)
        row.sipValue = Pm * ((Math.pow(1 + i, y * 12) - 1) / i) * (1 + i);
      if (res.sipFV !== undefined) row.sipInvested = Pm * y * 12;
      res.rows.push({
        year: y,
        lumpValue:
          row.lumpValue !== undefined ? Math.round(row.lumpValue) : undefined,
        sipValue:
          row.sipValue !== undefined ? Math.round(row.sipValue) : undefined,
        sipInvested: row.sipInvested,
      });
    }

    /* insight & recommendation */
    const parts = [];
    if (res.lumpFV !== undefined)
      parts.push(
        `₹${P_lump.toLocaleString(
          "en-IN"
        )} lump sum → ₹${res.lumpFV.toLocaleString(
          "en-IN"
        )} (gain ₹${res.lumpGain!.toLocaleString("en-IN")})`
      );
    if (res.sipFV !== undefined)
      parts.push(
        `₹${Pm.toLocaleString("en-IN")} monthly → ₹${res.sipFV.toLocaleString(
          "en-IN"
        )} (gain ₹${res.sipGain!.toLocaleString("en-IN")})`
      );
    res.insight = parts.join(". ");
    res.recommend =
      (res.lumpGain ?? 0) > (res.sipGain ?? 0)
        ? "📈  Lump-sum yields the higher gain for this scenario."
        : (res.lumpGain ?? 0) < (res.sipGain ?? 0)
        ? "📈  Monthly SIP outperforms lump-sum here."
        : "⚖️  Both methods yield similar gains—choose based on cash-flow comfort.";

    setResults(res);
    setTimeout(() => setBusy(false), 300);
  };

  /* -------- chart data -------- */
  const lineData = results
    ? results.rows.map((r) => {
        const d: any = { year: r.year };
        if (r.lumpValue !== undefined) d["Lump-Sum"] = r.lumpValue;
        if (r.sipValue !== undefined) d["Gold SIP"] = r.sipValue;
        return d;
      })
    : [];
  const barData = results
    ? [
        ...(results.lumpFV
          ? [{ name: "Lump-Sum", value: results.lumpFV }]
          : []),
        ...(results.sipFV ? [{ name: "Gold SIP", value: results.sipFV }] : []),
      ]
    : [];

  /* converter text */
  const conv = (k: keyof Inputs, v: string): string => {
    if (!v) return "";
    const num = +v;
    if (!isFinite(num)) return "";
    switch (k) {
      case "tenureYears":
        return `${words(num)} Years`;
      case "annualGrowthRate":
        return wordsPercent(num);
      default:
        return `${words(num)} Rupees`;
    }
  };

  /* ---------------- JSX ---------------- */
  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools">
          <button className="back">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Gold Investment Returns Calculator</h1>
      <p className="sub">
        Compare lump-sum versus monthly (SIP) gold investing.
      </p> 
      <div className="explanation">
  <p>
    <strong>Gold Investment Returns:</strong> This calculator helps you estimate the <strong>returns</strong> on your <strong>gold investment</strong> over a specified period, based on the <strong>current price of gold</strong> and your <strong>investment amount</strong>.
  </p>
  <p>
    By entering your <strong>investment amount</strong>, <strong>holding period</strong>, and the expected <strong>annual gold price growth</strong>,
    the calculator shows the potential value of your investment at the end of the period. It helps you evaluate the <strong>growth potential</strong> of gold as a long-term investment.
  </p>
</div>


      {/* ----- form card ----- */}
      <div className="card">
        <h2 className="sect">Enter Details</h2>
        <div className="grid">
          {/* mode */}
          <div className="field">
            <label htmlFor="mode" className="lbl">
              Investment Type
              <Tip text="Choose which method to evaluate." />
            </label>
            <select
              id="mode"
              name="mode"
              value={inputs.mode}
              onChange={onChange}
              className="sel"
            >
              <option>Both</option>
              <option>Lump-Sum</option>
              <option>Gold SIP</option>
            </select>
          </div>

          {/* common */}
          {[
            [
              "tenureYears",
              "Investment Tenure (Years)",
              "e.g. 10",
              "Number of years",
            ],
            [
              "annualGrowthRate",
              "Expected Annual Growth Rate (%)",
              "e.g. 8",
              "Annual gold price growth",
            ],
          ].map(([k, l, ph, tip]) => {
            const id = `input-${k}`;
            return (
              <div className="field" key={k}>
                <label htmlFor={id} className="lbl">
                  {l}
                  <Tip text={tip} />
                </label>
                <input
                  id={id}
                  name={k}
                  type="number"
                  value={inputs[k as keyof Inputs]}
                  onChange={onChange}
                  placeholder={ph}
                />
                <span className="conv">
                  {conv(k as keyof Inputs, inputs[k as keyof Inputs])}
                </span>
                {errors[k as keyof Inputs] && (
                  <span className="err">{errors[k as keyof Inputs]}</span>
                )}
              </div>
            );
          })}

          {/* conditional */}
          {inputs.mode !== "Gold SIP" && (
            <div className="field">
              <label htmlFor="lump" className="lbl">
                Lumpsum Amount (₹)
                <Tip text="One-time amount" />
              </label>
              <input
                id="lump"
                name="lumpSumAmount"
                type="number"
                value={inputs.lumpSumAmount}
                onChange={onChange}
                placeholder="e.g. 3 00 000"
              />
              <span className="conv">
                {conv("lumpSumAmount", inputs.lumpSumAmount)}
              </span>
              {errors.lumpSumAmount && (
                <span className="err">{errors.lumpSumAmount}</span>
              )}
            </div>
          )}
          {inputs.mode !== "Lump-Sum" && (
            <div className="field">
              <label htmlFor="sip" className="lbl">
                Monthly Investment (₹)
                <Tip text="Amount invested each month" />
              </label>
              <input
                id="sip"
                name="monthlyInvestment"
                type="number"
                value={inputs.monthlyInvestment}
                onChange={onChange}
                placeholder="e.g. 5 000"
              />
              <span className="conv">
                {conv("monthlyInvestment", inputs.monthlyInvestment)}
              </span>
              {errors.monthlyInvestment && (
                <span className="err">{errors.monthlyInvestment}</span>
              )}
            </div>
          )}
        </div>

        {/* centered full-width button */}
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {/* ----- results card ----- */}
      {results && (
        <div className="card">
          <h2 className="sect">Summary</h2>
          <div className="summary">
            {results.lumpFV !== undefined && (
              <div>
                <strong>Lump-Sum Future Value</strong>
                <br />₹{results.lumpFV.toLocaleString("en-IN")}
                <br />
                Gain: ₹{results.lumpGain!.toLocaleString("en-IN")}
                <br />
                CAGR: {results.lumpCAGR!.toFixed(2)}%
              </div>
            )}
            {results.sipFV !== undefined && (
              <div>
                <strong>Gold SIP Future Value</strong>
                <br />₹{results.sipFV.toLocaleString("en-IN")}
                <br />
                Invested: ₹{results.sipInvested!.toLocaleString("en-IN")}
                <br />
                Gain: ₹{results.sipGain!.toLocaleString("en-IN")}
              </div>
            )}
          </div>

          <div className="note">{results.insight}</div>
          {inputs.mode === "Both" && (
            <div className="action">{results.recommend}</div>
          )}

          {/* charts */}
          <div className="chart-expl">
            <p>
              <strong>Line Chart</strong> tracks growth over time;{" "}
              <strong>Bar Chart</strong> compares final corpus.
            </p>
          </div>
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
              Bar Chart
            </button>
          </div>
          <div className="chart">
            <ResponsiveContainer
              width="100%"
              height={chart === "line" ? 300 : 280}
            >
              {chart === "line" ? (
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    stroke="#272a2b"
                    label={{
                      value: "Year",
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
                  {inputs.mode !== "Gold SIP" && (
                    <Line dataKey="Lump-Sum" stroke="#108e66" strokeWidth={2} />
                  )}
                  {inputs.mode !== "Lump-Sum" && (
                    <Line dataKey="Gold SIP" stroke="#525ECC" strokeWidth={2} />
                  )}
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

          {/* year table */}
          <h3 className="sect" style={{ marginTop: "1.2rem" }}>
            Year-wise Projection
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  {inputs.mode !== "Gold SIP" && <th>Lump-Sum Value (₹)</th>}
                  {inputs.mode !== "Lump-Sum" && (
                    <>
                      <th>SIP Corpus (₹)</th>
                      <th>SIP Invested To-Date (₹)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {results.rows.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    {inputs.mode !== "Gold SIP" && (
                      <td>{r.lumpValue?.toLocaleString("en-IN") ?? "-"}</td>
                    )}
                    {inputs.mode !== "Lump-Sum" && (
                      <>
                        <td>{r.sipValue?.toLocaleString("en-IN") ?? "-"}</td>
                        <td>{r.sipInvested?.toLocaleString("en-IN") ?? "-"}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* considerations */}
          <div className="disc">
            <h4>Important Considerations</h4>
            <ul>
              <li>
                Projections assume a constant yearly growth rate; actual gold
                prices fluctuate.
              </li>
              <li>
                Storage, insurance, GST, and transaction costs are not included.
              </li>
              <li>
                Lump-sum returns rely on early price movements, while SIP
                averages volatility.
              </li>
              <li>Review your strategy annually according to market trends.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ------------- styles ------------- */}
      <style jsx>{`
        .wrap {
          padding: 1.25rem 1rem;
          font-family: Poppins, sans-serif;
          background: #fcfffe;
          color: #272a2b;
          width: 100%;
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
          margin-bottom: 1.1rem;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
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
        input,
        .sel {
          padding: 0.55rem 0.6rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: #fcfffe;
          font-size: 1rem;
          color: #272a2b;
          width: 100%;
          box-sizing: border-box;
        }
        .sel {
          height: 40px;
        }
        .conv {
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
          padding: 0.8rem 1.2rem;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.8rem;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
          border-left: 4px solid #108e66;
          padding-left: 0.8rem;
        }
        .note {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-bottom: 0.8rem;
        }
        .action {
          background: #fcfffe;
          padding: 0.8rem 1rem;
          border-left: 4px solid #108e66;
          border-radius: 4px;
          font-size: 0.95rem;
          margin-bottom: 1rem;
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
          border-radius: 4px;
          font-weight: 500;
          color: #272a2b;
          cursor: pointer;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart {
          margin-bottom: 1rem;
        }
        .table-wrap {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #272a2b;
          border-radius: 6px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        th,
        td {
          border: 1px solid #272a2b;
          padding: 0.45rem;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fcfffe;
          position: sticky;
          top: 0;
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

export default GoldInvestmentReturnsCalculator;
