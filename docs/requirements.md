## UI 계획 정리

### 문서 운영 규칙

- 작업 대화에서 확정된 내용은 `docs/requirements.md`의 요구사항/유의사항/에셋 섹션에 계속 반영합니다.
- 신규 요청은 성격에 맞게 `요구사항` 또는 `유의사항`으로 즉시 정리합니다.
- `docs/mission.md`는 수정하지 않고 참조 전용으로 유지합니다.
- 디자인 상 의문사항/어색한 포인트는 `docs/questions.md`에 누적 기록합니다.

### 요구사항

- 타이포그래피(Title/Body/Caption/Small) 폰트 스타일은 디자인 시스템 토큰으로 정의하고 전역에서 재사용해야 합니다.
- 페이지는 총 2개 화면으로 구성합니다.
  - `도서 검색` 화면
  - `내가 찜한 책` 화면
- `도서 검색` 화면은 `일반 검색`과 `상세 검색`으로 구분합니다.
- `도서 검색` 상단 기본 영역은 `도서검색(제목)`, 검색 input, `상세검색` 버튼으로 구성합니다.
- `도서검색 box`는 2줄 구조로 구성합니다.
  - 1줄: `도서 검색` 텍스트 (`Title2`, 색상 `Text/Title`)
  - 2줄: 검색 input + 우측 `상세검색` 버튼
- 검색 input 스타일은 다음을 따릅니다.
  - 배경색: `Secondary/Light 2` (Figma 기준)
  - 좌측 아이콘: `search svg` (`30x30`, 색상 `Text/Default`)
  - 형태: full-rounded
- `상세검색` 버튼 스타일은 다음을 따릅니다.
  - `1px` border, `8px` radius, padding `5px 10px`
  - 텍스트 색상: `Text/Subtitle`
  - border 색상: `Text/Subtitle`
- 일반 검색은 별도 검색 버튼 없이 `Enter` 입력으로 실행합니다.
- 검색창 placeholder는 `검색어 입력`으로 고정합니다.
- 검색 기록 저장 기능을 제공합니다. (최대 8개)
- 검색 기록이 8개를 초과하면 가장 오래된 기록부터 삭제합니다.
- 브라우저 재시작 후에도 검색 기록 목록이 유지되어야 합니다.
- 검색어 입력 후 `Enter` 키를 누르면 검색을 실행합니다.
- 검색 결과 리스트는 페이지당 10개 아이템을 노출합니다.
- 초기화면 또는 검색 결과가 없는 상태에서는 Empty UI를 노출합니다.
  - 아이콘: `assets/icons/icon_book.png` (`80x80`)
  - 텍스트: `검색된 결과가 없습니다` (`24px`)
  - 이미지와 텍스트 간 간격: `24px`
  - 이미지+텍스트 묶음은 화면 중앙 정렬
- `구매하기` 버튼 클릭 시 새 탭에서 해당 책의 다음 책 상세페이지로 이동해야 합니다.
- 성능 고려 (내용 미정)
- 검색 결과 개별 아이템은 다음 요소를 포함해야 합니다.
  - 책 이미지
  - 책 제목
  - 작가 이름
  - 가격 정보 (할인가 우선)
  - `구매하기` 버튼
  - `상세보기` 버튼 (chevron down 아이콘 포함)
- `상세보기` 버튼 클릭 시 아코디언(accordion)처럼 펼침/접힘 토글 동작을 해야 합니다.
- `상세보기`가 펼쳐진 상태는 다음 요소를 포함해야 합니다.
  - 책 이미지 (크게)
  - 책 제목
  - 작가 이름
  - 책 소개
  - `상세보기` 버튼 (chevron up 아이콘 포함)
  - 원가
  - 할인가
  - `구매하기` 버튼
- 검색 결과 아이템 배치는 제공된 참조 이미지와 동일한 구조를 따라야 합니다.
  - 접힘 상태: 좌측 썸네일, 중앙 제목/작가, 우측 가격(할인가 우선) + `구매하기` + `상세보기(chevron down)`
  - 펼침 상태(accordion): 좌측 큰 책 이미지, 중앙 상세 정보(제목/작가/소개), 우측 가격 정보(원가/할인가)와 `구매하기`, 우상단 `상세보기(chevron up)`
