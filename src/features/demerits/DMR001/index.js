import TimerHideEffect from "./TimerHideEffect.jsx";

const demeritModule = {
  id: "DMR-001",
  metadata: {
    name: "타이머 숨기기",
    description: "게임 시작 후 3초가 지나면 실제 타이머 표시가 사라집니다.",
    difficulties: ["상"],
    conflicts: ["DMR-003"]
  },
  TimerEffect: TimerHideEffect,
  StopButtonEffect: null,
  OverlayEffect: null,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
