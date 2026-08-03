import { MAX_SCORE, STAGE_CLEAR_LIMITS } from "../../../config/gameConfig.js";

const FLOATING_POINT_TOLERANCE = 1e-9;

/**
 * 절대 오차 계산
 * @param {number} actualTime 실제 정지 시간
 * @param {number} targetTime 목표 시간
 * @returns {number}
 */
export function calculateAbsoluteError(actualTime, targetTime) {
  return Math.abs(Number(actualTime) - Number(targetTime));
}

/**
 * Stage 1~3의 통과 제한을 반환합니다. Stage 4는 null입니다.
 * @param {number} stage
 * @returns {number | null}
 */
export function getStageClearLimit(stage) {
  return STAGE_CLEAR_LIMITS[Number(stage)] ?? null;
}

/**
 * 제한과 같은 오차는 통과하며, Stage 4는 항상 통과합니다.
 * @param {number} stage
 * @param {number} absoluteError
 * @returns {boolean}
 */
export function isStageCleared(stage, absoluteError) {
  const limit = getStageClearLimit(stage);
  if (limit === null) return true;

  const error = Number(absoluteError);
  return Number.isFinite(error) && error - limit <= FLOATING_POINT_TOLERANCE;
}

/**
 * 최종 랭킹 점수는 10000점에서 Stage 4 오차(ms)를 차감합니다.
 * 예: 0.042초 오차 = 9958점. 높을수록 높은 순위이며 최저점은 0점입니다.
 * @param {Array<{ stage: number, absoluteError: number }>} results
 */
export function calculateFinalScore(results) {
  const finalRound = results?.find((result) => Number(result.stage) === 4);
  const rawFinalError = Number(finalRound?.absoluteError);
  const finalError = Number.isFinite(rawFinalError) && rawFinalError >= 0
    ? rawFinalError
    : 0;
  const normalizedFinalError = Number(finalError.toFixed(6));

  return {
    finalError: normalizedFinalError,
    score: Math.max(0, MAX_SCORE - Math.round(normalizedFinalError * 1000))
  };
}
