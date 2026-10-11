import React, { useEffect, useRef, useState } from "react";
import {
  getShellChoice, getShellPhase, INITIAL_SLOTS, pickCorrectCup,
  SHELL_TIMINGS, swapShellSlots
} from "./shellGameLogic.js";
import "./ButtonShellGameEffect.css";

const SLOT_NAMES = ["왼쪽", "가운데", "오른쪽"];
const PHASE_LABELS = {
  preview: "정지 버튼이 숨은 컵을 기억하세요!",
  cover: "컵을 덮습니다. 위치를 기억하세요!",
  shuffle: "눈을 떼지 마세요. 컵을 섞는 중!",
  pick: "정지 버튼이 든 컵을 누르세요!"
};

/** 컵의 정체성(id)과 화면 위치(slot)를 분리해 추적하고 실제 onStop을 직접 호출합니다. */
export default function ButtonShellGameEffect({ children, isRunning, elapsedTime, roundId, onStop }) {
  const [correctCupId, setCorrectCupId] = useState(() => pickCorrectCup());
  const [slots, setSlots] = useState(() => [...INITIAL_SLOTS]);
  const [openedCups, setOpenedCups] = useState([]);
  const stoppedRef = useRef(false);
  const openedRef = useRef(new Set());
  const phase = getShellPhase(isRunning, elapsedTime);

  useEffect(() => {
    setCorrectCupId(pickCorrectCup());
    setSlots([...INITIAL_SLOTS]);
    setOpenedCups([]);
    openedRef.current = new Set();
    stoppedRef.current = false;
  }, [roundId]);

  useEffect(() => {
    if (phase !== "shuffle") return;
    const shuffle = () => setSlots((current) => swapShellSlots(current));
    shuffle();
    const timerId = window.setInterval(shuffle, SHELL_TIMINGS.swapIntervalMs);
    return () => window.clearInterval(timerId);
  }, [phase, roundId]);

  const handlePick = (cupId) => {
    if (phase !== "pick" || !isRunning || stoppedRef.current || openedRef.current.has(cupId)) return;
    const choice = getShellChoice(cupId, correctCupId, [...openedRef.current]);
    if (choice === "correct") {
      stoppedRef.current = true;
      onStop?.();
      return;
    }
    if (choice === "wrong") {
      openedRef.current.add(cupId);
      setOpenedCups((previous) => [...previous, cupId]);
    }
  };

  // 시작 전에 원래 버튼을 노출하며 이후에는 공통 정지 버튼 영역을 동일하게 사용합니다.
  if (!isRunning) return <>{children}</>;

  const canPick = phase === "pick";
  const isPreview = phase === "preview";
  const status = openedCups.length > 0 && canPick
    ? "빈 컵! 남은 " + (3 - openedCups.length) + "개 중 선택하세요."
    : PHASE_LABELS[phase];

  return (
    <section className="dmr-010-container" aria-label="정지 버튼 야바위 게임">
      <div className="dmr-010-header">
        <span className="dmr-010-heading"><span className="dmr-010-dice" aria-hidden="true">◆</span> SHELL GAME</span>
        <span className={"dmr-010-phase dmr-010-phase-" + phase}>
          {isPreview ? "기억" : phase === "cover" ? "숨김" : phase === "shuffle" ? "섞는 중" : "선택 가능"}
        </span>
      </div>
      <div className="dmr-010-stage" aria-label="세 개의 컵">
        <div className="dmr-010-track">
          {INITIAL_SLOTS.map((cupId) => {
            const slot = slots[cupId];
            const isTargetPreview = isPreview && cupId === correctCupId;
            const isOpened = openedCups.includes(cupId);
            return (
              <button
                key={cupId}
                type="button"
                className={[
                  "dmr-010-shell",
                  isTargetPreview ? "is-preview-target" : "",
                  phase === "shuffle" ? "is-shuffling" : "",
                  canPick && !isOpened ? "is-pickable" : "",
                  isOpened ? "is-opened" : ""
                ].filter(Boolean).join(" ")}
                style={{ "--slot": slot }}
                onClick={() => handlePick(cupId)}
                disabled={!canPick || isOpened}
                aria-label={SLOT_NAMES[slot] + " 컵" + (isOpened ? ", 빈 컵" : "")}
              >
                <span className="dmr-010-token" aria-hidden="true">
                  {isTargetPreview ? "STOP" : isOpened ? "EMPTY" : ""}
                </span>
                <span className="dmr-010-shell-art" aria-hidden="true">
                  <span className="dmr-010-shell-shine" />
                  <span className="dmr-010-shell-question">?</span>
                  <span className="dmr-010-shell-rim" />
                </span>
              </button>
            );
          })}
        </div>
        <div className="dmr-010-slot-indicators" aria-hidden="true">
          <span>01</span><span>02</span><span>03</span>
        </div>
      </div>
      <div className="dmr-010-footer" role="status" aria-live="polite" aria-atomic="true">
        <span className="dmr-010-status-dot" aria-hidden="true" />
        <span className="dmr-010-status-text">{status}</span>
        <span className="dmr-010-countdown">
          {canPick ? "STOP!" : (Math.max(0, SHELL_TIMINGS.shuffleEndsAt - elapsedTime).toFixed(1) + "s")}
        </span>
      </div>
    </section>
  );
}
