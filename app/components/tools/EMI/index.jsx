import React from "react";
import { Text, Img } from "./..";

export default function EMI({
  emiAmt = "₹ 4,614/month",
  totalEmiAmt = "₹ 1,10,748",
  emiPrinciple = "Principal amount",
  emiPrincipleAmt = "₹ 1,00,000",
  emiIntrest = "Interest amount",
  emiInterestAmt = "₹ 10,748",
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex flex-col items-start justify-start w-full max-w-[282px]">
        <Text size="md" as="p" className="!text-gray-900">
          Your EMI will be
        </Text>
        <Text size="2xl" as="p" className="!text-black-900_33">
          {emiAmt}
        </Text>
      </div>
      <div className="h-px w-full bg-gray-900_3f max-w-[281px]" />
      <div className="flex flex-col items-center justify-start w-full gap-2 max-w-[282px]">
        <div className="flex flex-row justify-start items-center w-full">
          <Text size="xs" as="p" className="!text-gray-900">
            Total amount payable:{" "}
          </Text>
          <Text as="p" className="ml-1 !text-gray-900 !font-medium">
            {totalEmiAmt}
          </Text>
        </div>
        <Img src="images/img_amount_lines.svg" alt="amountlinesone" className="h-2 rounded" />
        <div className="flex flex-col w-full gap-[3px]">
          <div className="flex flex-row justify-start items-center w-full gap-1.5">
            <div className="h-[9px] w-[9px] bg-teal-400 rounded" />
            <div className="flex flex-row justify-between w-[95%]">
              <Text size="xs" as="p" className="!text-gray-900">
                {emiPrinciple}
              </Text>
              <Text size="xs" as="p" className="!text-gray-900">
                {emiPrincipleAmt}
              </Text>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center w-full gap-1.5">
            <div className="h-[9px] w-[9px] bg-indigo-400 rounded" />
            <div className="flex flex-row justify-between w-[95%]">
              <Text size="xs" as="p" className="mb-px !text-gray-900">
                {emiIntrest}
              </Text>
              <Text size="xs" as="p" className="!text-gray-900">
                {emiInterestAmt}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
