import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import searchIcon from "@/assets/icons/search.svg";
import { toUserMessage } from "@/lib/errors";
import type { BookSearchParams, SearchHistoryRecord, SearchTarget } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import { BookList } from "@/components/book-list";
import { DetailSearchPanel } from "@/components/detail-search-panel";
import { SearchHistoryLayer } from "@/components/search-history-layer";
import { useToggleFavorite, useFavoriteIds } from "@/hooks/use-favorites";
import { bookSearchQueryOptions, useBookSearch } from "@/hooks/use-book-search";
import { Button } from "@/components/ui/button";
import {
  useRemoveSearchHistory,
  useSearchHistory,
  useUpsertSearchHistory,
} from "@/hooks/use-search-history";
import { cn } from "@/lib/class-name";

const PAGE_SIZE = 10 as const;

export function SearchPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/search" });
  const search = useSearch({ from: "/search" });
  const keywordInputRef = useRef<HTMLInputElement>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const trimmed = search.query.trim();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- React Compiler handles memoization
  const params: BookSearchParams | null = trimmed
    ? { query: trimmed, page: search.page, size: PAGE_SIZE, target: search.target }
    : null;

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
  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / PAGE_SIZE);

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

    const nextPageParams: BookSearchParams = {
      ...params,
      page: params.page + 1,
    };

    void queryClient.prefetchQuery(bookSearchQueryOptions(nextPageParams));
  }, [params, queryClient, searchQuery.data]);

  const setBookSearchParams = (next: { query: string; target: SearchTarget; page: number }) => {
    void navigate({
      to: "/search",
      search: next,
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

    const next: BookSearchParams = {
      query: trimmed,
      target: nextTarget,
      page: nextPage,
      size: PAGE_SIZE,
    };

    const isSameSearch =
      params?.query === next.query && params?.target === next.target && params?.page === next.page;

    if (isSameSearch) {
      void queryClient.invalidateQueries({
        queryKey: bookSearchQueryOptions(next).queryKey,
      });
    }

    setIsDetailOpen(false);
    setBookSearchParams({
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
  };

  const handlePageChange = (nextPage: number) => {
    if (!params || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setBookSearchParams({
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
              "group h-12 w-120 flex-col items-center gap-2.75 px-4.5",
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
                  "focus-visible:outline-palette-primary h-12 outline-none",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
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
            onSearch={({ keyword, target }) => executeSearch(keyword, target)}
          />
        </div>

        <div
          className={cn(
            "text-title-3 text-text-primary mt-6 gap-4",
            "flex items-center font-medium",
          )}
        >
          <span>도서 검색 결과</span>
          <span>
            총 <strong className="text-palette-primary">{totalCount}</strong>건
          </span>
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

      {!searchQuery.isFetching && !searchQuery.error && books.length === 0 ? <EmptyState /> : null}
    </section>
  );
}
