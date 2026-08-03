import CloudCaptionsEffect from "./CloudCaptionsEffect.jsx";

const demeritModule = {
  id: "DMR-004",
  metadata: {
    name: "타이머 구름 자막",
    description: "실제 타이머 주변에 여러 개의 가짜 타이머 텍스트가 표시됩니다.",
    difficulties: ["중"],
    conflicts: []
  },
  TimerEffect: null,
  StopButtonEffect: null,
  OverlayEffect: CloudCaptionsEffect,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
