import { AppError } from '@/domain/errors'
import type { SearchParams, SearchResult } from '@/domain/types'
import { searchCacheRepository } from '@/repositories/search-cache-repository'
import { kakaoBookClient } from '@/services/kakao-book-client'

export class BookRepository {
  async search(params: SearchParams, signal?: AbortSignal): Promise<SearchResult> {
    try {
      const payload = await kakaoBookClient.search(params, signal)

      await searchCacheRepository.set(params, payload)

      return {
        ...payload,
        source: 'network',
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      const cached = await searchCacheRepository.get(params)

      if (cached) {
        return {
          ...cached,
          source: 'cache',
        }
      }

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError('UNKNOWN', '검색 중 알 수 없는 오류가 발생했습니다.')
    }
  }
}

export const bookRepository = new BookRepository()
