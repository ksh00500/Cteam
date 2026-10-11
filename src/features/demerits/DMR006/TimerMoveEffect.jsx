import React, { useEffect, useState } from "react";
import "./TimerMoveEffect.css";

const INITIAL_POSITION = { top: "50%", left: "50%", rotate: 0 };

export default function TimerMoveEffect({ isRunning, roundId, difficulty, children }) {
  const [pos, setPos] = useState(INITIAL_POSITION);
  const isHard = difficulty === "상";

  useEffect(() => {
    if (!isRunning) {
      setPos(INITIAL_POSITION);
      return;
    }

    const move = () => {
      const top = isHard ? 14 + Math.random() * 72 : 28 + Math.random() * 44;
      const left = isHard ? 10 + Math.random() * 80 : 22 + Math.random() * 56;
      const rotate = isHard ? Math.random() * 360 : Math.random() * 16 - 8;
      setPos({ top: `${top}%`, left: `${left}%`, rotate });
    };

    move();
    const interval = setInterval(move, isHard ? 450 : 1100);
    return () => clearInterval(interval);
  }, [isHard, isRunning, roundId]);

  return (
    <div className="dmr-006-slot">
      <div
        className={`dmr-006-moving${isRunning ? " is-running" : ""}`}
        style={{
          "--dmr-006-top": pos.top,
          "--dmr-006-left": pos.left,
          "--dmr-006-rotation": `${pos.rotate}deg`,
          "--dmr-006-duration": isHard ? "0.35s" : "0.85s"
        }}
      >
        {children}
      </div>
    </div>
  );
}
