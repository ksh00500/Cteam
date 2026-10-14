import { API_BASE_URL } from "../config/apiConfig.js";

async function readJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("서버 응답 형식이 올바르지 않습니다.");
  }
  return response.json();
}

/**
 * 점수 등록 API
 * @param {Object} scoreData { nickname, score, stage, finalError, selectedDemerits }
 */
export async function submitScore(scoreData) {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nickname: scoreData.nickname,
        score: scoreData.score,
        stage: scoreData.stage,
        finalError: scoreData.finalError,
        selectedDemerits: scoreData.selectedDemerits
      })
    });

    const data = await readJsonResponse(response);
    if (!response.ok || data.success === false) {
      throw new Error(data.error || `서버 오류가 발생했습니다. (${response.status})`);
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "점수 등록 중 네트워크 오류가 발생했습니다."
    };
  }
}

/**
 * 랭킹 조회 API
 * @param {number} limit 조회 개수 (기본 10개)
 */
export async function getRankings(limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/scores/rankings?limit=${limit}`, {
      cache: "no-store"
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.error || `랭킹을 불러오지 못했습니다. (${response.status})`);
    }

    return {
      success: true,
      data: Array.isArray(data) ? data : data.data || []
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "랭킹 정보를 가져올 수 없습니다.",
      data: []
    };
  }
}
