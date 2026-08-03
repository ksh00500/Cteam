import React from "react";
import { getRoundModifier } from "./index.js";

export default function TimeAdjustmentEffect({ children, elapsedTime, isRunning, roundId }) {
  // index.js에서 만든 해시 함수를 가져와 동일한 조작 값을 얻음
  const modifier = getRoundModifier(roundId);
  
  // 명세에 따라 타이머가 5초에 도달한 뒤 보정값을 공개합니다.
  const isVisible = isRunning && elapsedTime >= 5.0;
  
  const signText = modifier > 0 ? "+" : "";
  const displayValue = `${signText}${modifier.toFixed(1)}s`;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {isVisible && (
        <div style={{
          position: "absolute",
          top: "-50px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: modifier > 0 ? "#FF3B30" : "#2563EB", // 플러스는 빨강, 마이너스는 파랑
          color: "#FFFFFF",
          padding: "0.4rem 1rem",
          borderRadius: "var(--radius-md)",
          fontWeight: "900",
          fontSize: "1.25rem",
          border: "3px solid #000000",
          boxShadow: "3px 3px 0px #000000",
          zIndex: 10,
        }}>
          최종 시간 {displayValue}
        </div>
      )}
      
      {/* 기존 타이머 컴포넌트 렌더링 */}
      {children}
    </div>
  );
}
