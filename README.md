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
- 핵심 목표
  - `docs/requirements.md` 요구사항 충족
  - 로컬 우선 저장 + 향후 원격 동기화 확장 가능성 확보

### 폴더 구조

```text
src/
  assets/          # 이미지, 아이콘 등 정적 에셋
  adapters/        # SyncAdapter(no-op)
  components/      # React 컴포넌트(헤더, 레이아웃, BookList, 검색 패널 등)
  db/              # Dexie 스키마
  hooks/           # 커스텀 훅(검색, 찜, 검색 기록)
  lib/             # 타입, 순수 함수, query client, persistence 유틸
  pages/           # 페이지 컴포넌트(검색, 찜)
  repositories/    # 데이터 접근 계층(IDB + fallback)
  routes/          # TanStack file routes
  services/        # Kakao API 클라이언트
```


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

# 미사용 의존성 및 변수 검증
npm run knip

# 빌드
npm run build

# E2E 테스트 (Playwright)
npx playwright install --with-deps chromium
npm run test:e2e
```

## 필수 요건

- `React` + `TypeScript`
- `TanStack Query`: 서버 상태 캐시/재시도/prefetch 

## 그외 라이브러리 선택 이유

- `TailwindCSS`: 유틸리티 클래스 기반 빠른 스타일링과 일관된 디자인 시스템 구현.
- `TanStack Router`: 타입 안전한 파일 기반 라우팅. URL params·search params에 대한 타입 추론이 내장되어 있어 런타임 파싱 오류를 줄인다.
- `ESLint` + `Prettier`: 여전히 가장 널리 사용되는 린트/포매터 조합으로, 생태계 지원(플러그인, IDE 통합, 커뮤니티 문서)이 가장 풍부하다. Biome 같은 올인원 도구도 성장 중이나, 프로젝트에서 사용하는 `prettier-plugin-tailwindcss` 등 기존 플러그인 생태계와의 호환성이 확보된 라이브러리를 선택함.
- `Dexie`: IndexedDB 추상화와 스키마 관리. localStorage 대비 현대적인 브라우저 스토리지 API를 활용하면서도, low-level API의 복잡성을 줄여준다.
- `@radix-ui/*`: 컴포넌트 종류가 풍부하고, unstyled 원시 요소만 제공해 Tailwind와 자연스럽게 결합된다.
- `lucide-react`: 경량 아이콘 라이브러리. 일관되고 심플한 아이콘 셋 제공됨.
- `sonner`: 기본 UX가 충실한 경량 토스트 알림. unstyled 모드로 프로젝트 디자인에 맞게 커스터마이징 가능.
- `cva` + `clsx` + `tailwind-merge`: 컴포넌트 정의할 때 Tailwind 클래스 관리를 편하게 진행할 수 있음. `cva`로 컴포넌트별 variant 정의, `clsx`로 조건부 클래스 조합, `tailwind-merge`로 클래스 충돌 해결.
- `React Compiler`: 빌드 타임 자동 메모이제이션으로 손쉽게 성능 최적화를 달성할 수 있는 가성비 좋은 솔루션.
- `knip`: 미사용 파일/의존성/export 탐지로 코드베이스 청결 유지 (AI Agents가 코드를 탐색할 때의 비용 감소).
- `Playwright`: 실제 사용자 플로우 E2E 검증.

## 강조 기능

- 찜하기 `optimistic update` + 실패 시 롤백
- `React Compiler` 빌드 타임 자동 메모이제이션
- 다음 페이지 `prefetch` + `keepPreviousData`로 깜빡임 없는 페이지 전환
- 찜 목록 `Dexie(IndexedDB)`에 저장 및 `SyncAdapter` 패턴으로 원격 동기화 확장 준비
- 커스텀 ESLint 규칙으로 코드 스타일과 아키텍처 일관성 유지
- `E2E 테스트`(Playwright) — 검색·페이지네이션·찜·기록 등 주요 플로우 검증

## 프로젝트 규칙

### 커밋
- 커밋 메시지는 한글로 작성합니다.
- 커밋 메시지 형식은 `유형: 변경 요약`을 권장합니다.
- 예시: `문서: 과제 설명 문서 추가`
- 내용이 많은 경우 주제별로 나눠서 커밋합니다.

### 문서
- `docs/mission.md`는 기준 문서로 고정하며 수정하지 않습니다.
- Figma에서 정리된 기획/디자인 사항은 `docs/requirements.md`에서 관리합니다.
- 참고사항/논의사항은 `docs/notes.md`에서 별도 관리합니다.

### 코드 스타일
- 코드 주석은 JSDoc(`/** */`) 형식으로 작성합니다.
- `==`, `!=` 금지. 항상 `===`, `!==` 사용 (`eqeqeq` 규칙).
- `curly` 규칙 적용 — `if`/`else`/`for`/`while` 등에 항상 중괄호를 사용합니다.
- Tailwind 클래스는 canonical 값을 사용합니다 (예: `gap-[6px]` → `gap-1.5`).
- `className`에 template literal 금지 — `cva()`/`cn()`을 사용합니다.
- `cva()` variant 타입은 `VariantProps<typeof xxxVariants>`로 추출하고, props 인터페이스에 `extends`합니다.
- `local/max-classname-line-length` 규칙으로 한 줄 `className="..."`가 100컬럼을 넘으면 경고합니다. 긴 클래스는 `cn("...", "...")`로 분리합니다.
- 컴포넌트 props는 `ComponentProps<"...">` 기반으로 선언합니다. DOM props/ref 전달은 `...props`로 처리하고, `ref`를 별도 props로 명시하지 않습니다. (Ref 선언 등에 사용되는 `AnchorHTMLAttributes` 등 `*HTMLAttributes` 타입 사용을 금지합니다.)
- `clsx`, `tailwind-merge`, `class-variance-authority` 직접 import 금지 — `@/lib/class-name`을 사용합니다.

### 임포트
- 에셋(이미지, 아이콘)은 `src/assets/` 에 배치하고, `@/assets/...` 절대경로로 임포트합니다.
- 상대경로 임포트는 같은 디렉토리 또는 바로 하위만 허용합니다. 그 외에는 `@/...` 별칭을 사용합니다.

### 컴포넌트 스타일 경계
- 컴포넌트는 **자신의 내부 스타일**(padding, background, border, border-radius, overflow, 내부 layout 등)만 스스로 정의합니다.
- **위치·외부 여백·표시 조건**은 부모(호출부)에서 지정합니다.
  - `position`, `top/right/bottom/left`, `z-index`
  - `margin`
  - `flex`/`align-self`/`justify-self`/`grid-area`/`order`
  - `width`/`max-width` (유동 크기일 때)
  - `hidden`/`block` 등 표시 토글
- 판단 기준: "이 컴포넌트를 다른 것으로 교체해도 해당 속성이 같은 자리에 여전히 필요한가?" → **예**면 부모가 정의, **아니오**면 컴포넌트가 정의.

### TanStack Query
- 쿼리 정의 시 `queryOptions()`를 사용합니다. `queryKey`에 `DataTag`가 자동 부여되어 `getQueryData`/`setQueryData` 호출 시 데이터 타입이 추론되므로, 수동 제네릭(`getQueryData<T>()`)을 제거할 수 있습니다.
- 파라미터가 있는 쿼리는 `queryOptions`를 반환하는 팩토리 함수로 정의합니다 (예: `bookSearchQueryOptions(params)`).
- `prefetchQuery`, `invalidateQueries` 등에도 동일한 `queryOptions` 객체를 재사용하여 키-함수 불일치를 방지합니다.

### 아키텍처
- 무조건 CSR(SPA)이므로 `typeof window === "undefined"` 체크를 하지 않습니다.
- 외부 API 클라이언트의 파라미터 인터페이스는 실제 API 스펙에 맞춰 정의합니다 (내부 타입과 분리).
- Repository는 외부 의존성(API 클라이언트, SyncAdapter 등)을 생성자 주입으로 받습니다. 모듈 간 직접 import 결합을 제거하고, 사용처(hooks 계층)에서 조립합니다.
