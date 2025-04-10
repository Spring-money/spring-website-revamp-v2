'use client'
import React from "react";
import { Text, Img } from "./..";
import articleIMG from "../../../public/images/img_img_9906.png";
import Image from "next/image";
import Link from "next/link";

export default function Article({
  articleTitle = "The length of the short read can be up to max 80 characters",
  articleImg = "",
  articleType = "Short Read",
  articleTime = "2 mins",
  onClickLink,
  wixArticleLink,
  contentType= 'Article',
  ...props
}) {
  const handleClick = ()=>{
    localStorage.setItem('navigation_catergory', 'all-topics');
    localStorage.setItem('short_name', onClickLink);
    localStorage.setItem('html_content', wixArticleLink);
    localStorage.setItem('content_type', contentType);
  }
  return (
      <div className="font-sans" onClick={handleClick} {...props}>
        <Link href={`/academy/all-topics/${onClickLink}`}>
        <div className="flex flex-row justify-center items-center w-full gap-4">
          <Text as="p" className="w-[63%] !text-gray-900 !font-medium ">
            {articleTitle}
          </Text>
          <div className="flex flex-row justify-center w-[32%] bg-gray-400_04 rounded">
            <Image src={articleImg} width={2000} height={20} className="w-full object-contain rounded" />
          </div>
        </div>
        <div className="flex flex-row justify-start w-full">
          <div className="flex flex-row justify-start w-[43%] gap-1">
            <Text size="xs" as="p" className="!text-blue_gray-400">
              {articleType}
            </Text>
            <Text size="xs" as="p" className="!text-blue_gray-400">
              •
            </Text>
            <Text size="xs" as="p" className="!text-blue_gray-400">
              {articleTime}
            </Text>
          </div>
        </div>
        </Link>
      </div>
  );
}
