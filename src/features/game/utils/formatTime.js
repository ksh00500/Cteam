/**
 * 타이머 화면용 (소수점 둘째 자리)
 * 예: 10.00
 */
export function formatTimerDisplay(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return "0.00";
  }
  return Number(seconds).toFixed(2);
}

/**
 * 라운드 결과용 (소수점 셋째 자리)
 * 예: 10.042
 */
export function formatPrecisionTime(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return "0.000";
  }
  return Number(seconds).toFixed(3);
}
