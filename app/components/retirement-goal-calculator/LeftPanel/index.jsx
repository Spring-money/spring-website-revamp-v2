import React from "react";
import { Text } from "./..";

export default function LeftPanel({ panelName = "Fixed Deposits", amount = "₹ 1,00,000", ...props }) {
  return (
    <div {...props} >
      <Text as="p" className="ml-2 md:ml-0">
        {panelName}
      </Text>
      <Text size="md" as="p" className="ml-2 !font-normal !text-teal-600 md:ml-0">
        {new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(amount)}
      </Text>
    </div>
  );
}
