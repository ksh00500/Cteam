// src/features/demerits/DMR007/TimerRotateEffect.jsx

import React from "react";
import "./TimerRotateEffect.css";

export default function TimerRotateEffect({ children, isRunning, difficulty }) {
  // 난이도가 "상"인지 확인합니다.
  const isHard = difficulty === "상";
  
  let animationClass = "";
  if (isRunning) {
    animationClass = isHard ? "dmr-007-rotating-fast" : "dmr-007-rotating-normal";
  }

  const containerClass = `dmr-007-rotate-container ${animationClass}`;

  return (
    <div className={containerClass}>
      <div style={{ width: "100%" }}>
        {children}
      </div>
    </div>
  );
}