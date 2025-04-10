import React from "react";
import { Text } from "./..";

export default function RightPanelGoal({
  goal = "You have to invest",
  goalAmt = "₹ 9,979/month",
  goalDesc = "With an ROI of 10% to reach your goal of ₹ 5,00,000 in 3 years.",
  goalInfo = "If you cannot afford this investment, try adjusting your goal plan to see how you can arrive at an affordable result.",
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex flex-col items-center justify-start w-full gap-2 max-w-[282px]">
        <div className="flex flex-col items-start justify-start w-full">
          <Text size="md" as="p" className="!text-gray-900">
            {goal}
          </Text>
          <Text size="2xl" as="p" className="!text-black-900_33">
            {goalAmt}
          </Text>
        </div>
        <Text as="p" className="!text-gray-900">
          {goalDesc}
        </Text>
      </div>
      <div className="h-px w-full bg-gray-900_3f max-w-[281px]" />
      <Text size="xs" as="p" className="w-[99%] !text-gray-900_89_02">
        {goalInfo}
      </Text>
    </div>
  );
}
