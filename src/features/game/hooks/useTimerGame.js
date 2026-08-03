import { useState, useRef, useCallback, useEffect } from "react";

/**
 * performance.now() 및 requestAnimationFrame 기반의 고정밀 타이머 커스텀 훅
 */
export function useTimerGame() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  const startTimeRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // 타이머 루프
  const updateTimer = useCallback(() => {
    if (!startTimeRef.current) return;
    const now = performance.now();
    const elapsedSeconds = (now - startTimeRef.current) / 1000;
    setElapsedTime(elapsedSeconds);

    animFrameIdRef.current = requestAnimationFrame(updateTimer);
  }, []);

  // 타이머 시작
  const startTimer = useCallback(() => {
    if (isRunning || isStopped) return;

    setElapsedTime(0);
    setIsRunning(true);
    setHasStarted(true);
    setIsStopped(false);

    startTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, isStopped, updateTimer]);

  // 타이머 정지 (최종 정지 시간을 반환)
  const stopTimer = useCallback(() => {
    if (!isRunning || isStopped) return null;

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    const stopTime = performance.now();
    const finalElapsed = startTimeRef.current ? (stopTime - startTimeRef.current) / 1000 : elapsedTime;

    setElapsedTime(finalElapsed);
    setIsRunning(false);
    setIsStopped(true);

    return finalElapsed;
  }, [isRunning, isStopped, elapsedTime]);

  // 타이머 리셋
  const resetTimer = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    startTimeRef.current = null;
    setElapsedTime(0);
    setIsRunning(false);
    setHasStarted(false);
    setIsStopped(false);
  }, []);

  // 컴포넌트 해제 시 animation frame 정리
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return {
    elapsedTime,
    isRunning,
    hasStarted,
    isStopped,
    startTimer,
    stopTimer,
    resetTimer
  };
}
