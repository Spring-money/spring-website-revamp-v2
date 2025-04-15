"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RetirementApiCall } from "../../../../api_call";
import leadFormSpringMoneyLogo from "../../../../../../../public/retirement-calculator/leadFormSpringMoneyLogo.svg";
import Link from "next/link";

export default function WhenShouldStart(props) {
  const [title2, setTitle2] = useState();
  const [title3, setTitle3] = useState();
  const [detailTitle2, setDetailTitle2] = useState();
  const [detailTitle3, setDetailTitle3] = useState();
  const [currentAge2, setcurrentAge2] = useState();
  const [currentAge3, setcurrentAge3] = useState();
  const [apiData2, setapiData2] = useState();
  const [apiData3, setapiData3] = useState();
  const [showTitle3, setShowTitle3] = useState(true);
  useEffect(() => {
    if (props.ageLife["Current_Age"] <= 40) {
      if (props.ageLife["Life_Expectancy"] - props.ageLife["Current_Age"] > 5) {
        setShowTitle3(true);
      } else {
        setShowTitle3(false);
      }

      setTitle2("If started 5 years ago");
      setTitle3("If starting 5 years later");
      setDetailTitle2("If started 5 years ago");
      setDetailTitle3("If starting 5 years later");

      setcurrentAge2(props.ageLife["Current_Age"] + 5);
      let payLoad = {
        current_age: props.ageLife["Current_Age"] + 5,
        target_retirement_age: props.ageLife["Retirement_Age"],
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

      setcurrentAge3(props.ageLife["Current_Age"] - 5);
      payLoad = {
        current_age: props.ageLife["Current_Age"] - 5,
        target_retirement_age: props.ageLife["Retirement_Age"],
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
    if (props.ageLife["Current_Age"] > 40) {
      if (
        props.ageLife["Life_Expectancy"] - props.ageLife["Retirement_Age"] >
        10
      ) {
        setShowTitle3(true);
      } else {
        setShowTitle3(false);
      }

      setTitle2("If started 10 years ago");
      setTitle3("If starting 10 years later");
      setDetailTitle2("If started 10 years ago");
      setDetailTitle3("If starting 10 years later");

      setcurrentAge2(props.ageLife["Current_Age"] + 10);
      let payLoad = {
        current_age: props.ageLife["Current_Age"] + 10,
        target_retirement_age: props.ageLife["Retirement_Age"],
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

      setcurrentAge3(props.ageLife["Current_Age"] - 10);
      payLoad = {
        current_age: props.ageLife["Current_Age"] - 10,
        target_retirement_age: props.ageLife["Retirement_Age"],
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
      <div className="w-[100%] h-auto bg-white flex-col justify-start items-start gap-8 inline-flex">
        <div className="flex w-full justify-end items-center">
          <Image src={leadFormSpringMoneyLogo} alt="leadFormSpringMoneyLogo" />
        </div>
        <div className="self-stretch text-zinc-800 text-[28px] font-semibold ">
          When should you start?
        </div>
        <div className="self-stretch  flex-col justify-start items-center gap-8 flex">
          <div className="self-stretch justify-center items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                  Starting today
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Starting Age
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium ">
                    {props.ageLife?.Current_Age} years
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Savings required
                  </div>
                  <div className="self-stretch text-emerald-600 text-sm font-medium ">
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
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                  {title2}
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Starting Age
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium ">
                    {currentAge2} years
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Savings required
                  </div>
                  <div className="self-stretch justify-start items-start gap-2 inline-flex">
                    <div className="grow shrink basis-0 text-emerald-600 text-sm font-medium ">
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
            {showTitle3 && (
              <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
                <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                  <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                    {title3}
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                  <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                    <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                      Starting Age
                    </div>
                    <div className="self-stretch text-zinc-800 text-base font-medium ">
                      {currentAge3} years
                    </div>
                  </div>
                  <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                    <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                      Savings required
                    </div>
                    <div className="self-stretch justify-start items-start gap-2 inline-flex">
                      <div className="grow shrink basis-0 text-emerald-600 text-sm font-medium ">
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
            )}
          </div>
          <div className="self-stretch  flex-col justify-start items-start gap-5 flex">
            <div className="self-stretch justify-start items-start gap-4 inline-flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                <div className="self-stretch text-zinc-800 text-base font-medium ">
                  Starting today
                </div>
                <div className="self-stretch text-zinc-800 text-sm font-normal ">
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
                  /month. Your staring age to save for retirement is{" "}
                  {props.ageLife?.Current_Age} years.
                </div>
              </div>
            </div>
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium ">
                {detailTitle2}
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal ">
                Instead of starting your savings journey for retirement today,
                if you had started it 5 years ago, i.e. had started at{" "}
                {currentAge2} years, the monthly savings required to reach the
                target amount would have gone down to{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData2?.data.monthly_savings_required)}
                .
              </div>
            </div>
            {showTitle3 && (
              <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
                <div className="self-stretch text-zinc-800 text-base font-medium ">
                  {detailTitle3}
                </div>
                <div className="self-stretch text-zinc-800 text-sm font-normal ">
                  Instead of starting your savings journey for retirement today,
                  if you delay it by 5 years, ie. get started at {currentAge3}{" "}
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
            )}
          </div>
          <div className="self-stretch p-4 bg-emerald-600/opacity-5 rounded bg-colors-lightGreen justify-start items-center gap-8 inline-flex">
            <div className="grow shrink basis-0 text-zinc-800 text-sm font-normal ">
              Check your financial readiness for free with our Financial X-Ray.
            </div>
            <div className="px-6 py-2.5 bg-emerald-600 rounded justify-start items-start gap-2 flex">
              <Link href={"/academy/tools/financial-x-ray"}>
                <div className=" text-white text-sm font-semibold ">
                  Get a free report
                </div>
              </Link>
            </div>
          </div>
          <div className="self-stretch  flex-col justify-start items-center gap-4 flex">
            <div className="self-stretch  p-4 bg-indigo-50 rounded flex-col justify-start items-start gap-2 flex">
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 text-black/opacity-20 text-base text-indigo-600 font-medium ">
                  Compounding Growth
                </div>
              </div>
              <div className="self-stretch">
                <span className="text-zinc-800 text-sm font-normal ">
                  When you invest early, your money has more time to grow
                  through the power of compounding. This means that not only do
                  you earn returns on your initial investment, but you also earn
                  returns on those returns over time. The longer your money is
                  invested, the greater the compounding effect. One could
                  achieve similar goals with different routes, such as:-
                  <br />
                  <br />
                </span>
                <span className="text-zinc-800 text-sm font-medium ">
                  Early Start, Consistent Contributions:
                </span>
                <span className="text-zinc-800 text-sm font-normal ">
                  {" "}
                  Suppose you start investing for retirement in your 20s or
                  early 30s and consistently contribute to your retirement
                  accounts over the decades. With the benefit of compounding,
                  even modest contributions can grow substantially by the time
                  you reach retirement age. This scenario allows you to build a
                  sizeable nest egg and potentially retire comfortably.
                  <br />
                </span>
                <span className="text-zinc-800 text-sm font-medium ">
                  Late Start, Aggressive Saving:
                </span>
                <span className="text-zinc-800 text-sm font-normal ">
                  {" "}
                  If you delay investing for retirement until later in life, you
                  may need to adopt a more aggressive saving strategy to catch
                  up. While it's still possible to accumulate significant
                  savings, you'll need to contribute larger amounts and may need
                  to take on more investment risk to achieve your retirement
                  goals.
                  <br />
                </span>
                <span className="text-zinc-800 text-sm font-medium ">
                  Early Start, Reduced Contributions:
                </span>
                <span className="text-zinc-800 text-sm font-normal ">
                  {" "}
                  In this scenario, you start investing for retirement early but
                  contribute less consistently over time. While you still
                  benefit from the power of compounding, the impact may be less
                  pronounced compared to Scenario 1. However, starting early
                  provides a valuable head start, and even small contributions
                  can grow significantly over time.
                  <br />
                </span>
                <span className="text-zinc-800 text-sm font-medium ">
                  Early Start, Increased Contributions:
                </span>
                <span className="text-zinc-800 text-sm font-normal ">
                  {" "}
                  Alternatively, you may choose to start investing early and
                  increase your contributions over time as your income grows.
                  This approach allows you to take full advantage of compounding
                  while also harnessing the benefits of higher savings rates
                  later in your career.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full mt-[690px]">
          <div>Retirement Goal Report</div>
          <div>05</div>
        </div>
      </div>
    </>
  );
}
