import React, { useEffect, useState } from "react";
import "./TimerMoveEffect.css";

export default function TimerMoveEffect({
  isRunning,
  roundId,
  difficulty,
  children,
}) {
  const [pos, setPos] = useState({ top: "52%", left: "50%", rotate: 0 });
  const isHard = difficulty === "상";

  useEffect(() => {
    if (!isRunning) return;
    const move = () => {
      const top = isHard
        ? 14 + Math.random() * 72
        : 28 + Math.random() * 44;
      const left = isHard
        ? 10 + Math.random() * 80
        : 22 + Math.random() * 56;
      const rotate = isHard
        ? Math.random() * 360
        : Math.random() * 16 - 8;
      setPos({ top: `${top}%`, left: `${left}%`, rotate });
    };
    // initial move
    move();
    const interval = setInterval(move, isHard ? 450 : 1100);
    return () => clearInterval(interval);
  }, [isHard, isRunning, roundId]);

  const style = {
    position: "fixed",
    top: pos.top,
    left: pos.left,
    transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
    transition: `all ${isHard ? 0.35 : 0.85}s ease`,
    pointerEvents: "none",
    zIndex: 45,
    width: "min(88vw, 680px)",
  };

  return <div style={style}>{children}</div>;
}
