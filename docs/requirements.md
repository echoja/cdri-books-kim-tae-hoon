## UI 계획 정리

### 문서 운영 규칙

- 작업 대화에서 확정된 내용은 `docs/requirements.md`의 요구사항/유의사항/에셋 섹션에 계속 반영합니다.
- 신규 요청은 성격에 맞게 `요구사항` 또는 `유의사항`으로 즉시 정리합니다.
- `docs/mission.md`는 수정하지 않고 참조 전용으로 유지합니다.
- 디자인 상 참고사항/논의사항/어색한 포인트는 `docs/notes.md`에 누적 기록합니다.

### 요구사항

- 타이포그래피(Title/Body/Caption/Small) 폰트 스타일은 디자인 시스템 토큰으로 정의하고 전역에서 재사용해야 합니다.
- 전체 디자인 구현 기준은 데스크톱입니다.
- 본문 컨텐츠 영역의 가로 사이즈는 데스크톱 기준 `960px`로 구현합니다.
- 모바일 레이아웃은 Figma 기준이 없으므로 별도 계획(`plans.md`)으로 정의합니다. (피그마에 없음)
- 페이지는 총 2개 화면으로 구성합니다.
  - `도서 검색` 화면
  - `내가 찜한 책` 화면
- 성능 고려 (내용 미정)
- 페이지 공통 배치는 `페이지 상단 여백 없음` + `가운데 정렬` + `헤더 -> 80px -> 검색 박스 -> 36px -> 본문` 순서를 따릅니다.

#### API 연동

- API 연동은 별도 백엔드 연동 없이 `다음 검색 - 책` API만 사용합니다.
- API 문서 참조:
  - `https://developers.kakao.com/docs/latest/ko/getting-started/quick-start`
  - `https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book`

#### 공통 헤더 (GNB 포함)

- 공통 헤더는 화면 전체 폭(`100%`)을 사용합니다.
- 헤더 좌우 패딩은 `160px`입니다.
- 헤더 내 로고는 좌측 정렬, GNB는 가운데 정렬로 배치합니다.
- GNB 메뉴는 `도서 검색`, `내가 찜한 책` 2개로 구성합니다.
- GNB 메뉴 간 간격은 `56px`입니다.
- 활성 탭 시각 규칙은 `텍스트 하단 border-bottom 1px #4880EE`를 사용합니다.
- 타이포그래피 토큰은 `Body1`을 사용합니다.
  - Font: `Noto Sans KR`
  - Weight: `500`
  - Style: `Medium`
  - Size: `20px`
  - Line-height: `20px`
  - Letter-spacing: `0%`

#### 도서검색 BOX

- `도서 검색` 화면은 `일반 검색`과 `상세 검색`으로 구분합니다.
- `도서 검색` 상단 기본 영역은 `도서검색(제목)`, 검색 input, `상세검색` 버튼으로 구성합니다.
- `도서검색 box`는 세로 배치, 좌측 정렬 구조로 구성합니다.
- `도서검색 box`는 3줄 구조로 구성합니다.
  - 1줄: `도서 검색` 텍스트 (`Title2`, 색상 `Text/Title`)
  - 2줄: 검색 input + 우측 `상세검색` 버튼 (세로 중앙 정렬)
  - 3줄: `검색결과` + `총 N건` 텍스트
- 3줄 카운트 텍스트는 `검색결과`와 `총 N건`을 서로 다른 span으로 분리합니다.
- 두 span 간 간격은 `16px`입니다.
- `총 N건`에서 숫자 `N` 텍스트 색상은 `Palette/Primary`를 사용합니다.
- 줄 간 간격은 `1줄-2줄 16px`, `2줄-3줄 24px`를 사용합니다.
- 검색 input 스타일은 다음을 따릅니다.
  - 배경색: `Secondary/Light 2` (Figma 기준)
  - 좌측 아이콘: `search svg` (`30x30`, 색상 `Text/Default`)
  - input 크기: `480x48`
  - 아이콘과 텍스트 간 간격: `11px`
  - border: 없음
  - border-radius: `24px`
