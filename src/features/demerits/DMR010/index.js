import ButtonShellGameEffect from "./ButtonShellGameEffect.jsx";

const demeritModule = {
  id: "DMR-010",
  metadata: {
    name: "버튼 야바위",
    description: "정지 버튼이 숨은 컵을 기억하고 이동 경로를 추적하세요. 5초 이후 정답 컵을 찾아 누르면 타이머가 정지합니다.",
    difficulties: ["상"],
    conflicts: ["DMR-002"]
  },
  TimerEffect: null,
  StopButtonEffect: ButtonShellGameEffect,
  OverlayEffect: null,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
