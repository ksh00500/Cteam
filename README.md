# ⏱️ 본때 C팀 게임 (SetStop)

**본때 C팀 게임(SetStop)**은 축제 부스에서 누구나 직관적이고 재미있게 즐길 수 있는 타이머 맞추기 웹 게임입니다.  
사용자는 제시된 목표 시간(10.00초)에 맞춰 타이머를 정확하게 멈추어야 하며, 스테이지가 올라갈수록 누적되는 페널티 디메리트를 극복해야 합니다.

---

## 🎮 게임 특징

1. **직관적인 4단계 스테이지 구성**: Stage 1부터 Stage 4까지 진행.
2. **단계별 누적 디메리트 시스템**: 총 3번의 선택에서 하 → 중 → 상 난이도 순서로 2개 후보 중 1개를 선택하여 다음 라운드에 누적 반영.
3. **고정밀 타이머 측정**: `performance.now()` 및 `requestAnimationFrame`을 이용한 정밀한 시간 오차 계산.
4. **라운드 통과 제한**: Stage 1은 ±1.0초, Stage 2는 ±0.5초, Stage 3은 ±0.3초 이내에 들어와야 다음 라운드로 진출.
5. **명예의 전당 (랭킹)**: 생존자의 Stage 4 절대 오차를 밀리초 점수로 환산해 최종 화면 진입 시 자동으로 JSON 파일에 저장.
6. **닉네임만 등록**: 참가자는 닉네임으로 게임을 시작하며 연락처 없이 점수가 자동으로 저장됩니다.
7. **독립 플러그인 아키텍처**: 각 디메리트가 독립된 파일/폴더로 작성되어 팀원들이 핵심 로직 변경 없이 개별 구현 가능.
8. **개발자 지원 패널**: `import.meta.env.DEV` 환경에서 디메리트 강제 활성화 및 스테이지 점프 테스트 가능.

---

## 🚀 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
기본적으로 `http://localhost:3000`에서 개발 서버가 실행됩니다.

- 게임 운영 화면: `http://localhost:3000/game`
- 랭킹 전용 화면: `http://localhost:3000/ranking`
- API 상태 확인: `http://localhost:3000/api/health`

### 3. 프로덕션 빌드 및 실행
```bash
npm run build
npm start
```

프로덕션에서도 `/game`과 `/ranking` 주소를 각각 노트북과 아이패드에서 열면 됩니다. 랭킹 화면은 3초마다 자동 갱신됩니다.

---

## 💾 랭킹 저장 방식

점수는 기본적으로 서버의 `data/scores.json`에 저장됩니다. 브라우저나 서버를 재시작해도 파일이 유지되는 한 랭킹은 사라지지 않습니다.

### 라운드 판정 및 점수

- Stage 1: 절대 오차가 `1.000초 이하`이면 통과
- Stage 2: 절대 오차가 `0.500초 이하`이면 통과
- Stage 3: 절대 오차가 `0.300초 이하`이면 통과
- Stage 4: 탈락 제한 없음
- 최종 점수: `10000 - Stage 4 절대 오차(ms)` (예: `0.042초 = 9958점`)
- 최저 점수: Stage 4 오차가 10초 이상이면 `0점`으로 기록되며 등록은 계속 가능
- 최종 순위: 점수가 높은 순서, 동점이면 Stage 4 실제 오차가 작은 순서

제한과 정확히 같은 오차는 통과하며, Stage 1~3에서 탈락한 기록은 랭킹에 등록되지 않습니다.

### 닉네임 및 점수 등록

- 참가자는 1~12자의 닉네임만 입력하고 게임을 시작합니다.
- 최종 결과 화면에 진입하면 점수가 자동으로 랭킹에 저장됩니다.
- 전화번호·상품 안내 팝업 및 연락처 수집 API는 사용하지 않습니다.
- 기존 점수 기록은 유지하며, 이전 버전의 연락처·토큰 필드는 서버 시작 시 제거합니다.

환경 변수는 `.env.example`을 참고해 설정할 수 있습니다.

```env
PORT=3000
SCORES_FILE=./data/scores.json
```

- 서버 프로세스에 점수 파일이 있는 디렉터리의 쓰기 권한이 필요합니다.
- 한 개의 서버 프로세스로 운영하는 구성을 권장합니다.
- 행사 전 초기화할 때는 서버를 중지하고 `data/scores.json`의 내용을 `[]`로 변경합니다.
- 행사 중에는 `scores.json`을 다른 이름으로 복사해 두면 간단히 백업할 수 있습니다.
- 파일 내용이 손상된 경우 서버는 기존 데이터를 덮어쓰지 않고 시작을 중단합니다.

### API

- `POST /api/scores`: 점수 등록
- `GET /api/scores/rankings?limit=10`: 랭킹 조회
- `GET /api/health`: 서버 상태와 저장된 점수 개수 확인

---

## 🛠️ 기술 스택

- **Frontend**: React 19, Vite, JavaScript (JSX)
- **Backend**: Express (Node.js REST API + JSON 파일 저장)
- **Styling**: Vanilla CSS (Variables + Reset + Modular CSS)
- **Icon**: lucide-react

---

## 📄 팀 개발 가이드 및 문서

- [중간산출물 기획서 원본 (INTERIM_PROJECT_PLAN.md)](./docs/INTERIM_PROJECT_PLAN.md)
- [프로젝트 구조 및 아키텍처 (PROJECT_STRUCTURE.md)](./docs/PROJECT_STRUCTURE.md)
- [팀원용 디메리트 개발 가이드 (DEMERIT_DEVELOPMENT_GUIDE.md)](./docs/DEMERIT_DEVELOPMENT_GUIDE.md)
- [팀 협업 및 코드 관리 규칙 (TEAM_RULES.md)](./docs/TEAM_RULES.md)
