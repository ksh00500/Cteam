# SetStop 팀원용 디메리트 개발 가이드

안녕하세요! SetStop 개발팀원 여러분. 본 가이드는 자신에게 배정된 페널티 디메리트를 독립적으로 개발하고 검증하는 방법을 안내합니다.

---

## 1. 담당 디메리트 폴더 위치
각 팀원은 오직 자신에게 배정된 디메리트 폴더 내의 파일만 작성 및 수정합니다.

예시:
- DMR-002 담당자: `src/features/demerits/DMR002/`
- DMR-003 담당자: `src/features/demerits/DMR003/`

---

## 2. 공통 모듈 규격 (`index.js`)

각 디메리트 폴더 내 `index.js`는 반드시 아래 형태의 객체를 `default export` 해야 합니다.

```javascript
const demeritModule = {
  id: "DMR-002",
  metadata: {
    name: "움직이는 정지 버튼",
    description: "정지 버튼이 화면 안에서 계속 이동합니다.",
    difficulties: ["하", "중", "상"],
    conflicts: ["DMR-010"]
  },
  TimerEffect: null,       // 타이머 표시 감싸기 컴포넌트
  StopButtonEffect: null,  // 정지 버튼 감싸기 컴포넌트
  OverlayEffect: null,     // 게임 화면 위 오버레이 레이어
  ScreenEffect: null,      // 전체 게임 화면 감싸기 컴포넌트
  modifyResult: null       // 결과 보정 함수 (필요 시)
};

export default demeritModule;
```

---

## 3. 시각 효과 컴포넌트가 전달받는 Props

모든 Effect 컴포넌트(`TimerEffect`, `StopButtonEffect`, `OverlayEffect`, `ScreenEffect`)는 다음 props를 공통 전달받습니다.

```javascript
{
  elapsedTime,   // 현재 경과 시간 (소수점 초 단위 float, 예: 3.42)
  targetTime,    // 목표 시간 (10.00초)
  isRunning,     // 타이머 작동 중 여부 (boolean)
  currentStage,  // 현재 스테이지 번호 (1 ~ 4)
  difficulty,    // 난이도 ("하", "중", "상")
  roundId,       // 현재 라운드 고유 식별자 (string)
  onStop,        // 타이머 정지 핸들러 함수
  children       // 기본 UI 요소 (TimerEffect, StopButtonEffect, ScreenEffect 적용 시)
}
```

---

## 4. 시각 효과 유형별 구현 가이드

### 4.1 TimerEffect (타이머 표시 효과)
타이머 숫자의 숨김, 깜빡임, 회전, 이동 효과 구현 시 사용합니다.
`children`에는 기본 `TimerDisplay` 컴포넌트가 들어옵니다.

### 4.2 StopButtonEffect (정지 버튼 효과)
정지 버튼의 무작위 이동, 야바위 섞기 효과 구현 시 사용합니다.
`children`에는 기본 `StopButton` 컴포넌트가 들어옵니다.

### 4.3 OverlayEffect (화면 오버레이)
방해 팝업, 구름 자막 등 화면 전체에 떠있는 요소 구현 시 사용합니다. `children`을 받지 않고 독립적으로 렌더링됩니다.

### 4.4 ScreenEffect (전체 화면 반전)
게임 화면 전체의 좌우 반전, 상하 반전 구현 시 사용합니다.
`children`을 css `transform: scaleX(-1)` 등으로 감싸서 렌더링합니다.

### 4.5 modifyResult (최종 시간 보정)
결과 시간에 미세 보정값을 더하거나 뺄 때 사용합니다.
```javascript
modifyResult: function(actualTime, context) {
  // 예: 5초에 부여된 보정값 0.35초 추가
  return actualTime + 0.35;
}
```

---

## 5. 라운드 초기화 및 리셋 (`roundId`)

새로운 라운드가 시작되면 `roundId`값이 변경됩니다.
컴포넌트 내에 `useState`가 존재한다면 `useEffect`에서 `roundId` 변경을 감지해 내부 상태를 초기화하세요.

```javascript
useEffect(() => {
  // 라운드가 바뀌면 내부 상태 초기화
  setIsTriggered(false);
}, [roundId]);
```

---

## 6. CSS 클래스명 접두사 규칙

타 팀원과의 CSS 스타일 충돌을 방지하기 위해 반드시 **자신의 디메리트 ID 접두사**를 붙이세요.

예시 (`DMR002`):
```css
.dmr-002-moving-button {
  position: absolute;
  transition: all 0.2s ease;
}
```

---

## 7. 공통 레이아웃 규칙 (필수)

게임 화면의 타이머와 정지 버튼에는 모든 디메리트가 공통으로 사용하는 자리 크기가 지정되어 있습니다.

- 타이머 표시의 기본 최대 폭은 **540px**, 정지 버튼 영역은 **510px**입니다.
- 효과 래퍼는 기본적으로 `width: 100%`를 유지하세요. `inline-block`, `width: fit-content` 등 콘텐츠 너비만큼 줄어드는 래퍼는 피하세요.
- 타이머를 숨길 때 컴포넌트를 제거하거나 `display: none`으로 접지 말고, **opacity/visibility** 또는 절대 위치 오버레이를 사용하세요.
- `position: fixed`/ `absolute`로 요소를 이동할 때는 기본 자리를 차지할 **플레이스홀더**를 남겨 화면이 위아래로 흔들리지 않게 하세요.
- 난이도가 높아져도 타이머·정지 버튼의 **기본 크기를 바꾸지 않는 것**을 원칙으로 하세요. 난이도는 이동 경로, 속도, 등장 시점 등으로 조절합니다.
- 다른 디메리트와 결합하여 버튼을 덮거나 클릭을 막는다면 `metadata.conflicts`에 ID를 추가하세요.
- PC와 모바일 폭에서 각각 단일 효과와 **2~3개 누적 효과**를 테스트하세요.

현재 영역 높이는 `src/pages/GamePage.css`의 `--game-timer-zone-height`, `--game-control-zone-height`에서 관리합니다.

---

## 8. 🛑 팀원이 직접 수정하면 안 되는 파일 목록

아래 파일들은 전체 프로젝트의 핵심 로직이므로 절대 직접 수정하지 마세요!

- `src/app/App.jsx`
- `src/pages/GamePage.jsx`
- `src/features/game/hooks/useGameSession.js`
- `src/features/game/hooks/useTimerGame.js`
- `src/features/demerits/registry/demeritRegistry.js`
- `src/api/scores.js`
- `src/config/gameConfig.js`
- `src/main.jsx`

---

## 9. 디메리트 테스트 방법

화면 우측 하단의 **🛠️ 개발자 패널 (DEV)**을 클릭하면:
1. 자신이 개발 중인 디메리트를 강제로 활성화할 수 있습니다.
2. 원하는 스테이지로 즉시 이동할 수 있습니다.
3. 충돌 여부를 한눈에 확인할 수 있습니다.

---

## 10. 최종 레지스트리 등록

개발이 끝난 디메리트의 `demeritRegistry.js` 최종 등록 작업은 **통합 담당자**가 진행합니다. 구현 완료 후 PR/알림을 남겨주세요!
