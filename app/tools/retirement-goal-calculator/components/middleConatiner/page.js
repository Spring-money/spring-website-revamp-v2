
'use client'
import style from "../middleConatiner/page.module.css"
import download from "../../../../../public/retirement-calculator/download.svg"
import Image from "next/image"
import infoIcon from "../../../../../public/retirement-calculator/material-symbols_info-outline.svg"
import Toogle from "../../../../components/toogleSwitch"
import Slider from "../../../../components/tools/Slider/index"
import Link from "next/link"
// import ShareButton from "@/app/academy/components/share-button/page"
import { useEffect, useState, useContext } from "react"
import ToggleSliderInput from "../toggleSliderInput"
import RetirementAnalysis from "../reportComponents/retirementAnalysis/page"
import FindingRightRoi from "../reportComponents/findingRightRoi/page"
import DiffInvestingAndSavings from "../reportComponents/diffInvesting&Savings/page"
import AdjustingRetirementAge from "../reportComponents/adjustingRetiremntAge/page"
import WhenShouldStart from "../reportComponents/whenShouldStart/page"
import AlteringYourExpenses from "../reportComponents/alteringYourExpenses/page"
import ImpactOfInflation from "../reportComponents/ImpactOfInflation/page"
import UnderstandingRetirement from "../reportComponents/understandingRetirement/page"
import { AppContext } from "../../../../RetirementReportContext"
import ConfirmationBox from "../../../../components/retirement-goal-calculator/ConfirmationBox/ConfirmationBox"

