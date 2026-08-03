import React, { useState } from "react";
import PageContainer from "../components/common/PageContainer.jsx";
import AppButton from "../components/common/AppButton.jsx";
import { NICKNAME_MAX_LENGTH } from "../config/gameConfig.js";

export default function StartPage({
  initialNickname = "",
  onStartGame,
  onGoToRanking
}) {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState("");

  const handleStart = () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError("닉네임을 입력해 주세요!");
      return;
    }
    if (trimmed.length > NICKNAME_MAX_LENGTH) {
      setError(`닉네임은 최대 ${NICKNAME_MAX_LENGTH}자까지 가능합니다.`);
      return;
    }
    setError("");
    onStartGame(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleStart();
  };

  return (
    <PageContainer>
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "1rem",
        width: "100%",
        maxHeight: "160px"
      }}>
        <img
          src="/images/logo.svg"
          alt="Set Stop!"
          style={{ maxWidth: "360px", width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>

      <p className="setstop-subtitle">
        축제 부스 전용 타이머 맞추기 게임!<br />
        제시된 목표 시간에 정확히 맞춰 타이머를 멈추세요.<br />
        라운드가 진행될수록 방해 디메리트가 누적됩니다!
      </p>

      <div className="setstop-card" style={{ marginBottom: "1.25rem" }}>
        <label
          htmlFor="nickname-input"
          style={{ display: "block", fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.6rem", color: "#0f172a" }}
        >
          👤 플레이어 닉네임
        </label>
        <input
          id="nickname-input"
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="닉네임을 입력하세요 (최대 12자)"
          maxLength={NICKNAME_MAX_LENGTH}
          className={`setstop-input ${error ? "setstop-input-error" : ""}`}
        />
        {error && <p className="setstop-error-text">⚠️ {error}</p>}
      </div>

      <div style={{ width: "100%", marginBottom: "0.75rem", textAlign: "center" }}>
        <button
          type="button"
          onClick={handleStart}
          className="setstop-img-btn"
          style={{ width: "100%", maxWidth: "380px" }}
          aria-label="게임 시작하기"
        >
          <img src="/images/start-button.svg" alt="게임 시작하기" style={{ width: "100%", height: "auto" }} />
        </button>
      </div>

      <AppButton variant="secondary" onClick={onGoToRanking} style={{ width: "100%" }}>
        🏆 랭킹 확인하기
      </AppButton>
    </PageContainer>
  );
}
