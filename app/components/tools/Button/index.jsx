import React from "react";
import PropTypes from "prop-types";

const shapes = {
  circle: "rounded-[50%]",
  square: "rounded-[0px]",
  round: "rounded",
};
const variants = {
  fill: {
    gray_900_ce: "bg-gray-900_ce_02",
    teal_600: "bg-teal-600 text-white_01",
  },
  outline: {
    teal_600: "border-teal-600 border-b-4 border-solid text-gray-900",
  },
};
const sizes = {
  lg: "h-[53px] px-4 text-sm",
  xs: "h-[26px] px-1.5",
  xl: "h-[74px] px-4 text-sm",
  md: "h-[45px] px-6 text-sm",
  sm: "h-[33px] px-4 text-xs",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "round",
  variant = "fill",
  size = "xs",
  color = "teal_600_b3_03",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["circle", "square", "round"]),
  size: PropTypes.oneOf(["lg", "xs", "xl", "md", "sm"]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf(["gray_900_ce", "teal_600"]),
};

export { Button };
