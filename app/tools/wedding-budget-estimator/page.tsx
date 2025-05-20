// File: /app/tools/wedding-budget-estimator/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

/* ──────────────────────────────────
   Shared helpers – Tooltip & Words
─────────────────────────────────── */
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="ml-1 inline-block select-none"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
        i
      </span>
      {show && (
        <span className="absolute z-30 mt-2 whitespace-nowrap rounded bg-primary px-2 py-1 text-xs text-white shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
};

/* Figure-to-words (Indian numbering) */
const toWords = (n: number): string => {
  if (!Number.isFinite(n)) return "";
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
  const r = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "");
    if (x < 1000) return ones[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " + r(x % 100) : "");
    if (x < 100000) return r(Math.floor(x / 1000)) + " Thousand" + (x % 1000 ? " " + r(x % 1000) : "");
    if (x < 10000000)
      return r(Math.floor(x / 100000)) + " Lakh" + (x % 100000 ? " " + r(x % 100000) : "");
    return r(Math.floor(x / 10000000)) + " Crore" + (x % 10000000 ? " " + r(x % 10000000) : "");
  };
  return r(Math.round(Math.abs(n)));
};

const fmt = (v: number) => v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

/* ────────────────────────────────
   Component
───────────────────────────────── */
export default function WeddingBudgetEstimator() {
  /* ------------- state ------------- */
  const [fields, setFields] = useState<Record<string, string>>({
    venue: "400000",
    plateCost: "1800",
    guests: "300",
    decor: "150000",
    photo: "100000",
    entertainment: "50000",
    attire: "125000",
    invites: "25000",
    giftPerGuest: "250",
    misc: "75000",
    years: "2",
    inflation: "7",
    returnRate: "8",
    buffer: "10",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [computed, setComputed] = useState(false);

  /* results */
  const [result, setResult] = useState({
    baseTotal: 0,
    inflatedTotal: 0,
    totalWithBuffer: 0,
    monthlySaving: 0,
    pvCost: 0,
  });
  const [pieData, setPieData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [chart, setChart] = useState<"pie" | "growth">("pie");

  /* ------------- meta ------------- */
  const costFields = [
    { k: "venue", lbl: "Venue / Hall (₹)", tip: "Rental including basic décor.", ph: "400000" },
    { k: "plateCost", lbl: "Cost per Plate (₹)", tip: "Per guest catering charge.", ph: "1800" },
    { k: "guests", lbl: "Guest Count", tip: "Expected invitees.", ph: "300" },
    { k: "decor", lbl: "Decoration & Flowers (₹)", tip: "Stage, florals, props.", ph: "150000" },
    { k: "photo", lbl: "Photography & Video (₹)", tip: "Full-day coverage.", ph: "100000" },
    { k: "entertainment", lbl: "Entertainment (₹)", tip: "DJ, band, MC fees.", ph: "50000" },
    { k: "attire", lbl: "Attire & Jewellery (₹)", tip: "Bride + groom outfits.", ph: "125000" },
    { k: "invites", lbl: "Invitations & Stationery (₹)", tip: "Cards + e-invites.", ph: "25000" },
    { k: "giftPerGuest", lbl: "Return Gift / Guest (₹)", tip: "Favours or mementos.", ph: "250" },
    { k: "misc", lbl: "Miscellaneous (₹)", tip: "Licence, makeup, mehendi…", ph: "75000" },
  ];

  const planFields = [
    { k: "years", lbl: "Years Until Wedding", tip: "Time horizon.", ph: "2" },
    { k: "inflation", lbl: "Wedding Inflation (%)", tip: "Avg cost rise per year.", ph: "7" },
    { k: "returnRate", lbl: "Return on Savings (%)", tip: "Post-tax annual yield.", ph: "8" },
    { k: "buffer", lbl: "Contingency Buffer (%)", tip: "Safety margin.", ph: "10" },
  ];

  /* ------------- helpers ------------- */
  const handle = (k: string, v: string) => setFields((p) => ({ ...p, [k]: v }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    [...costFields, ...planFields].forEach(({ k }) => {
      if (isNaN(Number(fields[k])) || Number(fields[k]) < 0) e[k] = "Invalid";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ------------- main calc ------------- */
  const calculate = () => {
    if (!validate()) return;

    const F = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, Number(v || 0)])
    ) as Record<string, number>;

    const catering = F.plateCost * F.guests;
    const gifts = F.giftPerGuest * F.guests;
    const baseTotal =
      F.venue +
      catering +
      F.decor +
      F.photo +
      F.entertainment +
      F.attire +
      F.invites +
      gifts +
      F.misc;

    const inflatedTotal = baseTotal * Math.pow(1 + F.inflation / 100, F.years);
    const totalWithBuffer = inflatedTotal * (1 + F.buffer / 100);

    const n = F.years * 12;
    const r = F.returnRate / 100 / 12;
    const monthlySaving = (totalWithBuffer * r) / (Math.pow(1 + r, n) - 1);

    const pvCost = totalWithBuffer / Math.pow(1 + F.returnRate / 100, F.years);

    setResult({ baseTotal, inflatedTotal, totalWithBuffer, monthlySaving, pvCost });

    /* pie */
    setPieData([
      { name: "Venue", value: F.venue, fill: "#108E66" },
      { name: "Catering", value: catering, fill: "#6ABF7B" },
      { name: "Decor", value: F.decor, fill: "#A8D5BA" },
      { name: "Photo/Video", value: F.photo, fill: "#D4ECDC" },
      { name: "Entertainment", value: F.entertainment, fill: "#FCFFE7" },
      { name: "Attire", value: F.attire, fill: "#F8B195" },
      { name: "Invites", value: F.invites, fill: "#F67280" },
      { name: "Gifts", value: gifts, fill: "#C06C84" },
      { name: "Misc", value: F.misc, fill: "#355C7D" },
    ]);

    /* growth */
    const g: any[] = [];
    let corpus = 0;
    for (let m = 1; m <= n; m++) {
      corpus = corpus * (1 + r) + monthlySaving;
      g.push({ month: m, corpus: Math.round(corpus), target: Math.round(monthlySaving * m) });
    }
    setGrowthData(g);

    /* table */
    const rows: any[] = [];
    for (let y = 1; y <= F.years; y++) {
      const factor = Math.pow(1 + F.inflation / 100, y);
      const cost = baseTotal * factor;
      const target = cost * (1 + F.buffer / 100);
      rows.push({ year: y, factor: factor.toFixed(2), cost: Math.round(cost), target: Math.round(target) });
    }
    setTableRows(rows);

    setComputed(true);
  };

  /* ------------- render ------------- */
  return (
    <div className="px-4 py-6 font-poppins text-ink">
      {/* back nav */}
      <Link href="/tools" className="back">
         Back to Dashboard
      </Link>

      <h1 className="mb-2 text-center text-3xl font-semibold">What Will Our Dream Wedding Cost?</h1>
      <p className="mb-6 text-center text-sm text-ink/70">
        Plug in your numbers, forecast inflation, and discover the monthly SIP you need.
      </p>

      {/* cost inputs */}
      <section className="mb-6 rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold"> Core Event Costs</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {costFields.map(({ k, lbl, tip, ph }) => (
            <label key={k} className="flex flex-col text-sm">
              <span className="mb-1 flex items-center font-medium">
                {lbl}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                placeholder={ph}
                value={fields[k]}
                onChange={(e) => handle(k, e.target.value)}
                className="rounded border border-ink/50 px-3 py-2"
              />
              {errors[k] && <small className="text-xs text-red-600">Invalid</small>}
              <small className="text-xs text-ink/60">
                {k === "guests"
                  ? `${toWords(+fields[k])} guests`
                  : `${toWords(+fields[k])} Rupees`}
              </small>
            </label>
          ))}
        </div>
      </section>

      {/* planning inputs */}
      <section className="mb-6 rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold"> Planning Variables</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {planFields.map(({ k, lbl, tip, ph }) => (
            <label key={k} className="flex flex-col text-sm">
              <span className="mb-1 flex items-center font-medium">
                {lbl}
                <TooltipIcon text={tip} />
              </span>
              <input
                type="number"
                placeholder={ph}
                value={fields[k]}
                onChange={(e) => handle(k, e.target.value)}
                className="rounded border border-ink/50 px-3 py-2"
              />
              {errors[k] && <small className="text-xs text-red-600">Invalid</small>}
              <small className="text-xs text-ink/60">
                {toWords(+fields[k])} {lbl.includes("%") ? "percent" : lbl.includes("Years") ? "years" : ""}
              </small>
            </label>
          ))}
        </div>
      </section>

      {/* calculate */}
      <button
        onClick={calculate}
        className="block w-full rounded bg-primary py-3 text-center text-base font-semibold text-white hover:opacity-90"
      >
        Calculate
      </button>

      {/* outputs */}
      {computed && (
        <section className="mt-8 space-y-6">
          {/* summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Grand Total", value: result.totalWithBuffer },
              { label: "Per-Guest Cost", value: result.totalWithBuffer / Number(fields.guests || 1) },
              { label: "Monthly Savings", value: result.monthlySaving },
              { label: "Present-Value Cost", value: result.pvCost },
            ].map(({ label, value }) => (
              <div key={label} className="rounded border border-primary p-4 text-center">
                <p className="text-xs font-medium text-ink/70">{label}</p>
                <p className="mt-1 text-lg font-semibold">₹{fmt(Math.round(value))}</p>
              </div>
            ))}
          </div>

          {/* chart toggle */}
          <div className="flex justify-center gap-4">
            <button
              className={`rounded border px-4 py-2 text-sm ${
                chart === "pie" ? "border-primary bg-primary text-white" : "border-ink/40"
              }`}
              onClick={() => setChart("pie")}
            >
              Pie
            </button>
            <button
              className={`rounded border px-4 py-2 text-sm ${
                chart === "growth" ? "border-primary bg-primary text-white" : "border-ink/40"
              }`}
              onClick={() => setChart("growth")}
            >
              Growth
            </button>
          </div>

          {/* chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer>
              {chart === "pie" ? (
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                </PieChart>
              ) : (
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₹${fmt(v as number)}`} />
                  <RechartsTooltip formatter={(v: number) => `₹${fmt(v)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="corpus" name="Corpus" stroke="#108E66" />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#272A2B" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* yearly table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-2 py-1">Year</th>
                  <th className="px-2 py-1">Inflation Factor</th>
                  <th className="px-2 py-1">Nominal Cost (₹)</th>
                  <th className="px-2 py-1">Target w/ Buffer (₹)</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.year} className="even:bg-ink/5">
                    <td className="px-2 py-1 text-center">{r.year}</td>
                    <td className="px-2 py-1 text-center">{r.factor}</td>
                    <td className="px-2 py-1 text-center">₹{fmt(r.cost)}</td>
                    <td className="px-2 py-1 text-center">₹{fmt(r.target)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* insights */}
          <div className="rounded border-l-4 border-primary bg-[#FCFFE7] p-4 text-sm">
            <p className="mb-1">
              Start a SIP of <strong>₹{fmt(Math.round(result.monthlySaving))}</strong> to reach the
              target in {fields.years} years.
            </p>
            <p className="mb-1">
              Venue + catering constitute&nbsp;
              {fmt(
                Math.round(
                  ((Number(fields.venue) + Number(fields.plateCost) * Number(fields.guests)) /
                    result.baseTotal) *
                    100,
                ),
              )}
              % of budget—negotiating 5 % less here could save about&nbsp;
              <strong>
                ₹
                {fmt(
                  Math.round(
                    (Number(fields.venue) + Number(fields.plateCost) * Number(fields.guests)) * 0.05,
                  ),
                )}
              </strong>
              .
            </p>
            <p>Consider off-season or weekday dates to trim costs by up to 20 %.</p>
          </div>

          {/* CTA */}
         
        </section>
      )}

      {/* global (palette) */}
      <style jsx global>{`
        :root {
          --primary: #108e66;
          --ink: #272a2b;
        }
        .text-primary {
          color: var(--primary);
        }
        .bg-primary {
          background: var(--primary);
        }
        .border-primary {
          border-color: var(--primary);
        }
          .back-button {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        .text-ink {
          color: var(--ink);
        }
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}
