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

export default function AddAssets(props) {
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

  const handleCross = () => {
    props.setShowAssets(false);
  };

  const [selectedAddAssetsButton, setSelectedAddAssetsButton] = useState({
    "Bank Balance": true,
    "Fixed Deposits": false,
    "Recurring Deposits": false,
    NSC: false,
    POMIS: false,
    EPF: false,
    PPF: false,
    "Sukanya Samruddhi Scheme": false,
    Bonds: false,
    "Debt Mutual Fund": false,
    "Equity Mutual Fund": false,
    "Other Mutual Fund": false,
    Shares: false,
    "Real Estate": false,
    "ULIP/Insaurance": false,
    "Gold/Silver": false,
    NPS: false,
    Others: false,
  });

  const [assetsStepValue, setAssetsStepValue] = useState({
    "Bank Balance": 5000,
    "Fixed Deposits": 25000,
    "Recurring Deposits": 25000,
    NSC: 25000,
    POMIS: 25000,
    EPF: 25000,
    PPF: 25000,
    "Sukanya Samruddhi Scheme": 25000,
    Bonds: 25000,
    "Debt Mutual Fund": 25000,
    "Equity Mutual Fund": 25000,
    "Other Mutual Fund": 25000,
    Shares: 25000,
    "Real Estate": 1000000,
    "ULIP/Insaurance": 25000,
    "Gold/Silver": 25000,
    NPS: 25000,
    Others: 25000,
  });

  const [assetsMAxValue, setAssetsMaxValue] = useState({
    "Bank Balance": 100000,
    "Fixed Deposits": 2500000,
    "Recurring Deposits": 2500000,
    NSC: 2500000,
    POMIS: 2500000,
    EPF: 2500000,
    PPF: 2500000,
    "Sukanya Samruddhi Scheme": 2500000,
    Bonds: 2500000,
    "Debt Mutual Fund": 2500000,
    "Equity Mutual Fund": 2500000,
    "Other Mutual Fund": 2500000,
    Shares: 2500000,
    "Real Estate": 50000000,
    "ULIP/Insaurance": 2500000,
    "Gold/Silver": 2500000,
    NPS: 2500000,
    Others: 2500000,
  });

  const [addAssetsToolTip, setAddAssetsToolTip] = useState({
    "Bank Balance": "Your current balance in savings or checking accounts.",
    "Fixed Deposits":
      "Investments with fixed interest rates for a specified term.",
    "Recurring Deposits":
      "Regular deposits at fixed intervals with a predetermined maturity.",
    NSC: "Government savings bond with fixed interest and tax benefits.",
    POMIS: "Monthly income scheme with fixed interest from post offices.",
    EPF: "Mandatory contribution by employees and employers for retirement.",
    PPF: "Long-term, tax-saving investment with fixed interest.",
    "Sukanya Samruddhi Scheme":
      "Savings scheme for the girl child with tax benefits.",
    Bonds: "Fixed-income securities issued by governments or corporations.",
    "Debt Mutual Fund": "Mutual fund investing in fixed-income securities.",
    "Equity Mutual Fund":
      "Mutual fund investing in stocks for potential high returns.",
    "Other Mutual Fund": "Diverse mutual funds beyond debt and equity.",
    Shares: "Ownership in a company for dividends.",
    "Real Estate": "Physical property investments, such as land or buildings.",
    "ULIP/Insaurance": "Insurance plan with an investment component.",
    "Gold/Silver": "Precious metal investments for diversification.",
    NPS: "Voluntary pension savings",
    Others: "",
  });

  const handleAssetsButton = (assets) => {
    setSelectedAddAssetsButton((prevState) => {
      const updatedButtons = {};
      // Set the clicked button to true, all others to false
      Object.keys(prevState).forEach((name) => {
        updatedButtons[name] = name === assets;
      });
      return updatedButtons;
    });
  };

  const handleAssetsAmount = (parameterName, value) => {
    props.setAddAssets((prevParameters) => ({
      ...prevParameters,
      [parameterName]: value,
    }));
  };

  const handleAnnualReturn = (parameterName, value) => {
    props.setAnnualReturns((prevParameters) => ({
      ...prevParameters,
      [parameterName]: value,
    }));
  };

  const handleReset = () => {
    props.setEditDetailsCurrentInvestButton(false);
    props.setAddAssets((prevState) => {
      // Create a new object with all values set to 0
      const resetValues = Object.fromEntries(
        Object.keys(prevState).map((key) => [key, 0])
      );
      return resetValues;
    });
    props.setAnnualReturns((prevState) => {
      // Create a new object with all values set to 0
      const resetValues = Object.fromEntries(
        Object.keys(prevState).map((key) => [key, 0])
      );
      return resetValues;
    });
  };

  const handleSaveDetails = () => {
    props.setCallApi((prev) => prev + 1);
    props.setShowAssets(false);
    props.setSaveTotalCurrentInvetments(props.totalCurrentInvetments);
    props.setEditDetailsCurrentInvestButton(true);
  };

  return (
    <>
      <div className="content-center w-[660px] sm:w-[400px] sm:h-[600px] h-[800px] rounded-lg bg-white-A700 font-sans border border-solid ">
        <div className="flex justify-between gap-5 border-b border-solid border-gray-900_2d bg-white-A700 p-[13px]">
          <Text size="lg" as="p" className="ml-0.5 self-end md:ml-0">
            Add your existing investment assets
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
                {props.addAssets &&
                  Object.entries(props.addAssets).map(([assets, amount]) => (
                    <div key={assets}>
                      {selectedAddAssetsButton[assets] ? (
                        <>
                          <div className="flex border-l-4 sm:border-l-0 border-solid border-teal-600 bg-white-A700 p-[15px]">
                            <Text
                              as="p"
                              className="self-start !font-medium !text-teal-600 "
                            >
                              {assets}
                            </Text>
                          </div>
                        </>
                      ) : (
                        <>
                          <LeftPanel
                            key={assets}
                            panelName={assets}
                            amount={amount}
                            onClick={() => handleAssetsButton(assets)}
                            className="flex flex-col items-start bg-gray-900_0c p-[7px] border border-gray-900_0c"
                          />
                        </>
                      )}
                    </div>
                  ))}
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
                {Object.entries(addAssetsToolTip).map(([assets, tooltip]) => {
                  if (selectedAddAssetsButton[assets]) {
                    return (
                      <>
                        <div
                          key={assets}
                          className="flex flex-col items-start gap-[3px]"
                        >
                          <Text size="lg" as="p">
                            {assets}
                          </Text>
                          <Text as="p" className="!text-gray-900_bf">
                            {tooltip}
                          </Text>
                        </div>
                        <div key={assets} className="flex flex-col gap-2">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-1 flex-col items-start h-[83px]">
                              <Slider
                                parameterName={assets}
                                SliderName="Current Amount"
                                SliderDesc="Your current balance in savings or checking accounts"
                                defaultValue={
                                  props.addAssets && props.addAssets[assets]
                                }
                                minValue={0}
                                maxValue={assetsMAxValue[assets]}
                                step={assetsStepValue[assets]}
                                onSliderChange={handleAssetsAmount}
                                inputType="amount"
                                className="flex rounded-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div key={assets} className="flex flex-col gap-2">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-1 flex-col items-start h-[83px]">
                              <Slider
                                parameterName={assets}
                                SliderName="Expected Annual Returns"
                                SliderDesc="Your assumption of this category’s return on investments"
                                defaultValue={
                                  props.annualReturns &&
                                  props.annualReturns[assets]
                                }
                                minValue={0}
                                maxValue={15}
                                step={1}
                                onSliderChange={handleAnnualReturn}
                                className="flex rounded-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  }
                })}
              </div>
              {/* <Save className="flex w-[91%] items-center justify-between gap-5 md:w-full" /> */}
            </div>
          </div>
          <SaveReset
            currentValue={props.totalCurrentInvetments}
            handleSaveDetails={handleSaveDetails}
            handleReset={handleReset}
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
