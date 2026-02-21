import { useQuery } from '@tanstack/react-query'
import type { SearchParams } from '@/domain/types'
import { bookRepository } from '@/repositories/book-repository'

export function createBookSearchQueryKey(params: SearchParams | null) {
  return ['book-search', params] as const
}

export function useBookSearch(params: SearchParams | null) {
  return useQuery({
    queryKey: createBookSearchQueryKey(params),
    queryFn: ({ signal }) => {
      if (!params) {
        throw new Error('검색 파라미터가 없습니다.')
      }

      return bookRepository.search(params, signal)
    },
    enabled: !!params,
    placeholderData: (previousData) => previousData,
  })
}
