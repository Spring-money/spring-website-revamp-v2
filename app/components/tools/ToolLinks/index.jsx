import React from "react";
import { Img, Heading, Text } from "./..";

export default function ToolLinks({
  toolTitle = "Goal Calculator",
  toolImg = "images/img_goal_calculator.png",
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col items-start justify-start w-[64%] gap-2">
          <div className="flex flex-row justify-start">
            <Text as="p" className="!text-gray-900 !font-medium">
              {toolTitle}
            </Text>
          </div>
          <div className="flex flex-row justify-start items-center gap-2">
            <Heading as="h1">Calculate</Heading>
            <Img src="images/img_arrow_1.svg" alt="calculate_two" className="h-px" />
          </div>
        </div>
        <Img src={toolImg} alt="goal_calculator" className="w-[72px] object-cover" />
      </div>
    </div>
  );
}
