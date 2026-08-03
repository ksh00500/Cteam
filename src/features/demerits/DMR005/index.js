import TimeAdjustmentEffect from "./TimeAdjustmentEffect.jsx";

// 라운드 ID(roundId)를 기반으로 고정된 랜덤 값을 생성하는 헬퍼 함수
// UI 표시와 최종 결과 계산 시 정확히 같은 값을 사용하기 위함입니다.
export function getRoundModifier(roundId) {
  if (!roundId) return 0;
  
  // 문자열 기반 간단한 해시 생성
  let hash = 0;
  for (let i = 0; i < roundId.length; i++) {
    hash = (hash << 5) - hash + roundId.charCodeAt(i);
    hash |= 0;
  }
  
  const absHash = Math.abs(hash);
  
  // 1. 0.1 ~ 1.0 추출 (0.1 단위)
  const magnitude = (absHash % 10) + 1;
  const value = magnitude / 10;
  
  // 2. 5:5 확률로 부호 결정
  const sign = (absHash % 2 === 0) ? 1 : -1;
  
  return parseFloat((value * sign).toFixed(1));
}

const demeritModule = {
  id: "DMR-005",
  metadata: {
    name: "타이머 최종에 ±(1초 이하)",
    description: "타이머가 5초에 도달하면 최종 시간에 더하거나 뺄 값을 알려주며, 결과에 -1.0초 ~ +1.0초 범위의 값이 적용됩니다.",
    difficulties: ["중"],
    conflicts: []
  },
  // 1. 타이머 영역 위에 변경될 시간을 띄워줌
  TimerEffect: TimeAdjustmentEffect,
  StopButtonEffect: null,
  OverlayEffect: null,
  ScreenEffect: null,
  
  // 2. 최종 결과 시간(actualTime)을 조작
  modifyResult: function(actualTime, context) {
    const modifier = getRoundModifier(context.roundId);
    // 0초 미만으로 내려가지 않도록 처리
    return Math.max(0, actualTime + modifier);
  }
};

export default demeritModule;
