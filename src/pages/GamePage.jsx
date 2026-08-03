import React from "react";
import PageContainer from "../components/common/PageContainer.jsx";
import GameBoard from "../features/game/components/GameBoard.jsx";
import "./GamePage.css";

export default function GamePage({
  currentStage,
  targetTime,
  roundId,
  activeDemerits,
  activeDemeritDifficulties,
  onFinishRound
}) {
  return (
    <PageContainer className="game-page-container">
      <GameBoard
        currentStage={currentStage}
        targetTime={targetTime}
        roundId={roundId}
        activeDemerits={activeDemerits}
        activeDemeritDifficulties={activeDemeritDifficulties}
        onFinishRound={onFinishRound}
      />
    </PageContainer>
  );
}
