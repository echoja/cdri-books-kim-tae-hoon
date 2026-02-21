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

# 미사용 의존성 검증
npm run knip

# 빌드
npm run build

# E2E 테스트 (Playwright)
npx playwright install --with-deps chromium
npm run test:e2e
```

## 폴더 구조

```text
src/
  assets/          # 이미지, 아이콘 등 정적 에셋
  adapters/        # SyncAdapter(no-op)
  components/      # 공통 UI(헤더, 레이아웃, BookList, empty)
  db/              # Dexie 스키마
  domain/          # 타입/규칙/순수 함수
  features/        # 검색/찜 기능 단위
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
- `knip`: 미사용 파일/의존성/export 탐지로 코드베이스 청결 유지
- `Playwright`: 실제 사용자 플로우 E2E 검증

## 강조 기능

- 검색 실패 시 `검색 캐시` 자동 fallback 및 `캐시 데이터` 배지 노출
- 검색 기록 `최대 8개` 유지 + 중복 최신화
- 찜하기 `optimistic update` + 실패 시 롤백
- `prefers-reduced-motion` 대응 애니메이션
- 리스트/빈 상태 진입 시 부드러운 페이드인 애니메이션

## 프로젝트 규칙

### 커밋
- 커밋 메시지는 한글로 작성합니다.
- 커밋 메시지 형식은 `유형: 변경 요약`을 권장합니다.
- 예시: `문서: 과제 설명 문서 추가`
- 내용이 많은 경우 주제별로 나눠서 커밋합니다.

### 문서
- `docs/mission.md`는 기준 문서로 고정하며 수정하지 않습니다.
- 작업 중 확정된 요구사항/유의사항/에셋 정보는 `docs/requirements.md`에 누적 관리합니다.
- 디자인 상 참고사항/논의사항은 `docs/notes.md`에서 별도 관리합니다.

### 코드 스타일
- 코드 주석은 JSDoc(`/** */`) 형식으로 작성합니다.
- `==`, `!=` 금지. 항상 `===`, `!==` 사용 (`eqeqeq` 규칙).
- `curly` 규칙 적용 — `if`/`else`/`for`/`while` 등에 항상 중괄호를 사용합니다.
- Prettier 설정: `semi: true`, `singleQuote: false`.
- Tailwind 클래스는 canonical 값을 사용합니다 (예: `gap-[6px]` → `gap-1.5`).
- `className`에 template literal 금지 — `cva()`/`cn()`을 사용합니다.
- `clsx`, `tailwind-merge`, `class-variance-authority` 직접 import 금지 — `@/lib/class-name`을 사용합니다.

### 임포트
- 에셋(이미지, 아이콘)은 `src/assets/` 에 배치하고, `@/assets/...` 절대경로로 임포트합니다.
- 상대경로 임포트는 같은 디렉토리 또는 바로 하위만 허용합니다. 그 외에는 `@/...` 별칭을 사용합니다.

### 아키텍처
- 무조건 CSR(SPA)이므로 `typeof window === "undefined"` 체크를 하지 않습니다.
- 외부 API 클라이언트의 파라미터 인터페이스는 실제 API 스펙에 맞춰 정의합니다 (내부 타입과 분리).
- `knip`으로 미사용 의존성을 검증합니다 (`npm run knip`).
