"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RetirementApiCall } from "../../../../api_call";
import leadFormSpringMoneyLogo from "../../../../../../../public/retirement-calculator/leadFormSpringMoneyLogo.svg";

export default function DifferenceBetweenInvestingAndSavings(props) {
  const [apiData1, setapiData1] = useState();
  const [apiData2, setapiData2] = useState();
  const [apiData3, setapiData3] = useState();

  useEffect(() => {
    let payLoad = {
      current_age: props.ageLife["Current_Age"],
      target_retirement_age: props.ageLife["Retirement_Age"],
      life_expectancy_age: props.ageLife["Life_Expectancy"],
      current_monthly_household_expenses: props.currentMonthlyAmount,
      expected_annual_inflation: props.annualInflation,
      current_value_of_existing_investments: props.currentInvestments,
      expected_annual_returns: [0.05],
      expected_annual_returns_post_retirement:
        props.ageLife["Expected_returns_after"] / 100,
      increase_in_your_savings_per_year:
        props.ageLife["Increase_savings_per_year"] / 100,
      desired_inheritance: props.ageLife["Desired_Inheritance"],
    };
    const RetirementApi1 = async () => {
      const data = await RetirementApiCall(payLoad);
      setapiData1(data);
    };
    RetirementApi1();

    payLoad = {
      current_age: props.ageLife["Current_Age"],
      target_retirement_age: props.ageLife["Retirement_Age"],
      life_expectancy_age: props.ageLife["Life_Expectancy"],
      current_monthly_household_expenses: props.currentMonthlyAmount,
      expected_annual_inflation: props.annualInflation,
      current_value_of_existing_investments: props.currentInvestments,
      expected_annual_returns: [0.09],
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

    payLoad = {
      current_age: props.ageLife["Current_Age"],
      target_retirement_age: props.ageLife["Retirement_Age"],
      life_expectancy_age: props.ageLife["Life_Expectancy"],
      current_monthly_household_expenses: props.currentMonthlyAmount,
      expected_annual_inflation: props.annualInflation,
      current_value_of_existing_investments: props.currentInvestments,
      expected_annual_returns: [0.12],
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
  });
  return (
    <>
      <div className="w-[100%] h-auto bg-white flex-col justify-start items-start gap-4 inline-flex">
        <div className="flex w-full justify-end items-center">
          <Image src={leadFormSpringMoneyLogo} alt="leadFormSpringMoneyLogo" />
        </div>
        <div className="self-stretch text-zinc-800 text-[28px] font-semibold font-['Poppins']">
          Difference between investing & saving
        </div>
        <div className="self-stretch  flex-col justify-start items-center gap-6 flex">
          <div className="self-stretch justify-center items-center gap-6 inline-flex">
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium font-['Poppins']">
                  Savings Account
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch h-11 flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Return on Investments
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                    5%
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
                    }).format(apiData1?.data.monthly_savings_required)}
                    /month
                  </div>
                </div>
              </div>
            </div>
            <div className="grow shrink basis-0 p-4 bg-white rounded-lg shadow border border-zinc-800/opacity-25 flex-col justify-start items-start gap-4 inline-flex">
              <div className="pb-2 border-b border-zinc-800/opacity-20 justify-start items-start gap-2 inline-flex">
                <div className="text-zinc-800/opacity-75 text-xs font-medium font-['Poppins']">
                  Retirement Plan
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch h-11 flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Return on Investments
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                    9%
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
                  Securities
                </div>
              </div>
              <div className="self-stretch  flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch  flex-col justify-start items-start gap-0.5 flex">
                  <div className="self-stretch text-zinc-800/opacity-75 text-xs font-normal font-['Poppins']">
                    Return on Investments
                  </div>
                  <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                    12%
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
          <div className="self-stretch  flex-col justify-start items-start gap-6 flex">
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                Saving, but only in savings bank account
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                If you are getting started even with your savings bank account,
                if you follow savings-only path, assuming 5% ROI, the monthly
                savings required to reach the target amount will be{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData1?.data.monthly_savings_required)}
                .
              </div>
            </div>
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                Investing through Retirement Plans
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                If you instead switch to retirement plans, i.e. start
                contributing to these options regularly, assuming 9% ROI, the
                monthly savings required to reach the target amount will be{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData2?.data.monthly_savings_required)}
                .
              </div>
            </div>
            <div className="self-stretch  flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch text-zinc-800 text-base font-medium font-['Poppins']">
                Investing in securities
              </div>
              <div className="self-stretch text-zinc-800 text-sm font-normal font-['Poppins']">
                Instead of relying only on bank’s savings account or retirement
                plans, if you start investing it, and aim for 12% ROI, the
                monthly savings required to reach the target amount would have
                gone down to{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(apiData3?.data.monthly_savings_required)}
                .
              </div>
            </div>
          </div>
          <div className="self-stretch p-4 bg-emerald-600/opacity-5 rounded justify-start bg-colors-lightGreen  items-center gap-8 inline-flex">
            <div className="grow shrink basis-0 text-zinc-800 text-sm font-normal font-['Poppins']">
              Book a free 1 hour consultation call with our investment advisor.
            </div>
            <div className="px-6 py-2.5 bg-emerald-600 rounded justify-start items-start gap-2 flex">
              <a
                href="https://wa.me/918459070919?text=Hey%2C%20I%20would%20like%20to%20book%20a%20call%20with%20financial%20expert%20at%20Spring%20Money.%20"
                target="_blank"
              >
                <div className=" text-white-A700 text-sm font-semibold font-['Poppins']">
                  Plan my retirement
                </div>
              </a>
            </div>
          </div>
          <div className="self-stretch  p-4 bg-indigo-50 rounded flex-col justify-start items-start gap-2 flex">
            <div className="self-stretch justify-start items-center gap-2 inline-flex">
              <div className="grow shrink basis-0 text-black/opacity-20 text-base text-indigo-600 font-medium font-['Poppins']">
                The Importance of Investing
              </div>
            </div>
            <div className="self-stretch">
              <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                While saving is essential for short-term financial goals and
                emergencies, investing offers several advantages over saving
                alone when it comes to preparing for retirement:-
                <br /> <br />
              </span>
              <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                Potential for Higher Returns:
              </span>
              <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                {" "}
                Investing in assets such as stocks, bonds, and mutual funds
                typically offers the potential for higher returns compared to
                traditional savings accounts or fixed deposit (FDs). Over the
                long term, investment returns have historically outpaced
                inflation, helping your retirement savings to grow faster.
                <br />
              </span>
              <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                Beating Inflation:
              </span>
              <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                {" "}
                Investing allows your money to grow at a rate that outpaces
                inflation, preserving your purchasing power over time. In
                contrast, savings accounts may offer minimal interest rates that
                fail to keep up with inflation, causing the real value of your
                savings to erode over time.
                <br />
              </span>
              <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                Harnessing the Power of Compounding:
              </span>
              <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                {" "}
                Investing early allows you to benefit from the power of
                compounding, where your investment earnings generate additional
                returns. Over time, compounding can significantly boost the
                growth of your retirement savings, especially when reinvested
                dividends and capital gains are allowed to accumulate.
                <br />
              </span>
              <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                Diversification and Risk Management:
              </span>
              <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                {" "}
                Investing enables you to diversify your portfolio across various
                asset classNamees, industries, and geographic regions, reducing
                the overall risk of your investments. Diversification helps
                mitigate the impact of market volatility and specific asset
                downturns, enhancing the stability of your retirement savings.
                <br />
              </span>
              <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                Tax Advantages:
              </span>
              <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                {" "}
                Certain retirement accounts and investment options offer tax
                benefits that can help your investments grow more efficiently.
                Contributions to these options may be tax-deductible or grow
                tax-deferred, allowing your investments to compound without
                immediate tax consequences.
                <br />
              </span>
              <span className="text-zinc-800 text-sm font-medium font-['Poppins']">
                Long-Term Goals:
              </span>
              <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                {" "}
                Investing is well-suited for achieving long-term financial goals
                like retirement, as it aligns with the extended time horizon and
                provides the opportunity for wealth accumulation over decades.{" "}
                <br />
              </span>
              <span className="text-zinc-800 text-sm font-normal font-['Poppins']">
                <br />
                While investing involves inherent risks, such as market
                volatility and potential loss of principal, these risks can be
                managed through prudent investment strategies, diversification,
                and a long-term perspective. By combining saving with investing,
                you can build a robust retirement portfolio that balances growth
                potential with risk management, ultimately increasing the
                likelihood of achieving your retirement goals.
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full mt-[520px]">
          <div>Retirement Goal Report</div>
          <div>03</div>
        </div>
      </div>
    </>
  );
}
