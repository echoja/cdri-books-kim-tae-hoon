import { appDb } from "@/db/app-db";
import type { SearchParams, SearchResultPayload } from "@/lib/types";

const CACHE_MAX_COUNT = 60;

function createSearchCacheKey(params: SearchParams): string {
  return `${params.target ?? "title"}:${params.query.trim().toLowerCase()}:p${params.page}`;
}

class SearchCacheRepository {
  async get(params: SearchParams): Promise<SearchResultPayload | null> {
    const key = createSearchCacheKey(params);
    const entry = await appDb.searchCache.get(key);
    return entry?.payload ?? null;
  }

  async set(params: SearchParams, payload: SearchResultPayload): Promise<void> {
    const key = createSearchCacheKey(params);

    await appDb.searchCache.put({
      key,
      query: params.query,
      page: params.page,
      target: params.target,
      payload,
      updatedAt: new Date().toISOString(),
    });

    const overflow = await appDb.searchCache
      .orderBy("updatedAt")
      .reverse()
      .offset(CACHE_MAX_COUNT)
      .primaryKeys();

    if (overflow.length > 0) {
      await appDb.searchCache.bulkDelete(overflow);
    }
  }
}

export const searchCacheRepository = new SearchCacheRepository();
