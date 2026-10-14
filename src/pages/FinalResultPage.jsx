import React, { useEffect, useRef, useState } from "react";
import PageContainer from "../components/common/PageContainer.jsx";
import AppButton from "../components/common/AppButton.jsx";
import ActiveDemeritList from "../features/demerits/components/ActiveDemeritList.jsx";
import { formatPrecisionTime } from "../features/game/utils/formatTime.js";
import {
  calculateFinalScore,
  getStageClearLimit,
  isStageCleared
} from "../features/game/utils/calculateScore.js";
import { submitScore } from "../api/scores.js";
import LoadingMessage from "../components/common/LoadingMessage.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

export default function FinalResultPage({
  nickname,
  results = [],
  activeDemerits = [],
  activeDemeritDifficulties = {},
  isScoreSubmitted,
  setIsScoreSubmitted,
  onGoToRanking,
  onRestart
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const submitStartedRef = useRef(false);

  const { finalError, score } = calculateFinalScore(results);
  const completedStages = results.length;

  const handleSubmitScore = async () => {
    if (isScoreSubmitted || isSubmitting || submitStartedRef.current) return;
    submitStartedRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    const res = await submitScore({
      nickname,
      score,
      stage: completedStages,
      finalError,
      selectedDemerits: activeDemerits
    });
    setIsSubmitting(false);

    if (res.success) {
      const savedScore = res.data;
      setIsScoreSubmitted(true);
      setSubmittedMessage(`🎉 점수가 자동 등록되었습니다. 현재 ${savedScore.rank}위입니다!`);
    } else {
      submitStartedRef.current = false;
      setSubmitError(res.error || "점수 자동 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  useEffect(() => {
    handleSubmitScore();
  }, []);

  return (
    <>
      <PageContainer>
        <h2 className="setstop-title">🏆 최종 게임 결과</h2>
        <p className="setstop-subtitle">
          <strong style={{ color: "#2563eb", fontSize: "1.2rem" }}>{nickname}</strong> 님의 도전 기록입니다!
        </p>

        <div className="setstop-card" style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          textAlign: "center",
          padding: "1.5rem",
          marginBottom: "1.25rem",
          border: "3px solid #000000",
          boxShadow: "6px 6px 0px #FF3B30"
        }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.95rem", color: "#9CA3AF", fontWeight: "900" }}>완료 라운드</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#38BDF8" }}>{completedStages} / 4</div>
            </div>
            <div>
              <span style={{ fontSize: "0.95rem", color: "#9CA3AF", fontWeight: "900" }}>4라운드 절대 오차</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#FACC15" }}>±{formatPrecisionTime(finalError)}s</div>
            </div>
          </div>

          <div style={{ borderTop: "2px dashed #4B5563", paddingTop: "1rem", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "1rem", color: "#D1D5DB", fontWeight: "900" }}>최종 랭킹 점수</span>
            <div style={{ fontSize: "4rem", fontWeight: "900", color: "#22C55E", fontFamily: "'Courier New', Courier, monospace" }}>
              {score} <span style={{ fontSize: "1.25rem" }}>점</span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#9CA3AF", marginTop: "0.35rem", fontWeight: "700" }}>
              💡 10000점에서 4라운드 오차(ms)를 뺀 점수이며, <strong>높을수록 높은 순위</strong>입니다.
            </p>
          </div>
        </div>

        <div style={{ width: "100%", marginBottom: "1rem", overflowX: "auto" }}>
          <h4 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.6rem", color: "#0f172a" }}>📊 라운드별 세부 기록</h4>
          <table className="setstop-table" style={{ minWidth: "600px" }}>
            <thead><tr><th>라운드</th><th>실제 시간</th><th>절대 오차</th><th>판정</th></tr></thead>
            <tbody>
              {results.map((res, index) => {
                const limit = res.clearLimit ?? getStageClearLimit(res.stage);
                const cleared = res.cleared ?? isStageCleared(res.stage, res.absoluteError);
                const isFinal = Number(res.stage) === 4;
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: "800" }}>R{res.stage}</td>
                    <td>{formatPrecisionTime(res.actualTime)}s</td>
                    <td style={{ fontWeight: "800", color: "#2563eb" }}>
                      ±{formatPrecisionTime(res.absoluteError)}s
                      {!isFinal && <div style={{ fontSize: "0.75rem", color: "#64748b" }}>제한 ±{formatPrecisionTime(limit)}s</div>}
                    </td>
                    <td style={{ fontWeight: "900", color: isFinal ? "#2563EB" : cleared ? "#15803D" : "#B91C1C" }}>
                      {isFinal ? "랭킹" : cleared ? "통과" : "탈락"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ width: "100%", marginBottom: "1rem" }}>
          <h4 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.45rem", color: "#0f172a" }}>⚡ 적용된 디메리트</h4>
          <ActiveDemeritList activeDemerits={activeDemerits} activeDemeritDifficulties={activeDemeritDifficulties} />
        </div>

        {isSubmitting && <LoadingMessage message="점수를 랭킹에 자동 등록 중입니다..." />}
        {submitError && <ErrorMessage message={submitError} onRetry={handleSubmitScore} />}
        {submittedMessage && (
          <div className="setstop-card" style={{ backgroundColor: "#dcfce7", borderColor: "#86efac", textAlign: "center", padding: "0.9rem", marginBottom: "1rem" }}>
            <p style={{ color: "#15803d", fontWeight: "800", fontSize: "1rem" }}>{submittedMessage}</p>
          </div>
        )}

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <AppButton variant="primary" onClick={onGoToRanking} style={{ width: "100%" }}>🏆 전체 랭킹 확인하기</AppButton>
          <AppButton variant="secondary" onClick={onRestart} style={{ width: "100%" }}>🔄 처음부터 다시 도전하기</AppButton>
        </div>
      </PageContainer>
    </>
  );
}
