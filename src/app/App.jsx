import React from "react";
import { useGameSession } from "../features/game/hooks/useGameSession.js";
import StartPage from "../pages/StartPage.jsx";
import GamePage from "../pages/GamePage.jsx";
import RoundResultPage from "../pages/RoundResultPage.jsx";
import DemeritSelectPage from "../pages/DemeritSelectPage.jsx";
import FinalResultPage from "../pages/FinalResultPage.jsx";
import RankingPage from "../pages/RankingPage.jsx";
import DevPanel from "../components/common/DevPanel.jsx";

export default function App() {
  const {
    screen,
    nickname,
    currentStage,
    targetTime,
    roundId,
    results,
    activeDemerits,
    activeDemeritDifficulties,
    demeritOptions,
    isScoreSubmitted,
    startGame,
    finishRound,
    nextFromRoundResult,
    selectDemeritAndProceed,
    restartGame,
    setIsScoreSubmitted,
    devSetStage,
    devToggleDemerit,
    setScreen
  } = useGameSession();

  const latestResult = results.length > 0 ? results[results.length - 1] : null;
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const isRankingRoute = normalizedPath === "/ranking";

  const openRanking = () => {
    window.location.assign("/ranking");
  };

  if (isRankingRoute) {
    return (
      <div className="setstop-app-wrapper screen-ranking">
        <RankingPage
          onBackToStart={() => window.location.assign("/game")}
          currentNickname=""
        />
      </div>
    );
  }

  return (
    <div className={`setstop-app-wrapper screen-${screen}`}>
      {screen === "start" && (
        <StartPage
          initialNickname={nickname}
          onStartGame={startGame}
          onGoToRanking={openRanking}
        />
      )}

      {screen === "game" && (
        <GamePage
          currentStage={currentStage}
          targetTime={targetTime}
          roundId={roundId}
          activeDemerits={activeDemerits}
          activeDemeritDifficulties={activeDemeritDifficulties}
          onFinishRound={finishRound}
        />
      )}

      {screen === "roundResult" && (
        <RoundResultPage
          latestResult={latestResult}
          currentStage={currentStage}
          onNext={nextFromRoundResult}
          onRestart={restartGame}
        />
      )}

      {screen === "demeritSelect" && (
        <DemeritSelectPage
          currentStage={currentStage}
          activeDemerits={activeDemerits}
          activeDemeritDifficulties={activeDemeritDifficulties}
          demeritOptions={demeritOptions}
          onSelectDemerit={selectDemeritAndProceed}
        />
      )}

      {screen === "finalResult" && (
        <FinalResultPage
          nickname={nickname}
          results={results}
          activeDemerits={activeDemerits}
          activeDemeritDifficulties={activeDemeritDifficulties}
          isScoreSubmitted={isScoreSubmitted}
          setIsScoreSubmitted={setIsScoreSubmitted}
          onGoToRanking={openRanking}
          onRestart={restartGame}
        />
      )}

      {/* 개발자 테스팅 전용 패널 */}
      <DevPanel
        currentStage={currentStage}
        activeDemerits={activeDemerits}
        onSetStage={devSetStage}
        onToggleDemerit={devToggleDemerit}
        onResetSession={restartGame}
        onSetScreen={setScreen}
      />
    </div>
  );
}
