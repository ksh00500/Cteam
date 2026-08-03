export const TOTAL_STAGES = 4;
export const DEFAULT_TARGET_TIME = 10.00; // 초 단위 기본 목표 시간

export const DEMERIT_OPTION_COUNT = 2;
export const DEMERIT_SELECT_COUNT_PER_ROUND = 1;
export const MAX_ACTIVE_DEMERITS = 3;

// 각 디메리트 선택 단계의 난이도: Stage 1 종료 후 하, Stage 2 종료 후 중, Stage 3 종료 후 상
export const DEMERIT_DIFFICULTY_BY_SELECTION = ["하", "중", "상"];

export const NICKNAME_MAX_LENGTH = 12;
export const MAX_SCORE = 10000;

// Stage 1~3 통과 제한(초). Stage 4는 제한 없이 최종 오차로 순위를 정합니다.
export const STAGE_CLEAR_LIMITS = {
  1: 1.0,
  2: 0.5,
  3: 0.3
};
