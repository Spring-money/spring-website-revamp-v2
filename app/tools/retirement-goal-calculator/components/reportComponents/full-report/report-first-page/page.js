import Image from "next/image"
import style from "../../../middleConatiner/page.module.css"
import ToggleSliderInput from "../../../../components/toggleSliderInput"
import leadFormSpringMoneyLogo from '../../../../../../../public/retirement-calculator/leadFormSpringMoneyLogo.svg';

export default function ReportFirstPage(props) {
    return (props.ageLife &&
        <>
            <div className="flex flex-col gap-[16px]">
                <div className="flex w-full justify-start items-center mb-4">
                    <Image src={leadFormSpringMoneyLogo} alt="leadFormSpringMoneyLogo" />
                </div>
                <div className="font-sans text-[32px] text-[#0E5235] font-semibold">
                    <span>Retirement Goal Report</span>
                </div>
                <div className=" text-[14px] font-normal font-sans text-[#272b2a] text-opacity-[0.9]">
                    <span>The Financial X-ray report provides a snapshot of your financial well-being, highlighting positive aspects and areas requiring attention. It covers five main areas: Savings and Budgeting, Loans and Debts, Investments, Taxation, and Insurance. Use the insights from the X-ray report to make informed decisions and implement improvements where necessary, ensuring stress free financial future.</span>
                </div>
                <div className="text-[20px] font-medium font-sans text-[#272B2A] mt-[16px]">
                    <span>Input Summary</span>
                </div>
                <div className="p-[16px] rounded-[4px] ">
                    <div className=" flex flex-col gap-[8px]">
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Current Age</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{props.ageLife.Current_Age} years</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Retirement Age</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{props.ageLife.Retirement_Age} years</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Life Expectancy</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{props.ageLife.Life_Expectancy} years</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Monthly Expenditure</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0,
                                }).format(props.currentMonthlyAmount)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Annual Inflation</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{props.annualInflation * 100}%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Current Investments</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0,
                                }).format(props.currentInvestments)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Pre-retirement ROI</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{props.expectedReturnsBefore * 100}%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Post-retirement ROI</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{props.ageLife.Expected_returns_after}%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                <li>
                                    <span>Desired Inheritance</span>
                                </li>
                            </div>
                            <div className=" flex-grow border-b mx-[16px]"></div>
                            <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                <span>{new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0,
                                }).format(props.ageLife.Desired_Inheritance)}</span>
                            </div>
                        </div>
                    </div>
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
                                    }).format(props.dataFromApi.amount_required_at_retirement_age)}</span>
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
                                    }).format(props.dataFromApi.monthly_savings_required)}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <ToggleSliderInput
                        parameterName='Increase_savings_per_year'
                        SliderName='Increase in savings per year'
                        SliderDesc='Annual percentage growth rate'
                        updatedInputValue={props.ageLife.Increase_savings_per_year}
                        minValue={0}
                        maxValue={15}
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
                                    }).format(props.dataFromApi.monthly_savings_required_at_provided_increment)}</span>
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
                            }).format(props.dataFromApi.monthly_savings_required_at_provided_increment)}. This also means, that after a certain point, you will have to save more than {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0,
                            }).format(props.dataFromApi.monthly_savings_required)}, and keep saving more incrementally, till the time of your retirement. This function has an advantage of starting your savings journey with lesser amount, but has a constant pressure to consistently save more every year.
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}