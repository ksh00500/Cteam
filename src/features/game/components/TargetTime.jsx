import React from "react";
import { formatTimerDisplay } from "../utils/formatTime.js";

export default function TargetTime({ targetTime }) {
  return (
    <div className="game-target-time">
      <span>🎯 목표 시간</span>
      <strong>
        {formatTimerDisplay(targetTime)} <small>초</small>
      </strong>
    </div>
  );
}
