"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  SeekBar,
  Button,
  Text,
  Img,
} from "../../../../components/retirement-goal-calculator";
import LeftPanel from "../../../../components/retirement-goal-calculator/LeftPanel";
import Slider from "../../../../components/tools/Slider";
import SaveReset from "../../../../components/retirement-goal-calculator/SaveReset";
import Image from "next/image";
import img_arrow_down from "../../../../../public/retirement-calculator/img_arrow_down.svg";
import img_x from "../../../../../public/retirement-calculator/img_x.svg";

export default function AddMonthlyDetails(props) {
  const scrollableRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(true);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;

    const handleScroll = () => {
      if (scrollableElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
        setShowScrollTop(scrollTop > 0);
        setShowScrollBottom(scrollHeight - scrollTop > clientHeight);
      }
    };

    scrollableElement.addEventListener("scroll", handleScroll);
    return () => scrollableElement.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  };

  const [monthlyExpensesTooltip, setMonthlyExpensesTooltip] = useState({
    Rent: "Your monthly rental expenses for housing.",
    Groceries:
      "Expenses for food , groceries ,daily essential provisions and household items.",
    Utilities:
      "Regular expenses for utilities like electricity, phone, and DTH.",
    "Domestic Help": "Expenses for domestic help, including maids and drivers.",
    Shopping:
      "Expenditure on personal and gift shopping, both online and offline.",
    Entertainment:
      "Expenses related to movies, subscriptions, and other entertainment.",
    "Dine out": "Expenses for dining out and ordering food.",
    Grooming: "",
    "Personal Care": "Expenses associated with salon , spa & massage services.",
    "Health Care":
      "Medical expenses covering doctor visits, medicines, and tests.",
    Transportation: "Transportation costs including cabs, fuel, and tolls.",
    "Family Support":
      "Expenses associated with financial support provided to family members.",
    "House Maintenance":
      "Costs related to hiring services for house maintainence (  electrician, plumber etc.) ",
    "Pet Care":
      "Expenditure on pet-related expenses, including food and vaccines.",
    Miscellaneous: "Miscellaneous or expenses not covered in other categories.",
  });

  const [selectedmonthlyAmountButton, setSelectedmonthlyAmountButton] =
    useState({
      Rent: true,
      Groceries: false,
      Utilities: false,
      "Domestic Help": false,
      Shopping: false,
      Entertainment: false,
      "Dine out": false,
      Grooming: false,
      "Personal Care": false,
      "Health Care": false,
      Transportation: false,
      "Family Support": false,
      "House Maintenance": false,
      "Pet Care": false,
      Miscellaneous: false,
    });

  const handleExpenseButton = (category) => {
    setSelectedmonthlyAmountButton((prevState) => {
      const updatedButtons = {};
      // Set the clicked button to true, all others to false
      Object.keys(prevState).forEach((name) => {
        updatedButtons[name] = name === category;
      });
      return updatedButtons;
    });
  };

  const handleExpenseAmount = (parameterName, value) => {
    props.setMonthlyAmount((prevParameters) => ({
      ...prevParameters,
      [parameterName]: value,
    }));
  };

  const handleCategoryInflation = (parameterName, value) => {
    props.setCategoryInflation((prevParameters) => ({
      ...prevParameters,
      [parameterName]: value,
    }));
  };

  const handleCross = () => {
    props.setShowDetails(false);
  };

  const handleReset = () => {
    props.setEditDetailsMonthlyExpendiButton(false);
    props.setMonthlyAmount((prevState) => {
      // Create a new object with all values set to 0
      const resetValues = Object.fromEntries(
        Object.keys(prevState).map((key) => [key, 0])
      );
      return resetValues;
    });
    props.setCategoryInflation((prevState) => {
      // Create a new object with all values set to 0
      const resetValues = Object.fromEntries(
        Object.keys(prevState).map((key) => [key, 0])
      );
      return resetValues;
    });
  };

  const handleSaveDetails = () => {
    props.setCallApi((prev) => prev + 1);
    props.setShowDetails(false);
    props.setSaveTotalMonthlyExpenditure(props.totalMonthlyExpenditure);
    props.setEditDetailsMonthlyExpendiButton(true);
  };

  return (
    <>
      <div className="content-center w-[660px] sm:w-[400px] sm:h-[600px] h-[800px] rounded-lg bg-white-A700 font-sans border border-solid ">
        <div className="flex justify-between gap-5 border-b border-solid border-gray-900_2d bg-white-A700 p-[13px]">
          <Text size="lg" as="p" className="ml-0.5 self-end md:ml-0">
            Add your expected monthly expenditure
          </Text>
          <Image
            onClick={handleCross}
            src={img_x}
            alt="x_one"
            className=" cursor-pointer mr-0.5 h-[24px] w-[24px] md:mr-0"
          />
        </div>
        <div>
          <div className="flex sm:flex-col">
            <div className="flex w-[32%] flex-col bg-gray-900_3f sm:w-full sm:p-0">
              <div className="relative sm:hidden  flex rotate-[180deg] justify-center bg-gray-100 ">
                {showScrollTop && (
                  <Button
                    onClick={scrollToTop}
                    className="w-full h-fit bg-inherit p-3.5"
                  >
                    <Image
                      src={img_arrow_down}
                      alt="arrowdown_one"
                      className=" bg-inherit"
                      onClick={scrollToBottom}
                    />
                  </Button>
                )}
              </div>
              <div
                ref={scrollableRef}
                className="overflow-y-scroll sm:flex hide-scrollbar"
                style={{ maxHeight: "calc(100vh - 330px)" }}
              >
                {props.monthlyAmount &&
                  Object.entries(props.monthlyAmount).map(
                    ([category, amount]) => (
                      <div key={category}>
                        {selectedmonthlyAmountButton[category] ? (
                          <>
                            <div className="flex border-l-4 sm:border-l-0 border-solid border-teal-600 bg-white-A700 p-[15px]">
                              <Text
                                as="p"
                                className="self-start !font-medium !text-teal-600 "
                              >
                                {category}
                              </Text>
                            </div>
                          </>
                        ) : (
                          <>
                            <LeftPanel
                              key={category}
                              panelName={category}
                              amount={amount}
                              onClick={() => handleExpenseButton(category)}
                              className="flex flex-col items-start bg-gray-900_0c p-[7px] border border-gray-900_0c"
                            />
                          </>
                        )}
                      </div>
                    )
                  )}
              </div>
              {showScrollBottom && (
                <Button
                  onClick={scrollToBottom}
                  className="w-full sm:hidden h-fit bg-gray-100"
                  shape="square"
                >
                  <div className="relative mt-[5px] flex rotate-[0deg] justify-center  p-3.5">
                    <Image
                      src={img_arrow_down}
                      alt="arrowdown_one"
                      className=""
                      onClick={scrollToBottom}
                    />
                  </div>
                </Button>
              )}
            </div>

            <div className="flex flex-1 flex-col items-center gap-[100px] bg-white-A700 p-4 md:gap-[62px] sm:gap-[41px] sm:self-stretch sm:p-5">
              <div className="flex w-[91%] flex-col gap-[31px] md:w-full">
                {Object.entries(monthlyExpensesTooltip).map(
                  ([expenses, tooltip]) => {
                    if (selectedmonthlyAmountButton[expenses]) {
                      return (
                        <>
                          <div
                            key={expenses}
                            className="flex flex-col items-start gap-[3px]"
                          >
                            <Text size="lg" as="p">
                              {expenses}
                            </Text>
                            <Text as="p" className="!text-gray-900_bf">
                              {tooltip}
                            </Text>
                          </div>
                          <div key={expenses} className="flex flex-col gap-2">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-1 flex-col items-start h-[83px]">
                                <Slider
                                  parameterName={expenses}
                                  SliderName="Monthly amount"
                                  SliderDesc="Your current balance in savings or checking accounts"
                                  defaultValue={
                                    props.monthlyAmount &&
                                    props.monthlyAmount[expenses]
                                  }
                                  minValue={0}
                                  maxValue={100000}
                                  step={1}
                                  onSliderChange={handleExpenseAmount}
                                  inputType="amount"
                                  className="flex rounded-sm"
                                />
                              </div>
                            </div>
                          </div>
                          <div key={expenses} className="flex flex-col gap-2">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-1 flex-col items-start h-[83px]">
                                <Slider
                                  parameterName={expenses}
                                  SliderName="Category Inflation"
                                  SliderDesc="Your assumption of this category’s annual inflation rate"
                                  defaultValue={
                                    props.categoryInflation &&
                                    props.categoryInflation[expenses]
                                  }
                                  minValue={0}
                                  maxValue={15}
                                  step={1}
                                  onSliderChange={handleCategoryInflation}
                                  className="flex rounded-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    }
                  }
                )}
              </div>
              {/* <Save className="flex w-[91%] items-center justify-between gap-5 md:w-full" /> */}
            </div>
          </div>
          <SaveReset
            currentValue={props.totalMonthlyExpenditure}
            handleSaveDetails={handleSaveDetails}
            handleReset={handleReset}
            currentAmount="Expected Monthly Expenditure"
            className="flex items-center justify-between gap-5 border-t border-solid border-gray-900_2d bg-white-A700 p-3.5 sm:items-start sm:mt-8 sm:flex-col"
          />
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
