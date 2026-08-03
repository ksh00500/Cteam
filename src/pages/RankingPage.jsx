import React, { useState, useEffect, useCallback } from "react";
import PageContainer from "../components/common/PageContainer.jsx";
import AppButton from "../components/common/AppButton.jsx";
import LoadingMessage from "../components/common/LoadingMessage.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { getRankings } from "../api/scores.js";
import { formatPrecisionTime } from "../features/game/utils/formatTime.js";

export default function RankingPage({ onBackToStart, currentNickname = "" }) {
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const fetchRankings = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
      setError("");
    }
    const res = await getRankings(10);
    if (showLoading) setIsLoading(false);

    if (res.success) {
      setRankings(res.data || []);
      setLastUpdatedAt(new Date());
      setError("");
    } else if (showLoading) {
      setError(res.error || "랭킹 정보를 가져오지 못했습니다.");
    }
  }, []);

  useEffect(() => {
    fetchRankings(true);
    const refreshTimer = window.setInterval(() => fetchRankings(false), 3000);
    return () => window.clearInterval(refreshTimer);
  }, [fetchRankings]);

  return (
    <PageContainer className="ranking-page-container">
      <h2 className="setstop-title">🏆 명예의 전당 TOP 10</h2>
      <p className="setstop-subtitle">
        라운드 1~3을 통과한 도전자 중 점수가 높을수록 높은 순위입니다!<br />
        <span style={{ fontSize: "0.95rem", color: "#64748b" }}>
          3초마다 자동으로 갱신됩니다.
          {lastUpdatedAt && ` 마지막 갱신 ${lastUpdatedAt.toLocaleTimeString("ko-KR")}`}
        </span>
      </p>

      {isLoading && <LoadingMessage message="랭킹 목록을 불러오는 중..." />}
      {error && <ErrorMessage message={error} onRetry={fetchRankings} />}

      {!isLoading && !error && (
        <div style={{ width: "100%", marginBottom: "1rem", overflowX: "auto" }}>
          {rankings.length === 0 ? (
            <div className="setstop-card" style={{ textAlign: "center", color: "#64748b" }}>
              등록된 랭킹 정보가 없습니다. 첫 도전자가 되어보세요!
            </div>
          ) : (
            <table className="setstop-table" style={{ minWidth: "620px" }}>
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>순위</th>
                  <th style={{ width: "35%" }}>닉네임</th>
                  <th style={{ width: "25%" }}>4R 오차</th>
                  <th style={{ width: "25%" }}>점수</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item, idx) => {
                  const isCurrent = currentNickname && item.nickname === currentNickname;
                  return (
                    <tr key={item.id || idx} className={isCurrent ? "highlight" : ""}>
                      <td style={{ fontWeight: "900" }}>
                        {item.rank === 1 ? "🥇 1" : item.rank === 2 ? "🥈 2" : item.rank === 3 ? "🥉 3" : `${item.rank}위`}
                      </td>
                      <td style={{ fontWeight: "800", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {item.nickname}
                        {isCurrent && <span style={{ fontSize: "0.8rem", color: "#2563eb", marginLeft: "0.25rem" }}>(나)</span>}
                      </td>
                      <td style={{ fontFamily: "'Courier New', Courier, monospace", fontWeight: "900" }}>
                        ±{formatPrecisionTime(item.finalError)}s
                      </td>
                      <td style={{ fontWeight: "900", color: "#FF3B30", fontFamily: "'Courier New', Courier, monospace", fontSize: "1.2rem" }}>
                        {item.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div style={{ width: "100%", display: "flex", gap: "0.65rem" }}>
        <AppButton variant="secondary" onClick={() => fetchRankings(true)} disabled={isLoading} style={{ flex: 1 }}>
          🔄 새로고침
        </AppButton>
        <AppButton variant="primary" onClick={onBackToStart} style={{ flex: 1 }}>
          🏠 시작 화면으로
        </AppButton>
      </div>
    </PageContainer>
  );
}
