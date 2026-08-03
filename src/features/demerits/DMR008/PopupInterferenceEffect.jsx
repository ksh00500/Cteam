import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./PopupInterferenceEffect.css";

const MESSAGES = [
  "⚠️ 경고: 시간이 흐르는 중!",
  "🚨 방해 팝업 등장!",
  "⏱️ 목표 시간에 집중하세요!",
  "💥 이 창을 닫아야 합니다!",
  "📢 버튼 위치를 확인하세요!"
];

const COLORS = ["#FFE600", "#FF5D5D", "#00E5FF", "#A3FF00", "#FF70A6"];

export default function PopupInterferenceEffect({ children, isRunning, elapsedTime }) {
  const [popup, setPopup] = useState(null);
  const lastTickRef = useRef(-1);

  useEffect(() => {
    if (!isRunning) {
      setPopup(null);
      lastTickRef.current = -1;
    }
  }, [isRunning]);

  // 2초마다 새 팝업을 하나만 표시합니다. 이전 팝업이 남아 있으면 교체해
  // 여러 팝업이 겹쳐 닫히지 않는 것처럼 보이는 현상을 방지합니다.
  useEffect(() => {
    if (!isRunning) return;

    // 명세에 따라 9초가 되면 남아 있는 팝업까지 닫고 더 이상 생성하지 않습니다.
    if (elapsedTime >= 9.0) {
      setPopup(null);
      return;
    }

    const currentTick = Math.floor(elapsedTime / 2);
    if (currentTick <= 0 || currentTick === lastTickRef.current) return;

    lastTickRef.current = currentTick;

    const xOffset = Math.floor(Math.random() * 280) - 140;
    const yOffset = Math.floor(Math.random() * 360) - 180;

    setPopup({
      id: `${currentTick}_${Date.now()}`,
      text: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
      top: `calc(50% + ${yOffset}px)`,
      left: `calc(50% + ${xOffset}px)`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
  }, [elapsedTime, isRunning]);

  const handleClose = () => {
    setPopup(null);
  };

  const popupLayer = popup && typeof document !== "undefined"
    ? createPortal(
        <div className="dmr-008-popup-layer" aria-live="polite">
          <div
            key={popup.id}
            className="dmr-008-popup"
            role="dialog"
            aria-modal="false"
            aria-label="방해 팝업"
            style={{
              top: popup.top,
              left: popup.left,
              backgroundColor: popup.color
            }}
          >
            <div className="dmr-008-popup-header">
              <span>알림</span>
              <button
                type="button"
                className="dmr-008-close-btn"
                onClick={handleClose}
                aria-label="팝업 닫기"
              >
                ✕
              </button>
            </div>
            <div className="dmr-008-popup-body">
              <p>{popup.text}</p>
              <button
                type="button"
                className="dmr-008-action-btn"
                onClick={handleClose}
              >
                닫기
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="dmr-008-screen-wrapper">
      {children}
      {popupLayer}
    </div>
  );
}
