import React from "react";
import { Img, Text } from "./..";
import arrow_down from "../../../public/images/img_arrow_down.svg";
import Image from "next/image";
export default function LeftPanelDropdown({ toolName = "Financial X-Ray", ...props }) 

{
  return (
    <div {...props}>
      <Text as="p" className="mt-px !text-gray-900">
        {toolName}
      </Text>

    </div>
  );
}
