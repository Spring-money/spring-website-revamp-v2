  import React from "react";
  import PropTypes from "prop-types";

  const shapes = {
    square: "rounded-[0px]",
  };
  const variants = {
    fill: {
      gray_900_3f_01: "bg-gray-900_3f text-gray-900",
      gray_900_3f: "bg-gray-900_3f text-gray-900",
    },
  };
  const sizes = {
    lg: "h-[53px] px-4 text-sm",
  };

  const InputTools = React.forwardRef(
    (
      {
        className = "",
        name = "",
        placeholder = "",
        type = "text",
        children,
        label = "",
        prefix,
        suffix,
        onChange,
        shape = "square",
        variant = "fill",
        size = "lg",
        color = "gray_900_3f_01",
        ...restProps
      },
      ref,
    ) => {
      const handleChange = (e) => {
        if (onChange) onChange(e?.target?.value);
      };

      return (
        <>
          <div
            className={`${className} flex items-center justify-center gap-[35px] text-gray-900 text-sm bg-gray-900_3f ${shapes[shape] || ""} ${variants[variant]?.[color] || variants[variant] || ""} ${sizes[size] || ""}`}
          >
            {!!label && label}
            {!!prefix && prefix}
            <input ref={ref} type={type} name={name} onChange={handleChange} placeholder={placeholder} {...restProps} />
            {!!suffix && suffix}
          </div>
        </>
      );
    },
  );

  InputTools.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    shape: PropTypes.oneOf(["square"]),
    size: PropTypes.oneOf(["lg"]),
    variant: PropTypes.oneOf(["fill"]),
    color: PropTypes.oneOf(["gray_900_3f_01", "gray_900_3f"]),

  };
  InputTools.displayName='inputTools';

  export default InputTools ;
