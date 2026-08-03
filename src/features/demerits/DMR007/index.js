// src/features/demerits/DMR007/index.js

import TimerRotateEffect from "./TimerRotateEffect.jsx";

const demeritModule = {
  id: "DMR-007",
  metadata: {
    name: "타이머 회전",
    description: "라운드가 시작되면 타이머가 시계 방향으로 회전합니다. 난이도 '상'에서는 회전 속도가 매우 빨라집니다.",
    difficulties: ["하", "상"],
    conflicts: []
  },
  TimerEffect: TimerRotateEffect,
  StopButtonEffect: null,
  OverlayEffect: null,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;