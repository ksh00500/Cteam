// src/features/demerits/DMR002/StopButtonFloatingEffect.jsx

import React from "react";
import "./StopButtonFloatingEffect.css";

export default function StopButtonFloatingEffect({ children, isRunning, difficulty }) {
  let animationClass = "";
  if (isRunning) {
    if (difficulty === "상") {
      animationClass = "dmr-002-floating-hard";
    } else if (difficulty === "중") {
      animationClass = "dmr-002-floating-medium";
    } else {
      animationClass = "dmr-002-floating-low";
    }
  }

  return (
    <div className={`dmr-002-wrapper ${animationClass}`}>
      {children}
    </div>
  );
}
