import React from "react";
import { Button, Text, Img } from "./..";
import logo from "../../../public/images/img_logo.svg";
import arrow_down from "../../../public/images/img_arrow_down.svg";
import Image from "next/image";

export default function Header({ ...props }) {
  return (
    <div {...props}>
      <div className="flex flex-row justify-between items-center w-full mx-auto max-w-[1320px]">
        <Image src={logo} className="h-[34px]" />
        <div className="flex flex-row justify-center items-center w-[45%]">
          <a href="#">
            <Text as="p" className="!text-gray-900 !font-medium">
              Home
            </Text>
          </a>
          <a href="#" className="ml-8">
            <Text as="p" className="!text-gray-900 !font-medium">
              Advisory
            </Text>
          </a>
          <a href="#"> {/* Moved anchor tag */}
            <Text as="p" className="!text-gray-900 !font-medium">
              Academy
            </Text>
            <Image src={arrow_down} alt="arrowdown_one" className="h-[21px] w-[21px] ml-2" /> {/* Image inside anchor */}
          </a>
          <Button shape="square" className="!text-teal-600 font-semibold min-w-[70px]">
            Tools
          </Button>
          <a href="#" className="ml-4">
            <Text as="p" className="!text-gray-900 !font-medium">
              Blog
            </Text>
          </a>
          <Button size="md" variant="fill" className="ml-8 font-semibold min-w-[134px]">
            Get in touch
          </Button>
        </div>
        </div>
        </div>
        )
        }