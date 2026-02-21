import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import searchIcon from "@/assets/icons/search.svg";
import { toUserMessage } from "@/domain/errors";
import type { SearchHistoryRecord, SearchParams, SearchTarget } from "@/domain/types";
import { EmptyState } from "@/components/empty-state";
import { BookList } from "@/components/book-list";
import { DetailSearchPanel } from "@/features/search/detail-search-panel";
import { SearchHistoryLayer } from "@/features/search/search-history-layer";
import { useToggleFavorite, useFavoriteIds } from "@/features/favorites/use-favorites";
import { createBookSearchQueryKey, useBookSearch } from "@/features/search/use-book-search";
import { Button } from "@/components/ui/button";
import {
  useRemoveSearchHistory,
  useSearchHistory,
  useUpsertSearchHistory,
} from "@/features/search/use-search-history";
import { bookRepository } from "@/repositories/book-repository";
import { cn } from "@/lib/class-name";

const PAGE_SIZE = 10 as const;

export function SearchPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/search" });
  const search = useSearch({ from: "/search" });
  const keywordInputRef = useRef<HTMLInputElement>(null);

  const [detailKeyword, setDetailKeyword] = useState(search.query);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const params = useMemo<SearchParams | null>(() => {
    const trimmed = search.query.trim();

    if (!trimmed) {
      return null;
    }

    return {
      query: trimmed,
      page: search.page,
      size: PAGE_SIZE,
      target: search.target,
    };
  }, [search.page, search.query, search.target]);

  const searchQuery = useBookSearch(params);
  const historyQuery = useSearchHistory();
  const upsertHistory = useUpsertSearchHistory();
  const removeHistory = useRemoveSearchHistory();

  const favoriteIdsQuery = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();

  const historyRecords = historyQuery.data ?? [];
  const books = searchQuery.data?.books ?? [];
  const totalCount = searchQuery.data?.totalCount ?? 0;
  const hasSearched = search.query.trim().length > 0;

  const page = params?.page ?? 1;
  const totalPages = useMemo(() => {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / PAGE_SIZE);
  }, [totalCount]);

  const sourceLabel = searchQuery.data?.source === "cache" ? "캐시 데이터" : null;

  useEffect(() => {
    setDetailKeyword(search.query);
  }, [search.query]);

  useEffect(() => {
    const input = keywordInputRef.current;

    if (!input) {
      return;
    }

    if (input.value !== search.query) {
      input.value = search.query;
    }
  }, [search.query]);

  useEffect(() => {
    if (!params || !searchQuery.data || searchQuery.data.isEnd) {
      return;
    }

    const nextPageParams: SearchParams = {
      ...params,
      page: params.page + 1,
    };

    void queryClient.prefetchQuery({
      queryKey: createBookSearchQueryKey(nextPageParams),
      queryFn: ({ signal }) => bookRepository.search(nextPageParams, signal),
    });
  }, [params, queryClient, searchQuery.data]);

  const setSearchParams = (next: { query: string; target: SearchTarget; page: number }) => {
    void navigate({
      to: "/search",
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        ...next,
      }),
    });
  };

  const executeSearch = (keyword: string, nextTarget: SearchTarget, nextPage = 1) => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
    const trimmed = keyword.trim();

    if (!trimmed) {
      return;
    }

    const next: SearchParams = {
      query: trimmed,
      target: nextTarget,
      page: nextPage,
      size: PAGE_SIZE,
    };

    const isSameSearch =
      params?.query === next.query && params?.target === next.target && params?.page === next.page;

    if (isSameSearch) {
      void queryClient.invalidateQueries({
        queryKey: createBookSearchQueryKey(next),
      });
      void queryClient.refetchQueries({
        queryKey: createBookSearchQueryKey(next),
        exact: true,
      });
    }

    setDetailKeyword(trimmed);
    setIsDetailOpen(false);
    setSearchParams({
      query: trimmed,
      target: nextTarget,
      page: nextPage,
    });

    if (keywordInputRef.current && keywordInputRef.current.value !== trimmed) {
      keywordInputRef.current.value = trimmed;
    }

    upsertHistory.mutate({
      keyword: trimmed,
      target: nextTarget,
    });
  };

  const handleHistorySelect = (record: SearchHistoryRecord) => {
    executeSearch(record.keyword, record.target ?? "title");
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const handlePageChange = (nextPage: number) => {
    if (!params || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setSearchParams({
      query: params.query,
      target: params.target ?? "title",
      page: nextPage,
    });
  };

  return (
    <section className="w-full">
      <div className="flex flex-col items-start">
        <h1 className="text-title-2 text-text-title m-0">도서 검색</h1>

        <div className="mt-4 flex items-center gap-4">
          <form
            className={cn(
              "rounded-pill bg-palette-light-gray relative m-0",
              "group h-search-input-height w-120 flex-col items-center gap-2.75 px-4.5",
            )}
            onSubmit={(event) => {
              event.preventDefault();
              executeSearch(keywordInputRef.current?.value ?? "", search.target);
            }}
          >
            <div className="relative z-20 flex items-center gap-2.75">
              <img src={searchIcon} width={30} height={30} alt="" aria-hidden />
              <input
                ref={keywordInputRef}
                defaultValue={search.query}
                placeholder="검색어 입력"
                className={cn(
                  "text-caption text-text-primary placeholder:text-text-subtitle flex-1 border-none bg-transparent",
                  "focus-visible:outline-palette-primary h-search-input-height outline-none",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
                onChange={(event) => {
                  setDetailKeyword(event.target.value);
                }}
              />
            </div>
            {historyRecords.length > 0 ? (
              <SearchHistoryLayer
                className={cn(
                  "absolute top-6 left-0 z-10 pt-10 pl-14.5",
                  "pointer-events-none -translate-y-1 opacity-0 transition duration-200",
                  "group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100",
                )}
                records={historyRecords}
                onSelect={handleHistorySelect}
                onRemove={(key) => removeHistory.mutate(key)}
              />
            ) : null}
          </form>

          <DetailSearchPanel
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            target={search.target}
            keyword={detailKeyword}
            onTargetChange={(nextTarget) =>
              setSearchParams({
                query: search.query,
                page: 1,
                target: nextTarget,
              })
            }
            onKeywordChange={setDetailKeyword}
            onSearch={(keywordOverride) =>
              executeSearch(keywordOverride ?? detailKeyword, search.target)
            }
          />
        </div>

        <div className="gap-layout-gap-4 text-title-3 text-text-primary mt-6 flex items-center">
          <span>검색결과</span>
          <span>
            총 <strong className="text-palette-primary">{totalCount}</strong>건
          </span>
          {sourceLabel ? (
            <span
              className={cn(
                "border-palette-divider text-small text-text-subtitle rounded-full",
                "border px-2 py-0.75",
              )}
            >
              {sourceLabel}
            </span>
          ) : null}
        </div>
      </div>

      {searchQuery.error ? (
        <p className="text-body-2 text-palette-red mt-5">{toUserMessage(searchQuery.error)}</p>
      ) : null}

      {searchQuery.isFetching && hasSearched ? (
        <p className="text-body-2 mt-5">검색 중입니다...</p>
      ) : null}

      {!searchQuery.isFetching && books.length > 0 ? (
        <div>
          <BookList
            books={books}
            favoriteIds={favoriteIdsQuery.data ?? []}
            favoriteDisabled={toggleFavorite.isPending}
            onToggleFavorite={(book, willFavorite) =>
              toggleFavorite.mutate({
                book,
                willFavorite,
              })
            }
          />

          <nav
            className="mt-5 flex items-center justify-center gap-3"
            aria-label="검색 결과 페이지 이동"
          >
            <Button
              variant="secondary"
              className="gap-0 px-4.5 py-2.5"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              이전
            </Button>
            <span>
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              className="gap-0 px-4.5 py-2.5"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              다음
            </Button>
          </nav>
        </div>
      ) : null}

      {!searchQuery.isFetching && books.length === 0 ? <EmptyState /> : null}
    </section>
  );
}
