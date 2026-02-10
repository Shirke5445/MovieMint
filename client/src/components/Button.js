import React from "react";

function Button({
  title,
  onClick,
  variant,
  disabled,
  fullwidth,
  htmlType = "button",
}) {
  let className = "bg-primary p-1 text-white";

  if (fullwidth) className += " w-full";

  if (variant === "outlined") {
    className =
      "border border-primary text-primary bg-white p-1";
  }

  return (
    <button
      className={className}
      type={htmlType}
      disabled={disabled}
      onClick={htmlType === "submit" ? undefined : onClick}
    >
      {title}
    </button>
  );
}

export default Button;
