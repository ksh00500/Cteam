# SetStop 프로젝트 파일 구조 및 아키텍처 설명서

본 문서는 **SetStop** (축제 부스용 타이머 맞추기 게임) 프로젝트의 전체 아키텍처와 디렉토리 구조를 설명합니다.

---

## 📁 디렉토리 구조

```
server.ts                          # Express API, 정적 파일 제공, JSON 점수 저장
data/
└── scores.json                   # 서버가 관리하는 랭킹 원본 파일
src/
├── api/
│   └── scores.js                  # 점수 등록 및 랭킹 조회 REST API 모듈
├── app/
│   └── App.jsx                    # 중앙 화면 제어 및 루트 컴포넌트
├── components/
│   └── common/                    # 공통 UI 컴포넌트
│       ├── AppButton.jsx          # 표준화된 버라이어티 버튼
│       ├── LoadingMessage.jsx     # 로딩 스피너 및 메시지
│       ├── ErrorMessage.jsx       # 네트워크 및 검증 에러 표시
│       ├── PageContainer.jsx      # 고정 폭 반응형 카드 컨테이너
│       └── DevPanel.jsx           # 개발용 디메리트/스테이지 테스트 패널 (DEV 전용)
├── config/
│   ├── apiConfig.js               # 동일 출처 기반 API URL 설정
│   └── gameConfig.js              # 목표시간, 총 스테이지 수, 디메리트 옵션 수 등 설정값
├── features/
│   ├── game/
│   │   ├── components/
│   │   │   ├── GameBoard.jsx      # 게임 핵심 영역 (타이머 + 디메리트 엔진 연동)
│   │   │   ├── StageIndicator.jsx # 현재 스테이지 표시기
│   │   │   ├── TargetTime.jsx     # 목표 시간 표시기
│   │   │   ├── TimerDisplay.jsx   # 2자리 소수점 실시간 타이머
│   │   │   └── StopButton.jsx     # 정지 버튼
│   │   ├── hooks/
│   │   │   ├── useGameSession.js  # 게임 세션 상태 (화면전환, 닉네임, 결과, 디메리트)
│   │   │   └── useTimerGame.js    # performance.now & RAF 기반 고정밀 타이머 훅
│   │   └── utils/
│   │       ├── calculateScore.js  # 라운드 통과 판정 및 Stage 4 랭킹 점수 계산
│   │       ├── formatTime.js       # 타이머 및 결과 시간 포맷팅 (2자리/3자리)
│   │       └── selectDemeritOptions.js # 디메리트 무작위 선별 및 충돌 필터링 유틸
│   └── demerits/
│       ├── components/
│       │   ├── DemeritCard.jsx    # 디메리트 정보 및 선택 카드
│       │   ├── DemeritEngine.jsx  # 활성 디메리트 시각 효과 순차 적용 엔진
│       │   └── ActiveDemeritList.jsx # 현재 적용 중인 디메리트 배지 목록
│       ├── registry/
│       │   └── demeritRegistry.js # DMR-001~DMR-010 등록 및 충돌 검사 레지스트리
│       ├── template/
│       │   ├── DemeritTemplate.jsx# 팀원 개발용 신규 디메리트 템플릿
│       │   └── README.md          # 템플릿 안내 문서
│       ├── DMR001/                # [구현 완료] 타이머 숨기기
│       │   ├── index.js
│       │   ├── TimerHideEffect.jsx
│       │   └── TimerHideEffect.css
│       ├── DMR002/ ~ DMR010/      # 독립 구현된 추가 디메리트 모듈
├── pages/
│   ├── StartPage.jsx              # 시작 화면 (닉네임 입력 & 랭킹 진입)
│   ├── GamePage.jsx               # 게임 플레이 화면
│   ├── RoundResultPage.jsx        # 각 스테이지 라운드 결과 화면
│   ├── DemeritSelectPage.jsx      # 하→중→상 순서의 2개 증강 선택 화면
│   ├── DemeritSelectPage.css      # 가로형 증강 카드 및 난이도별 테마
│   ├── FinalResultPage.jsx        # 4스테이지 완료 후 최종 성적 및 점수 등록 화면
│   └── RankingPage.jsx            # 명예의 전당 TOP 10 랭킹 화면
├── styles/
│   ├── reset.css                  # CSS 초기화
│   ├── variables.css              # 색상, 폰트, 여백 CSS 변수
│   └── global.css                 # 앱 공통 스타일 및 버튼/테이블 레이아웃
├── main.tsx                       # React 앱 진입점
└── index.css                      # 스타일 종합 임포트
```

---

## 🔑 주요 모듈 간 역할 분리 원칙

1. **게임 핵심 로직과 화면의 분리**:
   `useTimerGame.js`는 순수 고정밀 시간 측정만 담당하며, `useGameSession.js`는 게임의 화면 흐름 및 상태 이력을 관리합니다.

2. **디메리트 플러그인 구조**:
   각 디메리트는 독립된 모듈로 `src/features/demerits/DMRxxx/`에 위치하며, `DemeritEngine`을 통해 동적으로 합성되므로 core 게임 코드를 수정할 필요가 없습니다.

3. **통과 판정과 점수 계산 분리**:
   `calculateScore.js`에서 Stage 1~3의 1.0/0.5/0.3초 제한을 판정하고, `10000 - Stage 4 오차(ms)`로 최종 랭킹 점수를 계산합니다.

4. **운영 화면과 랭킹 화면 분리**:
   `/game`은 게임 운영 화면, `/ranking`은 전용 랭킹 화면입니다. 두 화면은 같은 `/api`를 사용하며 랭킹은 서버의 `data/scores.json`에 유지됩니다.
