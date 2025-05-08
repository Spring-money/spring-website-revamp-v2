import React from "react";
import Image from "next/image";

export default function Blog({
  blogTitle = "The length of the article should be quite direct impactful, and can be up to max 100 characters",
  blogDesc = "A Systematic Investment Plan (SIP), more popularly known as SIP, is a facility offered by mutual funds to the investors to invest in a disciplined manner. ",
  blogImg = "https://via.placeholder.com/218x128",
  blogTime= 5,
  shareButton = "Share",
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex  gap-[2.00rem] self-stretch flex-col md:flex-row-reverse ">
        <div className="flex flex-1 flex-col gap-[0.50rem]">
          <p className="text-[#272B2A] text-lg">
            {blogTitle}
          </p>
          <p className="text-[#272b2ae6] text-sm">
            {blogDesc}
          </p>
        </div>
        <div className="flex w-full md:w-[20%] rounded bg-gray-400">
          <Image
            src={blogImg}
            width={218}
            height={128}
            alt="image"
            className="h-[8.00rem] w-full rounded object-cover md:h-auto"
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-[1.25rem] self-stretch">
        <div className="flex flex-wrap gap-[0.25rem]">
          <p className="self-start !text-blue_gray-400_01 text-xs">
            {blogTime} mins
          </p>
          <p className="!text-blue_gray-400_01 text-xs">
            •
          </p>
          <p className="self-end !text-blue_gray-400_01 text-xs">
            by NS Wealth Solution
          </p>
        </div>
        {/* <button
            <Img
              src="img_microphone.svg"
              width={10}
              height={18}
              alt="microphone"
              className=" h-[1.13rem]  w-[0.63rem]"
            />
          className="min-w-[4.75rem] gap-[0.38rem] font-medium"
        >
          {shareButton}
        </button> */}
      </div>
    </div>
  );
}
