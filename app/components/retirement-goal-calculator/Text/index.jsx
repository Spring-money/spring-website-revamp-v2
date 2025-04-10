import React from "react";

const sizes = {
  xs: "text-[10px] font-normal",
  lg: "text-base font-medium",
  s: "text-xs font-normal",
  md: "text-sm font-medium",
};

const Text = ({ children, className = "", as, size = "s", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-gray-900 whitespace-nowrap font-poppins ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
