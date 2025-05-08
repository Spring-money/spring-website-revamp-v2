import React from "react";
import { Heading, Text } from "./..";

export default function ToolHeader({ pageTitle = "Tools", toolAction = "View all", ...props }) {
  return (
    <div {...props}>
      <Text size="md" as="p" className="!text-gray-900">
        {pageTitle}
      </Text>
      <a href="#">
        <Heading as="h1">{toolAction}</Heading>
      </a>
    </div>
  );
}
