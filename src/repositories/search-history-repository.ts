import { appDb } from '@/db/app-db'
import { getSearchHistoryLimit, upsertSearchHistory } from '@/domain/search-utils'
import type { SearchHistoryRecord, SearchTarget } from '@/domain/types'

const STORAGE_KEY = 'cdri:search-history'

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readLocalHistory(): SearchHistoryRecord[] {
  if (!canUseLocalStorage()) {
    return []
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as SearchHistoryRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalHistory(records: SearchHistoryRecord[]): void {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export class SearchHistoryRepository {
  async list(): Promise<SearchHistoryRecord[]> {
    try {
      return await appDb.searchHistory.orderBy('searchedAt').reverse().limit(8).toArray()
    } catch {
      return readLocalHistory()
    }
  }

  async upsert(keyword: string, target?: SearchTarget): Promise<SearchHistoryRecord[]> {
    try {
      const current = await this.list()
      const next = upsertSearchHistory(current, keyword, target)

      await appDb.transaction('rw', appDb.searchHistory, async () => {
        await appDb.searchHistory.clear()
        await appDb.searchHistory.bulkPut(next)
      })

      return next
    } catch {
      const current = readLocalHistory()
      const next = upsertSearchHistory(current, keyword, target)
      writeLocalHistory(next)
      return next
    }
  }

  async remove(key: string): Promise<SearchHistoryRecord[]> {
    try {
      await appDb.searchHistory.delete(key)
      return this.list()
    } catch {
      const next = readLocalHistory().filter((record) => record.key !== key)
      writeLocalHistory(next.slice(0, getSearchHistoryLimit()))
      return next
    }
  }
}

export const searchHistoryRepository = new SearchHistoryRepository()
