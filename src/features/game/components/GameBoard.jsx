import React, { useEffect } from "react";
import StageIndicator from "./StageIndicator.jsx";
import TargetTime from "./TargetTime.jsx";
import TimerDisplay from "./TimerDisplay.jsx";
import StopButton from "./StopButton.jsx";
import AppButton from "../../../components/common/AppButton.jsx";
import ActiveDemeritList from "../../demerits/components/ActiveDemeritList.jsx";
import DemeritEngine from "../../demerits/components/DemeritEngine.jsx";
import { useTimerGame } from "../hooks/useTimerGame.js";

export default function GameBoard({
  currentStage,
  targetTime,
  roundId,
  activeDemerits,
  activeDemeritDifficulties,
  onFinishRound
}) {
  const {
    elapsedTime,
    isRunning,
    hasStarted,
    isStopped,
    startTimer,
    stopTimer,
    resetTimer
  } = useTimerGame();

  useEffect(() => {
    resetTimer();
  }, [roundId, resetTimer]);

  const inversionActive = isRunning && activeDemerits.includes("DMR-009");
  const inversionDifficulty = activeDemeritDifficulties["DMR-009"] || "중";

  useEffect(() => {
    const horizontalClass = "setstop-screen-flip-horizontal";
    const verticalClass = "setstop-screen-flip-vertical";
    document.body.classList.remove(horizontalClass, verticalClass);

    if (inversionActive) {
      document.body.classList.add(
        inversionDifficulty === "상" ? verticalClass : horizontalClass
      );
    }

    return () => {
      document.body.classList.remove(horizontalClass, verticalClass);
    };
  }, [inversionActive, inversionDifficulty]);

  const handleStop = () => {
    if (!isRunning || isStopped) return;
    const finalElapsed = stopTimer();
    if (finalElapsed !== null && finalElapsed !== undefined) {
      onFinishRound(finalElapsed);
    }
  };

  return (
    <div className={`game-arena ${isRunning ? "is-running" : "is-ready"}`}>
      <header className="game-hud">
        <div className="game-hud-left">
          <StageIndicator currentStage={currentStage} />
        </div>
        <div className="game-hud-right">
          <ActiveDemeritList
            variant="hud"
            activeDemerits={activeDemerits}
            activeDemeritDifficulties={activeDemeritDifficulties}
          />
        </div>
      </header>

      <main className="game-playfield">
        <TargetTime targetTime={targetTime} />

        <DemeritEngine
          activeDemerits={activeDemerits}
          activeDemeritDifficulties={activeDemeritDifficulties}
          elapsedTime={elapsedTime}
          targetTime={targetTime}
          isRunning={isRunning}
          currentStage={currentStage}
          roundId={roundId}
          onStop={handleStop}
          renderTimer={() => (
            <TimerDisplay elapsedTime={elapsedTime} isRunning={isRunning} />
          )}
          renderStopButton={() => (
            <StopButton
              onStop={handleStop}
              disabled={!isRunning || isStopped}
              isRunning={isRunning}
            />
          )}
        >
          {({ timerContent, stopButtonContent }) => (
            <div className="game-interaction-layer">
              <div className="game-timer-zone">{timerContent}</div>
              <div className="game-controls">
                {!hasStarted && (
                  <AppButton
                    variant="success"
                    className="game-start-button"
                    onClick={startTimer}
                    disabled={hasStarted}
                  >
                    ▶️ 타이머 시작
                  </AppButton>
                )}
                {hasStarted && stopButtonContent}
              </div>
            </div>
          )}
        </DemeritEngine>
      </main>
    </div>
  );
}
