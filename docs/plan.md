## UI 계획 정리

### 문서 운영 규칙

- 작업 대화에서 확정된 내용은 `docs/plan.md`의 요구사항/유의사항/에셋 섹션에 계속 반영합니다.
- 신규 요청은 성격에 맞게 `요구사항` 또는 `유의사항`으로 즉시 정리합니다.
- `docs/mission.md`는 수정하지 않고 참조 전용으로 유지합니다.

### 요구사항

- 타이포그래피(Title/Body/Caption/Small) 폰트 스타일은 디자인 시스템 토큰으로 정의하고 전역에서 재사용해야 합니다.

### 유의사항

- 에셋 파일은 루트가 아닌 `assets/` 하위 경로에서 목적별로 관리합니다.

### 에셋

- `assets/icons/line.svg`: 빈 하트 아이콘 (추후 찜 기능에서 사용)
- `assets/icons/fill.svg`: 채워진 하트 아이콘 (찜 완료 상태에서 사용)

### 타이포그래피

#### Title1

- font-family: `Noto Sans KR`
- font-weight: `700`
- font-style: `Bold`
- font-size: `24px`
- leading-trim: `NONE`
- line-height: `24px`
- letter-spacing: `0%`

#### Title2

- font-family: `Noto Sans KR`
- font-weight: `700`
- font-style: `Bold`
- font-size: `22px`
- leading-trim: `NONE`
- line-height: `24px`
- letter-spacing: `0%`

#### Title3

- font-family: `Noto Sans KR`
- font-weight: `700`
- font-style: `Bold`
- font-size: `18px`
- leading-trim: `NONE`
- line-height: `18px`
- letter-spacing: `0%`

#### Body2

- font-family: `Noto Sans KR`
- font-weight: `500`
- font-style: `Medium`
- font-size: `14px`
- leading-trim: `NONE`
- line-height: `14px`
- letter-spacing: `0%`

#### Body2 Bold

- font-family: `Noto Sans KR`
- font-weight: `700`
- font-style: `Bold`
- font-size: `14px`
- leading-trim: `NONE`
- line-height: `14px`
- letter-spacing: `0%`

#### Caption

- font-family: `Noto Sans KR`
- font-weight: `500`
- font-style: `Medium`
- font-size: `16px`
- leading-trim: `NONE`
- line-height: `16px`
- letter-spacing: `0%`

#### Small

- font-family: `Noto Sans KR`
- font-weight: `500`
- font-style: `Medium`
- font-size: `10px`
- leading-trim: `NONE`
- line-height: `10px`
- letter-spacing: `0%`

### 색상 토큰

- `Palette/White`: `#FFFFFF` (`white`)
- `Palette/Black`: `#222222`
- `Text/Primary`: `#353C49`
- `Text/Secondary`: `#6D7582`
- `Text/Subtitle`: `#8D94A0`
- `Palette/Gray`: `#DADADA`
- `Palette/LightGray`: `#F2F4F6`
- `Palette/Primary`: `#4880EE`
- `Palette/Red`: `#E84118`

### 색상 유의사항

- `fill=\"none\"`은 투명값으로 색상 토큰이 아닌 렌더링 속성으로 분리 관리합니다.

### 공통 헤더

- 좌측 로고 텍스트: `CERTICOS BOOKS`
- 타이포그래피 토큰: `Title1`

### 상단 GNB

- 메뉴
  - `도서 검색`
  - `내가 찜한 책`
- 타이포그래피 토큰: `Body1`
  - Font: `Noto Sans KR`
  - Weight: `500`
  - Style: `Medium`
  - Size: `20px`
  - Line-height: `20px`
  - Letter-spacing: `0%`
