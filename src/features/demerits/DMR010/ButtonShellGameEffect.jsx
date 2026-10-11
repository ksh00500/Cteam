// src/features/demerits/DMR010/ButtonShellGameEffect.jsx

import React, { useState, useEffect, useRef } from "react";
import "./ButtonShellGameEffect.css";

export default function ButtonShellGameEffect({ children, isRunning, elapsedTime }) {
  const [correctCup, setCorrectCup] = useState(0);
  const [removedCups, setRemovedCups] = useState([]);
  
  // 각 컵(0, 1, 2)이 현재 위치한 슬롯 번호 (0:왼쪽, 1:중앙, 2:오른쪽)
  const [cupSlots, setCupSlots] = useState([0, 1, 2]);

  const isInitializedRef = useRef(false);
  const hiddenButtonRef = useRef(null);

  // 라운드 시작 시 초기화 및 정답 컵 무작위 지정
  useEffect(() => {
    if (isRunning && !isInitializedRef.current) {
      const randomIdx = Math.floor(Math.random() * 3);
      setCorrectCup(randomIdx);
      setRemovedCups([]);
      setCupSlots([0, 1, 2]); // 위치 초기화
      isInitializedRef.current = true;
    } else if (!isRunning) {
      isInitializedRef.current = false;
      setRemovedCups([]);
      setCupSlots([0, 1, 2]);
    }
  }, [isRunning]);

  // 2초~5초 구간: 랜덤 교차(Swap) 타이머 실행
  useEffect(() => {
    if (!isRunning) return;

    // 2.0초 ~ 5.0초 야바위 구간
    if (elapsedTime >= 2.0 && elapsedTime < 5.0) {
      const interval = setInterval(() => {
        setCupSlots((prevSlots) => {
          const newSlots = [...prevSlots];
          
          // 0, 1, 2 중 무작위 2개 컵 선택 후 슬롯 위치 교환
          const cupA = Math.floor(Math.random() * 3);
          let cupB = Math.floor(Math.random() * 3);
          while (cupB === cupA) {
            cupB = Math.floor(Math.random() * 3);
          }

          const temp = newSlots[cupA];
          newSlots[cupA] = newSlots[cupB];
          newSlots[cupB] = temp;

          return newSlots;
        });
      }, 350); // 0.35초마다 무작위 위치 섞기

      return () => clearInterval(interval);
    }
  }, [isRunning, elapsedTime >= 2.0 && elapsedTime < 5.0]);

  // 타임라인 단계 계산
  const isNormalPhase = isRunning && elapsedTime < 1.0;                        // 0 ~ 1초: 정지 버튼 노출
  const isCovering    = isRunning && elapsedTime >= 1.0 && elapsedTime < 2.0;  // 1 ~ 2초: 컵으로 가리기
  const isShuffling   = isRunning && elapsedTime >= 2.0 && elapsedTime < 5.0;  // 2 ~ 5초: 무작위 야바위
  const isPickPhase   = isRunning && elapsedTime >= 5.0;                       // 5초 이후: 정답 컵 선택

  // 상태 안내 메시지
  let statusText = "";
  if (isNormalPhase) {
    statusText = "⏹️ 정지 버튼 위치를 확인하세요! (0~1초)";
  } else if (isCovering) {
    statusText = "🥤 컵이 정지 버튼을 가립니다! (1~2초)";
  } else if (isShuffling) {
    statusText = "🔀 무작위로 야바위 섞는 중... (2~5초)";
  } else {
    statusText = "🎯 정지 버튼이 든 컵을 찾으세요!";
  }

  const handleCupClick = (index, e) => {
    if (!isRunning || !isPickPhase) return;

    // 1. 정지 버튼이 숨겨진 정답 컵 클릭
    if (index === correctCup) {
      if (React.isValidElement(children) && typeof children.props.onClick === "function") {
        children.props.onClick(e);
      }

      if (hiddenButtonRef.current) {
        const targetBtn = hiddenButtonRef.current.querySelector("button") || hiddenButtonRef.current.firstElementChild;
        if (targetBtn && typeof targetBtn.click === "function") {
          targetBtn.click();
        }
      }
    } 
    // 2. 빈 컵 클릭 (컵 제거)
    else {
      if (!removedCups.includes(index)) {
        setRemovedCups((prev) => [...prev, index]);
      }
    }
  };

  if (!isRunning) {
    return <>{children}</>;
  }

  return (
    <div className="dmr-010-container">
      <div className="dmr-010-status-badge">
        {statusText}
      </div>

      {/* 0 ~ 1초: 정지 버튼 실제 위치 노출 */}
      {isNormalPhase ? (
        <div className="dmr-010-normal-preview">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="dmr-010-slot">
              {idx === correctCup ? children : <div className="dmr-010-empty-slot" />}
            </div>
          ))}
        </div>
      ) : (
        /* 1초 이후: 컵 오버레이 동작 */
        <>
          {[0, 1, 2].map((cupIdx) => {
            const isRemoved = removedCups.includes(cupIdx);
            const currentSlot = cupSlots[cupIdx];

            // 컵/간격 크기가 반응형으로 변해도 이동 거리가 슬롯에 맞도록 계산합니다.
            const slotDiff = currentSlot - cupIdx;
            const step = "var(--dmr-010-step)";
            const xOffset = slotDiff === 2
              ? `calc(${step} + ${step})`
              : slotDiff === 1
                ? step
                : slotDiff === -1
                  ? `calc(0px - ${step})`
                  : slotDiff === -2
                    ? `calc(0px - ${step} - ${step})`
                    : "0px";
            
            // 섞이는 도중에는 부드러운 입체감을 위해 살짝 Y축 이동 효과 부여
            const yOffset = isShuffling && currentSlot % 2 === 1 ? -18 : 0;

            return (
              <div
                key={cupIdx}
                className={`dmr-010-cup ${isCovering ? "covering" : ""} ${
                  isRemoved ? "removed" : ""
                }`}
                style={{
                  // 무작위 슬롯 위치에 맞게 실시간 위치 이동
                  transform: isCovering
                    ? undefined
                    : `translate(${xOffset}, ${yOffset}px)`,
                }}
                onClick={(e) => handleCupClick(cupIdx, e)}
              >
                <span style={{ fontSize: "3rem" }}>🥤</span>
              </div>
            );
          })}

          {/* 원본 정지 버튼 이벤트 연동용 (투명) */}
          <div
            ref={hiddenButtonRef}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              overflow: "hidden",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
