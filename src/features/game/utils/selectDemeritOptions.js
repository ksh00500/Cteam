import { getAllDemerits, checkConflicts } from "../../demerits/registry/demeritRegistry.js";
import {
  DEMERIT_DIFFICULTY_BY_SELECTION,
  DEMERIT_OPTION_COUNT
} from "../../../config/gameConfig.js";

const DIFFICULTY_ALIASES = {
  하: "하",
  중: "중",
  상: "상",
  보통: "중",
  어려움: "상"
};

export function normalizeDemeritDifficulty(difficulty) {
  return DIFFICULTY_ALIASES[difficulty] || difficulty;
}

export function getDemeritTierForSelection(selectionRound) {
  const parsedRound = Number(selectionRound);
  const safeRound = Number.isFinite(parsedRound) ? Math.trunc(parsedRound) : 1;
  const index = Math.min(
    Math.max(safeRound - 1, 0),
    DEMERIT_DIFFICULTY_BY_SELECTION.length - 1
  );
  return DEMERIT_DIFFICULTY_BY_SELECTION[index];
}

function shuffle(items, random) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomValue = Math.min(Math.max(random(), 0), 0.9999999999999999);
    const swapIndex = Math.floor(randomValue * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

/**
 * 선택 차수에 맞는 난이도 풀에서 활성/충돌 항목을 제외하고 2개를 무작위로 반환합니다.
 * @param {string[]} activeDemeritIds 현재 선택된 디메리트 ID 목록
 * @param {number} selectionRound 선택 차수 (1: 하, 2: 중, 3: 상)
 * @param {number} count 제시할 옵션 개수
 * @param {() => number} random 테스트 가능한 난수 함수
 */
export function selectDemeritOptions(
  activeDemeritIds = [],
  selectionRound = 1,
  count = DEMERIT_OPTION_COUNT,
  random = Math.random
) {
  const tier = getDemeritTierForSelection(selectionRound);

  const available = getAllDemerits().filter((demerit) => {
    if (activeDemeritIds.includes(demerit.id)) return false;
    if (checkConflicts(activeDemeritIds, demerit.id)) return false;

    const difficulties = demerit.metadata?.difficulties || [];
    return difficulties.some(
      (difficulty) => normalizeDemeritDifficulty(difficulty) === tier
    );
  });

  return shuffle(available, random)
    .slice(0, count)
    .map((demerit) => ({ ...demerit, presentedDifficulty: tier }));
}
