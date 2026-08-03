import React from "react";
import { getDemeritById } from "../registry/demeritRegistry.js";

export default function ActiveDemeritList({
  activeDemerits = [],
  activeDemeritDifficulties = {},
  variant = "default"
}) {
  const isHud = variant === "hud";

  if (!activeDemerits || activeDemerits.length === 0) {
    return (
      <div className={`active-demerits active-demerits-empty ${isHud ? "active-demerits-hud" : ""}`}>
        <strong>디메리트</strong>
        <span>적용 없음</span>
      </div>
    );
  }

  return (
    <div className={`active-demerits ${isHud ? "active-demerits-hud" : ""}`}>
      <p className="active-demerits-title">
        ⚡ 적용 중인 디메리트 ({activeDemerits.length})
      </p>
      <div className="active-demerits-chips">
        {activeDemerits.map((id) => {
          const mod = getDemeritById(id);
          const name = mod?.metadata?.name || id;
          const difficulty = activeDemeritDifficulties[id];
          return (
            <span key={id} className="active-demerit-chip">
              {difficulty && `[${difficulty}] `}{name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
