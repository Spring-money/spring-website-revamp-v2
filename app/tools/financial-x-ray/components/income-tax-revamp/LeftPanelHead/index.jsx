import React from "react";
import { Text, Img, Heading } from "./..";
import arrow_left from "../../../public/images/img_arrow_left.svg";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setshowReattempt } from "@/app/features/DashBoard/CategorySlice";

export default function LeftPanelHead({
  heading = "Tools",
  refreshImg = "/images/img_refresh_ccw.svg",
  reset = "Reset",
  taxImg = "/images/img_image_15.png",
  headingName = "Income Tax Savings Maximiser",
  headingDesc = "Find out the smartest tax-saving opportunities specifically for you.",
  ...props
}) {

  const SESSION_COOKIE_KEY = 'sm-token-2024';
  const token = Cookies.get(SESSION_COOKIE_KEY);
  const dispatch = useDispatch()
  const handleResetClick = () => {
    dispatch(setshowReattempt(true))
  }

 


  return (
    <div {...props}>
      <div className="flex justify-between gap-5 self-stretch">
        <div className="flex items-center gap-1.5">
          <Link href={'/tools'}>
            <Image src={arrow_left} width={20} height={20} alt="arrowdown_three" className="h-[18px] w-[18px] self-end" />
          </Link>
          <Heading as="h1">{heading}</Heading>
        </div>
        <div className="flex items-center gap-1.5">
          <Img src={refreshImg} alt="refreshccw_one" className="h-[16px] w-[16px]" />
          <Link href={'/academy/tools/save-income-tax'} onClick={handleResetClick}>
          <Heading as="h2" className="!text-gray-900_89">
            {reset}
          </Heading>
          </Link>
          
        </div>
      </div>
      <div className="flex flex-col gap-2 self-stretch">
        <Image src={taxImg} width={60} height={65} alt="imagefifteen" className="h-[64px] w-[21%] object-cover" />
        <Text size="xl" as="p" className="!text-gray-900">
          {headingName}
        </Text>
        <Text size="xs" as="p" className="!text-gray-900_bf">
          {headingDesc}
        </Text>
      </div>
    </div>
  );
}
