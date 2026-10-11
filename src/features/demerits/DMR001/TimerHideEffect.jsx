import React from "react";
import "./TimerHideEffect.css";

export default function TimerHideEffect({ elapsedTime, isRunning, children }) {
  // 타이머를 숨기더라도 원래 영역은 유지해 버튼 위치가 변하지 않도록 합니다.
  const opacity = !isRunning || elapsedTime < 2.5
    ? 1
    : elapsedTime < 3
      ? 1 - (elapsedTime - 2.5) / 0.5
      : 0;
  const isHidden = isRunning && elapsedTime >= 3;

  return (
    <div className="dmr-001-wrapper">
      <div
        className="dmr-001-content"
        style={{ opacity, transition: "opacity 0.1s linear" }}
        aria-hidden={isHidden}
      >
        {children}
      </div>
      {isHidden && (
        <div className="dmr-001-hidden-overlay">
          <div className="dmr-001-hidden-badge">🙈 타이머 숨김 (3초 경과)</div>
        </div>
      )}
    </div>
  );
}
