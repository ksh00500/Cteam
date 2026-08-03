import React from "react";
import AppButton from "../../../components/common/AppButton.jsx";

export default function StopButton({ onStop, disabled, isRunning }) {
  return (
    <AppButton
      variant="danger"
      onClick={onStop}
      disabled={disabled || !isRunning}
      className="game-stop-button"
    >
      🛑 정 지 (STOP)
    </AppButton>
  );
}
