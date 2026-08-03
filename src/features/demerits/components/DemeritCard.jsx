import React from "react";

const TIER_ICONS = {
  하: "✦",
  중: "✦✦",
  상: "✦✦✦"
};

const TIER_CLASS_NAMES = {
  하: "tier-low",
  중: "tier-mid",
  상: "tier-high"
};

export default function DemeritCard({
  demerit,
  difficulty,
  optionIndex = 0,
  onSelect,
  disabled = false,
  conflictReason = ""
}) {
  if (!demerit) return null;

  const { id, metadata } = demerit;
  const { name, description } = metadata || {};
  const tierClassName = TIER_CLASS_NAMES[difficulty] || "tier-low";

  return (
    <button
      type="button"
      className={`demerit-augment-card ${tierClassName}`}
      onClick={() => onSelect?.(id)}
      disabled={disabled || Boolean(conflictReason)}
      aria-label={`${name}, ${difficulty} 난이도 선택`}
    >
      <span className="demerit-card-frame" aria-hidden="true" />

      <span className="demerit-card-topline">
        <span className="demerit-card-option">OPTION {String(optionIndex + 1).padStart(2, "0")}</span>
        <span className="demerit-card-id">{id}</span>
      </span>

      <span className="demerit-card-emblem" aria-hidden="true">
        <span>{TIER_ICONS[difficulty] || "✦"}</span>
      </span>

      <span className="demerit-card-tier">{difficulty} 난이도 디메리트</span>
      <strong className="demerit-card-name">{name}</strong>
      <span className="demerit-card-description">{description}</span>

      {conflictReason && (
        <span className="demerit-card-conflict">⚠️ {conflictReason}</span>
      )}

      <span className="demerit-card-select">
        이 디메리트 선택 <span aria-hidden="true">→</span>
      </span>
    </button>
  );
}
