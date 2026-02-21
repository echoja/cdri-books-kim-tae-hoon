import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import searchIcon from '../../../assets/icons/search.svg'
import { toUserMessage } from '@/domain/errors'
import { toSearchTarget } from '@/domain/search-utils'
import type { SearchHistoryRecord, SearchParams, SearchTarget } from '@/domain/types'
import { EmptyState } from '@/components/empty-state'
import { BookList } from '@/features/books/book-list'
import { DetailSearchPanel } from '@/features/search/detail-search-panel'
import { SearchHistoryLayer } from '@/features/search/search-history-layer'
import { useToggleFavorite, useFavoriteIds } from '@/features/favorites/use-favorites'
import { createBookSearchQueryKey, useBookSearch } from '@/features/search/use-book-search'
import { Button } from '@/components/ui/button'
import {
  useRemoveSearchHistory,
  useSearchHistory,
  useUpsertSearchHistory,
} from '@/features/search/use-search-history'
import { bookRepository } from '@/repositories/book-repository'

const PAGE_SIZE = 10 as const

export function SearchPage() {
  const queryClient = useQueryClient()

  const [inputKeyword, setInputKeyword] = useState('')
  const [detailKeyword, setDetailKeyword] = useState('')
  const [target, setTarget] = useState<SearchTarget>('title')
  const [params, setParams] = useState<SearchParams | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const searchQuery = useBookSearch(params)
  const historyQuery = useSearchHistory()
  const upsertHistory = useUpsertSearchHistory()
  const removeHistory = useRemoveSearchHistory()

  const favoriteIdsQuery = useFavoriteIds()
  const toggleFavorite = useToggleFavorite()

  const historyRecords = historyQuery.data ?? []
  const books = searchQuery.data?.books ?? []
  const totalCount = searchQuery.data?.totalCount ?? 0
  const hasSearched = !!params

  const page = params?.page ?? 1
  const totalPages = useMemo(() => {
    if (totalCount === 0) {
      return 1
    }

    return Math.ceil(totalCount / PAGE_SIZE)
  }, [totalCount])

  const sourceLabel = searchQuery.data?.source === 'cache' ? '캐시 데이터' : null

  useEffect(() => {
    if (!params || !searchQuery.data || searchQuery.data.isEnd) {
      return
    }

    const nextPageParams: SearchParams = {
      ...params,
      page: params.page + 1,
    }

    void queryClient.prefetchQuery({
      queryKey: createBookSearchQueryKey(nextPageParams),
      queryFn: ({ signal }) => bookRepository.search(nextPageParams, signal),
    })
  }, [params, queryClient, searchQuery.data])

  const executeSearch = (keyword: string, nextTarget: SearchTarget, nextPage = 1) => {
    const trimmed = keyword.trim()

    if (!trimmed) {
      return
    }

    const next: SearchParams = {
      query: trimmed,
      target: nextTarget,
      page: nextPage,
      size: PAGE_SIZE,
    }

    const isSameSearch =
      params?.query === next.query &&
      params?.target === next.target &&
      params?.page === next.page

    if (isSameSearch) {
      void queryClient.invalidateQueries({
        queryKey: createBookSearchQueryKey(next),
      })
      void queryClient.refetchQueries({
        queryKey: createBookSearchQueryKey(next),
        exact: true,
      })
    }

    setInputKeyword(trimmed)
    setDetailKeyword(trimmed)
    setTarget(nextTarget)
    setParams(next)
    setIsHistoryOpen(false)
    setIsDetailOpen(false)

    upsertHistory.mutate({
      keyword: trimmed,
      target: nextTarget,
    })
  }

  const handleHistorySelect = (record: SearchHistoryRecord) => {
    executeSearch(record.keyword, record.target ?? 'title')
  }

  const handlePageChange = (nextPage: number) => {
    if (!params || nextPage < 1 || nextPage > totalPages) {
      return
    }

    setParams({
      ...params,
      page: nextPage,
    })
  }

  return (
    <section className="w-full">
      <div className="flex flex-col items-start">
        <h1 className="m-0 text-[22px] leading-6 font-bold text-[#1a1e27]">도서 검색</h1>

        <div className="mt-4 flex items-center gap-4 max-[767px]:w-full max-[767px]:flex-col max-[767px]:items-stretch">
          <form
            className="relative m-0 flex h-12 w-[480px] items-center gap-[11px] rounded-[24px] bg-[#f2f4f6] px-[18px] max-[767px]:w-full"
            onSubmit={(event) => {
              event.preventDefault()
              executeSearch(inputKeyword, target)
            }}
          >
            <img src={searchIcon} width={30} height={30} alt="" aria-hidden />
            <input
              value={inputKeyword}
              placeholder="검색어 입력"
              className="flex-1 border-none bg-transparent text-base text-[#353c49] outline-none placeholder:text-[#8d94a0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4880ee]"
              onFocus={() => setIsHistoryOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setIsHistoryOpen(false), 100)
              }}
              onChange={(event) => {
                setInputKeyword(event.target.value)
                setDetailKeyword(event.target.value)
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

        <div className="mt-6 flex items-center gap-4 text-[18px] text-[#353c49]">
          <span>검색결과</span>
          <span>
            총 <strong className="text-[#4880ee]">{totalCount}</strong>건
          </span>
          {sourceLabel ? (
            <span className="rounded-full border border-[#d2d6da] px-2 py-[3px] text-xs text-[#8d94a0]">
              {sourceLabel}
            </span>
          ) : null}
        </div>
      </div>

      {searchQuery.error ? <p className="mt-5 text-sm text-[#b42318]">{toUserMessage(searchQuery.error)}</p> : null}

      {searchQuery.isFetching && hasSearched ? <p className="mt-5 text-sm">검색 중입니다...</p> : null}

      {!searchQuery.isFetching && books.length > 0 ? (
        <>
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

          <nav className="mt-5 flex items-center justify-center gap-3" aria-label="검색 결과 페이지 이동">
            <Button
              variant="secondary"
              className="gap-0 px-[18px] py-[10px]"
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
              className="gap-0 px-[18px] py-[10px]"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              다음
            </Button>
          </nav>
        </>
      ) : null}

      {!searchQuery.isFetching && books.length === 0 ? <EmptyState /> : null}
    </section>
  )
}
