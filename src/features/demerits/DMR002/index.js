// src/features/demerits/DMR002/index.js

import StopButtonFloatingEffect from "./StopButtonFloatingEffect.jsx";

const demeritModule = {
  id: "DMR-002",
  metadata: {
    name: "움직이는 정지 버튼",
    description: "정지 버튼이 움직입니다. 난이도 '중'에서는 더 빠르게 움직이고, 난이도 '상'에서는 빠르게 움직이면서 크기도 변합니다.",
    difficulties: ["하", "중", "상"],
    conflicts: []
  },
  TimerEffect: null,
  // 정지 버튼 영역에 부유 이펙트를 적용합니다.
  StopButtonEffect: StopButtonFloatingEffect,
  OverlayEffect: null,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
