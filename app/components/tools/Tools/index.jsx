import React from "react";
import { Img, Heading, Text } from "./..";
import Link from "next/link";

export default function Tools({
  toolImg = "/images/img_x_ray_1.svg",
  altText = "financial_xray",
  toolTitle = "Financial X-Ray",
  toolDesc = "Get a customised snapshot of your financial health, strengths and areas of improvement",
  toolAction = "Scan now",
  actionImg = "/images/img_arrow_1.svg",
  toolsLink = "/x-ray-revamp",
  className,
  ...props
}) {
  return (
    <div
    {...props}
    className={`flex flex-col items-start justify-start gap-[7px] p-[15px] border-gray-900_3f border border-solid bg-white-A700 shadow-sm rounded-lg w-full ${className}`}
    >
      <div className="flex flex-col items-start justify-start gap-2 w-full">
        <Img src={toolImg} alt={altText} className="h-16 w-16" />
        <div className="flex flex-col items-start justify-start w-full gap-0.5">
          <Text size="md" as="p" className="!text-gray-900">
            {toolTitle}
          </Text>
          <Text
            size="xs"
            as="p"
            className="!text-gray-900_e5 leading-[140%] self-stretch"
          >
            {toolDesc}
          </Text>
        </div>
      </div>
      <div className="flex flex-row justify-start items-center gap-2 mt-auto w-full">
        <Link href={toolsLink}>
          <Heading as="h1">{toolAction}</Heading>
        </Link>
        <Img src={actionImg} alt="scan_now_one" className="h-px" />
      </div>
    </div>
  );
}
