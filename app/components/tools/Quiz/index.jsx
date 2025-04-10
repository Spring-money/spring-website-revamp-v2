'use client'
import React from "react";
import { Text, Img, Heading } from "./..";
import quizIMG from "../../../public/images/img_image_8.png";
import quizIMG1 from "@/public/images/img_arrow_1.svg";
import Image from "next/image";

export default function Quiz({
  quizTitle = "Very Interesting Quiz Name",
  quizType = "Personal Finance  - General",
  quizImg1 = "",
  quizImg = "",
  quizLength = "10 questions",
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex flex-row justify-start items-center w-full gap-2">
        <div className="flex flex-col items-start justify-start w-[71%] gap-4">
          <div className="flex flex-col items-start justify-start w-full gap-px">
            <Text as="p" className="!text-gray-900 !font-medium">
              {quizTitle}
            </Text>
            <Text size="xs" as="p" className=" !text-blue_gray-400 !font-medium">
              {quizType}
            </Text>
          </div>
          <div className="flex flex-row justify-start items-center gap-2">
            <Heading as="h1" className=" font-medium">Start quiz</Heading>
            <Image src={quizIMG1} width={16}/>
          </div>
        </div>
        <Image src={quizIMG} className="w-[76px] object-cover"  />
      </div>
      <div className="flex flex-row justify-start w-full">
        <div className="flex flex-row justify-start w-[41%] gap-1">
          <Text size="xs" as="p" className="!text-blue_gray-400">
            Quiz
          </Text>
          <Text size="xs" as="p" className="!text-blue_gray-400">
            •
          </Text>
          <Text size="xs" as="p" className="!text-blue_gray-400">
            {quizLength}
          </Text>
        </div>
      </div>
    </div>
  );
}
