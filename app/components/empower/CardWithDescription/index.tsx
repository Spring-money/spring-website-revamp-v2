import Image from "next/image";
import React from "react";

interface CardWithDescriptionProps {
  image: string;
  title: string;
  description: string;
}

const CardWithDescription = ({ image, title, description }: CardWithDescriptionProps) => {
  return (
    <div className="flex p-4 flex-col items-start gap-4 flex-1 self-stretch rounded-lg sm:h-fit sm:w-[23rem]">
      <Image src={image} width={432} height={248} alt="card-picture" className="w-full" />
      <div className="flex flex-col items-start gap-1 self-stretch">
        <span className="self-stretch text-gray-900 text-lg font-medium">
          {title}
        </span>
        <span className="self-stretch text-gray-900/80 text-sm">
          {description}
        </span>
      </div>
    </div>
  );
};

export default CardWithDescription;
