/** 타이머 버튼 야바위의 순수 게임 규칙. */
export const SHELL_TIMINGS = Object.freeze({
  previewEndsAt: 1,
  coverEndsAt: 2,
  shuffleEndsAt: 5,
  swapIntervalMs: 520
});
export const INITIAL_SLOTS = Object.freeze([0, 1, 2]);

export function getShellPhase(isRunning, elapsedTime) {
  if (!isRunning) return "idle";
  if (elapsedTime < SHELL_TIMINGS.previewEndsAt) return "preview";
  if (elapsedTime < SHELL_TIMINGS.coverEndsAt) return "cover";
  if (elapsedTime < SHELL_TIMINGS.shuffleEndsAt) return "shuffle";
  return "pick";
}

export function pickCorrectCup(random = Math.random) {
  return Math.min(2, Math.floor(random() * INITIAL_SLOTS.length));
}

/** 컵 ID → 슬롯 번호. 서로 다른 두 컵을 교환하고 원본은 수정하지 않습니다. */
export function swapShellSlots(slots, random = Math.random) {
  const first = Math.min(2, Math.floor(random() * slots.length));
  const offset = 1 + Math.min(1, Math.floor(random() * (slots.length - 1)));
  const second = (first + offset) % slots.length;
  const next = [...slots];
  [next[first], next[second]] = [next[second], next[first]];
  return next;
}

export function getShellChoice(cupId, correctCupId, alreadyOpened) {
  if (alreadyOpened.includes(cupId)) return "ignored";
  return cupId === correctCupId ? "correct" : "wrong";
}
