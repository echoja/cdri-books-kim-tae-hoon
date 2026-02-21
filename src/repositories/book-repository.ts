import { AppError } from "@/lib/errors";
import type { SearchParams, SearchResult, SearchResultPayload } from "@/lib/types";
import { searchCacheRepository } from "@/repositories/search-cache-repository";

interface BookSearchClient {
  search(
    options: { query: string; page?: number; size?: number; target?: string },
    signal?: AbortSignal,
  ): Promise<SearchResultPayload>;
}

export class BookRepository {
  private readonly client: BookSearchClient;

  constructor(client: BookSearchClient) {
    this.client = client;
  }

  async search(params: SearchParams, signal?: AbortSignal): Promise<SearchResult> {
    try {
      const payload = await this.client.search(
        {
          query: params.query,
          page: params.page,
          size: params.size,
          target: params.target,
        },
        signal,
      );

      try {
        await searchCacheRepository.set(params, payload);
      } catch {
        /* cache write failure is non-critical */
      }

      return {
        ...payload,
        source: "network",
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      const cached = await searchCacheRepository.get(params);

      if (cached) {
        return {
          ...cached,
          source: "cache",
        };
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("UNKNOWN", "검색 중 알 수 없는 오류가 발생했습니다.");
    }
  }
}
