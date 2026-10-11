import React from "react";
import { getDemeritById } from "../registry/demeritRegistry.js";

/**
 * 활성화된 디메리트들의 시각 효과(TimerEffect, StopButtonEffect, OverlayEffect, ScreenEffect)를
 * 순차적으로 중첩하여 적용하는 엔진 컴포넌트입니다.
 */
export default function DemeritEngine({
  activeDemerits = [],
  activeDemeritDifficulties = {},
  elapsedTime,
  targetTime,
  isRunning,
  currentStage,
  roundId,
  onStop,
  renderTimer,
  renderStopButton,
  children
}) {
  // 활성화된 디메리트 모듈 목록 가져오기 (없는 모듈 무시)
  const activeModules = activeDemerits
    .map((id) => getDemeritById(id))
    .filter(Boolean);

  // 공통 전달 Props
  const effectProps = {
    elapsedTime,
    targetTime,
    isRunning,
    currentStage,
    roundId,
    onStop
  };

  const getEffectProps = (module) => {
    const difficulties = module.metadata?.difficulties || [];
    const difficultyIndex = currentStage >= 3 ? difficulties.length - 1 : 0;
    return {
      ...effectProps,
      difficulty: activeDemeritDifficulties[module.id] || difficulties[difficultyIndex]
    };
  };

  // 1. TimerEffect 순차 적용
  // DMR-006(화면 전체 이동)을 바깥 래퍼로 유지해야 회전 등 transform 효과가
  // position: fixed의 기준 좌표를 바꾸지 않습니다.
  const timerModules = [
    ...activeModules.filter((module) => module.id !== "DMR-006"),
    ...activeModules.filter((module) => module.id === "DMR-006")
  ];
  let timerContent = renderTimer ? renderTimer() : null;
  timerModules.forEach((module) => {
    const EffectComponent = module.TimerEffect;
    if (EffectComponent) {
      timerContent = (
        <EffectComponent key={`timer_${module.id}`} {...getEffectProps(module)}>
          {timerContent}
        </EffectComponent>
      );
    }
  });

  // 2. StopButtonEffect 순차 적용
  let stopButtonContent = renderStopButton ? renderStopButton() : null;
  activeModules.forEach((module) => {
    const EffectComponent = module.StopButtonEffect;
    if (EffectComponent) {
      stopButtonContent = (
        <EffectComponent key={`btn_${module.id}`} {...getEffectProps(module)}>
          {stopButtonContent}
        </EffectComponent>
      );
    }
  });

  // 3. OverlayEffect 출력 목록
  const overlays = activeModules
    .map((module) => {
      const EffectComponent = module.OverlayEffect;
      if (!EffectComponent) return null;
      return <EffectComponent key={`overlay_${module.id}`} {...getEffectProps(module)} />;
    })
    .filter(Boolean);

  // 4. ScreenEffect 순차 적용 (어플리케이션 전체 스크린 감싸기)
  let screenContent = (
    <>
      {children({ timerContent, stopButtonContent })}
      {overlays.length > 0 && <div className="setstop-overlays-container">{overlays}</div>}
    </>
  );

  activeModules.forEach((module) => {
    const EffectComponent = module.ScreenEffect;
    if (EffectComponent) {
      screenContent = (
        <EffectComponent key={`screen_${module.id}`} {...getEffectProps(module)}>
          {screenContent}
        </EffectComponent>
      );
    }
  });

  return screenContent;
}

/**
 * 결과 값 보정 함수 (DMR-005 등 modifyResult 적용)
 * @param {number} actualTime 실제 정지 시간
 * @param {string[]} activeDemerits 활성화된 디메리트 ID 목록
 * @param {Object} context { targetTime, stage, roundId }
 * @returns {number} 보정된 실제 정지 시간
 */
export function applyModifyResult(actualTime, activeDemerits = [], context = {}) {
  let modifiedTime = actualTime;

  activeDemerits.forEach((id) => {
    const mod = getDemeritById(id);
    if (mod && typeof mod.modifyResult === "function") {
      try {
        modifiedTime = mod.modifyResult(modifiedTime, context);
      } catch (err) {
        console.error(`[DemeritEngine] modifyResult error in ${id}:`, err);
      }
    }
  });

  return modifiedTime;
}
