// src/features/demerits/DMR003/BlinkingTimerEffect.jsx

import React from "react";
import "./BlinkingTimerEffect.css";

export default function BlinkingTimerEffect({ children, isRunning, difficulty }) {
  const isHard = difficulty === "상";

  let animationClass = "";
  if (isRunning) {
    animationClass = isHard ? "dmr-003-blinking-fast" : "dmr-003-blinking-normal";
  }

  return (
    <div className={`dmr-003-blinking-container ${animationClass}`}>
      {children}
    </div>
  );
}