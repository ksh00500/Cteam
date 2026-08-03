// src/features/demerits/DMR008/index.js

import PopupInterferenceEffect from "./PopupInterferenceEffect.jsx";

const demeritModule = {
  id: "DMR-008",
  metadata: {
    name: "팝업",
    description: "라운드 시작 후 9초 이전까지 화면에 방해 팝업이 생성됩니다. 팝업은 클릭 한 번으로 제거할 수 있습니다.",
    difficulties: ["중"],
    conflicts: []
  },
  TimerEffect: null,
  StopButtonEffect: null,
  // 화면 위에 오버레이 형태로 팝업 생성
  OverlayEffect: PopupInterferenceEffect,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
