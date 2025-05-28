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

/* ───────── Tooltip component ───────── */
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
          color: #fcfffe;
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
          background: #108e66;
          color: #fcfffe;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.85rem;
          width: 200px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 10;
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
    setInputs((p) => ({ ...p, [name]: value }));
  };

  const [results, setResults] = useState<any>(null);

  /* -------- validation -------- */
  const validateInputs = () => Object.values(inputs).every((v) => v !== "");

  /* -------- calculate -------- */
  const calculate = () => {
    if (!validateInputs()) {
      alert("Please fill in all fields before calculating.");
      return;
    }
    const futureCost =
      (parseInt(inputs.currentCost) || 0) *
      (1 + (parseInt(inputs.inflationRate) || 0) / 100);
    setResults({
      futureCost,
      insight: `The future estimated cost is ₹${futureCost.toLocaleString(
        "en-IN"
      )}`,
    });
  };

  return (
    <div className="container">
      <div className="back-button">
        <Link href="/tools">
          <button>Back to Dashboard</button>
        </Link>
      </div>

      {/* Header */}
      <div className="header">
        <h1>Child Education Cost Estimator</h1>
        <p>
          Estimate the cost of a child’s education based on current expenses and
          expected inflation.
        </p>
      </div>

      <div className="explanation">
        <p>
          <strong>Child Education Cost Estimator:</strong> This tool helps you
          estimate the future cost of your child’s education using current fees,
          inflation, and years left until enrolment.
        </p>
        <p>
          It considers <strong>education inflation</strong>,{" "}
          <strong>course duration</strong>, and <strong>annual costs</strong> to
          give you a realistic savings target.
        </p>
      </div>

      {/* Form */}
      <div className="form">
        {(
          [
            [
              "currentAge",
              "Current Age of Child (Years)",
              "Enter the current age of the child.",
              "e.g., 5",
            ],
            [
              "educationAge",
              "Age When Education Starts (Years)",
              "Enter the age at which education is expected to start.",
              "e.g., 18",
            ],
            [
              "currentCost",
              "Current Cost of Education (INR)",
              "Enter the current cost of the child's education.",
              "e.g., 500000",
            ],
            [
              "inflationRate",
              "Inflation Rate (%)",
              "Enter the expected annual inflation rate for education costs.",
              "e.g., 7",
            ],
            [
              "courseDuration",
              "Course Duration (Years)",
              "Enter the number of years the course will last.",
              "e.g., 4",
            ],
          ] as const
        ).map(([k, lbl, tip, ph]) => (
          <div className="form-group" key={k}>
            <label htmlFor={k}>
              {lbl} <ToolTip text={tip} />
            </label>
            <input
              type="number"
              id={k}
              name={k}
              value={(inputs as any)[k]}
              onChange={handleChange}
              placeholder={ph}
            />
          </div>
        ))}
      </div>

      {/* Calculate Button */}
      <div className="calc-card">
        <button className="calculate-btn" onClick={calculate}>
          Calculate
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="results">
          <h2>Estimated Future Cost</h2>
          <p>{results.insight}</p>

          <div className="important-considerations">
            <h3>Important Considerations</h3>
            <ul>
              <li>Inflation assumptions are based on current rates.</li>
              <li>Taxes and fees are not included in this estimate.</li>
              <li>Consult a financial advisor for personalised advice.</li>
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          font-family: "Poppins", sans-serif;
          padding: 2rem;
          background: #fcfffe;
          color: #272a2b;
        }
        .back-button {
          margin-bottom: 1rem;
        }
        button {
          background: #108e66;
          color: #fcfffe;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        /* Header */
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
        /* Explanation */
        .explanation {
          background: #fcfffe;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #108e66;
          font-size: 0.95rem;
        }
        .explanation p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        /* Form */
        .form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
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
        /* Calculate */
        .calc-card {
          margin-top: 2rem;
        }
        .calculate-btn {
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
        .important-considerations ul {
          padding-left: 1.2rem;
        }

        /* ───────── Mobile tweaks ───────── */
        @media (max-width: 680px) {
          .form {
            grid-template-columns: 1fr;
          }
          .header h1 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChildEducationCostEstimator;
