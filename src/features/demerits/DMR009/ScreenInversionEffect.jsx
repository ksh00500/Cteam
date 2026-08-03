// src/features/demerits/DMR009/ScreenInversionEffect.jsx

import React from "react";
import "./ScreenInversionEffect.css";

export default function ScreenInversionEffect({ children, isRunning, difficulty }) {
  const isHard = difficulty === "상";

  let flipClass = "";
  if (isRunning) {
    flipClass = isHard ? "dmr-009-flip-vertical" : "dmr-009-flip-horizontal";
  }

  return (
    <div className={`dmr-009-container ${flipClass}`}>
      {children}
    </div>
  );
}