// File: /app/tools/vacation-budget-planner/page.tsx

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

// -----------------------
// Tooltip icon
// -----------------------
const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [hover, setHover] = useState(false);
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
          white-space: nowrap;
          font-size: 0.75rem;
          z-index: 10;
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

// -----------------------
// Number-to-words
// -----------------------
const numberToWords = (num: number): string => {
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
    "Ten",
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
  return helper(Math.round(Math.abs(num)));
};

// -----------------------
// Main Component
// -----------------------
export default function VacationBudgetPlanner() {
  // inputs
  const [numTravelers, setNumTravelers] = useState("");
  const [tripDays, setTripDays] = useState("");
  const [flightCost, setFlightCost] = useState("");
  const [transportDaily, setTransportDaily] = useState("");
  const [hotelNight, setHotelNight] = useState("");
  const [numRooms, setNumRooms] = useState("");
  const [foodDaily, setFoodDaily] = useState("");
  const [activityDaily, setActivityDaily] = useState("");
  const [shoppingTotal, setShoppingTotal] = useState("");
  const [bufferPct, setBufferPct] = useState("");
  const [error, setError] = useState<string | null>(null);

  // results
  const [travelTotal, setTravelTotal] = useState(0);
  const [accommodationTotal, setAccommodationTotal] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [bufferAmount, setBufferAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [perDayPerPerson, setPerDayPerPerson] = useState(0);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [calculated, setCalculated] = useState(false);

  const fmt = (n: number) =>
    `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const handleCalculate = () => {
    setError(null);
    const t = parseInt(numTravelers),
      d = parseInt(tripDays);
    const fc = parseFloat(flightCost),
      td = parseFloat(transportDaily);
    const hn = parseFloat(hotelNight),
      rooms = parseInt(numRooms);
    const fd = parseFloat(foodDaily),
      ad = parseFloat(activityDaily);
    const st = parseFloat(shoppingTotal),
      bp = parseFloat(bufferPct) / 100;

    if (!(t > 0 && d > 0))
      return setError("Enter valid number of travelers and days");
    if ([fc, td, hn, rooms, fd, ad, st, bp].some((v) => isNaN(v))) {
      return setError("Please fill all fields with valid numbers");
    }

    const totalFlight = t * fc;
    const totalTransport = t * td * d;
    const travel = totalFlight + totalTransport;

    const accommodation = hn * rooms * d;

    const food = t * fd * d;
    const activity = t * ad * d;
    const daily = food + activity;

    const base = travel + accommodation + daily + st;
    const buffer = base * bp;
    const grand = base + buffer;
    const perDayPerson = grand / (t * d);

    setTravelTotal(travel);
    setAccommodationTotal(accommodation);
    setDailyTotal(daily);
    setBufferAmount(buffer);
    setGrandTotal(grand);
    setPerDayPerPerson(perDayPerson);
    setCalculated(true);
  };

  const data = [
    { name: "Travel", value: travelTotal },
    { name: "Lodging", value: accommodationTotal },
    { name: "Food & Activities", value: dailyTotal },
    { name: "Shopping", value: parseFloat(shoppingTotal) || 0 },
    { name: "Buffer", value: bufferAmount },
  ];

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Plan Your Vacation Budget</h1>
      <p className="description">
        Estimate total trip costs—flights, lodging, food, activities, shopping &
        buffer.
      </p>
      <div className="explanation">
        <p>
          <strong>Vacation Budget Planner:</strong> This calculator helps you
          estimate the <strong>total cost of your trip</strong> by breaking down
          expenses such as{" "}
          <strong>travel, accommodation, food, activities</strong>, and{" "}
          <strong>miscellaneous costs</strong>. It is designed to help you plan
          your getaway without financial surprises.
        </p>
        <p>
          By entering your <strong>expected expenses</strong> for each category
          and setting a <strong>total trip budget</strong>, the planner shows
          how your costs align with your financial goals. It is perfect for
          keeping your vacation <strong>stress-free and budget-friendly</strong>
          .
        </p>
      </div>

      <section className="card form-card">
        <div className="grid">
          {[
            {
              label: "Number of Travelers",
              key: "numTravelers",
              value: numTravelers,
              set: setNumTravelers,
              placeholder: "e.g. 2",
              tooltip: "Total people on your trip",
              suffix: "people",
            },
            {
              label: "Trip Duration (Days)",
              key: "tripDays",
              value: tripDays,
              set: setTripDays,
              placeholder: "e.g. 5",
              tooltip: "Total nights away",
              suffix: "days",
            },
            {
              label: "Round-Trip Flight/person (₹)",
              key: "flightCost",
              value: flightCost,
              set: setFlightCost,
              placeholder: "e.g. 15000",
              tooltip: "Return airfare per traveler",
              suffix: "Rupees",
            },
            {
              label: "Local Transport/day/person (₹)",
              key: "transportDaily",
              value: transportDaily,
              set: setTransportDaily,
              placeholder: "e.g. 500",
              tooltip: "Taxi, rideshare per traveler/day",
              suffix: "Rupees",
            },
            {
              label: "Hotel Cost/night (₹)",
              key: "hotelNight",
              value: hotelNight,
              set: setHotelNight,
              placeholder: "e.g. 3000",
              tooltip: "Room rate per night (per room)",
              suffix: "Rupees",
            },
            {
              label: "Rooms Required",
              key: "numRooms",
              value: numRooms,
              set: setNumRooms,
              placeholder: "e.g. 1",
              tooltip: "Number of rooms needed",
              suffix: "rooms",
            },
            {
              label: "Food & Dining/day/person (₹)",
              key: "foodDaily",
              value: foodDaily,
              set: setFoodDaily,
              placeholder: "e.g. 800",
              tooltip: "Meals, snacks per traveler/day",
              suffix: "Rupees",
            },
            {
              label: "Activities/day/person (₹)",
              key: "activityDaily",
              value: activityDaily,
              set: setActivityDaily,
              placeholder: "e.g. 1200",
              tooltip: "Tours, entry fees per traveler/day",
              suffix: "Rupees",
            },
            {
              label: "Shopping & Souvenirs (₹)",
              key: "shoppingTotal",
              value: shoppingTotal,
              set: setShoppingTotal,
              placeholder: "e.g. 10000",
              tooltip: "Lump sum estimate",
              suffix: "Rupees",
            },
            {
              label: "Contingency Buffer (%)",
              key: "bufferPct",
              value: bufferPct,
              set: setBufferPct,
              placeholder: "e.g. 10",
              tooltip: "Unexpected expenses buffer",
              suffix: "percent",
            },
          ].map((f, i) => (
            <div key={i} className="field">
              <label>
                {f.label}
                <TooltipIcon text={f.tooltip} />
              </label>
              <input
                type="number"
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
              />
              {f.value && (
                <small className="converter">
                  {numberToWords(+f.value)} {f.suffix}
                </small>
              )}
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button className="calc-btn" onClick={handleCalculate}>
          Calculate Budget
        </button>
      </section>

      {calculated && (
        <>
          <section className="card results-card">
            <h2 className="section-title">Trip Cost Summary</h2>
            <div className="summary-grid">
              {[
                ["Travel Total", travelTotal],
                ["Lodging Total", accommodationTotal],
                ["Food & Activities", dailyTotal],
                ["Shopping & Misc.", parseFloat(shoppingTotal) || 0],
                ["Contingency Buffer", bufferAmount],
                ["Grand Total", grandTotal],
                ["Cost per Day per Person", perDayPerPerson],
              ].map(([label, val], i) => (
                <div key={i}>
                  <strong>{label}</strong>
                  <br />
                  {fmt(val as number)}
                </div>
              ))}
            </div>

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

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {data.map((d, i) => (
                        <Cell
                          key={i}
                          fill={
                            [
                              "#108E66",
                              "#272A2B",
                              "#108E66",
                              "#272A2B",
                              "#108E66",
                            ][i]
                          }
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip formatter={(v) => fmt(v as number)} />
                  </PieChart>
                ) : (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
                    <RechartsTooltip formatter={(v) => fmt(v as number)} />
                    <Legend />
                    <Bar dataKey="value" fill="#108E66" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </section>

          <section className="disc">
            <h3 >Important considrations</h3>
            <ul >
              <li>
                Booking flights 2–3 months early often saves 10–20% on airfare.
              </li>
              <li>
                Consider homestays or off‐season stays to lower lodging costs.
              </li>
              <li>
                A 10–15% buffer covers unexpected expenses like tips or local
                taxes.
              </li>
              <li>
                Group discounts on activities can reduce per-person rates.
              </li>
              <li>Sharing rooms or rides further optimizes your budget.</li>
            </ul>
          </section>
        </>
      )}

      <style jsx>{`
        .container {
          max-width: 100%;
          margin: auto;
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: "Poppins", sans-serif;
        }
        .top-nav {
          text-align: left;
          margin-bottom: 1rem;
        }
        .back-btn {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
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

        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .form-card .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .field label {
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }
        .field input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
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
        .converter {
          display: block;
          margin-top: 4px;
          font-size: 0.85rem;
          color: #444;
        }

        .calc-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.75rem;
          font-size: 1rem;
          background: #108e66;
          color: #fcfffe;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .error {
          color: red;
          text-align: center;
          margin-top: 0.5rem;
        }

        .results-card .section-title {
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .summary-grid > div {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 0.75rem;
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
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          background: #fafafa;
        }
        .chart-toggle button.active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart-container {
          width: 100%;
          height: 300px;
          margin-bottom: 1.5rem;
        }

        .points-card {
          border: 1px solid #108e66;
        }
        .points-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .points-list {
          list-style: disc inside;
          line-height: 1.5;
          padding-left: 1rem;
        }

        @media (max-width: 600px) {
          .form-card .grid,
          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
