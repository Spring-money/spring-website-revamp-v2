"use client";
import { useEffect, useState } from "react";
import { RetirementApiCall } from "../../../api_call";

export default function FindingRightRoi(props) {
  const [title2, setTitle2] = useState();
  const [title3, setTitle3] = useState();
  const [detailTitle2, setDetailTitle2] = useState();
  const [detailTitle3, setDetailTitle3] = useState();
  const [annualReturns2, setAnnualReturns2] = useState();
  const [annualReturns3, setAnnualReturns3] = useState();
  const [apiData2, setapiData2] = useState();
  const [apiData3, setapiData3] = useState();
  useEffect(() => {
    let expected_annual_returns = props.expectedReturnsBefore[0] * 100;
    if (
      props.expectedReturnsBefore[0] * 100 >= 6 &&
      props.expectedReturnsBefore[0] * 100 <= 18
    ) {
      setTitle2("Higher Risk");
      setDetailTitle2("Higher Risk (Higher Returns on Investment)");
      setTitle3("Lower Risk");
      setDetailTitle3("Lower Risk (Lower Returns on Investmet)");
      expected_annual_returns += 2;
      setAnnualReturns2(expected_annual_returns);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: [expected_annual_returns / 100],
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

      expected_annual_returns = props.expectedReturnsBefore[0] * 100;
      expected_annual_returns -= 2;
      setAnnualReturns3(expected_annual_returns);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: [expected_annual_returns / 100],
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
    } else if (props.expectedReturnsBefore[0] * 100 < 6) {
      setTitle2("High Risk");
      setDetailTitle2("High Risk (High Returns on Investment)");
      setTitle3("Even Higher Risk");
      setDetailTitle3("Even Higher Risk (Even Higher Returns on Investmet)");

      expected_annual_returns += 2;
      setAnnualReturns2(expected_annual_returns);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: [expected_annual_returns / 100],
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

      expected_annual_returns = props.expectedReturnsBefore[0] * 100;
      expected_annual_returns += 4;
      setAnnualReturns3(expected_annual_returns);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: [expected_annual_returns / 100],
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
    } else if (props.expectedReturnsBefore[0] * 100 > 18) {
      setTitle2("Low Risk");
      setDetailTitle2("Low Risk (Low Returns on Investment)");
      setTitle3("Even Lower Risk");
      setDetailTitle3("Even Lower Risk (Even Lower Returns on Investmet)");

      expected_annual_returns -= 2;
      setAnnualReturns2(expected_annual_returns);
      let payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: [expected_annual_returns / 100],
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

      expected_annual_returns = props.expectedReturnsBefore[0] * 100;
      expected_annual_returns -= 4;
      setAnnualReturns3(expected_annual_returns);
      payLoad = {
        current_age: props.ageLife["Current_Age"],
        target_retirement_age: props.ageLife["Retirement_Age"],
        life_expectancy_age: props.ageLife["Life_Expectancy"],
        current_monthly_household_expenses: props.currentMonthlyAmount,
        expected_annual_inflation: props.annualInflation,
        current_value_of_existing_investments: props.currentInvestments,
        expected_annual_returns: [expected_annual_returns / 100],
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
        <div className="self-stretch text-zinc-800 text-xl font-medium font-['Poppins']">
          Finding the right ROI for you
        </div>
        <div className="self-stretch  flex-col justify-start items-center gap-8 flex">
          <div className="self-stretch justify-center items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium font-['Poppins']">
                  Current
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Return on Investments
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                    {props.expectedReturnsBefore &&
                      props.expectedReturnsBefore[0] * 100}
                    %
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
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium font-['Poppins']">
                  {title2}
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Return on Investments
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                    {annualReturns2}%
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
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium font-['Poppins']">
                  {title3}
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Return on Investments
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                    {annualReturns3}%
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
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                Current ROI
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
                /month. Your current expected rate of returns for these
                investments is{" "}
                {props.expectedReturnsBefore &&
                  props.expectedReturnsBefore[0] * 100}
                %.
              </div>
            </div>
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                {detailTitle2}
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                Instead of your current expected ROI, if you change the strategy
                and invest into assets to target return on investments of{" "}
                {annualReturns2}%, the monthly savings required to reach the
                target amount will go up to{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData2?.data.monthly_savings_required)}
                /month.
              </div>
            </div>
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                {detailTitle3}
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                Instead of your current expected ROI, if you change the strategy
                and invest into assets to target return on investments of{" "}
                {annualReturns3}%, the monthly savings required to reach the
                target amount will go up to{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData3?.data.monthly_savings_required)}
                /month.
              </div>
            </div>
          </div>
          <div className="self-stretch p-4 bg-colors-lightGreen rounded justify-start items-center gap-8 inline-flex">
            <div className="grow shrink basis-0 text-zinc-800 text-sm font-normal font-['Poppins']">
              Book a free 1 hour consultation call with our investment advisor.
            </div>
            <div className="px-6 py-2.5 bg-emerald-600 rounded justify-start items-start gap-2 flex">
              <div className=" text-white text-sm font-semibold font-['Poppins']">
                Book a free call
              </div>
            </div>
          </div>
          <div className="self-stretch  flex-col justify-start items-center gap-4 flex">
            <div className="self-stretch  p-4 bg-indigo-600/opacity-5 rounded flex-col justify-start items-start gap-2 flex">
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 text-black/opacity-20 text-indigo-600 text-base font-medium font-['Poppins']">
                  Compounding Effect
                </div>
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                Power of compounding refers to capability of an investment to
                generate earnings, not only on the principal amount, by also on
                the interest earned over time. There are a number of investment
                options where the power of compounding is used and the interest
                earned is added to your invested funds. A seemingly meagre
                change in 2% in returns on investment also ends up affecting a
                lot.
              </div>
            </div>
            <div className="self-stretch  p-4 bg-indigo-600/opacity-5 rounded flex-col justify-start items-start gap-2 flex">
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 text-black/opacity-20 text-base text-indigo-600 font-medium font-['Poppins']">
                  Understanding Risk
                </div>
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                Risk is any uncertainty with respect to your investments that
                has the potential to negatively impact your financial welfare.
                For example, your investment value might rise or fall because of
                market conditions (market risk). The level of risk associated
                with a particular investment or asset className typically
                correlates with the level of return the investment might
                achieve. The rationale behind this relationship is that
                investors willing to take on risky investments and potentially
                lose money should be rewarded for their risk.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
