import React from "react";

/**
 * 디메리트 모듈 템플릿 예시
 * 새로 만드는 디메리트는 이 구조를 참고하세요.
 */
const demeritModule = {
  id: "DMR-000",
  metadata: {
    name: "디메리트 이름",
    description: "디메리트 상세 설명",
    difficulties: ["중"], // "하", "중", "상" 중 선택
    conflicts: [] // 충돌하는 다른 디메리트 ID 목록 예: ["DMR-001"]
  },

  // 1. 타이머 표시 영역 효과 (선택 사항)
  TimerEffect: function TimerEffectTemplate({ children, elapsedTime, isRunning, roundId }) {
    return children;
  },

  // 2. 정지 버튼 효과 (선택 사항)
  StopButtonEffect: function StopButtonEffectTemplate({ children, elapsedTime, isRunning, onStop }) {
    return children;
  },

  // 3. 화면 오버레이 효과 (선택 사항)
  OverlayEffect: function OverlayEffectTemplate({ elapsedTime, isRunning }) {
    return null;
  },

  // 4. 스크린 전체 감싸기 효과 (선택 사항)
  ScreenEffect: function ScreenEffectTemplate({ children, elapsedTime }) {
    return children;
  },

  // 5. 결과 값 보정 함수 (선택 사항)
  modifyResult: function modifyResultTemplate(actualTime, context) {
    return actualTime;
  }
};

export default demeritModule;
