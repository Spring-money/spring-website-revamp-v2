'use client'
import React, { useState, useEffect } from "react";
import { Img, Button, Text } from "./..";
import Image from "next/image";
import rightIcon from "@/public/images/img_arrow_1.svg";
import Link from "next/link";

export default function Promo({
  promoTitle = "Get your free Financial X-Ray Report!",
  promoDesc = "Get a detailed assessment report of your financial life.",
  buttonTitle = "Scan now",
  buttonClickLink,
  promoImage,
  ...props
}) {
  return (

    <div {...props}>
      <div className="flex flex-col items-start justify-start w-[68%] gap-4">
        <div className="flex flex-col items-center justify-start gap-2">
          <Text size="md" as="p" className="!text-gray-900">
            {promoTitle}
          </Text>
          <Text size="xs" as="p" className="!text-gray-900_e5 leading-[140%]">
            {promoDesc}
          </Text>
        </div>
        <Link href={buttonClickLink}>
          <Button
            rightIcon={<Image src={rightIcon} alt="Arrow 1" width={12} />}

            className="h-[2.063rem] gap-1.5 text-teal-600 text-xs font-semibold border-teal-600 border border-solid min-w-[6.75rem] rounded ">
            {buttonTitle}
          </Button>
        </Link>
      </div>
      <Image src={promoImage} alt="xrayone_one" className="h-[5.188rem] w-[5.188rem]" />
    </div>
  );
}
