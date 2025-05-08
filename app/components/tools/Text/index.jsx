import React from "react";

const sizes = {
  xs: "text-xs font-normal",
  lg: "text-lg font-medium",
  s: "text-sm font-normal",
  "2xl": "text-2xl font-medium",
  xl: "text-xl font-medium",
  md: "text-base font-medium",
};

const Text = ({ children, className = "", as, size = "s", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-white_01  ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