- 검색 input과 `상세검색` 버튼 간 간격은 `16px`입니다.
- `상세검색` 버튼 스타일은 `버튼` 섹션 기준을 따릅니다.
- 일반 검색은 별도 검색 버튼 없이 `Enter` 입력으로 실행합니다.
- 검색창 placeholder는 `검색어 입력`으로 고정합니다.
- 검색 기록 저장 기능을 제공합니다. (최대 8개)
- 검색 기록이 8개를 초과하면 가장 오래된 기록부터 삭제합니다.
- 브라우저 재시작 후에도 검색 기록 목록이 유지되어야 합니다.

#### 검색 기록 UI

- 검색 기록 UI는 아래 명시된 수치를 기준으로 구현합니다.
- 검색 기록 레이어는 검색 input 하단에 노출합니다.
- 검색 기록 컨테이너는 `480x153`, `border-radius: 24px`, 배경 `Secondary/Light 2`입니다.
- 검색 기록 항목의 우측 삭제 버튼은 `24x24`입니다.

#### 북 검색 결과 리스트

- 검색어 입력 후 `Enter` 키를 누르면 검색을 실행합니다.
- 검색 결과 리스트는 페이지당 10개 아이템을 노출합니다.
- 초기화면 또는 검색 결과가 없는 상태에서는 Empty UI를 노출합니다.
  - 아이콘: `assets/icons/icon_book.png` (`80x80`)
  - 텍스트: `검색된 결과가 없습니다` (`24px`)
  - 이미지와 텍스트 간 간격: `24px`
  - 이미지+텍스트 묶음은 뷰포트 중앙 정렬

#### BookListItem (접힘, 펼침 포함)

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
- `구매하기` 버튼 클릭 시 새 탭에서 해당 책의 다음 책 상세페이지로 이동해야 합니다.
- `BookListItem` 접힘 상태 기준값(디자인 노드 `2143:449`)은 다음 수치를 기준으로 구현합니다.
  - 아이템 높이: `100`
  - 아이템 내부 패딩: 상하 `16px`, 좌 `48px`, 우 `16px`
  - 하단 divider: `height=1`, 색상 `#D2D6DA` (`Palette/Divider`)
  - 도서 썸네일: `48x68`
  - 찜 아이콘(하트): 썸네일 프레임 우상단 오버레이, `16x16`, `right 0`, `top 0`
  - 썸네일과 텍스트 블록 사이 간격: `48px`
  - 텍스트 블록: `408x18`
  - 제목(`Title3`): `18px Bold`, 색상 `Text/Primary`
  - 작가(`Body2`): 제목 우측 `16px` 간격, `14px Medium`, 색상 `Text/Secondary`
  - 텍스트 블록과 가격 사이 간격: `22px`
  - 가격(`Title3`): 우측 정렬, 색상 `Text/Primary`
  - 가격과 우측 액션 버튼 그룹 사이 간격: `56px`
  - 우측 액션 버튼 간 간격: `8px`
  - 버튼 스타일은 `버튼` 섹션 기준을 따릅니다.
  - 텍스트/가격/버튼은 아이템 높이 기준 수직 중앙 정렬
  - 제목/작가의 텍스트 줄바꿈/말줄임 처리 규칙은 별도 계획(`plans.md`)으로 정의합니다. (피그마에 없음)
- `BookListItem` 펼침 상태 기준값(디자인 노드 `2143:567`)은 다음 수치를 기준으로 구현합니다.
  - 아코디언이 펼쳐지면 아이템 높이는 콘텐츠에 맞춰 확장됩니다.
  - 아이템 내부 패딩: 상 `24px`, 좌 `54px`, 우 `16px`
  - 하단 divider: `height=1`, 색상 `#D2D6DA` (`Palette/Divider`)
  - 좌측 도서 이미지: `210x280`
  - 찜 아이콘(하트): `24x24`, 이미지 우상단 오버레이, `right 8px`, `top 8px`
  - 도서 이미지와 중앙 상세 정보 영역 간격: `32px`
  - 중앙 상세 정보 영역: 제목/작가 행 + 책 소개 영역으로 구성
  - 제목과 작가 간격: `16px`
  - 제목/작가 행과 책 소개 영역 간격: `16px`
  - 책 소개 제목과 본문 간격: `12px`
  - 책 소개 본문: `10px`, `line-height 16px`, 색상 `Text/Primary`
  - 중앙 상세 정보 영역과 우측 가격/액션 영역 간격: `163px`
  - 우측 하단 `PriceBox`: 원가 행 + 할인가 행(행 간격 `8px`) + `구매하기` 버튼
  - 가격 행 내부: 라벨과 가격 간격 `8px`
  - 가격 라벨(`원가`, `할인가`): `10px`, 색상 `Text/Subtitle`
  - 가격 값: `18px`, 색상 `Text/Primary`
  - 우측 액션 영역은 상단 `상세보기` 버튼 + 하단 `PriceBox` 구조로 배치합니다.
  - 우측 상단 `상세보기` 버튼과 하단 `구매하기` 버튼은 모두 `버튼` 섹션 기준을 따릅니다.
  - 펼침 상태 `구매하기` 버튼은 `PriceBox` 내부에서 우측 액션 영역 폭을 채우는 블록형으로 배치합니다.
  - 펼침 상태 높이 최소/최대값은 별도 계획(`plans.md`)으로 정의합니다. (피그마에 없음)

