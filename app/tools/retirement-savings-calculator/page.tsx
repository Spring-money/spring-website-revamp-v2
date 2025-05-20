// File: /app/tools/retirement-savings-calculator/page.tsx
// Retirement Savings Calculator — Spring Money Theme (a11y-compliant)

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
interface Inputs {
  ageNow: string;
  ageRetire: string;
  ageEnd: string;
  reqIncome: string;
  inflRate: string;
  currSavings: string;
  contrib: string;
  retRate: string;
  otherIncome: string;
}
interface YearRow {
  age: number;
  startBal: number;
  contribution: number;
  interest: number;
  endBal: number;
  reqCorpus: number;
  gap: number;
}
interface Results {
  totalCorpus: number;
  requiredCorpus: number;
  gap: number;
  contribReq: number | null;
  breakEvenAge: number | null;
  years: YearRow[];
  suggestion: string;
}

/* ─────────── Tooltip Icon ─────────── */
const Info: React.FC<{ text: string }> = ({ text }) => {
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
        .tip { position: relative; display: inline-block; margin-left: 4px; }
        .i {
          width: 16px; height: 16px; background: #108e66; color: #fcfffe;
          border-radius: 50%; font-size: 0.65rem; text-align: center;
          line-height: 16px; font-weight: 700; cursor: default;
          display: inline-block;
        }
        .box {
          position: absolute; bottom: 130%; left: 50%;
          transform: translateX(-50%);
          background: #fcfffe; color: #272a2b;
          border: 1px solid #108e66; border-radius: 4px;
          padding: 6px 8px; font-size: 0.75rem; width: 220px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1); z-index: 1000;
        }
        .box::after {
          content: ""; position: absolute; top: 100%; left: 50%;
          margin-left: -4px; border: 4px solid transparent;
          border-top-color: #fcfffe;
        }
      `}</style>
    </span>
  );
};

/* ─────────── Number → Words ─────────── */
const words = (n: number): string => {
  if (!isFinite(n)) return "";
  n = Math.round(Math.abs(n));
  if (n === 0) return "Zero";
  const o = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const t = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const h = (x: number): string => {
    if (x<20) return o[x];
    if (x<100) return `${t[Math.floor(x/10)]}${x%10 ? " "+o[x%10] : ""}`;
    if (x<1000) return `${o[Math.floor(x/100)]} Hundred${x%100 ? " "+h(x%100) : ""}`;
    if (x<1e5) return `${h(Math.floor(x/1000))} Thousand${x%1000 ? " "+h(x%1000) : ""}`;
    if (x<1e7) return `${h(Math.floor(x/1e5))} Lakh${x%1e5 ? " "+h(x%1e5) : ""}`;
    return `${h(Math.floor(x/1e7))} Crore${x%1e7 ? " "+h(x%1e7) : ""}`;
  };
  return h(n);
};

/* ─────────── Component ─────────── */
const RetirementSavingsCalc: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    ageNow: "", ageRetire: "", ageEnd: "",
    reqIncome: "", inflRate: "",
    currSavings: "", contrib: "",
    retRate: "", otherIncome: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs,string>>>({});
  const [results, setResults] = useState<Results|null>(null);
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState<"line"|"bar">("line");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs(p => ({...p,[e.target.name]: e.target.value}));

  const pos = (v: string) => v!=="" && !isNaN(+v) && +v>0;
  const validate = () => {
    const e: Partial<Record<keyof Inputs,string>> = {};
    (["ageNow","ageRetire","ageEnd","reqIncome","inflRate","currSavings","contrib","retRate"] as (keyof Inputs)[])
      .forEach(k=>{ if(!pos(inputs[k])) e[k]="Required"; });
    setErrors(e);
    return !Object.keys(e).length;
  };

  const calculate = () => {
    if(!validate()) return;
    setBusy(true);
    const ageNow=+inputs.ageNow, ageRet=+inputs.ageRetire, lifeExp=+inputs.ageEnd;
    const yearsToR=ageRet-ageNow;
    const reqInc=+inputs.reqIncome, infl=+inputs.inflRate/100;
    const currSave=+inputs.currSavings, contrib=+inputs.contrib;
    const retRate=+inputs.retRate/100, rM=retRate/12;
    const other=+inputs.otherIncome||0;

    // future values
    const fvCurr=currSave*Math.pow(1+retRate,yearsToR);
    const n=yearsToR*12;
    const fvContrib=contrib*((Math.pow(1+rM,n)-1)/rM)*(1+rM);
    const fvOther=other*yearsToR*Math.pow(1+retRate,yearsToR);
    const totalCorpus=fvCurr+fvContrib+fvOther;

    const inflFactor=Math.pow(1+infl,yearsToR);
    const desiredAnnual=reqInc*inflFactor;
    const requiredCorpus=desiredAnnual/0.04;

    const gap=totalCorpus-requiredCorpus;
    let contribReq: number|null=null;
    if(gap<0) {
      contribReq=(requiredCorpus-fvCurr)/(((Math.pow(1+rM,n)-1)/rM)*(1+rM));
    }

    let breakAge: number|null=null;
    if(gap>=0){
      for(let y=0;y<=yearsToR;y++){
        const cv= fvCurr/Math.pow(1+retRate,yearsToR-y)
                 + contrib*((Math.pow(1+rM,(yearsToR-y)*12)-1)/rM)*(1+rM);
        if(cv>=requiredCorpus){ breakAge=ageNow+y; break; }
      }
    }

    const years:YearRow[]=[];
    let bal=currSave;
    for(let age=ageNow; age<=lifeExp; age++){
      const start=bal;
      const cont= age<ageRet ? contrib*12 : 0;
      const intEarn=start*retRate;
      const end=start+cont+intEarn;
      const reqC= age<=ageRet ? requiredCorpus : 0;
      years.push({
        age, startBal:Math.round(start),
        contribution:Math.round(cont),
        interest:Math.round(intEarn),
        endBal:Math.round(end),
        reqCorpus:Math.round(reqC),
        gap:Math.round(end-reqC)
      });
      bal=end;
    }

    const suggestion = gap>=0
      ? `You're on track! Surplus ₹${Math.round(gap).toLocaleString("en-IN")}.`
      : `Shortfall. Save ₹${Math.round(contribReq!).toLocaleString("en-IN")} monthly.`;

    setResults({
      totalCorpus:Math.round(totalCorpus),
      requiredCorpus:Math.round(requiredCorpus),
      gap:Math.round(gap),
      contribReq:contribReq?Math.round(contribReq):null,
      breakEvenAge:breakAge,
      years,suggestion
    });
    setTimeout(()=>setBusy(false),300);
  };

  const lineData = results
    ? results.years.map(y=>({ age:y.age, Projected:y.endBal, Required:y.reqCorpus }))
    : [];
  const barData = results
    ? [
        { name:"Projected", value:results.totalCorpus },
        { name:"Required", value:results.requiredCorpus }
      ]
    : [];

  return (
    <div className="wrap">
      <div className="nav">
        <Link href="/tools"><button className="back"> Back to Dashboard</button></Link>
      </div>

      <h1 className="title">Retirement Savings Calculator</h1>
      <p className="sub">Check if youre on pace for your desired retirement income.</p>
      
      <div className="explanation">
  <p>
    <strong>Retirement Saving Planner:</strong> This tool helps you plan how much you need to save regularly to reach your desired retirement corpus by your target retirement age.
  </p>
  <p>
    It estimates your required <strong>monthly or yearly contributions</strong> based on factors like your <strong>current age</strong>, <strong>retirement age</strong>, <strong>expected rate of return</strong>, and <strong>target retirement corpus</strong>. The calculator assumes consistent contributions and compound growth over time.
  </p>
</div>



      <div className="card full">
        <h2 className="sect">Personal & Goals</h2>
        <div className="grid">
          {[
            ["ageNow","Current Age (yrs)","Your present age" ],
            ["ageRetire","Retirement Age (yrs)","Age you plan to retire"],
            ["ageEnd","Life Expectancy (yrs)","Age you expect to live till"],
            ["reqIncome","Desired Annual Income (₹)","Income needed in today's ₹"],
            ["inflRate","Inflation Rate (%)","Pre-retirement inflation"],
            ["currSavings","Current Savings (₹)","Amount already saved"],
            ["contrib","Monthly Contribution (₹)","You'll save each month"],
            ["retRate","Expected Return (%)","Annual investment return"],
            ["otherIncome","Other Annual Income (₹)","Pension or other (opt)"],
          ].map(([k,label,tip])=>(
            <div className="field" key={k}>
              <label className="lbl">
                {label}<Info text={tip}/>
              </label>
              <input
                name={k} type="number"
                value={(inputs as any)[k]}
                onChange={onChange}
                placeholder={
                  k === "ageNow" ? "e.g., 30" :
                  k === "ageRetire" ? "e.g., 60" :
                  k === "ageEnd" ? "e.g., 85" :
                  k === "reqIncome" ? "e.g., 6,00,000" :
                  k === "inflRate" ? "e.g., 6" :
                  k === "currSavings" ? "e.g., 10,00,000" :
                  k === "contrib" ? "e.g., 10,000" :
                  k === "retRate" ? "e.g., 7" :
                  k === "otherIncome" ? "e.g., 50,000" :
                  ""
                }
              />
              {["reqIncome","currSavings","contrib","otherIncome"].includes(k) && (
                <span className="conv">
                  {(inputs as any)[k] && `${words(+((inputs as any)[k]))} Rupees`}
                </span>
              )}
              {errors[k as keyof Inputs] && <span className="err">{errors[k as keyof Inputs]}</span>}
            </div>
          ))}
        </div>
        <button className="calc" onClick={calculate} disabled={busy}>
          {busy ? "Calculating…" : "Calculate"}
        </button>
      </div>

      {results && (
        <div className="card full">
          <h2 className="sect">Summary</h2>
          <div className="summary">
            <div>
              <strong>Corpus @ {inputs.ageRetire}:</strong><br/>
              ₹{results.totalCorpus.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Required Corpus:</strong><br/>
              ₹{results.requiredCorpus.toLocaleString("en-IN")}
            </div>
            <div>
              <strong>Gap:</strong><br/>
              <span style={{color:results.gap>=0?"#108e66":"red"}}>
                ₹{results.gap.toLocaleString("en-IN")}
              </span>
            </div>
            {results.contribReq!==null && (
              <div>
                <strong>Required Monthly:</strong><br/>
                ₹{results.contribReq.toLocaleString("en-IN")}
              </div>
            )}
            {results.breakEvenAge && (
              <div>
                <strong>Break-Even Age:</strong><br/>
                {results.breakEvenAge}
              </div>
            )}
          </div>

          <div className="note">{results.suggestion}</div>

          <div className="toggle">
            <button onClick={()=>setChart("line")} className={chart==="line"?"active":""}>Line Chart</button>
            <button onClick={()=>setChart("bar")} className={chart==="bar"?"active":""}>Bar Chart</button>
          </div>

          {chart==="line" ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="age" stroke="#272a2b"/>
                <YAxis stroke="#272a2b" tickFormatter={v=>v.toLocaleString("en-IN")}/>
                <RechartsTooltip formatter={(v:number)=>`₹${v.toLocaleString("en-IN")}`}/>
                <Legend/>
                <Line dataKey="Projected" stroke="#108e66" strokeWidth={2}/>
                <Line dataKey="Required" stroke="#272a2b" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" stroke="#272a2b"/>
                <YAxis stroke="#272a2b" tickFormatter={v=>v.toLocaleString("en-IN")}/>
                <RechartsTooltip formatter={(v:number)=>`₹${v.toLocaleString("en-IN")}`}/>
                <Legend/>
                <Bar dataKey="value" fill="#108e66"/>
              </BarChart>
            </ResponsiveContainer>
          )}

          <h3 className="sect">Year-Wise Projection</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Age</th><th>Start Bal</th><th>Contribution</th>
                  <th>Interest</th><th>End Bal</th><th>Req Corpus</th><th>Gap</th>
                </tr>
              </thead>
              <tbody>
                {results.years.map(r=>(
                  <tr key={r.age}>
                    <td>{r.age}</td>
                    <td>{r.startBal.toLocaleString("en-IN")}</td>
                    <td>{r.contribution.toLocaleString("en-IN")}</td>
                    <td>{r.interest.toLocaleString("en-IN")}</td>
                    <td>{r.endBal.toLocaleString("en-IN")}</td>
                    <td>{r.reqCorpus.toLocaleString("en-IN")}</td>
                    <td>{r.gap.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="disc">
            <h4>Important considerations</h4>
            <ul>
              <li>Assumes constant rates of inflation & return.</li>
              <li>Pension/other income grows at same rate until retirement.</li>
              <li>Consult a planner for personalized advice.</li>
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .wrap {
          width: 100%;
          padding: 1rem;
          background: #fcfffe;
          color: #272a2b;
          font-family: Poppins, sans-serif;
        }
        .nav { margin-bottom: 1rem; }
        .back {
          background: #108e66; color: #fcfffe;
          border: none; padding: 0.5rem 1rem;
          border-radius: 4px; cursor: pointer;
        }
        .title {
          text-align: center; font-size: 2.2rem;
          margin-bottom: 0.3rem; font-weight: 700;
        }
        .sub {
          text-align: center; font-size: 1rem;
          margin-bottom: 1rem; color: #555;
        }
        .card.full {
          width: 100%; max-width: none;
        }
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          padding: 1.25rem;
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
        .sect {
          font-size: 1.2rem; font-weight: 600;
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .field {
          display: flex; flex-direction: column;
        }
        .lbl {
          font-size: 0.9rem; margin-bottom: 4px;
          display: flex; align-items: center;
        }
        input {
          padding: 0.5rem; font-size: 1rem;
          border: 1px solid #272a2b; border-radius: 4px;
          background: #fcfffe;
        }
        .conv {
          font-size: 0.85rem; margin-top: 2px; color: #555;
        }
        .err {
          color: red; font-size: 0.8rem; margin-top: 2px;
        }
        .calc {
          width: 100%; padding: 0.75rem;
          background: #108e66; color: #fcfffe;
          border: none; font-size: 1rem;
          font-weight: 600; border-radius: 4px;
          cursor: pointer;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
          gap: 1rem; padding: 1rem;
          border-left: 4px solid #108e66;
          background: #fcfffe;
        }
        .note {
          margin: 1rem 0;
          padding: 0.75rem;
          background: #fcfffe;
          border-left: 4px solid #108e66;
        }
        .toggle {
          display: flex; justify-content: center;
          gap: 0.5rem; margin: 1rem 0;
        }
        .toggle button {
          padding: 0.5rem 1rem; border: 1px solid #272a2b;
          border-radius: 20px; background: #fff;
          cursor: pointer; font-weight: 500;
        }
        .toggle .active {
          background: #108e66; color: #fcfffe;
          border-color: #108e66;
        }
        .table-wrap {
          max-height: 280px; overflow: auto;
          border: 1px solid #272a2b; border-radius: 6px;
          margin-top: 1rem;
        }
        table {
          width: 100%; border-collapse: collapse;
          font-size: 0.9rem;
        }
        th,td {
          border: 1px solid #272a2b;
          padding: 0.5rem; text-align: center;
        }
        th {
          background: #108e66; color: #fcfffe;
          position: sticky; top: 0;
        }
        .disc {
          background: #fcfffe; padding: 1rem;
          border: 1px solid #272a2b; border-radius: 6px;
          font-size: 0.9rem; margin-top: 1rem;
        }
        .disc h4 { margin-bottom: 0.5rem; }
        .disc ul { padding-left: 1.2rem; }
        @media(max-width:768px){
          .grid { grid-template-columns:1fr; }
          .summary { grid-template-columns:1fr; }
        }
      `}</style>
      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none; margin: 0;
        }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
};

export default RetirementSavingsCalc;
