"use client";
import style from "../retirement-goal-calculator/page.module.css";
import LeftPannel from "../retirement-goal-calculator/components/leftPannel/page";
import MiddleConatiner from "../retirement-goal-calculator/components/middleConatiner/page";
import AddAssets from "../retirement-goal-calculator/components/addAssets/page";
import AddMonthlyDetails from "../retirement-goal-calculator/components/addMonthlyDetails/page";
import { useEffect, useState, useContext } from "react";
import { RetirementApiCall } from "./api_call";
import { AppContext } from "../../RetirementReportContext";

export default function RetirementCalculator() {
  const { reportData, setReportData } = useContext(AppContext);

  const [showDetails, setShowDetails] = useState(false);
  const [showAssets, setShowAssets] = useState(false);
  const [currentMonthlyAmount, setCurrentMonthlyAmount] = useState([]);
  const [annualInflation, setAnnualInflation] = useState([]);
  const [currentInvestments, setCurrentInvestments] = useState([]);
  const [expectedReturnsBefore, setExpectedReturnsBefore] = useState([]);
  const [dataFromApi, setDataFromApi] = useState();
  const [totalMonthlyExpenditure, setTotalMonthlyExpenditure] = useState(0);
  const [saveTotalMonthlyExpenditure, setSaveTotalMonthlyExpenditure] =
    useState(0);
  const [totalCurrentInvetments, setTotalCurrentInvetments] = useState(0);
  const [saveTotalCurrentInvetments, setSaveTotalCurrentInvetments] =
    useState(0);
  const [editDetailsMonthlyExpendiButton, setEditDetailsMonthlyExpendiButton] =
    useState(false);
  const [editDetailsCurrentInvestButton, setEditDetailsCurrentInvestButton] =
    useState(false);
  const [callApi, setCallApi] = useState(0);
  const [selectLeftPannelCategory, setSelectLeftPannelCategory] = useState(
    "Your retirement analysis"
  );

  const [ageLife, setAgeLife] = useState({
    Current_Age: 30,
    Retirement_Age: 50,
    Life_Expectancy: 80,
    Desired_Inheritance: 0,
    Expected_returns_after: 8,
    Increase_savings_per_year: 5,
  });
  const [monthlyAmount, setMonthlyAmount] = useState({
    Rent: 0,
    Groceries: 0,
    Utilities: 0,
    "Domestic Help": 0,
    Shopping: 0,
    Entertainment: 0,
    "Dine out": 0,
    Grooming: 0,
    "Personal Care": 0,
    "Health Care": 0,
    Transportation: 0,
    "Family Support": 0,
    "House Maintenance": 0,
    "Pet Care": 0,
    Miscellaneous: 0,
  });

  const [categoryInflation, setCategoryInflation] = useState({
    Rent: 0,
    Groceries: 0,
    Utilities: 0,
    "Domestic Help": 0,
    Shopping: 0,
    Entertainment: 0,
    "Dine out": 0,
    Grooming: 0,
    "Personal Care": 0,
    "Health Care": 0,
    Transportation: 0,
    "Family Support": 0,
    "House Maintenance": 0,
    "Pet Care": 0,
    Miscellaneous: 0,
  });

  const [addAssets, setAddAssets] = useState({
    "Bank Balance": 0,
    "Fixed Deposits": 0,
    "Recurring Deposits": 0,
    NSC: 0,
    POMIS: 0,
    EPF: 0,
    PPF: 0,
    "Sukanya Samruddhi Scheme": 0,
    Bonds: 0,
    "Debt Mutual Fund": 0,
    "Equity Mutual Fund": 0,
    "Other Mutual Fund": 0,
    Shares: 0,
    "Real Estate": 0,
    "ULIP/Insaurance": 0,
    "Gold/Silver": 0,
    NPS: 0,
    Others: 0,
  });

  const [annualReturns, setAnnualReturns] = useState({
    "Bank Balance": 0,
    "Fixed Deposits": 0,
    "Recurring Deposits": 0,
    NSC: 0,
    POMIS: 0,
    EPF: 0,
    PPF: 0,
    "Sukanya Samruddhi Scheme": 0,
    Bonds: 0,
    "Debt Mutual Fund": 0,
    "Equity Mutual Fund": 0,
    "Other Mutual Fund": 0,
    Shares: 0,
    "Real Estate": 0,
    "ULIP/Insaurance": 0,
    "Gold/Silver": 0,
    NPS: 0,
    Others: 0,
  });

  useEffect(() => {
    const monthlyAmountArray = Object.values(monthlyAmount);
    setCurrentMonthlyAmount(monthlyAmountArray);
    const sum = Object.values(monthlyAmount).reduce(
      (total, currentValue) => total + currentValue,
      0
    );
    setTotalMonthlyExpenditure(sum);
  }, [monthlyAmount]);

  useEffect(() => {
    const categoryInflationArray = Object.values(categoryInflation).map(
      (value) => value / 100
    );
    setAnnualInflation(categoryInflationArray);
  }, [categoryInflation]);

  useEffect(() => {
    const addAssetsArray = Object.values(addAssets);
    setCurrentInvestments(addAssetsArray);
    const sum = Object.values(addAssets).reduce(
      (total, currentValue) => total + currentValue,
      0
    );
    setTotalCurrentInvetments(sum);
  }, [addAssets]);
  useEffect(() => {
    const annualReturnsArray = Object.values(annualReturns).map(
      (value) => value / 100
    );
    setExpectedReturnsBefore(annualReturnsArray);
  }, [annualReturns]);

  const showPlusCircleDetails = () => {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  };
  const showPlusCircleAssets = () => {
    if (showAssets) {
      setShowAssets(false);
    } else {
      setShowAssets(true);
    }
  };

  useEffect(() => {
    setCallApi(callApi + 1);
  }, []);
  useEffect(() => {
    const payLoad = {
      current_age: ageLife["Current_Age"],
      target_retirement_age: ageLife["Retirement_Age"],
      life_expectancy_age: ageLife["Life_Expectancy"],
      current_monthly_household_expenses: currentMonthlyAmount,
      expected_annual_inflation: annualInflation,
      current_value_of_existing_investments: currentInvestments,
      expected_annual_returns: expectedReturnsBefore,
      expected_annual_returns_post_retirement:
        ageLife["Expected_returns_after"] / 100,
      increase_in_your_savings_per_year:
        ageLife["Increase_savings_per_year"] / 100,
      desired_inheritance: ageLife["Desired_Inheritance"],
    };
    const RetirementApi = async () => {
      console.log("payload in api call....", payLoad);
      const data = await RetirementApiCall(payLoad);
      setDataFromApi(data);
      console.log("data............", data);
    };
    setReportData({
      ...reportData,
      callApi: callApi || 1,
      dataApi1: dataFromApi || 1,
      expectedReturnsBefore: expectedReturnsBefore || 0,
      currentInvestments: currentInvestments || 0,
      annualInflation: annualInflation || 0,
      currentMonthlyAmount: currentMonthlyAmount || 0,
      ageLife: ageLife,
      timeTillRetirement: ageLife["Retirement_Age"] - ageLife["Current_Age"],
      targetCorpus: dataFromApi?.data?.amount_required_at_retirement_age || 0,
      monthlySavings:
        dataFromApi?.data?.monthly_savings_required_at_provided_increment || 0,
    });

    RetirementApi();
  }, [callApi]);

  return (
    <>
      {showAssets && (
        <div className={style.blurredBackground}>
          <div className={style.containerAdd}>
            <AddAssets
              setEditDetailsCurrentInvestButton={
                setEditDetailsCurrentInvestButton
              }
              setSaveTotalCurrentInvetments={setSaveTotalCurrentInvetments}
              totalCurrentInvetments={totalCurrentInvetments}
              setCallApi={setCallApi}
              setAnnualReturns={setAnnualReturns}
              annualReturns={annualReturns}
              setAddAssets={setAddAssets}
              addAssets={addAssets}
              setExpectedReturnsBefore={setExpectedReturnsBefore}
              setCurrentInvestments={setCurrentInvestments}
              setShowAssets={setShowAssets}
            />
          </div>
        </div>
      )}
      {showDetails && (
        <div className={style.blurredBackground}>
          <div className={style.containerAdd}>
            <AddMonthlyDetails
              setEditDetailsMonthlyExpendiButton={
                setEditDetailsMonthlyExpendiButton
              }
              setSaveTotalMonthlyExpenditure={setSaveTotalMonthlyExpenditure}
              totalMonthlyExpenditure={totalMonthlyExpenditure}
              setCallApi={setCallApi}
              setCategoryInflation={setCategoryInflation}
              categoryInflation={categoryInflation}
              setMonthlyAmount={setMonthlyAmount}
              monthlyAmount={monthlyAmount}
              setAnnualInflation={setAnnualInflation}
              setCurrentMonthlyAmount={setCurrentMonthlyAmount}
              setShowDetails={setShowDetails}
            />
          </div>
        </div>
      )}
      <div className={style.container}>
        <div className={style.leftMiddleContainer}>
          <div className={style.leftContainer}>
            <LeftPannel
              selectLeftPannelCategory={selectLeftPannelCategory}
              setSelectLeftPannelCategory={setSelectLeftPannelCategory}
            />
          </div>
          <div className={style.middleContainer}>
            <MiddleConatiner
              callApi={callApi}
              expectedReturnsBefore={expectedReturnsBefore}
              currentInvestments={currentInvestments}
              annualInflation={annualInflation}
              currentMonthlyAmount={currentMonthlyAmount}
              selectLeftPannelCategory={selectLeftPannelCategory}
              editDetailsCurrentInvestButton={editDetailsCurrentInvestButton}
              editDetailsMonthlyExpendiButton={editDetailsMonthlyExpendiButton}
              saveTotalCurrentInvetments={saveTotalCurrentInvetments}
              saveTotalMonthlyExpenditure={saveTotalMonthlyExpenditure}
              dataFromApi={dataFromApi}
              setCallApi={setCallApi}
              setExpectedReturnsBefore={setExpectedReturnsBefore}
              setCurrentInvestments={setCurrentInvestments}
              setAnnualInflation={setAnnualInflation}
              setCurrentMonthlyAmount={setCurrentMonthlyAmount}
              ageLife={ageLife}
              setAgeLife={setAgeLife}
              showPlusCircleDetails={showPlusCircleDetails}
              showPlusCircleAssets={showPlusCircleAssets}
            />
          </div>
        </div>
        <div className={style.leftContainerResponsive}>
          <LeftPannel
            selectLeftPannelCategory={selectLeftPannelCategory}
            setSelectLeftPannelCategory={setSelectLeftPannelCategory}
          />
        </div>
        <div className="lg:hidden px-[20px] my-[16px]">
          <p className=" text-[10px] font-normal font-poppins">
            <span className="font-poppins text-[10px] font-medium">
              Disclaimer:
            </span>{" "}
            This has been prepared based on the details provided by the user.
            The results are meant to act as broad guidelines for attaining
            financial well-being. This assessment is not a recommendation or
            advice for making any financial or non-financial decision. Before
            making any financial decisions, the user must study and comprehend
            the applicable rules, regulations, and legal framework in addition
            to conducting his/her own independent analysis and due diligence.
          </p>
        </div>
        {/* <div className={style.rightContainer}>
                    <RightPannel />
                </div> */}
      </div>
    </>
  );
}
