import React from "react";
import { Heading, Img } from "./..";
import arrow_left from "../../../public/images/img_arrow_left.svg";
import Image from "next/image";

export default function PreviousPage({ prevPageName = "Back", ...props }) {
  return (
    <div {...props}>
      <Image src={arrow_left} className="h-[18px] w-[18px]" />
      <Heading as="h1">{prevPageName}</Heading>
    </div>
  );
}
