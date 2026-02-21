## 디자인 참고사항 및 논의사항

### 1. 초기화면 Empty 문구

- 현재 화면에서는 초기 진입 시에도 `검색된 결과가 없습니다` 문구가 보이도록 반영되어 있습니다.
- 이후 필요 시, 초기 진입 전용 안내 문구로 분리하는 방향을 함께 검토하면 좋겠습니다.

### 2. 색상 토큰 네이밍 불일치 (`Secondary/Light 2`)

- Figma의 `Secondary/Light 2`는 현재 코드 기준 `Palette/LightGray`와 동일 색상(`#F2F4F6`)으로 사용되고 있습니다.
- 토큰 표기 일관성을 위해 `Secondary/Light 2` 별칭(alias) 유지 여부를 정하면 좋겠습니다.

### 3. 색상 토큰 정의 누락 (`Palette/Divider`, `Icon/Muted`)

- BookListItem에서 `Palette/Divider`, `Icon/Muted`를 사용하고 있습니다.
- 현재 문서 기준 색상값은 `Palette/Divider=#D2D6DA`, `Icon/Muted=#B1B8C0`입니다.
- 디자인 가이드에 정식 토큰으로 추가할지, 기존 토큰으로 매핑할지 정리 필요합니다.

### 4. 버튼 컴포넌트 정의 부재

- 현재 디자인 가이드에는 버튼 컴포넌트 단위 정의가 없는 상태입니다.
- 구현에서는 일관성을 위해 공통 버튼 컴포넌트를 사용하고 있습니다.
- 추후 디자인 시스템 문서에 버튼 스펙(variant/state/token)을 함께 정리하면 유지보수에 도움이 됩니다.

### 5. BookListItem 펼침/접힘 애니메이션 적용

- BookListItem 아코디언 펼침/접힘 전환에 애니메이션이 적용되어 있습니다.
- 디자이너 검수 시 duration/easing, opacity 사용 여부, reduced-motion 기준을 함께 맞추면 좋겠습니다.

### 6. 도서검색 BOX 간격/입력창 높이 보정

- `2줄-3줄 간격`은 레이아웃 정렬 기준에 맞춰 `24px`로 반영되어 있습니다.
- 검색 input 높이는 radius 기준과 맞춰 `48px`로 반영되어 있습니다.

### 7. 상세보기 chevron 아이콘 소스

- `상세보기` chevron은 현재 `lucide-react`(`ChevronDown`, `ChevronUp`)로 통일해 사용 중입니다.
- 디자인 가이드에 별도 아이콘 컴포넌트가 정리되면 해당 기준으로 맞출 수 있습니다.

### 8. 색상 토큰 임의 추가 (`Text/Title`, `Text/Default`)

- 현재 구현에서 `Text/Title`, `Text/Default`를 사용하고 있습니다.
- 적용값은 `Text/Title=#1A1E27`, `Text/Default=#353C49`입니다.

### 9. BookListItem 버튼 폭 클래스 정리 (`w-[115px]` -> `w-28`)

- `BookListItem`의 `구매하기/상세보기` 버튼 폭은 `w-28`로 통일되어 있습니다.
- 가로 패딩 제거(`px-0`) 규칙은 그대로 유지됩니다.
