import React from "react";

export default function AppButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  style = {}
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`setstop-btn setstop-btn-${variant} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
