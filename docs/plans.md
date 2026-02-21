# `docs/plans.md` 최종 계획안 (TanStack Start SPA + 견고한 fallback)

## 요약

- 목표는 `requirements.md` 충족 + `mission.md` 의도를 반영한 고품질 구현입니다.
- 프레임워크는 `TanStack Start`를 채택하되 `SPA 모드`로 제한해 복잡도를 통제합니다.
- 저장 전략은 `IndexedDB(Dexie) 기본 + localStorage fallback`으로 고정합니다.
- 테스트는 `유닛 + E2E(Playwright)`로 운영하고 `RTL+MSW 통합 테스트`는 제외합니다.
- 애니메이션은 `anime.js`를 핵심 인터랙션에만 적용하고, 버튼 상태 전환은 CSS로 유지합니다.

## 범위/비범위

- 범위: 도서 검색 화면, 내가 찜한 책 화면, 상세검색, 검색기록, 찜 기능, 캐시/fallback, 접근성, 제출 문서.
- 비범위: 원격 DB 실제 연동, SSR, Server Functions, 백엔드 구축.

## 기술/라이브러리 결정

- 앱 골격: `@tanstack/react-start` (SPA 모드).
- 라우팅: Start 기본 Router.
- 서버 상태: `@tanstack/react-query`.
- Query 캐시 영속화: `@tanstack/react-query-persist-client`.
- 로컬 저장소: `dexie`(IndexedDB).
- 폼/스키마 검증: `zod`.
- 접근성 UI 프리미티브: `@radix-ui/react-popover`, `@radix-ui/react-select`.
- 에러 경계: `react-error-boundary`.
- 아이콘: `lucide-react` + 제공 에셋.
- 애니메이션: `animejs`.
- 테스트: `vitest`, `playwright`.

## 버전/안정성 정책

- `@tanstack/*`는 exact pin으로 고정합니다.
- Start 관련 호환 이슈 발생 시 fallback은 `Vite + React + TanStack Query + TanStack Router`로 즉시 전환합니다.
- `.env` 기반 API Key 관리와 `.gitignore` 제외를 필수 준수합니다.

## 아키텍처

- 레이어는 `UI -> feature hooks -> repositories -> adapters`로 분리합니다.
- 네트워크는 Kakao Book API 전용 클라이언트 1개로 통일합니다.
- 저장소는 `SearchHistoryRepository`, `FavoritesRepository`, `SearchCacheRepository`로 분리합니다.
- 동기화 확장 포인트로 `SyncAdapter` 인터페이스를 둡니다(기본 구현은 no-op).

## 공개 인터페이스/타입 (추가/확정)

- `SearchTarget = "title" | "person" | "publisher"`.
- `Book`, `SearchParams`, `SearchResult`, `FavoriteRecord`, `SearchHistoryRecord` 타입 정의.
- `source: "network" | "cache"`를 결과 타입에 포함해 fallback 출처를 UI에서 표시 가능하게 유지.
- `SyncAdapter`는 인터페이스만 제공하고 실제 remote 구현은 보류.

## 기능 명세 보강 (requirements 보완)

- 반응형 기준:
  - `>=1280px`: 데스크톱 원본 수치 유지.
  - `768~1279px`: 컨테이너 `min(960px, 100%-64px)`.
  - `<=767px`: 컨테이너 `100%-32px`, 검색행 2줄.
- 텍스트 규칙:
  - 접힘 제목 1줄 ellipsis, 작가 1줄 ellipsis.
  - 펼침 제목 2줄, 소개 8줄(모바일 6줄) 제한.
- 펼침 높이 정책:
  - 최소 `344px`, 최대 `520px`(모바일 `640px`), 초과분은 소개영역 내부 스크롤.
- 검색 기록 정책:
  - 최대 8개, 중복 검색어는 최신으로 재정렬, 개별 삭제 가능, 브라우저 재시작 후 유지.

## 버튼 상태 정의 (신규 확정)

