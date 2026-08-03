# SetStop 팀 협업 및 코드 관리 규칙

## 1. 파일 수정 권한 분리

- **개별 담당 영역**: 팀원은 자신에게 배정된 `src/features/demerits/DMRxxx/` 폴더만 수정합니다.
- **공통/핵심 영역**: `src/app/`, `src/pages/`, `src/features/game/`, `src/api/` 등 공통 영역 수정은 통합 담당자 승인 하에 진행됩니다.

---

## 2. 코드 품질 및 작성 규칙

1. **JavaScript 사용**: 모든 파일은 JavaScript/JSX로 작성합니다. (TypeScript 파일 확장자 금지)
2. **함수형 컴포넌트**: 모든 React 컴포넌트는 함수형 컴포넌트로 작성합니다.
3. **컴포넌트 단일 책임**: 하나의 컴포넌트는 한 가지 역할만 담당합니다.
4. **CSS 클래스 접두사**:
   - 공통 게임 UI: `setstop-`
   - 개별 디메리트: `dmr-001-`, `dmr-002-` 형태
5. **버튼 접근성**: 모든 button 요소에 `type="button"` 명시.
6. **더블 클릭 방지**: 빠른 연속 클릭으로 중복 처리되지 않도록 클릭 처리 시 방어 로직 적용.

---

## 3. 브랜치 및 통합 규칙

- 브랜치명 예시: `feature/DMR-002-moving-button`
- PR 생성 후 `DEV` 패널을 이용한 정상 동작 확인 후 통합 진행.
- `demeritRegistry.js` 파일 수정은 통합 담당자가 일괄 처리.
