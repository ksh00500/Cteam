# 디메리트 개발 템플릿 안내

새로운 디메리트를 개발할 때는 본 폴더의 `DemeritTemplate.jsx` 파일 구조를 참조하세요.

## 신규 디메리트 폴더 생성 가이드
1. `src/features/demerits/` 아래에 배정받은 디메리트 ID 폴더를 생성합니다. (예: `DMR003`)
2. 해당 폴더 내에 `index.js` 파일을 작성하고 디메리트 규격 객체를 `default export` 하세요.
3. 시각 효과가 필요하다면 동일 폴더 내에 JSX 컴포넌트와 CSS 파일(`dmr-xxx-` 클래스명)을 작성하여 불러오세요.
4. 개발을 완료하면 통합 담당자에게 알려 `demeritRegistry.js`에 등록을 요청하세요.