- 공통 상태:
  - `focus-visible`: 2px outline ring (`Palette/Primary`, offset 2px).
  - `disabled`: `cursor: not-allowed`, 클릭 차단, 대비 유지.
  - 상태 전환: `160ms` (`background-color`, `border-color`, `color`).
- 상세검색 버튼(아웃라인):
  - hover: `Palette/LightGray` 배경.
  - disabled: border `Palette/Divider`, text `Icon/Muted`.
- 구매하기 버튼(프라이머리):
  - hover: primary 색상 8% darken.
  - disabled: `#AFC4F4`, text white.
- 상세보기 버튼(세컨더리):
  - hover: `#E7EBEF`.
  - disabled: `#F3F5F7`, text/icon `Icon/Muted`.

## 애니메이션 정책 (anime.js)

- 적용 대상:
  - BookListItem 아코디언 열기/닫기.
  - 상세검색 패널 열기/닫기.
  - 검색기록 레이어 항목 등장(stagger).
- 비적용 대상:
  - 버튼 hover/focus/disabled는 CSS.
- 접근성:
  - `prefers-reduced-motion`에서는 anime duration을 0 처리.
- 안정성:
  - 애니메이션 실패 시 즉시 상태 전환으로 기능 우선 fallback.

## 데이터 저장/fallback

- 기본 저장:
  - 검색 기록, 찜, 검색 캐시 모두 IndexedDB(Dexie)에 저장.
- fallback:
  - IndexedDB 사용 불가/실패 시 검색 기록은 localStorage로 자동 대체.
- 검색 fallback:
  - 네트워크 실패 시 최근 캐시 결과를 `source: cache`로 표기해 노출.
- 에러 정책:
  - 429: 제한적 재시도 + 사용자 안내.
  - 5xx/타임아웃: 재시도 후 캐시 fallback.
  - API 키 오류: 설정 안내 메시지 제공.

## 테스트 케이스/시나리오

- 유닛(Vitest):
  - 가격 노출 규칙(할인가 우선/없음).
  - 검색 기록 8개 제한/FIFO/중복 재정렬.
  - 찜 optimistic update 및 실패 롤백.
  - 상세검색 target 매핑(title/person/publisher).
- E2E(Playwright):
  - Enter 검색 -> 리스트 렌더 -> 페이지 이동.
  - 상세검색 열기/선택/검색.
  - 찜 추가/해제와 내가 찜한 책 동기 반영.
  - 새로고침 후 검색 기록/찜 유지.
  - API 장애 시 안내 및 캐시 fallback 동작.
- 제외:
  - RTL+MSW 통합 테스트는 이번 계획에서 제외.

## 구현 순서

1. Start SPA 프로젝트 초기화와 라우트 골격 구축.
2. 토큰/공통 레이아웃/헤더/GNB 구현.
3. Kakao API 클라이언트 + Query 훅 + 검색 결과 리스트.
4. 상세검색 패널/검색 기록(IndexedDB+fallback).
5. BookListItem 접힘/펼침/가격 규칙/버튼 상태.
6. 찜 기능과 내가 찜한 책 화면 연결.
7. anime.js 핵심 인터랙션 적용 + reduced-motion 대응.
8. 유닛/E2E 작성 및 제출 문서 정리.

## 수용 기준

- `requirements.md`의 수치/레이아웃/동작 요구를 모두 충족합니다.
- 모바일 기준이 명시된 보완 규칙대로 정상 동작합니다.
- 네트워크 실패 시 앱이 깨지지 않고 fallback UI/데이터를 제공합니다.
- 키보드 접근(탭/엔터/ESC)과 focus-visible이 정상 동작합니다.
- 테스트(`unit`, `e2e`)가 성공하고 제출 문서가 완비됩니다.

## 가정 및 기본값

- `docs/mission.md`는 변경하지 않습니다.
- 백엔드는 추가하지 않습니다.
- 원격 DB 동기화는 인터페이스만 설계하고 실제 구현은 후속 작업으로 남깁니다.
- Start는 SPA 모드로 고정하며 SSR/Server Functions는 도입하지 않습니다.
