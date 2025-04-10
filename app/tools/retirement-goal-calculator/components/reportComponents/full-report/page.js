'use client'
import ReportFirstPage from "./report-first-page/page"
import RetirementAnalysis from "./retirementAnalysis/page"
import FindingRightRoi from "./findingRightRoi/page"
import DifferenceBetweenInvestingAndSavings from "./diffInvesting&Savings/page"
import AdjustingRetirementAge from "./adjustingRetiremntAge/page"
import WhenShouldStart from "./whenShouldStart/page"
import AlteringYourExpenses from "./alteringYourExpenses/page"
import ImpactOfInflation from "./ImpactOfInflation/page"
import UnderstandingRetirement from "./understandingRetirement/page"
import { useEffect, useState } from "react"

export default function FullReport() {

    const [reportData, setReportData] = useState({});

    useEffect(() => {
        console.log('inside full report page useEffect')
        const retirementReportData = JSON.parse(localStorage.getItem("retirementReportData"));
        console.log("retirementReportDataFullReport", retirementReportData);
        setReportData(retirementReportData);
        console.log("reportDataFullReport", reportData);
    }, []);
    
    const { callApi, dataApi1, expectedReturnsBefore, currentInvestments, annualInflation, currentMonthlyAmount, ageLife, timeTillRetirement, targetCorpus, monthlySavings } = reportData;

    return (reportData &&
        <>
            {dataApi1 && (
                <div className="flex items-center justify-center w-full" >
                    <div className="flex flex-col w-[650px]">
                        <div>
                            <ReportFirstPage dataFromApi={dataApi1.data} expectedReturnsBefore={expectedReturnsBefore} currentInvestments={currentInvestments} annualInflation={annualInflation} currentMonthlyAmount={currentMonthlyAmount} ageLife={ageLife} />
                        </div>
                        <hr></hr>
                        <div className="mt-[16px]">
                            <RetirementAnalysis timeTillRetirement={timeTillRetirement} targetCorpus={targetCorpus} monthlySavings={monthlySavings} />
                        </div>
                        <div>
                            <FindingRightRoi callApi={callApi} dataApi1={dataApi1.data} expectedReturnsBefore={expectedReturnsBefore} currentInvestments={currentInvestments} annualInflation={annualInflation} currentMonthlyAmount={currentMonthlyAmount} ageLife={ageLife} />
                        </div>
                        <div>
                            <DifferenceBetweenInvestingAndSavings callApi={callApi} dataApi1={dataApi1} expectedReturnsBefore={expectedReturnsBefore} currentInvestments={currentInvestments} annualInflation={annualInflation} currentMonthlyAmount={currentMonthlyAmount} ageLife={ageLife} />
                        </div>
                        <div>
                            <AdjustingRetirementAge callApi={callApi} dataApi1={dataApi1.data} expectedReturnsBefore={expectedReturnsBefore} currentInvestments={currentInvestments} annualInflation={annualInflation} currentMonthlyAmount={currentMonthlyAmount} ageLife={ageLife} />
                        </div>
                        <div>
                            <WhenShouldStart callApi={callApi} dataApi1={dataApi1.data} expectedReturnsBefore={expectedReturnsBefore} currentInvestments={currentInvestments} annualInflation={annualInflation} currentMonthlyAmount={currentMonthlyAmount} ageLife={ageLife} />
                        </div>
                        <div className="break-after-all">
                            <AlteringYourExpenses callApi={callApi} dataApi1={dataApi1.data} expectedReturnsBefore={expectedReturnsBefore} currentInvestments={currentInvestments} annualInflation={annualInflation} currentMonthlyAmount={currentMonthlyAmount} ageLife={ageLife} />
                        </div>
                        <div>
                            <ImpactOfInflation callApi={callApi} dataApi1={dataApi1.data} expectedReturnsBefore={expectedReturnsBefore} currentInvestments={currentInvestments} annualInflation={annualInflation} currentMonthlyAmount={currentMonthlyAmount} ageLife={ageLife} />
                        </div>
                        <div>
                            <UnderstandingRetirement />
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}