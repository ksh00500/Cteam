import React from "react";
import { formatTimerDisplay } from "../utils/formatTime.js";

export default function TimerDisplay({ elapsedTime, isRunning }) {
  const formatted = formatTimerDisplay(elapsedTime);

  return (
    <div className={`game-timer-display ${isRunning ? "is-running" : "is-stopped"}`}>
      <div className="game-timer-status">
        {isRunning ? "⏱️ 측정 중..." : "⏱️ 대기 중"}
      </div>
      <div className="game-timer-digits">{formatted}</div>
    </div>
  );
}
