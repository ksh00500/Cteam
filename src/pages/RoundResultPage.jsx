import React from "react";
import PageContainer from "../components/common/PageContainer.jsx";
import AppButton from "../components/common/AppButton.jsx";
import { formatPrecisionTime } from "../features/game/utils/formatTime.js";
import {
  getStageClearLimit,
  isStageCleared
} from "../features/game/utils/calculateScore.js";

export default function RoundResultPage({
  latestResult,
  currentStage,
  onNext,
  onRestart
}) {
  if (!latestResult) {
    return (
      <PageContainer>
        <p>라운드 결과를 찾을 수 없습니다.</p>
        <AppButton onClick={onRestart} variant="secondary">시작 화면으로</AppButton>
      </PageContainer>
    );
  }

  const { targetTime, actualTime, absoluteError } = latestResult;
  const isFinalRound = currentStage === 4;
  const clearLimit = latestResult.clearLimit ?? getStageClearLimit(currentStage);
  const cleared = isFinalRound
    ? true
    : latestResult.cleared ?? isStageCleared(currentStage, absoluteError);

  const resultColor = isFinalRound ? "#2563EB" : cleared ? "#15803D" : "#B91C1C";
  const resultBackground = isFinalRound ? "#DBEAFE" : cleared ? "#DCFCE7" : "#FEE2E2";

  return (
    <PageContainer>
      <h2 className="setstop-title">
        {isFinalRound ? "🏁 최종 라운드 완료" : cleared ? `✅ 라운드 ${currentStage} 통과` : `❌ 라운드 ${currentStage} 탈락`}
      </h2>
      <p className="setstop-subtitle">
        {isFinalRound
          ? "4라운드는 탈락 제한 없이 절대 오차로 최종 순위를 기록합니다."
          : `통과 제한은 ±${formatPrecisionTime(clearLimit)}초입니다.`}
      </p>

      <div className="setstop-card" style={{ textAlign: "center", padding: "1.75rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-around", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "800" }}>목표 시간</span>
            <div style={{ fontSize: "1.65rem", fontWeight: "900", color: "#0f172a" }}>
              {formatPrecisionTime(targetTime)}초
            </div>
          </div>
          {!isFinalRound && (
            <div>
              <span style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "800" }}>통과 제한</span>
              <div style={{ fontSize: "1.65rem", fontWeight: "900", color: "#D97706" }}>
                ±{formatPrecisionTime(clearLimit)}초
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "1rem", color: "#6B7280", fontWeight: "900" }}>실제 정지 시간</span>
          <div style={{ fontSize: "3.25rem", fontWeight: "900", color: "#FF3B30", fontFamily: "'Courier New', Courier, monospace" }}>
            {formatPrecisionTime(actualTime)}초
          </div>
        </div>

        <div style={{
          backgroundColor: resultBackground,
          border: "3px solid #000000",
          boxShadow: "3px 3px 0px #000000",
          borderRadius: "var(--radius-md)",
          padding: "1.15rem"
        }}>
          <span style={{ fontSize: "1rem", fontWeight: "900", color: "#000000" }}>
            {isFinalRound ? "🏆 최종 랭킹 오차" : cleared ? "통과" : "제한 초과"}
          </span>
          <div style={{
            fontSize: "3.6rem",
            fontWeight: "900",
            color: resultColor,
            fontFamily: "'Courier New', Courier, monospace"
          }}>
            ±{formatPrecisionTime(absoluteError)}초
          </div>
          <p style={{ fontSize: "1rem", fontWeight: "900", marginTop: "0.35rem", color: "#000000" }}>
            {isFinalRound
              ? "이 오차가 작을수록 최종 순위가 높습니다."
              : cleared
                ? `제한 안에 들어왔습니다. 라운드 ${currentStage + 1}로 진출합니다!`
                : `±${formatPrecisionTime(clearLimit)}초 제한을 넘어서 도전이 종료됩니다.`}
          </p>
        </div>
      </div>

      {!cleared ? (
        <AppButton variant="danger" onClick={onRestart} style={{ width: "100%", minHeight: "64px", fontSize: "1.25rem" }}>
          🔄 처음부터 다시 도전하기
        </AppButton>
      ) : (
        <AppButton variant="primary" onClick={onNext} style={{ width: "100%", minHeight: "64px", fontSize: "1.3rem" }}>
          {isFinalRound ? "최종 결과 확인하기 ▶" : "디메리트 선택으로 이동 ▶"}
        </AppButton>
      )}
    </PageContainer>
  );
}
