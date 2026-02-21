# CLAUDE.md

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 참조하는 규칙입니다.

## 프로젝트 규칙

`README.md`의 "프로젝트 규칙" 섹션을 참조합니다. 주요 사항:

- 커밋 메시지는 한글, `유형: 변경 요약` 형식, 주제별로 분리
- 코드 주석은 JSDoc(`/** */`) 형식
- `===`/`!==` 만 사용 (`==`/`!=` 금지)
- `if`/`else`/`for`/`while` 등에 항상 중괄호
- 에셋 임포트는 `@/assets/...` 절대경로, 상대경로는 같은 디렉토리/바로 하위만 허용
- `typeof window === "undefined"` 체크 금지 (CSR 전용 앱)
- 외부 API 클라이언트 파라미터는 실제 API 스펙에 맞춰 별도 인터페이스 정의
- Tailwind 클래스는 canonical 값 사용 (arbitrary value 대신 scale 값 우선)
- `className`에 template literal 금지, `cva()`/`cn()` 사용
- `cva()` variant 타입은 `VariantProps<typeof xxxVariants>`로 추출
- 한 줄 `className="..."`가 100컬럼 초과 시 `cn("...", "...")`로 분리
- 컴포넌트 props는 `ComponentProps<"...">` 기반 (`*HTMLAttributes` 금지)
- `clsx`/`tailwind-merge`/`class-variance-authority` 직접 import 금지 → `@/lib/class-name` 사용
- `queryOptions()`로 쿼리 정의, 파라미터 쿼리는 팩토리 함수 사용
- Repository는 외부 의존성을 생성자 주입으로 받음 (feature 계층에서 조립)

## 검증 명령어

```bash
npx tsc --noEmit   # 타입 검사
npm run lint        # ESLint + Prettier
npm run knip        # 미사용 의존성·export 검증
npm run build       # 프로덕션 빌드
npm run test:e2e    # Playwright E2E 테스트
```

## 기술 스택

- Vite + React 19 + TypeScript (CSR SPA)
- TanStack Router (파일 기반 라우팅) + TanStack Query (`queryOptions`)
- Dexie (IndexedDB), Radix UI, lucide-react, sonner
- ESLint + Prettier, Playwright, knip
