# Project Improvement Plan

## Context

The CDRI Books project used `@tanstack/react-start` (SSR framework) but ran as a pure SPA — adding unnecessary complexity and bundle weight. This plan addressed all improvements.

---

## Step 0. Commit Uncommitted Tooling Changes

Committed staged/modified files and untracked files as a clean baseline:

- Modified: `eslint.config.js`, `package.json`, `package-lock.json`, `src/features/books/book-list-item.tsx`
- Untracked: `.prettierignore`, `prettier.config.cjs`

---

## Step 1. Remove `@tanstack/react-start` -> plain `@tanstack/react-router` + Vite

### Packages

- **Removed:** `@tanstack/react-start`, `@tanstack/react-devtools`, `@tanstack/react-router-devtools`, `@tanstack/devtools-vite`
- **Added:** `@tanstack/router-plugin` (provides `tanstackRouter` for file-based route generation)

### File Changes

- `index.html` (new): SPA entry point
- `src/main.tsx` (new): React root with `RouterProvider`
- `vite.config.ts`: Replaced `tanstackStart()` with `tanstackRouter()`
- `src/routes/__root.tsx`: Removed `head()` and `shellComponent`
- `src/routes/-__root-layout.tsx`: Removed `RootDocument`, `HeadContent`, `Scripts`, devtools
- `src/features/favorites/use-favorites.ts`: Removed `isClient()` SSR guard
- `src/lib/animation.ts`: Fixed `safeAnimate` to use anime.js v4 two-argument API
- `e2e/books.spec.ts`: Updated `gotoReady()` for SPA

---

## Step 2. Upgrade TypeScript

- `typescript` 5.7.2 -> 5.9.3 (latest stable)
- Zero errors with `tsc --noEmit`

---

## Step 3. Document `.env` Requirements

Updated `.env.example` at project root with clear placeholder.

---

## Step 4. Add Loading/Error UI for Favorites Page

- **Loading state:** Shows "찜한 책을 불러오는 중입니다..." during `isLoading`
- **Error state:** Shows `toUserMessage()` error during `isError`
- **Fade-in animation:** Staggered fade-in using `safeAnimate` + `stagger`

---

## Step 5. Remove Unit Tests (vitest)

### Deleted files:

- `src/domain/book-utils.test.ts`
- `src/domain/search-utils.test.ts`
- `src/domain/favorites-utils.test.ts`
- `src/services/kakao-book-client.test.ts`
- `vitest.config.ts`

### Updated `package.json`:

- Removed `vitest` from devDependencies
- Removed `test:unit` script
- Changed `test` script to `npm run test:e2e`

---

## Step 6. Strengthen E2E Tests

### Updated: `e2e/books.spec.ts`

- Empty search submission does nothing
- Search history dropdown appears on input focus
- Search history item click triggers search
- Search history individual deletion
- Detail search panel open/close toggle
- Book detail expand/collapse interaction
- Pagination edge cases (prev disabled on page 1, next disabled on last page)

### New: `e2e/favorites.spec.ts`

- Favorites page shows empty state on first visit
- Add favorite from search -> verify in favorites page with correct count
- Remove favorite -> verify empty state returns
- Favorites persist after page reload

---

## Step 7. Add CI/CD (GitHub Actions)

Updated `.github/workflows/ci.yml` with:

- `check` job: lint, tsc --noEmit, build
- `e2e` job (depends on check): playwright test with chromium

---

## Step 8. Leverage animejs More

| File                                        | Animation                            |
| ------------------------------------------- | ------------------------------------ |
| `src/features/books/book-list.tsx`          | Staggered fade-in for book items     |
| `src/features/favorites/favorites-page.tsx` | Staggered fade-in for favorite items |
| `src/features/search/search-page.tsx`       | Fade-in when search results appear   |
| `src/components/empty-state.tsx`            | Gentle fade + slight scale entrance  |

All animations use `motionDuration()` to respect `prefers-reduced-motion`.

---

## Requirements Compliance

| Requirement                                           | Status |
| ----------------------------------------------------- | ------ |
| React.js + TypeScript + React Query                   | OK     |
| Kakao Book Search API                                 | OK     |
| `.env` for API key + `.gitignore`                     | OK     |
| Typography tokens (Title/Body/Caption/Small)          | OK     |
| Desktop-first 960px content area                      | OK     |
| Header: full-width, logo left, GNB center             | OK     |
| GNB: 2 items, 56px gap, active border-bottom          | OK     |
| Search box: 3-line structure, Enter search            | OK     |
| Search input: 480x48, pill radius, search icon        | OK     |
| Detail search panel: 360x160, shadow, dropdown        | OK     |
| Search history: max 8, persist, individual delete     | OK     |
| BookListItem collapsed/expanded layout                | OK     |
| Price rules (sale price priority)                     | OK     |
| Accordion animation                                   | OK     |
| Favorites page: same layout, same BookListItem        | OK     |
| Empty state: icon_book.png 80x80 + text               | OK     |
| Button styles (primary/secondary/outline)             | OK     |
| Favorites heart icons (line.svg/fill.svg)             | OK     |
| Responsive breakpoints (1280/768/767)                 | OK     |
| Color tokens                                          | OK     |
| Keyboard accessibility (tab/enter/ESC, focus-visible) | OK     |
| `prefers-reduced-motion` support                      | OK     |
| Network error -> cache fallback with badge            | OK     |
