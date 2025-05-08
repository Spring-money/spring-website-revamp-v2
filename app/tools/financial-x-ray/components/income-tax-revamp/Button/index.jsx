import React from "react";
import PropTypes from "prop-types";

const shapes = {
  square: "rounded-[0px]",
  circle: "rounded-[50%]",
  round: "rounded",
};
const variants = {
  outline: {
    teal_600: "border-teal-600 border-b-4 border-solid text-teal-600",
    gray_900: "border-gray-900 border-[0.5px] border-solid text-gray-900",
    gray_900_89: "border-gray-900_89 border border-solid text-gray-900",
    emerald_600: "border-emerald-600 border border-solid",
  },
  fill: {
    gray_900_0c: "bg-gray-900_0c text-gray-900_89",
    gray_900_ce: "bg-gray-900_ce",
    teal_400: "bg-teal-400",
  },
};
const sizes = {
  "2xl": "h-[74px] px-4 text-sm",
  sm: "h-[33px] px-4 text-xs",
  xs: "h-[26px] px-1.5",
  xl: "h-[48px] px-1.5",
  lg: "h-[45px] px-6 text-sm",
  md: "h-[41px] px-5 text-sm",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "outline",
  size = "md",
  color = "gray_900_89",
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
  shape: PropTypes.oneOf(["square", "circle", "round"]),
  size: PropTypes.oneOf(["2xl", "sm", "xs", "xl", "lg", "md"]),
  variant: PropTypes.oneOf(["outline", "fill"]),
  color: PropTypes.oneOf(["teal_600", "gray_900", "gray_900_89", "gray_900_0c", "gray_900_ce", "teal_400","emerald_600"]),
};

export { Button };
