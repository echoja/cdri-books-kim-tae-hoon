import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import searchIcon from "@/assets/icons/search.svg";
import { toUserMessage } from "@/domain/errors";
import { toSearchTarget } from "@/domain/search-utils";
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
import { motionDuration, runAnimate } from "@/lib/animation";

const PAGE_SIZE = 10 as const;

export function SearchPage() {
  const queryClient = useQueryClient();

  const [inputKeyword, setInputKeyword] = useState("");
  const [detailKeyword, setDetailKeyword] = useState("");
  const [target, setTarget] = useState<SearchTarget>("title");
  const [params, setParams] = useState<SearchParams | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const searchQuery = useBookSearch(params);
  const historyQuery = useSearchHistory();
  const upsertHistory = useUpsertSearchHistory();
  const removeHistory = useRemoveSearchHistory();

  const favoriteIdsQuery = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const historyRecords = historyQuery.data ?? [];
  const books = searchQuery.data?.books ?? [];
  const totalCount = searchQuery.data?.totalCount ?? 0;
  const hasSearched = !!params;

  const page = params?.page ?? 1;
  const totalPages = useMemo(() => {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / PAGE_SIZE);
  }, [totalCount]);

  const sourceLabel = searchQuery.data?.source === "cache" ? "캐시 데이터" : null;

  useEffect(() => {
    if (!resultsRef.current || books.length === 0) {
      return;
    }

    runAnimate(resultsRef.current, {
      opacity: [0, 1],
      duration: motionDuration(300),
      ease: "outQuad",
    });
  }, [searchQuery.data, books.length]);

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

  const executeSearch = (keyword: string, nextTarget: SearchTarget, nextPage = 1) => {
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

    setInputKeyword(trimmed);
    setDetailKeyword(trimmed);
    setTarget(nextTarget);
    setParams(next);
    setIsHistoryOpen(false);
    setIsDetailOpen(false);

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

    setParams({
      ...params,
      page: nextPage,
    });
  };

  return (
    <section className="w-full">
      <div className="flex flex-col items-start">
        <h1 className="text-page-heading text-text-title m-0">도서 검색</h1>

        <div className="mt-4 flex items-center gap-4 max-[767px]:w-full max-[767px]:flex-col max-[767px]:items-stretch">
          <form
            className="h-search-input rounded-pill bg-surface-secondary relative m-0 flex w-120 items-center gap-2.75 px-4.5 max-[767px]:w-full"
            onSubmit={(event) => {
              event.preventDefault();
              executeSearch(inputKeyword, target);
            }}
          >
            <img src={searchIcon} width={30} height={30} alt="" aria-hidden />
            <input
              value={inputKeyword}
              placeholder="검색어 입력"
              className="text-caption text-text-primary placeholder:text-text-subtitle focus-visible:outline-palette-primary flex-1 border-none bg-transparent outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              onFocus={() => setIsHistoryOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setIsHistoryOpen(false), 100);
              }}
              onChange={(event) => {
                setInputKeyword(event.target.value);
                setDetailKeyword(event.target.value);
              }}
            />
            {isHistoryOpen && historyRecords.length > 0 ? (
              <SearchHistoryLayer
                records={historyRecords}
                onSelect={handleHistorySelect}
                onRemove={(key) => removeHistory.mutate(key)}
              />
            ) : null}
          </form>

          <DetailSearchPanel
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            target={target}
            keyword={detailKeyword}
            onTargetChange={(value) => setTarget(toSearchTarget(value))}
            onKeywordChange={setDetailKeyword}
            onSearch={(keywordOverride) => executeSearch(keywordOverride ?? detailKeyword, target)}
          />
        </div>

        <div className="gap-layout-gap-4 text-title text-text-primary mt-6 flex items-center">
          <span>검색결과</span>
          <span>
            총 <strong className="text-palette-primary">{totalCount}</strong>건
          </span>
          {sourceLabel ? (
            <span className="border-divider text-small text-text-subtitle rounded-full border px-2 py-0.75">
              {sourceLabel}
            </span>
          ) : null}
        </div>
      </div>

      {searchQuery.error ? (
        <p className="text-body-small text-text-error mt-5">{toUserMessage(searchQuery.error)}</p>
      ) : null}

      {searchQuery.isFetching && hasSearched ? (
        <p className="text-body-small mt-5">검색 중입니다...</p>
      ) : null}

      {!searchQuery.isFetching && books.length > 0 ? (
        <div ref={resultsRef}>
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
