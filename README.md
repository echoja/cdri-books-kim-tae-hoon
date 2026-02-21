# CDRI Books

카카오 도서 검색 API를 기반으로 구현한 2화면 앱입니다.

## 프로젝트 개요

- 화면
  - `도서 검색`
  - `내가 찜한 책`
- 기술 스택
  - `TanStack Start` (SPA 모드)
  - `React + TypeScript`
  - `TanStack Query`
  - `Dexie(IndexedDB)`
  - `anime.js`
- 핵심 목표
  - `docs/requirements.md` 요구사항 충족
  - 네트워크 실패 시 캐시 fallback
  - 로컬 우선 저장 + 향후 원격 동기화 확장 포인트 확보

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

3. 테스트

```bash
npm run test:unit
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

- `TanStack Start`: Router/Query 기반 SPA 구조를 일관되게 유지
- `TanStack Query`: 서버 상태 캐시/재시도/prefetch
- `Dexie`: IndexedDB 추상화와 스키마 관리
- `@radix-ui/*`: 접근성 있는 popover/select 구현
- `anime.js`: 핵심 인터랙션 애니메이션 품질 확보
- `Playwright`: 실제 사용자 플로우 E2E 검증

## 강조 기능

- 검색 실패 시 `검색 캐시` 자동 fallback 및 `캐시 데이터` 배지 노출
- 검색 기록 `최대 8개` 유지 + 중복 최신화
- 찜하기 `optimistic update` + 실패 시 롤백
- `prefers-reduced-motion` 대응 애니메이션

## 프로젝트 규칙

- 커밋 메시지는 한글로 작성합니다.
- 커밋 메시지 형식은 `유형: 변경 요약`을 권장합니다.
- 예시: `문서: 과제 설명 문서 추가`
- `docs/mission.md`는 기준 문서로 고정하며 수정하지 않습니다.
- 작업 중 확정된 요구사항/유의사항/에셋 정보는 `docs/requirements.md`에 누적 관리합니다.
- 디자인 상 참고사항/논의사항은 `docs/notes.md`에서 별도 관리합니다.
