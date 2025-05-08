import React from "react";
import { Switch, Img, Text } from "./..";
import Image from "next/image";
import outline from "@/public/images/img_material_symbols_info_outline.svg"; 

export default function Save({ ...props }) {
  return (
    <div {...props}>
      <div className="flex items-center gap-1.5">
        <Text size="md" as="p" className="text-center !text-teal-600">
          Save to profile
        </Text>
        <Image
          src={outline}
          alt="material_one"
          className="h-[16px] w-[16px] self-start"
        />
      </div>
      <Switch />
    </div>
  );
}