- 가격 노출 규칙은 다음을 따릅니다.
  - 할인가는 있을 수도 있고 없을 수도 있습니다.
  - 접힘 상태에서는 할인가가 있으면 할인가를 우선 노출합니다.
  - 펼침 상태에서는 원가와 할인가를 모두 노출합니다.
  - 할인가가 없는 경우에는 할인가 항목을 노출하지 않습니다.
- `상세검색` 버튼 클릭 시 검색 영역 바로 하단에 작은 모달(패널) 형태로 표시됩니다.
- 상세검색 모달은 다음 요소를 포함해야 합니다.
  - 우상단 닫기 버튼 (`X`)
  - 검색 기준 선택 드롭다운 (기본값 `제목`, chevron down 아이콘 포함)
  - 검색어 입력 input (`검색어 입력`)
  - 하단 `검색하기` 버튼
- 검색 기준 드롭다운 옵션은 최소 `저자명`, `출판사`를 포함해야 합니다.
- 드롭다운이 열리면 기준 선택 영역 바로 아래에 옵션 리스트가 표시되어야 합니다.
- 상세검색 모달 배치는 제공된 참조 이미지와 동일한 구조를 따릅니다.

### 컴포넌트 설계 원칙

- 원칙 1. 화면 결과는 Figma와 동일하게 구현합니다. (레이아웃, 간격, 크기, 색상, 타이포)
- 원칙 2. 컴포넌트 구조는 역할 중심으로 재해석합니다. (`SearchBar`, `BookCard`, `BookList`, `Header` 등)
- 원칙 3. Figma 컴포넌트 트리를 1:1로 복제하지 않습니다. 재사용성과 책임 분리를 우선합니다.
- 원칙 4. 동일 UI 패턴이 3회 이상 반복되면 공통 컴포넌트로 추출합니다.
- 원칙 5. 상태는 `props`로 분리합니다. (`default`, `active`, `disabled`, `empty` 등)
- 원칙 6. 스타일 값은 디자인 토큰(타이포/색상) 사용을 우선합니다.
- 원칙 7. 스타일 하드코딩은 ESLint/Stylelint 등 정적 분석 규칙으로 감지 가능해야 합니다.
- 원칙 8. 판단 충돌 시 우선순위는 `시각적 일치 > 접근성/동작 정확성 > 코드 재사용성`으로 따릅니다.

### 유의사항

- 에셋 파일은 루트가 아닌 `assets/` 하위 경로에서 목적별로 관리합니다.

### 에셋

- `assets/icons/line.svg`: 빈 하트 아이콘 (추후 찜 기능에서 사용)
- `assets/icons/fill.svg`: 채워진 하트 아이콘 (찜 완료 상태에서 사용)
- `assets/icons/icon_book.png`: Empty UI 아이콘 (`80x80`)
- `assets/icons/search.svg`: 검색 input 좌측 아이콘 (`30x30`)

### 타이포그래피

#### Title1

- font-family: `Noto Sans KR`
- font-weight: `700`
- font-style: `Bold`
- font-size: `24px`
- line-height: `24px`
- letter-spacing: `0%`

#### Title2

- font-family: `Noto Sans KR`
- font-weight: `700`
- font-style: `Bold`
- font-size: `22px`
- line-height: `24px`
- letter-spacing: `0%`

#### Title3

- font-family: `Noto Sans KR`
- font-weight: `700`
- font-style: `Bold`
- font-size: `18px`
- line-height: `18px`
- letter-spacing: `0%`

#### Body2

- font-family: `Noto Sans KR`
- font-weight: `500`
- font-style: `Medium`
- font-size: `14px`
- line-height: `14px`
- letter-spacing: `0%`

#### Body2 Bold

- font-family: `Noto Sans KR`
- font-weight: `700`
- font-style: `Bold`
- font-size: `14px`
- line-height: `14px`
- letter-spacing: `0%`

#### Caption

- font-family: `Noto Sans KR`
- font-weight: `500`
- font-style: `Medium`
- font-size: `16px`
- line-height: `16px`
- letter-spacing: `0%`

#### Small

- font-family: `Noto Sans KR`
- font-weight: `500`
- font-style: `Medium`
- font-size: `10px`
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