#### BookListItem 요소 트리 (Parent-Children / Layout Direction / Gap)

- 접힘 상태 (`2143:449`) 트리
```text
BookListItemCollapsed [dir=column]
├─ ContentRow [dir=row, align=center]
│  ├─ ThumbnailWrap [dir=overlay]
│  │  ├─ BookImage (48x68)
│  │  └─ LikeBadge (16x16, top 0 / right 0)
│  ├─ MetaRow [dir=row, gap=16]
│  │  ├─ Title
│  │  └─ Author
│  └─ PriceAndActions [dir=row, gap=56]
│     ├─ Price
│     └─ ActionButtons [dir=row, gap=8]
│        ├─ BuyButton
│        └─ DetailButton (text-chevron gap=19)
├─ InterGroupGap: ThumbnailWrap ↔ MetaRow = 48
└─ InterGroupGap: MetaRow ↔ PriceAndActions = 22
```
- 펼침 상태 (`2143:567`) 트리
```text
BookListItemExpanded [dir=column]
├─ ContentRow [dir=row, align=start]
│  ├─ ThumbnailWrap [dir=overlay]
│  │  ├─ BookImage (210x280)
│  │  └─ LikeBadge (24x24, top 8 / right 8)
│  ├─ MainInfoColumn [dir=column, gap=16]
│  │  ├─ MetaRow [dir=row, gap=16]
│  │  │  ├─ Title
│  │  │  └─ Author
│  │  └─ IntroColumn [dir=column, gap=12]
│  │     ├─ IntroLabel
│  │     └─ IntroText
│  └─ RightColumn [dir=column, justify=space-between]
│     ├─ DetailButton (chevron up, top)
│     └─ PriceBox [dir=column, gap=8, bottom]
│        ├─ OriginPriceRow [dir=row, gap=8]
│        ├─ SalePriceRow [dir=row, gap=8]
│        └─ BuyButton (block)
├─ InterGroupGap: ThumbnailWrap ↔ MainInfoColumn = 32
└─ InterGroupGap: MainInfoColumn ↔ RightColumn = 163
```

#### 버튼

- 모든 버튼은 고정 `width/height`가 아닌 상하좌우 `padding`으로 크기를 결정합니다.
- 버튼 공통 스타일
  - border-radius: `8px`
  - 타이포그래피: `Caption` (`16px`, `Medium`)
- `도서검색 BOX`의 `상세검색` 버튼
  - padding: 상하 `5px`, 좌우 `10px`
  - border: `1px solid Text/Subtitle`
  - 텍스트 색상: `Text/Subtitle`
  - 배경: `Palette/White`
- BookListItem `구매하기` 버튼
  - padding: 상하 `16px`, 좌우 `28px`
  - 배경: `Palette/Primary`
  - 텍스트 색상: `#FFFFFF`
- BookListItem `상세보기` 버튼
  - padding: 상하 `16px`, 좌우 `20px`
  - 배경: `Palette/LightGray`
  - 텍스트 색상: `Text/Secondary`
  - chevron 아이콘: `lucide-react`의 `ChevronDown/ChevronUp` 사용
  - chevron 색상: `#B1B8C0` (`Icon/Muted`)
  - 텍스트와 chevron 간 간격: `19px`

#### 찜 버튼 (내용 추가 예정)

