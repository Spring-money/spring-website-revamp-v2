import React from "react";

const sizes = {
  xs: "text-xs font-medium",
  lg: "text-lg font-medium",
  s: "text-sm font-normal",
  xl: "text-2xl font-medium md:text-[22px]",
  md: "text-base font-medium",
};

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: keyof typeof sizes;
}

const Text = ({
  children,
  className = "",
  as,
  size = "s",
  ...restProps
}: TextProps) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-white font-poppins ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
