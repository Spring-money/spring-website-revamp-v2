"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ─────────────────── Types ─────────────────── */
interface Inputs {
  currentAge: string;
  educationAge: string;
  currentCost: string;
  inflationRate: string;
  courseDuration: string;
}

const ToolTip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="tooltip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="info-icon">i</span>
      {open && <span className="tooltip-text">{text}</span>}
      <style jsx>{`
        .tooltip {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .info-icon {
          background: #108e66;
          color: white;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          font-size: 0.75rem;
          line-height: 14px;
          text-align: center;
          font-weight: bold;
          display: inline-block;
        }
        .tooltip-text {
          position: absolute;
          bottom: 120%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #108e66;
          color: #fcfffe;
          text-align: left;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.85rem;
          width: 200px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
        .tooltip-text::after {
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

/* ───────────────── Component ───────────────── */
const ChildEducationCostEstimator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    currentAge: "",
    educationAge: "",
    currentCost: "",
    inflationRate: "",
    courseDuration: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const [results, setResults] = useState<any>(null);

  /* -------- validation -------- */
  const validateInputs = (): boolean => {
    return Object.values(inputs).every((value) => value !== "");
  };

  /* -------- calculate -------- */
  const calculate = () => {
    if (!validateInputs()) {
      alert("Please fill in all fields before calculating.");
      return;
    }

    // Perform calculations here (dummy calculation for now)
    const futureCost = (parseInt(inputs.currentCost) || 0) * (1 + (parseInt(inputs.inflationRate) || 0) / 100);
    setResults({
      futureCost,
      insight: `The future estimated cost is ₹${futureCost.toLocaleString("en-IN")}`,
    });
  };

  return (
    <div className="container">
      <div className="back-button">
        <Link href="/tools">
          <button>Back to Dashboard</button>
        </Link>
      </div>

      {/* Title and Description */}
      <div className="header">
        <h1>Child Education Cost Estimator</h1>
        <p>Estimate the cost of a childs education based on current expenses and expected inflation.</p>
      </div>
      <div className="explanation">
  <p>
    <strong>Child Education Cost Estimator:</strong> This tool helps you estimate the future cost of your child education based on current tuition fees, inflation, and years left until enrollment.
  </p>
  <p>
    It accounts for <strong>education inflation rates</strong>, <strong>years of study</strong>, and <strong>expected annual costs</strong> to calculate the total amount you may need to save. This gives you a realistic savings target to ensure your child’s education plans are financially secure.
  </p>
</div>

      {/* Form */}
      <div className="form">
        <div className="form-group">
          <label htmlFor="currentAge">
            Current Age of Child (Years)
            <ToolTip text="Enter the current age of the child." />
          </label>
          <input
            type="number"
            id="currentAge"
            name="currentAge"
            value={inputs.currentAge}
            onChange={handleChange}
            placeholder="e.g., 5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="educationAge">
            Age When Education Starts (Years)
            <ToolTip text="Enter the age at which education is expected to start." />
          </label>
          <input
            type="number"
            id="educationAge"
            name="educationAge"
            value={inputs.educationAge}
            onChange={handleChange}
            placeholder="e.g., 18"
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentCost">
            Current Cost of Education (INR)
            <ToolTip text="Enter the current cost of the child's education." />
          </label>
          <input
            type="number"
            id="currentCost"
            name="currentCost"
            value={inputs.currentCost}
            onChange={handleChange}
            placeholder="e.g., 500000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="inflationRate">
            Inflation Rate (%)
            <ToolTip text="Enter the expected annual inflation rate for education costs." />
          </label>
          <input
            type="number"
            id="inflationRate"
            name="inflationRate"
            value={inputs.inflationRate}
            onChange={handleChange}
            placeholder="e.g., 7"
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseDuration">
            Course Duration (Years)
            <ToolTip text="Enter the number of years the course will last." />
          </label>
          <input
            type="number"
            id="courseDuration"
            name="courseDuration"
            value={inputs.courseDuration}
            onChange={handleChange}
            placeholder="e.g., 4"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <div className="calc-card">
        <button className="calculate-btn" onClick={calculate}>Calculate</button>
      </div>

      {/* Results */}
      {results && (
        <div className="results">
          <h2>Estimated Future Cost</h2>
          <p>{results.insight}</p>

          {/* Important Considerations */}
          <div className="important-considerations">
            <h3>Important Considerations</h3>
            <ul>
              <li>Inflation assumptions are based on the current rate.</li>
              <li>Tax and fee considerations are not factored into the estimate.</li>
              <li>Check with financial advisors for more tailored advice.</li>
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          font-family: "Poppins", sans-serif;
          padding: 2rem;
          background-color: #fcfffe;
          color: #272a2b;
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
        .back-button {
          margin-bottom: 1rem;
        }
        button {
          background: #108e66;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        /* Header Section */
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .header h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .header p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        /* Form */
        .form {
          display: grid;
          grid-template-columns:repeat(2, 1fr);
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        input {
          padding: 0.5rem;
          border: 1px solid #272a2b;
          border-radius: 4px;
          font-size: 1rem;
        }
        .tooltip {
          position: relative;
        }

        /* Calculate Button */
        .calc-card {
          margin-top: 2rem;
        }
        .calculate-btn {
          background: #108e66;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
        }

        /* Results */
        .results {
          margin-top: 2rem;
          text-align: center;
        }

        .important-considerations {
          margin-top: 2rem;
          background: #f7f7f7;
          padding: 1rem;
          border-radius: 4px;
        }
        .important-considerations h3 {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .important-considerations ul {
          padding-left: 1.2rem;
          list-style: disc;
        }
      `}</style>
    </div>
  );
};

export default ChildEducationCostEstimator;
