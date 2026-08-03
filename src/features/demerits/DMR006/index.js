import TimerMoveEffect from "./TimerMoveEffect.jsx";

const demeritModule = {
  id: "DMR-006",
  metadata: {
    name: "타이머 움직임",
    description: "타이머 표시가 화면 안에서 계속 이동합니다. 난이도 '상'에서는 더 빠르고 넓게 움직입니다.",
    difficulties: ["하", "상"],
    conflicts: []
  },
  TimerEffect: TimerMoveEffect,
  StopButtonEffect: null,
  OverlayEffect: null,
  ScreenEffect: null,
  modifyResult: null
};

export default demeritModule;
