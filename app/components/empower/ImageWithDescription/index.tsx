import Image from "next/image";
import React from "react";

interface ImageWithDescriptionProps {
  image: string;
  title: string;
  description: string;
}

const ImageWithDescription = ({ image, title, description }: ImageWithDescriptionProps) => {
  return (
    <div className="flex self-stretch p-4 items-center gap-4 flex-1">
        <Image src={image} width={64} height={64} alt="empower-image" />      
      <div className="flex flex-col items-start gap-1 flex-1">
        <span className="self-stretch text-[rgba(39,43,42,0.90)]  text-xl font-medium leading-none">
          {title}
        </span>
        <span className="self-stretch text-[rgba(39,43,42,0.80)]  text-base  leading-none">
            {description}
        </span>
      </div>
    </div>
  );
};

export default ImageWithDescription;
