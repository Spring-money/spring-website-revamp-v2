import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TestimonialCardProps {
  image: string;
  title: string;
  link: string;
  linkText?: string;
  isImage?: boolean;
  secondayImage?: string;
}

const TestimonialCard = ({ image, title, link, linkText = "Watch On Youtube", isImage = false, secondayImage }: TestimonialCardProps) => {
  return (
    <div className="flex flex-col w-[20rem] p-2 items-start gap-2 self-stretch rounded border border-[#272B2A]">
      <Image src={image} height={179} width={312} alt="testimonial"/>
      <div className="flex items-start gap-4 self-stretch">
      {isImage && secondayImage && <Image src={secondayImage} width={64} height={64} alt="Title-image" />}
      <span className="h-18 self-stretch text-gray-900  text-base font-medium">
        {title}
      </span>
      </div>
      <Link className="flex w-full justify-center items-center" href={link}>
      <button className="flex p-2 justify-center items-center gap-2 self-stretch rounded-md bg-green-900_05 w-full">
        <span className="flex-1 text-teal-600 text-center text-base font-medium">
          {linkText}
        </span>
      </button>

      </Link>
    </div>
  );
};

export default TestimonialCard;
