import { useState, useCallback } from "react";
import { TOTAL_STAGES, DEFAULT_TARGET_TIME } from "../../../config/gameConfig.js";
import {
  calculateAbsoluteError,
  getStageClearLimit,
  isStageCleared
} from "../utils/calculateScore.js";
import { applyModifyResult } from "../../demerits/components/DemeritEngine.jsx";
import {
  getDemeritTierForSelection,
  selectDemeritOptions
} from "../utils/selectDemeritOptions.js";

export function useGameSession() {
  const [screen, setScreen] = useState("start"); // "start", "game", "roundResult", "demeritSelect", "finalResult", "ranking"
  const [nickname, setNicknameState] = useState("");
  const [currentStage, setCurrentStage] = useState(1);
  const [targetTime, setTargetTime] = useState(DEFAULT_TARGET_TIME);
  const [roundId, setRoundId] = useState(`round_1_${Date.now()}`);
  const [results, setResults] = useState([]); // [{ stage, targetTime, actualTime, absoluteError }]
  const [activeDemerits, setActiveDemerits] = useState([]); // ["DMR-001", ...]
  const [activeDemeritDifficulties, setActiveDemeritDifficulties] = useState({});
  const [demeritOptions, setDemeritOptions] = useState([]); // 현재 선택 단계에 제시할 디메리트 2개
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);

  // 닉네임 변경
  const setNickname = useCallback((name) => {
    setNicknameState(name);
  }, []);

  // 게임 처음부터 시작
  const startGame = useCallback((inputNickname) => {
    const validNickname = (inputNickname || nickname || "").trim();
    setNicknameState(validNickname);
    setCurrentStage(1);
    setTargetTime(DEFAULT_TARGET_TIME);
    setRoundId(`round_1_${Date.now()}`);
    setResults([]);
    setActiveDemerits([]);
    setActiveDemeritDifficulties({});
    setDemeritOptions([]);
    setIsScoreSubmitted(false);
    setScreen("game");
  }, [nickname]);

  // 라운드 정지 및 결과 저장
  const finishRound = useCallback((rawActualTime) => {
    // modifyResult 디메리트 보정 적용
    const modifiedActualTime = applyModifyResult(rawActualTime, activeDemerits, {
      targetTime,
      stage: currentStage,
      roundId
    });

    const absoluteError = calculateAbsoluteError(modifiedActualTime, targetTime);
    const clearLimit = getStageClearLimit(currentStage);
    const cleared = isStageCleared(currentStage, absoluteError);

    const roundRecord = {
      stage: currentStage,
      targetTime,
      actualTime: modifiedActualTime,
      absoluteError,
      clearLimit,
      cleared
    };

    setResults((prev) => [...prev, roundRecord]);
    setScreen("roundResult");
  }, [activeDemerits, currentStage, roundId, targetTime]);

  // 라운드 결과 확인 후 다음으로 이동
  const nextFromRoundResult = useCallback(() => {
    const latestResult = results[results.length - 1];
    if (currentStage < TOTAL_STAGES && latestResult && !latestResult.cleared) {
      return;
    }

    if (currentStage < TOTAL_STAGES) {
      // 다음 스테이지로 가기 전 디메리트 선택 화면
      const options = selectDemeritOptions(activeDemerits, currentStage);
      setDemeritOptions(options);
      setScreen("demeritSelect");
    } else {
      // 4스테이지 완료 후 최종 결과 화면
      setScreen("finalResult");
    }
  }, [activeDemerits, currentStage, results]);

  // 디메리트 선택 후 다음 스테이지 게임으로 이동
  const selectDemeritAndProceed = useCallback((demeritId) => {
    if (demeritId && !activeDemerits.includes(demeritId)) {
      setActiveDemerits((prev) => (
        prev.includes(demeritId) ? prev : [...prev, demeritId]
      ));
      setActiveDemeritDifficulties((prev) => ({
        ...prev,
        [demeritId]: getDemeritTierForSelection(currentStage)
      }));
    }

    const nextStage = currentStage + 1;
    setCurrentStage(nextStage);
    setRoundId(`round_${nextStage}_${Date.now()}`);
    setScreen("game");
  }, [activeDemerits, currentStage]);

  // 랭킹 화면 이동
  const goToRanking = useCallback(() => {
    setScreen("ranking");
  }, []);

  // 시작 화면 이동
  const restartGame = useCallback(() => {
    setScreen("start");
  }, []);

  // 개발자 패널용 세션 조작 기능
  const devSetStage = useCallback((stageNum) => {
    setCurrentStage(stageNum);
    setRoundId(`round_${stageNum}_${Date.now()}`);
  }, []);

  const devToggleDemerit = useCallback((demeritId) => {
    const isActive = activeDemerits.includes(demeritId);
    setActiveDemerits((prev) => (
      isActive ? prev.filter((id) => id !== demeritId) : [...prev, demeritId]
    ));
    setActiveDemeritDifficulties((difficulties) => {
      if (!isActive) {
        return {
          ...difficulties,
          [demeritId]: getDemeritTierForSelection(Math.min(currentStage, 3))
        };
      }

      const next = { ...difficulties };
      delete next[demeritId];
      return next;
    });
  }, [activeDemerits, currentStage]);

  return {
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
    setNickname,
    startGame,
    finishRound,
    nextFromRoundResult,
    selectDemeritAndProceed,
    goToRanking,
    restartGame,
    setIsScoreSubmitted,
    // Dev Actions
    devSetStage,
    devToggleDemerit,
    setScreen
  };
}
