## 디자인 의문사항

### 1. 초기화면 Empty 문구

- 현행 디자인 기준: 초기화면에서도 `검색된 결과가 없습니다` 문구가 노출됩니다.
- 메모: UX 관점에서 어색할 수 있으나, 현재는 디자인 원본 기준으로 그대로 구현합니다.
- 추후 확인: 초기 진입 시 문구를 별도 안내 문구로 분리할지 검토가 필요합니다.

### 2. 색상 토큰 네이밍 불일치 (`Secondary/Light 2`)

- 현행 디자인 기준: Figma에는 `Secondary/Light 2`가 존재합니다.
- 문제: 디자인 시스템 색상 토큰 목록에는 `Secondary/Light 2`가 없습니다.
- 확인된 값: `Secondary/Light 2`는 `#F2F4F6`이며 현재 `Palette/LightGray`와 동일 값입니다.
- 추후 확인: 토큰 alias(`Secondary/Light 2` -> `Palette/LightGray`)를 공식화할지 검토가 필요합니다.