export default function MiddleConatiner(props) {

    const { reportData, setReportData } = useContext(AppContext);

    const [showConfirmationBox, setShowConfirmationBox] = useState(false);

    const [downloading, setDownloading] = useState(false);

    const [expenditureInvestment, setExpenditureInvestment] = useState({
        Monthly_Expenditure: 0,
        Annual_Inflation: 0,
        Current_Investments: 0,
        Expected_returns_before: 0,
    })

    const [isSwitchOn, setIsSwitchOn] = useState(false);

    const handleSwitchChange = () => {
        setIsSwitchOn(!isSwitchOn);
    };

    useEffect(() => {
        console.log('expenditureInvestment["Monthly_Expenditure"].........', expenditureInvestment)
        props.setCurrentMonthlyAmount([expenditureInvestment["Monthly_Expenditure"]])
        props.setAnnualInflation([expenditureInvestment["Annual_Inflation"] / 100])
        props.setCurrentInvestments([expenditureInvestment["Current_Investments"]])
        props.setExpectedReturnsBefore([expenditureInvestment["Expected_returns_before"] / 100])
        props.setCallApi(prev => prev + 1);
    }, [expenditureInvestment])


    const handleExpenditureInvestment = (parameterName, value) => {
        setExpenditureInvestment(prevParameters => ({
            ...prevParameters,
            [parameterName]: value
        }));
    }

    const handleAgeLife = (parameterName, value) => {
        props.setAgeLife(prevParameters => ({
            ...prevParameters,
            [parameterName]: value
        }));
    }

    const handleOnChangeCommit = () => {
        props.setCallApi(prev => prev + 1);

    }

    const handleDownloadClick = async () => {
        props.setCallApi(prev => prev + 1);
        localStorage.setItem('retirementReportData', JSON.stringify(reportData));
        props.setCallApi(prev => prev + 1);

        setShowConfirmationBox(true);
        console.log("showConfirmationBox", showConfirmationBox);

    }

    const startDownload = async () => {
        // Download PDF 
        console.log("Download started");
        try {
            const res = await fetch('/api/generatePdf', {
                method: 'POST',
                body: JSON.stringify({ url: `${window.location.origin}/academy/tools/retirement-goal-calculator/components/reportComponents/full-report`, localStorageKey: 'retirementReportData', localStorageValue: JSON.stringify(reportData) }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Retirement Report.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();
                setShowConfirmationBox(false);
                setDownloading(false);
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <>
            <div className={style.conatiner}>
                <div className={style.breadShare}>
                    <div className={style.breadCrums}>
                        <Link href={'/tools'}>
                            <div>
                                <span>Tools</span>
                            </div>
                        </Link>
                        <div style={{ marginLeft: '0.3125vw', marginRight: '0.3125vw' }}>
                            <span>&gt;</span>
                        </div>
                        <div>
                            <span>Retirement Goal Calculator</span>
                        </div>
                    </div>
                    <div className={style.Share}>
                        <div onClick={handleDownloadClick} className={style.download}>
                            <Image src={download} />
                        </div>
                        {/* <div className=" cursor-pointer">
                            <ShareButton position={"bottom center"} url={'https://www.spring.money/academy/tools/retirement-goal-calculator'} />
                        </div> */}
                    </div>
                </div>
                <div className={style.heading}>
                    <span>Retirement Goal Calculator</span>
                </div>
                <div className={style.inputContainer}>
                </div>
                <div className="md:grid flex flex-col md:grid-cols-2 self-stretch gap-2">
                    <Slider
                        parameterName='Current_Age'
                        SliderName='Current Age'
                        SliderDesc='What is your current age?'
                        defaultValue={30}
                        minValue={0}
                        maxValue={100}
                        step={1}
                        onSliderChange={handleAgeLife}
                        onChangeCommited={handleOnChangeCommit}
                        callRetirementApi={props.setCallApi}
                        inputType='years'
                    />
                    <Slider
                        parameterName='Retirement_Age'
                        SliderName='Retirement Age'
                        SliderDesc='When do you wish to retire?'
                        defaultValue={50}
                        minValue={props.ageLife?.Current_Age + 1}
                        maxValue={100}
                        step={1}
                        onSliderChange={handleAgeLife}
                        onChangeCommited={handleOnChangeCommit}
                        callRetirementApi={props.setCallApi}
                        inputType='years'
                    />
                    <Slider
                        parameterName='Life_Expectancy'
                        SliderName='Life Expectancy'
                        SliderDesc='Total number of years you will live'
                        defaultValue={80}
                        minValue={props.ageLife?.Retirement_Age + 1}
                        maxValue={100}
                        step={1}
                        onSliderChange={handleAgeLife}
                        onChangeCommited={handleOnChangeCommit}
                        callRetirementApi={props.setCallApi}
                        inputType='years'
                    />
                    <Slider
                        parameterName='Desired_Inheritance'
                        SliderName='Desired Inheritance'
                        SliderDesc='Intended financial legacy you wish to leave'
                        defaultValue={0}
                        minValue={0}
                        maxValue={100000000}
                        step={500000}
                        onSliderChange={handleAgeLife}
                        onChangeCommited={handleOnChangeCommit}
                        inputType='amount'
                        callRetirementApi={props.setCallApi}
                    />
                    <Slider
                        parameterName='Monthly_Expenditure'
                        SliderName='Expected Monthly Expenditure'
                        SliderDesc='Expected monthly household expenses during retirement'
                        defaultValue={0}
                        updatedInputValue={props.saveTotalMonthlyExpenditure}
                        Add={true}
                        editDetails={props.editDetailsMonthlyExpendiButton}
                        AddDetails={'Add details'}
                        edit={'Edit details'}
                        showPlusCircle={props.showPlusCircleDetails}
                        minValue={0}
                        maxValue={1000000}
                        step={5000}
                        onSliderChange={handleExpenditureInvestment}
                        onChangeCommited={handleOnChangeCommit}
                        callRetirementApi={props.setCallApi}
                        inputType='amount'
                    />
                    <Slider
                        parameterName='Annual_Inflation'
                        SliderName='Expected Annual Inflation'
                        SliderDesc='Your expectation of the annual inflation rate'
                        updatedInputValue={Math.round(props.dataFromApi?.data?.Expected_Annual_Inflation * 100)}
                        defaultValue={0}
                        minValue={0}
                        maxValue={15}
                        step={1}
                        onSliderChange={handleExpenditureInvestment}
                        onChangeCommited={handleOnChangeCommit}
                        callRetirementApi={props.setCallApi}
                        inputType='percentage'
                    />
                    <Slider
                        parameterName='Current_Investments'
                        SliderName='Current Investments'
                        SliderDesc='Total existing value excluding allocation for loan repayments'
                        defaultValue={0}
                        updatedInputValue={props.saveTotalCurrentInvetments}
                        Add={true}
                        editDetails={props.editDetailsCurrentInvestButton}
                        AddDetails={'Add assets'}
                        edit={'Edit assets'}
                        showPlusCircle={props.showPlusCircleAssets}
                        minValue={0}
                        maxValue={10000000}
                        step={100000}
                        onSliderChange={handleExpenditureInvestment}
                        onChangeCommited={handleOnChangeCommit}
                        callRetirementApi={props.setCallApi}
                        inputType='amount'
                    />
                    <Slider
                        parameterName='Expected_returns_before'
                        SliderName='Expected returns before retirement'
                        SliderDesc='Your expectation of returns on your investments'
                        updatedInputValue={Math.round(props.dataFromApi?.data?.Expected_returns_before_retirement * 100)}
                        defaultValue={0}
                        minValue={0}
                        maxValue={24}
                        step={1}
                        onSliderChange={handleExpenditureInvestment}
                        onChangeCommited={handleOnChangeCommit}
                        callRetirementApi={props.setCallApi}
                        inputType='percentage'
                    />
                    <Slider
                        parameterName='Expected_returns_after'
                        SliderName='Expected returns after retirement'
                        SliderDesc='Your expectation of returns on the retirement corpus'
                        defaultValue={8}
                        minValue={0}
                        maxValue={16}
                        step={1}
                        onSliderChange={handleAgeLife}
                        onChangeCommited={handleOnChangeCommit}
                        callRetirementApi={props.setCallApi}
                        inputType='percentage'
                    />
                </div>
                <div className={style.infoDetail}>
                    <Image src={infoIcon} />
                    <span>For more accurate results, please provide precise and detailed inputs for each section.</span>
                </div>
                <div className={style.outputField}>
                    <div className={style.outputFieldTextFields}>
                        <div className={style.outputFieldText}>
                            <span>Amount required at retirement age</span>
                        </div>
                        {props.dataFromApi && (
                            <>
                                <div className={style.outputFieldText}>
                                    <span>{new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 0,
                                    }).format(props.dataFromApi.data?.amount_required_at_retirement_age)}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={style.outputFieldTextFields}>
                        <div className={style.outputFieldText}>
                            <span>Monthly Savings required to retire</span>
                        </div>
                        {props.dataFromApi && (
                            <>
                                <div className={style.outputFieldText}>
                                    <span>{new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 0,
                                    }).format(props.dataFromApi?.data?.monthly_savings_required)}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.outputFieldTextFields}>
                        <div className={style.outputFieldText}>
                            <span>Start with less and increase per year</span>
                        </div>
                        <div>
                            <Toogle checked={isSwitchOn} onChange={handleSwitchChange} />
                        </div>
                    </div>
                    {isSwitchOn && (
                        <>
                            <ToggleSliderInput
                                parameterName='Increase_savings_per_year'
                                SliderName='Increase in savings per year'
                                SliderDesc='Annual percentage growth rate'
                                defaultValue={5}
                                minValue={0}
                                maxValue={15}
                                step={1}
                                onSliderChange={handleAgeLife}
                                onChangeCommited={handleOnChangeCommit}
                            />
                            <div className={style.outputFieldTextFields}>
                                <div className={style.outputFieldText}>
                                    <span>Monthly Savings required ({props.ageLife.Increase_savings_per_year}% incremental)</span>
                                </div>
                                {props.dataFromApi && (
                                    <>
                                        <div className={style.outputFieldText}>
                                            <span>starting from {new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                                maximumFractionDigits: 0,
                                            }).format(props.dataFromApi.data.monthly_savings_required_at_provided_increment)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={style.outputFinalText}>
                                <span>
                                    If you decide to increase your savings by {props.ageLife["Increase_savings_per_year"]}% every year, you can afford to save less initially and get started with your retirement goal journey with lot less, i.e. just {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 0,
                                    }).format(props.dataFromApi.data.monthly_savings_required_at_provided_increment)}. This also means, that after a certain point, you will have to save more than {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 0,
                                    }).format(props.dataFromApi.data.monthly_savings_required)}, and keep saving more incrementally, till the time of your retirement. This function has an advantage of starting your savings journey with lesser amount, but has a constant pressure to consistently save more every year.
                                </span>
                            </div>
                        </>
                    )}
                </div>
                <hr className={style.horizontalLine}></hr>
                {props.dataFromApi && props.selectLeftPannelCategory === 'Your retirement analysis' ? (
                    <div>
                        <RetirementAnalysis timeTillRetirement={props.ageLife['Retirement_Age'] - props.ageLife['Current_Age']} targetCorpus={props.dataFromApi?.data?.amount_required_at_retirement_age} monthlySavings={props.dataFromApi?.data?.monthly_savings_required} monthlySavingsAtProvidedIncrement={props.dataFromApi?.data?.monthly_savings_required_at_provided_increment} expectedReturnsBefore={props.expectedReturnsBefore} increaseSavingsPerYear={props.ageLife["Increase_savings_per_year"]} />
                    </div>
                ) : props.selectLeftPannelCategory === 'Finding the right ROI for you' ? (
                    <div>
                        <FindingRightRoi callApi={props.callApi} dataApi1={props.dataFromApi?.data} expectedReturnsBefore={props.expectedReturnsBefore} currentInvestments={props.currentInvestments} annualInflation={props.annualInflation} currentMonthlyAmount={props.currentMonthlyAmount} ageLife={props.ageLife} />
                    </div>
                ) : props.selectLeftPannelCategory === 'Difference between investing & saving' ? (
                    <div>
                        <DiffInvestingAndSavings callApi={props.callApi} dataApi1={props.dataFromApi?.data} expectedReturnsBefore={props.expectedReturnsBefore} currentInvestments={props.currentInvestments} annualInflation={props.annualInflation} currentMonthlyAmount={props.currentMonthlyAmount} ageLife={props.ageLife} />
                    </div>
                ) : props.selectLeftPannelCategory === 'Adjusting your retirement age' ? (
                    <div>
                        <AdjustingRetirementAge callApi={props.callApi} dataApi1={props.dataFromApi?.data} expectedReturnsBefore={props.expectedReturnsBefore} currentInvestments={props.currentInvestments} annualInflation={props.annualInflation} currentMonthlyAmount={props.currentMonthlyAmount} ageLife={props.ageLife} />
                    </div>
                ) : props.selectLeftPannelCategory === 'When should you start?' ? (
                    <div>
                        <WhenShouldStart callApi={props.callApi} dataApi1={props.dataFromApi?.data} expectedReturnsBefore={props.expectedReturnsBefore} currentInvestments={props.currentInvestments} annualInflation={props.annualInflation} currentMonthlyAmount={props.currentMonthlyAmount} ageLife={props.ageLife} />
                    </div>
                ) : props.selectLeftPannelCategory === 'Altering your expenses' ? (
                    <div>
                        <AlteringYourExpenses callApi={props.callApi} dataApi1={props.dataFromApi?.data} expectedReturnsBefore={props.expectedReturnsBefore} currentInvestments={props.currentInvestments} annualInflation={props.annualInflation} currentMonthlyAmount={props.currentMonthlyAmount} ageLife={props.ageLife} />
                    </div>
                ) : props.selectLeftPannelCategory === 'Impact of inflation' ? (
                    <div>
                        <ImpactOfInflation callApi={props.callApi} dataApi1={props.dataFromApi?.data} expectedReturnsBefore={props.expectedReturnsBefore} currentInvestments={props.currentInvestments} annualInflation={props.annualInflation} currentMonthlyAmount={props.currentMonthlyAmount} ageLife={props.ageLife} />
                    </div>
                ) : (
                    <div>
                        <UnderstandingRetirement />
                    </div>
                )}
                <hr className={`${style.horizontalLine} sm:hidden`} style={{ marginTop: '16px', marginBottom: '16px' }}></hr>
                <div className="sm:hidden">
                    <p className=" text-[10px] font-normal font-poppins"><span className="font-poppins text-[10px] font-medium">Disclaimer:</span> This has been prepared based on the details provided by the user. The results are meant to act as broad guidelines for attaining financial well-being. This assessment is not a recommendation or advice for making any financial or non-financial decision. Before making any financial decisions, the user must study and comprehend the applicable rules, regulations, and legal framework in addition to conducting his/her own independent analysis and due diligence.</p>
                </div>
                {props.dataFromApi && (
                    <ConfirmationBox showConfirmationBox={showConfirmationBox} setShowConfirmationBox={setShowConfirmationBox} startDownload={startDownload} downloading={downloading} setDownloading={setDownloading} />
                )
                }
            </div>
        </>
    )
}