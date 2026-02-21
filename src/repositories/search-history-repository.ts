import { appDb } from "@/db/app-db";
import { getSearchHistoryLimit, upsertSearchHistory } from "@/lib/search-utils";
import type { SearchHistoryRecord, SearchTarget } from "@/lib/types";

const STORAGE_KEY = "cdri:search-history";

function readLocalHistory(): SearchHistoryRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SearchHistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(records: SearchHistoryRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

class SearchHistoryRepository {
  async list(): Promise<SearchHistoryRecord[]> {
    try {
      return await appDb.searchHistory.orderBy("searchedAt").reverse().limit(8).toArray();
    } catch {
      return readLocalHistory();
    }
  }

  async upsert(keyword: string, target?: SearchTarget): Promise<SearchHistoryRecord[]> {
    try {
      const current = await this.list();
      const next = upsertSearchHistory(current, keyword, target);

      await appDb.transaction("rw", appDb.searchHistory, async () => {
        await appDb.searchHistory.clear();
        await appDb.searchHistory.bulkPut(next);
      });

      return next;
    } catch {
      const current = readLocalHistory();
      const next = upsertSearchHistory(current, keyword, target);
      writeLocalHistory(next);
      return next;
    }
  }

  async remove(key: string): Promise<SearchHistoryRecord[]> {
    try {
      await appDb.searchHistory.delete(key);
      return this.list();
    } catch {
      const next = readLocalHistory()
        .filter((record) => record.key !== key)
        .slice(0, getSearchHistoryLimit());
      writeLocalHistory(next);
      return next;
    }
  }
}

export const searchHistoryRepository = new SearchHistoryRepository();
