// File: /app/tools/property-valuation-calculator/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
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
// Helpers
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
  return helper(Math.round(Math.abs(num)));
};

const numberToWordsPercent = (v: number): string => {
  const ip = Math.floor(v),
    dp = Math.round((v - ip) * 100);
  return dp === 0
    ? `${numberToWords(ip)} percent`
    : `${numberToWords(ip)} point ${numberToWords(dp)} percent`;
};

// Mock function; replace with real rate lookup
const getAvgRate = (location: string, type: string): number =>
  type === "Residential" ? 5000 : 8000;

// Tooltip icon
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
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
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
// Main Component
// -----------------------

export default function PropertyValuationCalculator() {
  // Input state
  const [location, setLocation] = useState("");
  const [propType, setPropType] = useState<"Residential" | "Commercial">(
    "Residential"
  );
  const [area, setArea] = useState("");
  const [age, setAge] = useState("");
  const [floor, setFloor] = useState("");
  const [direction, setDirection] = useState<
    "North" | "East" | "South" | "West"
  >("North");
  const [parking, setParking] = useState("");
  const [furnishing, setFurnishing] = useState<
    "Unfurnished" | "Semi-furnished" | "Fully-furnished"
  >("Unfurnished");
  const [hasPool, setHasPool] = useState(false);
  const [hasClubhouse, setHasClubhouse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsed area for table
  const areaNum = parseFloat(area) || 0;

  // Results state
  const [baseRate, setBaseRate] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [deprPrice, setDeprPrice] = useState(0);
  const [dirPrice, setDirPrice] = useState(0);
  const [amenityPrice, setAmenityPrice] = useState(0);
  const [parkingCharge, setParkingCharge] = useState(0);
  const [finalValue, setFinalValue] = useState(0);
  const [lowEstimate, setLowEstimate] = useState(0);
  const [highEstimate, setHighEstimate] = useState(0);
  const [barData, setBarData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [showResults, setShowResults] = useState(false);

  const calculate = () => {
    setError(null);
    const A = parseFloat(area),
      Y = parseFloat(age),
      F = parseInt(floor, 10),
      P = parseInt(parking, 10);

    if (!location.trim() || isNaN(A) || isNaN(Y) || isNaN(F) || isNaN(P)) {
      setError("Please fill all fields with valid values.");
      return;
    }

    // Base rate & price
    const rate = getAvgRate(location.trim(), propType);
    const bp = A * rate;

    // Depreciation (1% p.a.)
    const deprFactor = Math.max(0, 1 - 0.01 * Y);
    const dp = bp * deprFactor;

    // Floor premium
    const floorFactor = 1 + 0.005 * (F - 1);
    const fp = dp * floorFactor;

    // Direction multiplier
    const dirMultipliers: Record<string, number> = {
      North: 1.02,
      East: 1.01,
      South: 1.0,
      West: 0.99,
    };
    const dp2 = fp * dirMultipliers[direction];

    // Amenities premium
    let amenityPct = 0;
    if (furnishing === "Semi-furnished") amenityPct += 0.03;
    if (furnishing === "Fully-furnished") amenityPct += 0.07;
    if (hasPool) amenityPct += 0.05;
    if (hasClubhouse) amenityPct += 0.04;
    const ap = dp2 * (1 + amenityPct);

    // Parking charge
    const pc = P * 200000;

    // Final and range
    const fv = Math.round(ap + pc),
      low = Math.round(fv * 0.95),
      high = Math.round(fv * 1.05);

    // Set states
    setBaseRate(rate);
    setBasePrice(Math.round(bp));
    setDeprPrice(Math.round(dp));
    setDirPrice(Math.round(dp2));
    setAmenityPrice(Math.round(ap));
    setParkingCharge(pc);
    setFinalValue(fv);
    setLowEstimate(low);
    setHighEstimate(high);

    // Bar chart data
    setBarData([
      { name: "Base", value: Math.round(bp) },
      { name: "After Depn", value: Math.round(dp) },
      { name: "Floor/Dir", value: Math.round(dp2) },
      { name: "Amenities", value: Math.round(ap) },
      { name: "Parking", value: pc },
      { name: "Final", value: fv },
    ]);

    // Line chart data
    const ld: any[] = [];
    for (let y = 0; y <= 20; y++) {
      const val = Math.round(bp * Math.max(0, 1 - 0.01 * y));
      ld.push({ year: y, value: val });
    }
    setLineData(ld);

    setShowResults(true);
  };

  return (
    <main className="container">
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-btn"> Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">What’s My Property Worth?</h1>
      <p className="description">
        Estimate your property’s fair market value using local rates and key
        adjustments.
      </p>
      <div className="explanation">
        <p>
          <strong>Property Appreciation:</strong> This calculator helps you
          estimate how much your propertys value may increase over time based on
          an assumed <strong>annual appreciation rate</strong>.
        </p>
        <p>
          By entering the <strong>initial property value</strong> and your
          expected <strong>yearly growth percentage</strong>, it projects the
          future value over a selected number of years, assuming compounding
          appreciation.
        </p>
        <p>
          This tool is useful for investors and homeowners looking to understand
          potential long-term returns, evaluate investment timing, or compare
          real estate with other asset classes like mutual funds or stocks.
        </p>
      </div>

      <section className="card form">
        <div className="grid">
          {/* Location */}
          <div>
            <label>
              Location{" "}
              <TooltipIcon text="Area or postal code to fetch avg. rates" />
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. 560001"
            />
          </div>

          {/* Property Type */}
          <div>
            <label>
              Property Type <TooltipIcon text="Residential or Commercial" />
            </label>
            <select
              aria-label="Property Type"
              value={propType}
              onChange={(e) => setPropType(e.target.value as any)}
            >
              <option>Residential</option>
              <option>Commercial</option>
            </select>
          </div>

          {/* Area */}
          <div>
            <label>
              Built-up Area (sq ft){" "}
              <TooltipIcon text="Total carpet + common area" />
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. 1200"
            />
            {area && (
              <small className="converter">{numberToWords(+area)} sq ft</small>
            )}
          </div>

          {/* Age */}
          <div>
            <label>
              Age of Property (Years){" "}
              <TooltipIcon text="Years since construction" />
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 5"
            />
            {age && (
              <small className="converter">{numberToWords(+age)} years</small>
            )}
          </div>

          {/* Floor */}
          <div>
            <label>
              Floor Number <TooltipIcon text="1 = Ground, 2 = First, etc." />
            </label>
            <input
              type="number"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="e.g. 3"
            />
          </div>

          {/* Direction */}
          <div>
            <label>
              Direction Facing{" "}
              <TooltipIcon text="North / East / South / West" />
            </label>
            <select
              aria-label="Direction Facing"
              value={direction}
              onChange={(e) => setDirection(e.target.value as any)}
            >
              <option>North</option>
              <option>East</option>
              <option>South</option>
              <option>West</option>
            </select>
          </div>

          {/* Parking */}
          <div>
            <label>
              Parking Slots <TooltipIcon text="Number of covered slots" />
            </label>
            <input
              type="number"
              value={parking}
              onChange={(e) => setParking(e.target.value)}
              placeholder="e.g. 2"
            />
          </div>

          {/* Furnishing */}
          <div>
            <label>
              Furnishing Level{" "}
              <TooltipIcon text="Unfurnished / Semi-furnished / Fully-furnished" />
            </label>
            <select
              aria-label="Furnishing Level"
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value as any)}
            >
              <option>Unfurnished</option>
              <option>Semi-furnished</option>
              <option>Fully-furnished</option>
            </select>
          </div>

          {/* Pool */}
          <div className="switch-row">
            <label>
              Swimming Pool <TooltipIcon text="Add premium for pool amenity" />
            </label>
            <input
              type="checkbox"
              checked={hasPool}
              onChange={(e) => setHasPool(e.target.checked)}
              aria-label="Swimming Pool"
            />
          </div>

          {/* Clubhouse */}
          <div className="switch-row">
            <label>
              Clubhouse / Gym{" "}
              <TooltipIcon text="Add premium for clubhouse/gym" />
            </label>
            <input
              type="checkbox"
              checked={hasClubhouse}
              onChange={(e) => setHasClubhouse(e.target.checked)}
              aria-label="Clubhouse / Gym"
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="calc-btn" onClick={calculate}>
          Calculate My Property Value
        </button>
      </section>

      {showResults && (
        <>
          <section className="card results">
            <h2 className="section-title">Estimation Summary</h2>

            <div className="summary">
              <div>
                <strong>Estimated Value Range</strong>
                <br />₹{lowEstimate.toLocaleString("en-IN")} – ₹
                {highEstimate.toLocaleString("en-IN")}
              </div>
              <div>
                <strong>Rate ₹/sq ft</strong>
                <br />₹{baseRate.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="toggle">
              <button
                className={chartType === "bar" ? "active" : ""}
                onClick={() => setChartType("bar")}
              >
                Breakdown Bar
              </button>
              <button
                className={chartType === "line" ? "active" : ""}
                onClick={() => setChartType("line")}
              >
                Depreciation Line
              </button>
            </div>

            <div className="chart">
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "bar" ? (
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(v) =>
                        `₹${(v as number).toLocaleString("en-IN")}`
                      }
                    />
                    <RechartsTooltip
                      formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#108E66" />
                  </BarChart>
                ) : (
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="year"
                      label={{
                        value: "Age (yrs)",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      tickFormatter={(v) =>
                        `₹${(v as number).toLocaleString("en-IN")}`
                      }
                    />
                    <RechartsTooltip
                      formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#108E66"
                      strokeWidth={2}
                      name="Value over Age"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            <h2 className="table-head">Year-Wise Depreciation</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Rate ₹/sq ft</th>
                    <th>Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 5, 10, 20].map((y) => {
                    const rrate = baseRate * Math.max(0, 1 - 0.01 * y);
                    return (
                      <tr key={y}>
                        <td>{y}</td>
                        <td>₹{Math.round(rrate).toLocaleString("en-IN")}</td>
                        <td>
                          ₹{Math.round(rrate * areaNum).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="insight">
              <p>
                💡 Your property’s final estimate is ₹
                {finalValue.toLocaleString("en-IN")}.
              </p>
              <p>
                💡 Depreciation shaved off ₹
                {(basePrice - deprPrice).toLocaleString("en-IN")}.
              </p>
              <p>
                💡 Amenities & furnishing added{" "}
                {numberToWordsPercent(
                  ((amenityPrice - dirPrice) / dirPrice) * 100
                )}
                , i.e. ₹{(amenityPrice - dirPrice).toLocaleString("en-IN")}.
              </p>
            </div>
          </section>

          <section className="disc">
            <h2>Important Considerations</h2>
            <ul>
              <li>
                This is an indicative estimate based on average per-sq-ft rates
                for your area.
              </li>
              <li>
                Depreciation is assumed at 1% p.a.; actual wear-and-tear may
                differ.
              </li>
              <li>
                Floor and direction premiums are model approximations; local
                demand may vary.
              </li>
              <li>
                Amenities and parking charges are added at fixed rates; verify
                with real market listings.
              </li>
              <li>
                The ±5% final range accounts for normal market variance and
                transactional factors.
              </li>
              <li>
                For a precise valuation, consider engaging a certified property
                appraiser.
              </li>
            </ul>
          </section>
        </>
      )}

      {/* Styles */}
      <style jsx>{`
        .container {
          max-width: 100%;
          margin: auto;
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #fcfffe;
          color: #272a2b;
        }
        .top-nav {
          margin-bottom: 1rem;
          text-align: left;
        }
        .back-btn {
          background: #108e66;
          color: #fcfffe;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .title {
          text-align: center;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .description {
          text-align: center;
          font-size: 1.05rem;
          color: #555;
          margin-bottom: 1.5rem;
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
        .card {
          background: #fcfffe;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .form .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        input,
        select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          font-size: 1rem;
        }
        .switch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .switch-row input {
          width: 1.2rem;
          height: 1.2rem;
          accent-color: #108e66;
        }
        .converter {
          font-size: 0.85rem;
          color: #555;
          margin-top: 0.25rem;
        }
        .error {
          color: red;
          text-align: center;
          margin: 0.5rem 0;
        }
        .calc-btn {
          display: block;
          margin: 1rem auto 0;
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .results .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 1rem;
        }
        .summary {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .summary > div {
          min-width: 200px;
          border: 1px solid #108e66;
          padding: 0.75rem;
          border-radius: 6px;
          text-align: center;
          font-weight: 500;
        }
        .toggle {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .toggle button {
          padding: 0.5rem 1rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
        }
        .toggle .active {
          background: #108e66;
          color: #fcfffe;
          border-color: #108e66;
        }
        .chart {
          width: 100%;
          height: 300px;
          margin-bottom: 1rem;
        }
        .table-head {
          text-align: center;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .table-wrap {
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #272a2b;
          padding: 0.5rem;
          text-align: center;
        }
        th {
          background: #108e66;
          color: #fcfffe;
        }
        .insight {
          background: #f7fff9;
          border: 1px solid #108e66;
          border-radius: 6px;
          padding: 1rem;
          margin-top: 1rem;
          color: #272a2b;
        }
        .considerations h2 {
          margin-bottom: 0.75rem;
        }
        .considerations ul {
          list-style: disc inside;
          line-height: 1.4;
        }
        .considerations li {
          margin-bottom: 0.5rem;
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

        @media (max-width: 600px) {
          .form .grid,
          .summary {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
