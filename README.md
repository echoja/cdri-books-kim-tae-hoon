# CDRI Books

카카오 도서 검색 API를 기반으로 구현한 2화면 앱입니다.

## 프로젝트 개요

- 화면
  - `도서 검색`
  - `내가 찜한 책`
- 기술 스택
  - `Vite` + `React` + `TypeScript`
  - `TanStack Router` (파일 기반 라우팅)
  - `TanStack Query`
  - `Dexie(IndexedDB)`
  - `anime.js`
- 핵심 목표
  - `docs/requirements.md` 요구사항 충족
  - 네트워크 실패 시 캐시 fallback
  - 로컬 우선 저장 + 향후 원격 동기화 확장 포인트 확보

## 사전 요구사항

- Node.js 22+
- 카카오 REST API 키 ([developers.kakao.com](https://developers.kakao.com))

## 실행 방법

1. 환경 변수 설정

```bash
cp .env.example .env
```

`.env`에 카카오 REST API 키를 입력합니다.

2. 설치 및 실행

```bash
npm install
npm run dev
```

## 검증 방법

```bash
# 타입 검사
npx tsc --noEmit

# 린트
npm run lint

# 빌드
npm run build

# E2E 테스트 (Playwright)
npx playwright install --with-deps chromium
npm run test:e2e
```

## 폴더 구조

```text
src/
  adapters/        # SyncAdapter(no-op)
  components/      # 공통 UI(헤더, 레이아웃, empty)
  db/              # Dexie 스키마
  domain/          # 타입/규칙/순수 함수
  features/        # 검색/찜/리스트 기능 단위
  repositories/    # 데이터 접근 계층(IDB + fallback)
  routes/          # TanStack file routes
  services/        # Kakao API 클라이언트
  lib/             # query client, persistence, animation 유틸
```

## 라이브러리 선택 이유

- `TanStack Router`: 타입 안전한 파일 기반 라우팅
- `TanStack Query`: 서버 상태 캐시/재시도/prefetch
- `Dexie`: IndexedDB 추상화와 스키마 관리
- `@radix-ui/*`: 접근성 있는 popover/select 구현
- `anime.js`: 핵심 인터랙션 애니메이션 품질 확보
- `ESLint` + `Prettier`: 여전히 가장 널리 사용되는 린트/포매터 조합으로, 생태계 지원(플러그인, IDE 통합, 커뮤니티 문서)이 가장 풍부하다. Biome 같은 올인원 도구도 성장 중이나, 프로젝트에서 사용하는 `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `prettier-plugin-tailwindcss` 등 기존 플러그인 생태계와의 호환성이 확보된 ESLint + Prettier를 선택했다.
- `Playwright`: 실제 사용자 플로우 E2E 검증

## 강조 기능

- 검색 실패 시 `검색 캐시` 자동 fallback 및 `캐시 데이터` 배지 노출
- 검색 기록 `최대 8개` 유지 + 중복 최신화
- 찜하기 `optimistic update` + 실패 시 롤백
- `prefers-reduced-motion` 대응 애니메이션
- 리스트/빈 상태 진입 시 부드러운 페이드인 애니메이션

## 요구사항 준수 체크리스트

| 요구사항 | 상태 |
|---------|------|
| React.js + TypeScript + React Query | OK |
| 카카오 도서 검색 API 연동 | OK |
| `.env` API 키 관리 + `.gitignore` | OK |
| 타이포그래피 토큰 (Title/Body/Caption/Small) | OK |
| 데스크톱 우선 960px 콘텐츠 영역 | OK |
| 헤더: 전폭, 로고 왼쪽, GNB 중앙 | OK |
| GNB: 2항목, 56px 간격, active 밑줄 | OK |
| 검색박스: 3줄 구조, Enter 검색 | OK |
| 검색 입력: 480x48, pill 라운드, 돋보기 | OK |
| 상세검색 패널: 360x160, 그림자, 드롭다운 | OK |
| 검색 기록: 최대 8개, 영속, 개별 삭제 | OK |
| BookListItem 접힘/펼침 레이아웃 | OK |
| 가격 규칙 (할인가 우선) | OK |
| 아코디언 애니메이션 | OK |
| 찜 페이지: 동일 레이아웃, 동일 BookListItem | OK |
| 빈 상태: icon_book.png 80x80 + 텍스트 | OK |
| 버튼 스타일 (primary/secondary/outline) | OK |
| 찜 하트 아이콘 (line.svg/fill.svg) | OK |
| 반응형 브레이크포인트 (1280/768/767) | OK |
| 색상 토큰 | OK |
| 키보드 접근성 (tab/enter/ESC, focus-visible) | OK |
| `prefers-reduced-motion` 지원 | OK |
| 네트워크 오류 시 캐시 fallback + 배지 | OK |

## 프로젝트 규칙

- 커밋 메시지는 한글로 작성합니다.
- 커밋 메시지 형식은 `유형: 변경 요약`을 권장합니다.
- 예시: `문서: 과제 설명 문서 추가`
- `docs/mission.md`는 기준 문서로 고정하며 수정하지 않습니다.
- 작업 중 확정된 요구사항/유의사항/에셋 정보는 `docs/requirements.md`에 누적 관리합니다.
- 디자인 상 참고사항/논의사항은 `docs/notes.md`에서 별도 관리합니다.
- 코드 주석은 JSDoc(`/** */`) 형식으로 작성합니다.
