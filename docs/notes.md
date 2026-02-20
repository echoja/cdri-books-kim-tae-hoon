## 디자인 참고사항 및 논의사항

### 1. 초기화면 Empty 문구

- 현행 디자인 기준: 초기화면에서도 `검색된 결과가 없습니다` 문구가 노출됩니다.
- 메모: UX 관점에서 어색할 수 있으나, 현재는 디자인 원본 기준으로 그대로 구현합니다.
- 추후 확인: 초기 진입 시 문구를 별도 안내 문구로 분리할지 검토가 필요합니다.

### 2. 색상 토큰 네이밍 불일치 (`Secondary/Light 2`)

- 현행 디자인 기준: Figma에는 `Secondary/Light 2`가 존재합니다.
- 문제: 디자인 시스템 색상 토큰 목록에는 `Secondary/Light 2`가 없습니다.
- 확인된 값: `Secondary/Light 2`는 `#F2F4F6`이며 현재 `Palette/LightGray`와 동일 값입니다.
- 추후 확인: 토큰 alias(`Secondary/Light 2` -> `Palette/LightGray`)를 공식화할지 검토가 필요합니다.

### 3. 색상 토큰 정의 누락 (`Palette/Divider`, `Icon/Muted`)

- 현행 디자인 기준: BookListItem 구현 중 `Palette/Divider`, `Icon/Muted`를 사용했습니다.
- 문제: 두 토큰 모두 기존 디자인 가이드/토큰 목록에는 명시되어 있지 않았습니다.
- 확인된 값: `Palette/Divider`=`#D2D6DA`, `Icon/Muted`=`#B1B8C0`으로 문서화했습니다.
- 추후 확인: 해당 토큰을 디자인 가이드에 정식 추가할지, 기존 토큰으로 매핑할지 결정이 필요합니다.

### 4. 버튼 컴포넌트 정의 부재

- 현행 디자인 기준: 디자인 가이드에는 버튼이 컴포넌트로 정의되어 있지 않습니다.
- 구현 방침: 실제 개발에서는 버튼을 공통 컴포넌트로 제작해 재사용합니다.
- 추후 확인: 디자인 시스템 문서에도 버튼 컴포넌트 스펙(variant/state/token)을 정식 반영할지 결정이 필요합니다.

### 5. BookListItem 펼침/접힘 애니메이션 적용

- 구현 방침: BookListItem 아코디언 펼침/접힘 전환 시 애니메이션을 적용합니다.
- 논의 포인트: 애니메이션 duration/easing, opacity 동시 적용 여부, reduced-motion 대응 기준을 확정해야 합니다.

### 6. 도서검색 BOX 간격/입력창 높이 보정

- 기존 논의값 `2줄-3줄 간격 25px`은 레이아웃 일관성을 위해 `24px`로 보정했습니다.
- 검색 input 높이는 초기 논의값 `50px` 대신 `radius 24px` 기준에 맞춰 `48px`로 보정했습니다.

### 7. 상세보기 chevron 아이콘 소스

- `상세보기`의 chevron은 디자인 가이드에 별도 컴포넌트 정의가 없어 `lucide-react` 아이콘(`ChevronDown`, `ChevronUp`)으로 통일합니다.
- 본 항목은 디자인 가이드 미정 영역에 대한 구현 결정입니다. (피그마에 없음)

### 8. 색상 토큰 임의 추가 (`Text/Title`, `Text/Default`)

- 디자인 가이드에 없는 `Text/Title`, `Text/Default`를 추가했습니다.
- 확정값: `Text/Title=#1A1E27`, `Text/Default=#353C49`