- 빈 하트(`assets/icons/line.svg`)와 채워진 하트(`assets/icons/fill.svg`)를 상태에 따라 사용합니다.
- 상세 동작 및 조건은 추후 추가합니다.

#### 상세 검색 기능 관련

- `상세검색` 버튼 클릭 시 검색 영역 바로 하단에 작은 모달(패널) 형태로 표시됩니다.
- 상세검색 패널 레이아웃은 아래 명시된 수치를 기준으로 구현합니다.
- 상세검색 패널 박스는 `360x160`, `border-radius: 8px`, 배경 `Palette/White`입니다.
- 상세검색 패널 내부 패딩은 `상하 36px`, `좌우 24px`입니다.
- 상세검색 패널은 그림자(`y=4`, `blur=14`, `spread=6`, `rgba(151,151,151,0.15)`)를 사용합니다.
- 상세검색 모달은 다음 요소를 포함해야 합니다.
  - 우상단 닫기 버튼 (`X`)
  - 검색 기준 선택 드롭다운 (기본값 `제목`, chevron down 아이콘 포함)
  - 검색어 입력 input (`검색어 입력`)
  - 하단 `검색하기` 버튼
- 상세검색 패널 내부 레이아웃은 좌측 `필터 100x36`, 우측 `검색어 input 208x36`을 사용합니다.
- 하단 `검색하기` 버튼은 높이 `36px`, 가로 `100%`를 사용합니다.
- 필터와 검색어 input 사이는 `4px`, 입력 행과 하단 버튼 사이는 `16px`입니다.
- 검색 기준 드롭다운 옵션은 최소 `저자명`, `출판사`를 포함해야 합니다.
- 드롭다운이 열리면 기준 선택 영역 바로 아래에 옵션 리스트가 표시되어야 합니다.
- 드롭다운 옵션 리스트는 가로 사이즈 제한 없이, 세로 `60px`(옵션 2개 `30px`씩) 구조를 사용합니다.
- 상세검색 모달 배치는 제공된 참조 이미지와 동일한 구조를 따릅니다.

#### 내가 찜한 책 관련

- `내가 찜한 책` 화면은 `도서 검색` 화면과 전체 레이아웃 구조를 동일하게 사용합니다.
- 상단은 검색 input/상세검색 버튼 없이 헤딩 영역만 사용합니다.
- 제목은 `내가 찜한 책`, 카운트 영역은 `찜한 책` + `총 N건` 형식을 사용합니다.
- 카운트 영역은 `찜한 책`과 `총 N건`을 서로 다른 span으로 분리하고 span 간 간격은 `16px`입니다.
- `총 N건`에서 숫자 `N` 텍스트 색상은 `Palette/Primary`를 사용합니다.
- 카운트 영역 디자인(텍스트 분리/간격/숫자 색상)은 `도서 검색` 화면의 `검색결과` 카운트와 동일하게 적용합니다.
- `내가 찜한 책` 리스트 아이템은 `북 검색 결과 리스트`의 `BookListItem`과 기능/디자인이 동일해야 합니다.
- 접힘/펼침 레이아웃, 가격 노출 규칙, 버튼 구성(`구매하기`, `상세보기`), 애니메이션 규칙을 동일하게 적용합니다.
- 구현은 동일 컴포넌트 재사용을 기본으로 하며, 데이터 소스만 `찜한 책 목록`으로 변경합니다.

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

#### Body1

- font-family: `Noto Sans KR`
- font-weight: `500`
- font-style: `Medium`
- font-size: `20px`
- leading-trim: `NONE`
- line-height: `20px`
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
- `Text/Default`: `#353C49`
- `Text/Secondary`: `#6D7582`
- `Text/Subtitle`: `#8D94A0`
- `Text/Title`: `#1A1E27`
- `Palette/Gray`: `#DADADA`
- `Palette/LightGray`: `#F2F4F6`
- `Palette/Primary`: `#4880EE`
- `Palette/Red`: `#E84118`
- `Palette/Divider`: `#D2D6DA` (BookListItem 행 구분선)
- `Icon/Muted`: `#B1B8C0` (`상세보기` chevron)

### 공통 헤더

- 좌측 로고 텍스트: `CERTICOS BOOKS`
- 타이포그래피 토큰: `Title1`
- GNB는 공통 헤더에 포함합니다.
