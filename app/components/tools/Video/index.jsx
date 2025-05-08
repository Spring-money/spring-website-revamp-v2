import React from "react";
import { Text, Button, Img } from "./..";
import videoIMG from "../../../public/images/img_img_9906_64x90.png";
import videoIMG1 from "../../../public/images/img_img_9917.png";
import Image from "next/image";

export default function Video({
  videoTitle = "This is the title of a video and it can be maximum 120 characters",
  videoImg = "",
  videoImg1 = "",
  videoLength = "6 mins",
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex flex-row justify-center items-center w-full gap-4">
        <Text as="p" className="w-[63%] !text-gray-900 !font-medium">
          {videoTitle}
        </Text>
        <div className="flex flex-row justify-center w-[32%] bg-gray-400_04 rounded">
          <div className="flex flex-col items-center justify-start w-full">
            <div className=" h-16 w-full relative rounded">
              <Image
                src={videoIMG1}
                className="justify-center w-full left-0 bottom-0 right-0 top-0 m-auto object-contain h-auto absolute rounded"
              />
              <Button className="h-[26px] w-[26px] left-0 bottom-0 right-0 top-0 m-auto bg-gray-900_ce_02 hidden absolute rounded-[50%]">
                <Img src="images/img_frame_1549.svg" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-start w-full">
        <div className="flex flex-row justify-start w-[32%] gap-1">
          <Text size="xs" as="p" className="!text-blue_gray-400">
            Video
          </Text>
          <Text size="xs" as="p" className="!text-blue_gray-400">
            •
          </Text>
          <Text size="xs" as="p" className="!text-blue_gray-400">
            {videoLength}
          </Text>
        </div>
      </div>
    </div>
  );
}
