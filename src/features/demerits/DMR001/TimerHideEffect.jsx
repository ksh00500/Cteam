import React from "react";
import "./TimerHideEffect.css";

export default function TimerHideEffect({
  elapsedTime,
  isRunning,
  roundId,
  children
}) {
  // 2.5초까지 표시하고 3초까지 서서히 숨깁니다.
  const getOpacity = (time) => {
    if (time < 2.5) return 1;
    if (time < 3) return 1 - (time - 2.5) / 0.5;
    return 0;
  };

  if (elapsedTime >= 3) {
    return (
      <div style={{ textAlign: "center", padding: "1rem 0" }}>
        <div className="dmr-001-hidden-badge">
          🙈 타이머 숨김 (3초 경과)
        </div>
      </div>
    );
  }

  const opacity = getOpacity(elapsedTime);

  return (
    <div style={{ opacity, transition: "opacity 0.1s linear" }}>
      {children}
    </div>
  );
}
