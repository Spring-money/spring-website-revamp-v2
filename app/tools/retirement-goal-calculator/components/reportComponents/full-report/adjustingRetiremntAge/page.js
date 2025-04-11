"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RetirementApiCall } from "../../../../api_call";
import leadFormSpringMoneyLogo from "../../../../../../../public/retirement-calculator/leadFormSpringMoneyLogo.svg";

export default function AdjustingRetirementAge(props) {
  const [title3, setTitle3] = useState();
  const [detailTitle3, setDetailTitle3] = useState();
  const [retirementAge2, setretirementAge2] = useState();
  const [retirementAge3, setretirementAge3] = useState();
  const [apiData2, setapiData2] = useState();
  const [apiData3, setapiData3] = useState();
  const [showTitle2, setShowTitle2] = useState(true);
  useEffect(() => {
    if (
      10 <=
      props.ageLife["Retirement_Age"] - props.ageLife["Current_Age"] <=
      30
    ) {
      if (
        props.ageLife["Life_Expectancy"] - props.ageLife["Retirement_Age"] >
        5
      ) {
        setShowTitle2(true);
      } else {
        setShowTitle2(false);
      }
      setTitle3("Earlier Retirement");
      setDetailTitle3("Earlier Retirement");
      setretirementAge2(props.ageLife["Retirement_Age"] + 5);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"] + 5,
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: props.expectedReturnsBefore,
        expected_annual_returns_post_retirement:
          props.ageLife["Expected_returns_after"] / 100,
        increase_in_your_savings_per_year:
          props.ageLife["Increase_savings_per_year"] / 100,
        desired_inheritance: props.ageLife["Desired_Inheritance"],
      };
      const RetirementApi2 = async () => {
        const data = await RetirementApiCall(payLoad);
        setapiData2(data);
      };
      RetirementApi2();

      setretirementAge3(props.ageLife["Retirement_Age"] - 5);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"] - 5,
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: props.expectedReturnsBefore,
        expected_annual_returns_post_retirement:
          props.ageLife["Expected_returns_after"] / 100,
        increase_in_your_savings_per_year:
          props.ageLife["Increase_savings_per_year"] / 100,
        desired_inheritance: props.ageLife["Desired_Inheritance"],
      };
      const RetirementApi3 = async () => {
        const data = await RetirementApiCall(payLoad);
        setapiData3(data);
      };
      RetirementApi3();
    } else if (
      props.ageLife["Retirement_Age"] - props.ageLife["Current_Age"] < 10 &&
      props.ageLife["Life_Expectancy"] - props.ageLife["Retirement_Age"] > 15
    ) {
      setTitle3("Further Delayed Retirement");
      setDetailTitle3("Further Delayed Retirement");

      setretirementAge2(props.ageLife["Retirement_Age"] + 5);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"] + 5,
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: props.expectedReturnsBefore,
        expected_annual_returns_post_retirement:
          props.ageLife["Expected_returns_after"] / 100,
        increase_in_your_savings_per_year:
          props.ageLife["Increase_savings_per_year"] / 100,
        desired_inheritance: props.ageLife["Desired_Inheritance"],
      };
      const RetirementApi2 = async () => {
        const data = await RetirementApiCall(payLoad);
        setapiData2(data);
      };
      RetirementApi2();

      setretirementAge3(props.ageLife["Retirement_Age"] + 10);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"] + 10,
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: props.expectedReturnsBefore,
        expected_annual_returns_post_retirement:
          props.ageLife["Expected_returns_after"] / 100,
        increase_in_your_savings_per_year:
          props.ageLife["Increase_savings_per_year"] / 100,
        desired_inheritance: props.ageLife["Desired_Inheritance"],
      };
      const RetirementApi3 = async () => {
        const data = await RetirementApiCall(payLoad);
        setapiData3(data);
      };
      RetirementApi3();
    } else if (
      props.ageLife["Retirement_Age"] - props.ageLife["Current_Age"] > 30 &&
      props.ageLife["Life_Expectancy"] - props.ageLife["Retirement_Age"] > 10
    ) {
      setTitle3("Earlier Retirement");
      setDetailTitle3("Earlier Retirement");

      setretirementAge2(props.ageLife["Retirement_Age"] + 10);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"] + 10,
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: props.expectedReturnsBefore,
        expected_annual_returns_post_retirement:
          props.ageLife["Expected_returns_after"] / 100,
        increase_in_your_savings_per_year:
          props.ageLife["Increase_savings_per_year"] / 100,
        desired_inheritance: props.ageLife["Desired_Inheritance"],
      };
      const RetirementApi2 = async () => {
        const data = await RetirementApiCall(payLoad);
        setapiData2(data);
      };
      RetirementApi2();

      setretirementAge3(props.ageLife["Retirement_Age"] - 10);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"] - 10,
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: props.expectedReturnsBefore,
        expected_annual_returns_post_retirement:
          props.ageLife["Expected_returns_after"] / 100,
        increase_in_your_savings_per_year:
          props.ageLife["Increase_savings_per_year"] / 100,
        desired_inheritance: props.ageLife["Desired_Inheritance"],
      };
      const RetirementApi3 = async () => {
        const data = await RetirementApiCall(payLoad);
        setapiData3(data);
      };
      RetirementApi3();
    } else if (
      props.ageLife["Retirement_Age"] - props.ageLife["Current_Age"] > 30 &&
      props.ageLife["Life_Expectancy"] - props.ageLife["Retirement_Age"] <= 10
    ) {
      setTitle3("Earlier Retirement");
      setDetailTitle3("Earlier Retirement");

      setretirementAge2(props.ageLife["Retirement_Age"] + 5);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"] + 5,
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: props.expectedReturnsBefore,
        expected_annual_returns_post_retirement:
          props.ageLife["Expected_returns_after"] / 100,
        increase_in_your_savings_per_year:
          props.ageLife["Increase_savings_per_year"] / 100,
        desired_inheritance: props.ageLife["Desired_Inheritance"],
      };
      const RetirementApi2 = async () => {
        const data = await RetirementApiCall(payLoad);
        setapiData2(data);
      };
      RetirementApi2();

      setretirementAge3(props.ageLife["Retirement_Age"] - 5);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"] - 5,
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: props.expectedReturnsBefore,
        expected_annual_returns_post_retirement:
          props.ageLife["Expected_returns_after"] / 100,
        increase_in_your_savings_per_year:
          props.ageLife["Increase_savings_per_year"] / 100,
        desired_inheritance: props.ageLife["Desired_Inheritance"],
      };
      const RetirementApi3 = async () => {
        const data = await RetirementApiCall(payLoad);
        setapiData3(data);
      };
      RetirementApi3();
    }
  }, [props.callApi]);
  return (
    <>
      <div className="w-[100%] h-auto bg-white flex-col justify-start items-start gap-4 inline-flex">
        <div className="flex w-full justify-end items-center">
          <Image src={leadFormSpringMoneyLogo} alt="leadFormSpringMoneyLogo" />
        </div>
        <div className="self-stretch text-zinc-800 text-[28px] font-semibold font-['Poppins']">
          Adjusting your retirement age
        </div>
        <div className="self-stretch  flex-col justify-start items-center gap-8 flex">
          <div className="self-stretch justify-center items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium font-['Poppins']">
                  Current timeline
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Retirement Age
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                    {props.ageLife?.Retirement_Age} years
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Savings required
                  </div>
                  <div className="self-stretch text-emerald-600 text-sm font-medium font-['Poppins']">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(props.dataApi1?.monthly_savings_required)}
                    /month
                  </div>
                </div>
              </div>
            </div>
            {showTitle2 && (
              <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
                <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                  <div className="text-zinc-800/opacity-75 text-xs font-medium font-['Poppins']">
                    Delayed Retirement
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                  <div className="self-stretch flex-col justify-start items-start gap-0.5 flex">
                    <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                      Retirement Age
                    </div>
                    <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                      {retirementAge2} years
                    </div>
                  </div>
                  <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                    <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                      Savings required
                    </div>
                    <div className="self-stretch justify-start items-start gap-2 inline-flex">
                      <div className="grow shrink basis-0 text-emerald-600 text-sm font-medium font-['Poppins']">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(apiData2?.data.monthly_savings_required)}
                        /month
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium font-['Poppins']">
                  {title3}
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Retirement Age
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                    {retirementAge3} years
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Savings required
                  </div>
                  <div className="self-stretch justify-start items-start gap-2 inline-flex">
                    <div className="grow shrink basis-0 text-emerald-600 text-sm font-medium font-['Poppins']">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(apiData3?.data.monthly_savings_required)}
                      /month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch  flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch justify-start items-start gap-4 inline-flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                  Current timeline for retirement
                </div>
                <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                  Your current assumption is to reach a target of{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(props.dataApi1?.amount_required_at_retirement_age)}
                  /- by saving and investing an amount of{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(props.dataApi1?.monthly_savings_required)}
                  /month. Your current target age of retirement is{" "}
                  {props.ageLife?.Retirement_Age} years.
                </div>
              </div>
            </div>
            {showTitle2 && (
              <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
                <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                  Delayed retirement
                </div>
                <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                  Instead of your current target age for retirement, if you
                  change the horizon and plan to retire at an age of{" "}
                  {retirementAge2} years, the monthly savings required to reach
                  the target amount will down to{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(apiData2?.data.monthly_savings_required)}
                  .
                </div>
              </div>
            )}
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                {detailTitle3}
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                Instead of your current target age for retirement, if you change
                the horizon and plan to retire at an age of {retirementAge3}{" "}
                years, the monthly savings required to reach the target amount
                will go up to{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData3?.data.monthly_savings_required)}
                .
              </div>
            </div>
          </div>
          {/* <div className="self-stretch p-4 bg-emerald-600/opacity-5 bg-colors-lightGreen rounded justify-start items-center gap-8 inline-flex">
            <div className="grow shrink basis-0 text-zinc-800 text-sm font-normal font-['Poppins']">Book a free 1 hour consultation call with our investment advisor</div>
            <div className="px-6 py-2.5 bg-emerald-600 rounded justify-start items-start gap-2 flex">
              <div className=" text-white text-sm font-semibold font-['Poppins']">CTA Button</div>
            </div>
          </div> */}
          <div className="self-stretch  flex-col justify-start items-center gap-4 flex">
            <div className="self-stretch  p-4 bg-indigo-50 rounded flex-col justify-start items-start gap-2 flex">
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 text-black/opacity-20 text-base text-indigo-600 font-medium font-['Poppins']">
                  Optimising The Horizon
                </div>
              </div>
              <div className="self-stretch">
                <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                  Although many of us would like to work till we want and we
                  can, the target age of retirement has to be properly deciding
                  after duly considering multiple elements. Be it the
                  traditional understanding of retirement or be the aim of
                  financial independence, understanding certain factors is
                  crucial:-
                  <br />
                  <br />
                </span>
                <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                  Financial readiness:
                </span>
                <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                  {" "}
                  Your current financial situation, including savings,
                  investments, pensions, and other sources of income is crucial.{" "}
                  <br />
                </span>
                <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                  Health and longevity:
                </span>
                <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                  {" "}
                  Factoring in potential healthcare costs and the likelihood of
                  needing long-term care as you age is also important. <br />
                </span>
                <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                  Post-retirement goals:
                </span>
                <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                  {" "}
                  Post-retirement goals, such as travel plans, hobbies,
                  volunteer work, or spending time with family are important
                  considerations. Ensure your target retirement age aligns with
                  these aspirations, allowing you to fully enjoy these things
                  after your retirement.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full mt-11">
          <div>Retirement Goal Report</div>
          <div>04</div>
        </div>
      </div>
    </>
  );
}
