"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RetirementApiCall } from "../../../../api_call";
import leadFormSpringMoneyLogo from "../../../../../../../public/retirement-calculator/leadFormSpringMoneyLogo.svg";

export default function AlteringYourExpenses(props) {
  const [apiData2, setapiData2] = useState();
  const [apiData3, setapiData3] = useState();
  const [monthlyExpenses2, setMonthlyExpenses2] = useState();
  const [monthlyExpenses3, setMonthlyExpenses3] = useState();
  useEffect(() => {
    let newArray = [...props.currentMonthlyAmount];
    if (props.currentMonthlyAmount[0] <= 10000) {
      newArray[0] += 2500;
      setMonthlyExpenses2([newArray[0]]);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: newArray,
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

      newArray = [...props.currentMonthlyAmount];
      newArray[0] = newArray[0] / 2;
      setMonthlyExpenses3([newArray[0]]);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: newArray,
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
    } else if (10000 < props.currentMonthlyAmount[0] <= 30000) {
      newArray[0] += 5000;
      setMonthlyExpenses2([newArray[0]]);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: newArray,
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
        console.log("payload2....", payLoad);
        const data = await RetirementApiCall(payLoad);
        setapiData2(data);
        console.log("data2........", data);
      };
      RetirementApi2();

      newArray = [...props.currentMonthlyAmount];
      newArray[0] -= 5000;
      setMonthlyExpenses3([newArray[0]]);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: newArray,
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
        console.log("payload3....", payLoad);
        const data = await RetirementApiCall(payLoad);
        setapiData3(data);
        console.log("data3........", data);
      };
      RetirementApi3();
    } else if (30000 < props.currentMonthlyAmount[0] <= 100000) {
      newArray[0] += 10000;
      setMonthlyExpenses2([newArray[0]]);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: newArray,
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

      newArray = [...props.currentMonthlyAmount];
      newArray[0] -= 10000;
      setMonthlyExpenses3([newArray[0]]);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: newArray,
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
    } else if (props.currentMonthlyAmount[0] > 100000) {
      newArray[0] += 20000;
      setMonthlyExpenses2([newArray[0]]);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: newArray,
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

      newArray = [...props.currentMonthlyAmount];
      newArray[0] -= 20000;
      setMonthlyExpenses3([newArray[0]]);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: newArray,
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
      <div className="w-[100%] h-screen relative bg-white flex-col justify-start items-start gap-8 inline-flex">
        <div className="flex w-full justify-end items-center">
          <Image src={leadFormSpringMoneyLogo} alt="leadFormSpringMoneyLogo" />
        </div>
        <div className="self-stretch text-zinc-800 text-[28px] font-semibold ">
          Altering your expenses
        </div>
        <div className="self-stretch  flex-col justify-start items-center gap-8 flex">
          <div className="self-stretch justify-center items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                  Current assumption
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Monthly Expenses
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium ">
                    ₹ {props.currentMonthlyAmount}
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Savings required
                  </div>
                  {props.dataApi1 && (
                    <div className="self-stretch text-emerald-600 text-sm font-medium ">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(props.dataApi1.monthly_savings_required)}
                      /month
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                  Higher expenditure
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Monthly Expenses
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium ">
                    ₹ {monthlyExpenses2}
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Savings required
                  </div>
                  <div className="self-stretch justify-start items-start gap-2 inline-flex">
                    {apiData2 && (
                      <div className="grow shrink basis-0 text-emerald-600 text-sm font-medium ">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(apiData2.data?.monthly_savings_required)}
                        /month
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium ">
                  Lower expenditure
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Monthly Expenses
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium ">
                    ₹ {monthlyExpenses3}
                  </div>
                </div>
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal ">
                    Savings required
                  </div>
                  <div className="self-stretch justify-start items-start gap-2 inline-flex">
                    {apiData3 && (
                      <div className="grow shrink basis-0 text-emerald-600 text-sm font-medium ">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(apiData3.data?.monthly_savings_required)}
                        /month
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch  flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium ">
                Starting with current assumption
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal ">
                Your current assumption is to manage your monthly expenses
                within ₹ {props.currentMonthlyAmount} during your retirement. In
                this case, you will need to save{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(props.dataApi1?.monthly_savings_required)}
                /month for your retirement.
              </div>
            </div>
            <div className="self-stretch justify-start items-start gap-4 inline-flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                <div className="self-stretch text-zinc-800 text-base font-medium ">
                  Preparing for more costs than expected
                </div>
                <div className="self-stretch text-zinc-800 text-sm font-normal ">
                  Instead of considering your monthly expenses as ₹{" "}
                  {props.currentMonthlyAmount}, if you consider the costs on the
                  higher side and assume ₹ {monthlyExpenses2}, the monthly
                  savings required to reach the target amount will go up to{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(apiData2?.data?.monthly_savings_required)}
                  .
                </div>
              </div>
            </div>
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium ">
                In case you need to spend less
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal ">
                Instead of considering your monthly expenses as ₹{" "}
                {props.currentMonthlyAmount}, if you manage your lifestyle in a
                way where you restrict monthly expenses as ₹ {monthlyExpenses3},
                the monthly savings required to reach the target amount will go
                down to{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData3?.data?.monthly_savings_required)}
                .
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row absolute justify-between w-full bottom-0">
          <div>Retirement Goal Report</div>
          <div>06</div>
        </div>
      </div>
    </>
  );
}
