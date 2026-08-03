import React, { useState } from "react";
import { getAllDemerits, checkConflicts } from "../../features/demerits/registry/demeritRegistry.js";

export default function DevPanel({
  currentStage,
  activeDemerits,
  onSetStage,
  onToggleDemerit,
  onResetSession,
  onSetScreen
}) {
  const [isOpen, setIsOpen] = useState(false);

  // DEV 환경이 아니면 렌더링하지 않음
  if (!import.meta.env.DEV) return null;

  const allDemerits = getAllDemerits();

  return (
    <div style={{
      position: "fixed",
      bottom: "10px",
      right: "10px",
      zIndex: 9999,
      fontFamily: "sans-serif"
    }}>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: "#0f172a",
            color: "#f59e0b",
            fontWeight: "800",
            fontSize: "0.8rem",
            padding: "0.4rem 0.8rem",
            borderRadius: "20px",
            border: "2px solid #f59e0b",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
          }}
        >
          🛠️ 개발자 패널 (DEV)
        </button>
      ) : (
        <div style={{
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: "1rem",
          borderRadius: "12px",
          border: "2px solid #38bdf8",
          width: "320px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h4 style={{ color: "#38bdf8", fontWeight: "800", margin: 0 }}>🛠️ 테스트 개발 패널</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ color: "#94a3b8", fontWeight: "800", fontSize: "1rem" }}
            >
              ✕
            </button>
          </div>

          {/* 스테이지 조작 */}
          <div style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #334155" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "0.35rem" }}>
              📍 스테이지 변경 (현재: Stage {currentStage})
            </p>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              {[1, 2, 3, 4].map((stageNum) => (
                <button
                  key={stageNum}
                  type="button"
                  onClick={() => onSetStage(stageNum)}
                  style={{
                    flex: 1,
                    padding: "0.3rem",
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    borderRadius: "4px",
                    backgroundColor: currentStage === stageNum ? "#38bdf8" : "#1e293b",
                    color: currentStage === stageNum ? "#0f172a" : "#ffffff",
                    border: "none"
                  }}
                >
                  S{stageNum}
                </button>
              ))}
            </div>
          </div>

          {/* 화면 바로가기 */}
          <div style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #334155" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "0.35rem" }}>
              🖥️ 화면 스위치
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem" }}>
              {["start", "game", "roundResult", "demeritSelect", "finalResult", "ranking"].map((scr) => (
                <button
                  key={scr}
                  type="button"
                  onClick={() => onSetScreen(scr)}
                  style={{
                    padding: "0.25rem",
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    backgroundColor: "#1e293b",
                    color: "#f8fafc",
                    borderRadius: "4px"
                  }}
                >
                  {scr}
                </button>
              ))}
            </div>
          </div>

          {/* 디메리트 강제 활성화 토글 */}
          <div style={{ marginBottom: "0.75rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "0.35rem" }}>
              ⚡ 디메리트 토글
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", maxHeight: "150px", overflowY: "auto" }}>
              {allDemerits.map((mod) => {
                const isActive = activeDemerits.includes(mod.id);
                const hasConflict = !isActive && checkConflicts(activeDemerits, mod.id);
                return (
                  <label
                    key={mod.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justify: "space-between",
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.4rem",
                      backgroundColor: isActive ? "#1e3a8a" : "#1e293b",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    <span>
                      {mod.id} ({mod.metadata.name})
                      {hasConflict && <span style={{ color: "#f59e0b", marginLeft: "0.25rem" }}>⚡충돌</span>}
                    </span>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => onToggleDemerit(mod.id)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* 세션 초기화 */}
          <button
            type="button"
            onClick={onResetSession}
            style={{
              width: "100%",
              padding: "0.4rem",
              fontSize: "0.8rem",
              fontWeight: "800",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
            }}
          >
            🔄 전체 게임 상태 초기화
          </button>
        </div>
      )}
    </div>
  );
}
