import React from "react";
import PageContainer from "../components/common/PageContainer.jsx";
import DemeritCard from "../features/demerits/components/DemeritCard.jsx";
import ActiveDemeritList from "../features/demerits/components/ActiveDemeritList.jsx";
import { getDemeritTierForSelection } from "../features/game/utils/selectDemeritOptions.js";
import "./DemeritSelectPage.css";

const TIER_LABELS = {
  하: "LOW",
  중: "MID",
  상: "HIGH"
};

export default function DemeritSelectPage({
  currentStage,
  activeDemerits = [],
  activeDemeritDifficulties = {},
  demeritOptions = [],
  onSelectDemerit
}) {
  const difficulty = getDemeritTierForSelection(currentStage);

  return (
    <PageContainer className={`demerit-select-container tier-screen-${TIER_LABELS[difficulty].toLowerCase()}`}>
      <div className="demerit-selection-progress" aria-label={`디메리트 선택 ${currentStage}/3`}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <span
              className={`demerit-progress-step ${
                step < currentStage ? "is-complete" : step === currentStage ? "is-active" : ""
              }`}
            >
              {step < currentStage ? "✓" : step}
            </span>
            {step < 3 && <span className={`demerit-progress-line ${step < currentStage ? "is-complete" : ""}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="demerit-select-heading">
        <span className="demerit-select-eyebrow">
          DEMERIT {String(currentStage).padStart(2, "0")} / 03
        </span>
        <h2>디메리트 선택</h2>
        <div className="demerit-tier-banner">
          <span>{TIER_LABELS[difficulty]}</span>
          <strong>{difficulty} 난이도</strong>
        </div>
        <p>
          두 가지 디메리트 중 하나를 선택하세요.<br />
          선택한 효과는 다음 라운드 {currentStage + 1}부터 누적 적용됩니다.
        </p>
      </div>

      {activeDemerits.length > 0 && (
        <div className="demerit-active-summary">
          <ActiveDemeritList
            activeDemerits={activeDemerits}
            activeDemeritDifficulties={activeDemeritDifficulties}
          />
        </div>
      )}

      <div className="demerit-augment-grid">
        {demeritOptions.map((demerit, index) => (
          <DemeritCard
            key={demerit.id}
            demerit={demerit}
            difficulty={demerit.presentedDifficulty || difficulty}
            optionIndex={index}
            onSelect={onSelectDemerit}
          />
        ))}
      </div>

      {demeritOptions.length === 0 && (
        <div className="demerit-empty-options">
          선택 가능한 {difficulty} 난이도 디메리트가 없습니다.
        </div>
      )}

      <p className="demerit-select-hint">카드를 선택하면 즉시 다음 스테이지가 시작됩니다.</p>
    </PageContainer>
  );
}
