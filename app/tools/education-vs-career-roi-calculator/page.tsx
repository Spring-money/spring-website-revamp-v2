// File: /app/tools/education-vs-career-roi/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Tooltip Icon ─────────────────────────────────────────────────────────────
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
        .tooltip { position: relative; display: inline-block; margin-left: 4px; }
        .info-icon {
          background: #108e66; color: #fcfffe;
          width: 14px; height: 14px; border-radius: 50%;
          font-size: 0.6rem; font-weight: bold;
          display: flex; align-items: center; justify-content: center;
          cursor: default;
        }
        .tooltiptext {
          position: absolute; bottom: 125%; left: 50%;
          transform: translateX(-50%);
          background: #108e66; color: #fcfffe;
          padding: 6px 8px; border-radius: 4px;
          font-size: 0.75rem; white-space: nowrap; z-index: 10;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .tooltiptext::after {
          content: ""; position: absolute; top: 100%;
          left: 50%; margin-left: -4px;
          border: 4px solid transparent; border-top-color: #108e66;
        }
      `}</style>
    </span>
  );
};

// ── Number-to-Words (Indian) ───────────────────────────────────────────────
const numberToWords = (n: number): string => {
  if (!isFinite(n)) return "";
  const num = Math.round(Math.abs(n));
  if (num === 0) return "Zero";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const rec = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x/10)] + (x%10 ? " "+ones[x%10] : "");
    if (x < 1000) return ones[Math.floor(x/100)]+" Hundred"+(x%100 ? " "+rec(x%100):"");
    if (x < 100000) return rec(Math.floor(x/1000))+" Thousand"+(x%1000 ? " "+rec(x%1000):"");
    if (x < 10000000) return rec(Math.floor(x/100000))+" Lakh"+(x%100000 ? " "+rec(x%100000):"");
    return rec(Math.floor(x/10000000))+" Crore"+(x%10000000 ? " "+rec(x%10000000):"");
  };
  return rec(num);
};

// ── Component ────────────────────────────────────────────────────────────────
export default function EducationVsCareerROI() {
  // Inputs
  const [tuition, setTuition] = useState("1000000");
  const [yearsStudy, setYearsStudy] = useState("2");
  const [livingStudy, setLivingStudy] = useState("300000");
  const [salaryPost, setSalaryPost] = useState("800000");
  const [growthPost, setGrowthPost] = useState("10");
  const [salaryNow, setSalaryNow] = useState("400000");
  const [growthNow, setGrowthNow] = useState("8");
  const [horizon, setHorizon] = useState("25");
  const [discount, setDiscount] = useState("6");
  const [taxRate, setTaxRate] = useState("20");
  const [errors, setErrors] = useState<Record<string,string>>({});
  // Results
  const [npvEdu, setNpvEdu] = useState(0);
  const [npvWork, setNpvWork] = useState(0);
  const [roiPct, setRoiPct] = useState(0);
  const [breakEven, setBreakEven] = useState<number|null>(null);
  const [cumGap, setCumGap] = useState(0);
  const [cashflows, setCashflows] = useState<
    { year:number; pvFactor:number; edu:number; work:number; gap:number }[]
  >([]);
  const [computed, setComputed] = useState(false);
  const [chartType, setChartType] = useState<"line"|"barpie">("line");

  // Validation
  const validate = () => {
    const e: Record<string,string> = {};
    const nums = { tuition, yearsStudy, livingStudy, salaryPost, growthPost, salaryNow, growthNow, horizon, discount, taxRate };
    Object.entries(nums).forEach(([k,v])=>{
      if (!v.trim()||isNaN(+v)||+v<0) e[k]="Invalid";
    });
    setErrors(e);
    return Object.keys(e).length===0;
  };

  // Calculate
  const calculate = () => {
    if (!validate()) return;
    const T = +tuition, Y = +yearsStudy, L = +livingStudy;
    const SP = +salaryPost, GP = +growthPost/100;
    const SN = +salaryNow, GN = +growthNow/100;
    const H = +horizon, d = +discount/100, tR = +taxRate/100;

    const pv = (y:number) => 1/Math.pow(1+d,y);

    let pvOutEdu=0, pvInEdu=0, pvInWork=0;
    const flows: typeof cashflows = [];
    let cumGapLocal=0, be: number|null = null;

    for(let y=1;y<=H;y++){
      let edu=0, work=0;
      if (y<=Y) {
        const costYear = T/Y + L;
        edu = -costYear * pv(y);
      } else {
        const sal = SP * Math.pow(1+GP, y-Y-1);
        edu = sal*(1-tR)*pv(y);
      }
      {
        const salW = SN * Math.pow(1+GN, y-1);
        work = salW*(1-tR)*pv(y);
      }
      pvOutEdu += (y<=Y? (T/Y+L)*pv(y):0);
      if (y>Y) pvInEdu += edu;
      pvInWork += work;

      cumGapLocal += edu - work;
      if (be===null && cumGapLocal>0) be=y;
      flows.push({
        year: y,
        pvFactor: pv(y),
        edu: +edu.toFixed(2),
        work: +work.toFixed(2),
        gap: +cumGapLocal.toFixed(2),
      });
    }

    const npvE = pvInEdu - pvOutEdu;
    const npvW = pvInWork;
    const roi = ((npvE - npvW)/Math.abs(pvOutEdu))*100;

    setNpvEdu(+ (npvE/1000).toFixed(2)*1000);
    setNpvWork(+ (npvW/1000).toFixed(2)*1000);
    setRoiPct(+roi.toFixed(2));
    setBreakEven(be);
    setCumGap(+((npvE-npvW)/1000).toFixed(2)*1000);
    setCashflows(flows);
    setComputed(true);
  };

  // Chart data
  const lineData = cashflows.map(f=>({ year:f.year, Education:f.edu, Work:f.work }));
  const barData = [
    { name:"NPV Edu", value: npvEdu },
    { name:"NPV Work", value: npvWork },
    { name:"Δ Gap",   value: npvEdu - npvWork },
  ];
  const pieData = barData;
  const COLORS = ["#108E66","#272A2B","#108E66"];

  return (
    <main className="container">
      {/* Back */}
      <div className="top-nav">
        <Link href="/tools">
          <button className="back-button">Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="title">Will This Degree Pay Off for Me?</h1>
      <p className="description">
        Compare your Lifetime After-Tax &amp; Discounted earnings with vs without a degree.
      </p>

      <div className="explanation">
        <p>
          <strong>Education vs Career ROI:</strong> We compute the <em>NPV</em> of both paths—the costs of tuition &amp; living
          during study vs the net salary if you start working immediately—discounted to today’s rupee.
        </p>
        <p>
          You’ll see <strong>NPV</strong> for each, the <strong>ROI%</strong> on your education investment, and the
          <strong> break-even year</strong>. Use this to make an informed career decision.
        </p>
      </div>

      <section className="card">
        <h2 className="section-title">🎓 Education Path</h2>
        <div className="grid">
          {[
            { label:"Tuition & Fees (₹)",    key:"tuition",     state:tuition,    set:setTuition,    tip:"One-time degree cost"  , ph:"e.g. 1000000" },
            { label:"Years to Complete",      key:"yearsStudy",  state:yearsStudy, set:setYearsStudy, tip:"Course duration (yrs)", ph:"e.g. 2" },
            { label:"Living Cost During Study (₹/yr)", key:"livingStudy",  state:livingStudy, set:setLivingStudy, tip:"Rent+food per year", ph:"e.g. 300000" },
            { label:"Starting Salary After Degree (₹/yr)", key:"salaryPost",  state:salaryPost, set:setSalaryPost, tip:"First-year CTC", ph:"e.g. 800000" },
            { label:"Salary Growth After Degree (%)",     key:"growthPost",  state:growthPost, set:setGrowthPost, tip:"Annual increment", ph:"e.g. 10" },
          ].map(f=>(
            <label key={f.key}>
              <span className="input-label">
                {f.label}
                <TooltipIcon text={f.tip}/>
              </span>
              <input
                type="number"
                value={f.state}
                placeholder={f.ph}
                onChange={e=>f.set(e.target.value)}
              />
              <small className="converter">
                {numberToWords(+f.state)}{f.label.endsWith("%")?" percent":" Rupees"}
              </small>
              {errors[f.key] && <small className="error">{errors[f.key]}</small>}
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">💼 Work-Now Path</h2>
        <div className="grid">
          {[
            { label:"Current Salary (₹/yr)", key:"salaryNow",  state:salaryNow, set:setSalaryNow, tip:"If you skip degree", ph:"e.g. 400000" },
            { label:"Salary Growth Without Degree (%)", key:"growthNow", state:growthNow, set:setGrowthNow, tip:"Annual raise", ph:"e.g. 8" },
          ].map(f=>(
            <label key={f.key}>
              <span className="input-label">
                {f.label}
                <TooltipIcon text={f.tip}/>
              </span>
              <input
                type="number"
                value={f.state}
                placeholder={f.ph}
                onChange={e=>f.set(e.target.value)}
              />
              <small className="converter">
                {numberToWords(+f.state)}{f.label.endsWith("%")?" percent":" Rupees"}
              </small>
              {errors[f.key] && <small className="error">{errors[f.key]}</small>}
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">🛠 Global Settings</h2>
        <div className="grid">
          {[
            { label:"Career Horizon (yrs)", key:"horizon",  state:horizon, set:setHorizon, tip:"Total years to compare", ph:"e.g. 25" },
            { label:"Discount Rate (%)",    key:"discount", state:discount,set:setDiscount, tip:"To PV future cashflows", ph:"e.g. 6" },
            { label:"Tax Rate on Salary (%)", key:"taxRate", state:taxRate, set:setTaxRate, tip:"Effective flat tax", ph:"e.g. 20" },
          ].map(f=>(
            <label key={f.key}>
              <span className="input-label">
                {f.label}
                <TooltipIcon text={f.tip}/>
              </span>
              <input
                type="number"
                value={f.state}
                placeholder={f.ph}
                onChange={e=>f.set(e.target.value)}
              />
              <small className="converter">
                {numberToWords(+f.state)}{f.label.endsWith("%")?" percent":""}
              </small>
              {errors[f.key] && <small className="error">{errors[f.key]}</small>}
            </label>
          ))}
        </div>
      </section>

      <button className="calculate-button" onClick={calculate}>
        Calculate
      </button>

      {computed && (
        <section className="card results">
          <h2 className="results-title">Results</h2>

          <div className="summary">
            <div><strong>NPV – Education</strong><br/>₹{npvEdu.toLocaleString("en-IN")}</div>
            <div><strong>NPV – Work Now</strong><br/>₹{npvWork.toLocaleString("en-IN")}</div>
            <div><strong>ROI on Degree</strong><br/>{roiPct}%</div>
            <div><strong>Break-even Year</strong><br/>{breakEven||"–"}</div>
            <div><strong>Cumulative Gain</strong><br/>₹{cumGap.toLocaleString("en-IN")}</div>
          </div>

          <div className="chart-toggle">
            <button 
              className={chartType==="line"?"active":""}
              onClick={()=>setChartType("line")}
            >Line Chart</button>
            <button 
              className={chartType==="barpie"?"active":""}
              onClick={()=>setChartType("barpie")}
            >Bar/Pie</button>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {chartType==="line" ? (
                <LineChart data={lineData} margin={{ top:20,right:30,left:50,bottom:20 }}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="year" label={{value:"Year",position:"insideBottom",offset:-5}}/>
                  <YAxis tickFormatter={v=>`₹${v.toLocaleString("en-IN")}`}/>
                  <RechartsTooltip formatter={(v:number)=>`₹${v.toLocaleString("en-IN")}`}/>
                  <Legend/>
                  <Line type="monotone" dataKey="Education" stroke="#108e66" strokeWidth={2}/>
                  <Line type="monotone" dataKey="Work"      stroke="#272a2b" strokeWidth={2}/>
                </LineChart>
              ) : (
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name"/>
                  <YAxis tickFormatter={v=>`₹${v.toLocaleString("en-IN")}`}/>
                  <RechartsTooltip formatter={(v:number)=>`₹${v.toLocaleString("en-IN")}`}/>
                  <Legend/>
                  <Bar dataKey="value" fill="#108e66"/>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {chartType==="barpie" && (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name"
                     cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                </Pie>
                <RechartsTooltip formatter={(v:number)=>`₹${v.toLocaleString("en-IN")}`}/>
              </PieChart>
            </ResponsiveContainer>
          )}

          <h3 className="results-subtitle">Year-wise Cash-Flow</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Yr</th>
                  <th>PV Factor</th>
                  <th>Edu Path (₹)</th>
                  <th>Work Path (₹)</th>
                  <th>Cum Gap (₹)</th>
                </tr>
              </thead>
              <tbody>
                {cashflows.map(r=>(
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{r.pvFactor.toFixed(3)}</td>
                    <td>{r.edu.toLocaleString("en-IN")}</td>
                    <td>{r.work.toLocaleString("en-IN")}</td>
                    <td>{r.gap.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="insights">
            {roiPct < 0 || (breakEven||Infinity) > +horizon
              ? <p>Monetarily, working now may out-earn the degree. Consider scholarships or cheaper programs.</p>
              : <p>Great – you recover your costs in about {breakEven} years and earn a {roiPct}% return.</p>
            }
          </div>
          
        </section>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          font-family: "Poppins", sans-serif;
          background: #FCFFFE;
          color: #272A2B;
        }
        .top-nav { margin-bottom:1rem; }
        .back-button {
          background:#108E66; color:#FCFFFE;
          border:none; padding:.5rem 1rem;
          border-radius:6px; cursor:pointer;
        }
        .title {
          text-align:center; font-size:2.25rem; font-weight:600;
          margin-bottom:.25rem;
        }
        .description {
          text-align:center; font-size:1rem; margin-bottom:1.5rem; color:#555;
        }
        .explanation {
          padding:1rem; background:#FCFFFE; border-left:4px solid #108E66;
          border-radius:8px; margin-bottom:1.5rem;
        }
        .explanation p { margin:.5rem 0; line-height:1.5; }
        .card {
          padding:1.5rem; background:#FCFFFE;
          border:1px solid #e0e0e0; border-radius:8px;
          margin-bottom:1.5rem;
        }
        .section-title {
          font-size:1.3rem; font-weight:600; margin-bottom:1rem;
        }
        .grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
          gap:1rem;
        }
        label { display:block; }
        .input-label {
          font-weight:500; display:flex; align-items:center;
        }
        input {
          width:100%; margin-top:.3rem; padding:.5rem;
          border:1px solid #ccc; border-radius:4px;
          font-size:1rem; background:#FCFFFE; color:#272A2B;
        }
        .converter {
          font-size:.85rem; color:#272A2B; opacity:.7; margin-top:.25rem;
        }
        .error {
          color:red; font-size:.8rem; display:block; margin-top:.25rem;
        }
        .calculate-button {
          width:100%; padding:.75rem; font-size:1rem;
          background:#108E66; color:#FCFFFE; border:none;
          border-radius:4px; cursor:pointer; margin-bottom:2rem;
        }
        .results-title {
          text-align:center; font-size:1.5rem; font-weight:600; margin-bottom:1rem;
        }
        .summary {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
          gap:1rem; margin-bottom:1.5rem;
        }
        .summary > div {
          padding:.75rem; text-align:center;
          border:1px solid #108E66; border-radius:6px;
          font-weight:500;
        }
        .chart-toggle {
          display:flex; justify-content:center; gap:1rem; margin-bottom:1rem;
        }
        .chart-toggle button {
          padding:.5rem 1rem; border:1px solid #ccc; background:transparent; border-radius:4px; cursor:pointer;
        }
        .chart-toggle .active {
          background:#108E66; color:#FCFFFE; border-color:#108E66;
        }
        .chart-container { width:100%; height:300px; margin-bottom:1.5rem; }
        .results-subtitle {
          font-size:1.3rem; font-weight:600; margin:1.5rem 0 1rem;
        }
        .table-wrap { overflow-x:auto; margin-bottom:1.5rem; }
        table {
          width:100%; border-collapse:collapse; font-size:.9rem;
        }
        th,td {
          border:1px solid #272A2B; padding:.5rem; text-align:center;
        }
        th { background:#108E66; color:#FCFFFE; position:sticky; top:0; }
        .insights { text-align:center; font-weight:500; color:#108E66; margin-bottom:1.5rem; }
        .cta a {
          display:inline-block; background:#108E66; color:#FCFFFE;
          padding:.75rem 1.5rem; border-radius:4px; font-weight:600;
          text-decoration:none; margin:auto; text-align:center;
        }
        @media(max-width:768px){
          .grid { grid-template-columns:1fr; }
        }
      `}</style>
    </main>
  );
}
