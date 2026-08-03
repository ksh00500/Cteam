import DMR001 from "../DMR001/index.js";
import DMR002 from "../DMR002/index.js";
import DMR003 from "../DMR003/index.js";
import DMR004 from "../DMR004/index.js";
import DMR005 from "../DMR005/index.js";
import DMR006 from "../DMR006/index.js";
import DMR007 from "../DMR007/index.js";
import DMR008 from "../DMR008/index.js";
import DMR009 from "../DMR009/index.js";
import DMR010 from "../DMR010/index.js";

export const demeritRegistry = {
  "DMR-001": DMR001,
  "DMR-002": DMR002,
  "DMR-003": DMR003,
  "DMR-004": DMR004,
  "DMR-005": DMR005,
  "DMR-006": DMR006,
  "DMR-007": DMR007,
  "DMR-008": DMR008,
  "DMR-009": DMR009,
  "DMR-010": DMR010
};

/**
 * 등록된 모든 디메리트 리스트 반환
 */
export function getAllDemerits() {
  return Object.values(demeritRegistry);
}

/**
 * ID로 디메리트 모듈 조회
 */
export function getDemeritById(id) {
  return demeritRegistry[id] || null;
}

/**
 * 현재 활성화된 디메리트 목록과 후보 디메리트 간의 충돌 여부 검사
 * @param {string[]} activeIds 현재 활성화된 디메리트 ID 배열
 * @param {string} candidateId 새로 검사할 디메리트 ID
 * @returns {boolean} 충돌 시 true
 */
export function checkConflicts(activeIds, candidateId) {
  if (!activeIds || activeIds.length === 0) return false;
  if (activeIds.includes(candidateId)) return true; // 이미 활성화됨

  const candidateModule = getDemeritById(candidateId);
  if (!candidateModule) return false;

  const candidateConflicts = candidateModule.metadata?.conflicts || [];

  for (const activeId of activeIds) {
    // 1. 후보 디메리트가 활성 디메리트를 충돌 목록에 가지고 있는 경우
    if (candidateConflicts.includes(activeId)) {
      return true;
    }

    // 2. 활성 디메리트가 후보 디메리트를 충돌 목록에 가지고 있는 경우
    const activeModule = getDemeritById(activeId);
    const activeConflicts = activeModule?.metadata?.conflicts || [];
    if (activeConflicts.includes(candidateId)) {
      return true;
    }
  }

  return false;
}
