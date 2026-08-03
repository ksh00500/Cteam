// src/features/demerits/DMR009/index.js

import "./ScreenInversionEffect.css";

const demeritModule = {
  id: "DMR-009",
  metadata: {
    name: "화면 반전",
    description: "라운드가 시작되면 화면이 반전됩니다. 난이도 '중'에서는 좌우 반전, 난이도 '상'에서는 상하 반전이 적용됩니다.",
    difficulties: ["중", "상"],
    conflicts: []
  },
  TimerEffect: null,
  StopButtonEffect: null,
  OverlayEffect: null,
  // GameBoard에서 #root 전체에 적용해 HUD와 배경까지 모두 반전합니다.
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
