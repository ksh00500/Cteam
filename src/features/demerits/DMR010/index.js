// src/features/demerits/DMR010/index.js

import ButtonShellGameEffect from "./ButtonShellGameEffect.jsx";

const demeritModule = {
  id: "DMR-010",
  metadata: {
    name: "버튼 야바위",
    description: "5초까지 정지 버튼을 가린 3개의 컵이 섞이며, 5초 이후 진짜 정지 버튼이 들어 있는 컵을 찾아 눌러야 합니다.",
    difficulties: ["상"],
    conflicts: []
  },
  TimerEffect: null,
  // 정지 버튼 영역에 야바위 이펙트 적용
  StopButtonEffect: ButtonShellGameEffect,
  OverlayEffect: null,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
