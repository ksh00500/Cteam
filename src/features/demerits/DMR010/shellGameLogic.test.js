import test from "node:test";
import assert from "node:assert/strict";
import {
  getShellChoice, getShellPhase, INITIAL_SLOTS, pickCorrectCup,
  SHELL_TIMINGS, swapShellSlots
} from "./shellGameLogic.js";

test("1/2/5초에 정확히 단계가 변경된다", () => {
  assert.equal(getShellPhase(false, 8), "idle");
  assert.equal(getShellPhase(true, 0), "preview");
  assert.equal(getShellPhase(true, 0.999), "preview");
  assert.equal(getShellPhase(true, 1), "cover");
  assert.equal(getShellPhase(true, 2), "shuffle");
  assert.equal(getShellPhase(true, 4.999), "shuffle");
  assert.equal(getShellPhase(true, 5), "pick");
  assert.ok(SHELL_TIMINGS.swapIntervalMs > 460);
});

test("모든 교환은 서로 다른 두 컵의 위치만 바꾸고 원본을 유지한다", () => {
  for (let i = 0; i < 20; i++) {
    const before = [0, 1, 2];
    let reads = 0;
    const next = swapShellSlots(before, () => reads++ === 0 ? i / 20 : ((i * 13) % 20) / 20);
    assert.deepEqual(before, [0, 1, 2]);
    assert.deepEqual([...next].sort(), [0, 1, 2]);
    assert.equal(next.filter((value, index) => value !== before[index]).length, 2);
  }
  assert.deepEqual(INITIAL_SLOTS, [0, 1, 2]);
});

test("컵이 이동해도 정답의 고유 ID는 바뀌지 않는다", () => {
  const correctCupId = pickCorrectCup(() => .99);
  assert.equal(correctCupId, 2);
  assert.equal(swapShellSlots([0, 1, 2], () => .7).length, 3);
  assert.equal(getShellChoice(correctCupId, 2, []), "correct");
  assert.equal(getShellChoice(0, 2, []), "wrong");
  assert.equal(getShellChoice(0, 2, [0]), "ignored");
});
