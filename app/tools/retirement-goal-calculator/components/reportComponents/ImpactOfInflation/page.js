"use client";
import { useEffect, useState } from "react";
import { RetirementApiCall } from "../../../api_call";

export default function ImpactOfInflation(props) {
  const [inflation2, setinflation2] = useState();
  const [inflation3, setinflation3] = useState();
  const [apiData2, setapiData2] = useState();
  const [apiData3, setapiData3] = useState();
  const [showTitle2, setShowTitle2] = useState(true);

  useEffect(() => {
    if (props.annualInflation[0] * 100 > 2) {
      setShowTitle2(true);
    } else {
      setShowTitle2(false);
    }

    if (props.annualInflation[0] * 100 > 3) {
      let newarr = props.annualInflation[0] * 100;
      newarr -= 2;
      setinflation2(newarr);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: [newarr / 100],
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

      newarr = props.annualInflation[0] * 100;
      newarr += 2;
      setinflation3(newarr);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: [newarr / 100],
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
      <div className="w-[100%] h-auto pt-4 bg-white flex-col justify-start items-start gap-8 inline-flex">
        <div className="self-stretch text-zinc-800 text-xl font-medium ">
          Impact of inflation
        </div>
        <div className="self-stretch  flex-col justify-start items-center gap-8 flex">
          <div className="self-stretch justify-center items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                  Assumed inflation
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Inflation Rate
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium ">
                    {props.annualInflation && props.annualInflation[0] * 100}%
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
            {showTitle2 && (
              <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
                <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                  <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                    Lower inflation
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                  <div className="self-stretch flex-col justify-start items-start gap-0.5 flex">
                    <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                      Inflation Rate
                    </div>
                    <div className="self-stretch text-zinc-800 text-base font-medium ">
                      {inflation2}%
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
            )}
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                  Higher inflation
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Inflation Rate
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium ">
                    {inflation3}%
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
          </div>
          <div className="self-stretch  flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch justify-start items-start gap-4 inline-flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                <div className="self-stretch text-zinc-800 text-base font-medium ">
                  Assumed annual inflation rate
                </div>
                <div className="self-stretch text-zinc-800 text-sm font-normal ">
                  Your current assumption assumes an inflation rate of{" "}
                  {props.annualInflation && props.annualInflation[0] * 100}%
                  till your target retirement age. With this, you will have to
                  monthly save{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(props.dataApi1?.monthly_savings_required)}{" "}
                  to reach your target corpus.
                </div>
              </div>
            </div>
            {showTitle2 && (
              <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
                <div className="self-stretch text-zinc-800 text-base font-medium ">
                  Lower inflation rate
                </div>
                <div className="self-stretch text-zinc-800 text-sm font-normal ">
                  Instead of assuming the inflation rate as{" "}
                  {props.annualInflation && props.annualInflation[0] * 100}%, if
                  the inflation rate is set at {inflation2}%, the monthly
                  savings required to reach the target corpus goes down to{" "}
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
              <div className="self-stretch text-zinc-800 text-base font-medium ">
                Higher inflation rate
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal ">
                Instead of assuming the inflation rate as{" "}
                {props.annualInflation && props.annualInflation[0] * 100}%, if
                the inflation rate is set at {inflation3}%, the monthly savings
                required to reach the target corpus goes up to{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData3?.data.monthly_savings_required)}
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
