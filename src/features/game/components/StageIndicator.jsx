import React from "react";
import { TOTAL_STAGES } from "../../../config/gameConfig.js";

export default function StageIndicator({ currentStage, totalStages = TOTAL_STAGES }) {
  return (
    <div className="game-stage-indicator">
      <span>ROUND</span>
      <strong>{currentStage}</strong>
      <span className="game-stage-divider">/</span>
      <span>{totalStages}</span>
    </div>
  );
}
