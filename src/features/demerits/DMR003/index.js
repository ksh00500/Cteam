import BlinkingTimerEffect from "./BlinkingTimerEffect.jsx";

const demeritModule = {
  id: "DMR-003",
  metadata: {
    name: "깜빡이는 타이머",
    description: "타이머가 빠르게 사라졌다가 나타납니다.",
    difficulties: ["하"],
    conflicts: ["DMR-001"]
  },
  TimerEffect: BlinkingTimerEffect,
  StopButtonEffect: null,
  OverlayEffect: null,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
