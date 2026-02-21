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
    <section className="page-section">
      <div className="search-box">
        <h1 className="page-title">도서 검색</h1>

        <div className="search-input-row">
          <form
            className="search-input-wrap"
            onSubmit={(event) => {
              event.preventDefault()
              executeSearch(inputKeyword, target)
            }}
          >
            <img src={searchIcon} width={30} height={30} alt="" aria-hidden />
            <input
              value={inputKeyword}
              placeholder="검색어 입력"
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

        <div className="count-row">
          <span>검색결과</span>
          <span>
            총 <strong>{totalCount}</strong>건
          </span>
          {sourceLabel ? <span className="source-label">{sourceLabel}</span> : null}
        </div>
      </div>

      {searchQuery.error ? <p className="error-message">{toUserMessage(searchQuery.error)}</p> : null}

      {searchQuery.isFetching && hasSearched ? <p className="loading-message">검색 중입니다...</p> : null}

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

          <nav className="pagination" aria-label="검색 결과 페이지 이동">
            <button
              type="button"
              className="btn btn-secondary pagination-btn"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              이전
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-secondary pagination-btn"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              다음
            </button>
          </nav>
        </>
      ) : null}

      {!searchQuery.isFetching && books.length === 0 ? <EmptyState /> : null}
    </section>
  )
}
