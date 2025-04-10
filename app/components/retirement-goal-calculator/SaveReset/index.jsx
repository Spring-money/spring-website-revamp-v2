import React from "react";
import { Button, Heading, Img, Text } from "./..";
import Image from "next/image";
import img_bx_reset from "../../../../public/retirement-calculator/img_bx_reset.svg";

export default function SaveReset({
  currentAmount = "Current Value of Investments",
  currentValue = "₹ 2,38,000",
  handleReset,
  handleSaveDetails,
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex flex-col items-start">
        <Text as="p" className="text-center !text-gray-900_bf">
          {currentAmount}
        </Text>
        <Text size="lg" as="p" className="text-center">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(currentValue)}
        </Text>
      </div>
      <div className="flex items-center gap-4 sm:gap-28">
        <div onClick={handleReset} className="flex gap-1">
          <Image src={img_bx_reset} alt="bxreset_one" className=" cursor-pointer h-[18px] w-[18px]" />
          <Heading as="h1" className=" cursor-pointer text-center">
            Reset all values
          </Heading>
        </div>
        <Button onClick={handleSaveDetails} color="teal_600" size="sm" shape="round" className="min-w-[135px] font-semibold sm:px-5">
          Save details
        </Button>
      </div>
    </div>
  );
}
