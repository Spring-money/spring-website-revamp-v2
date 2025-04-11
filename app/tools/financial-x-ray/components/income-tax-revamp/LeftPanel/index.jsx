import React from "react";
import { Img, Text } from "./..";
import Image from "next/image";

export default function LeftPanel({
  panelName = "Basic Information",
  flag,
  icon,
  ...props
}) {
  return (
    <div {...props}>
      {flag || icon !== '' ? (
        <Text as="p" className={`self-start ${flag ? "!text-emerald-600" : "!text-gray-900"}`}>
          {panelName}
        </Text>
      ) : (
        <Text as="p" className="self-start !text-gray-900">
          {panelName}
        </Text>)
      }

      <Image src={icon} alt="" />

    </div>
  );
}
