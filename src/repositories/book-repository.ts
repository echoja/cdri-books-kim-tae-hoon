import { AppError } from "@/lib/errors";
import type { SearchParams, SearchResult } from "@/lib/types";

interface BookSearchClient {
  search(
    options: { query: string; page?: number; size?: number; target?: string },
    signal?: AbortSignal,
  ): Promise<SearchResult>;
}

export class BookRepository {
  private readonly client: BookSearchClient;

  constructor(client: BookSearchClient) {
    this.client = client;
  }

  async search(params: SearchParams, signal?: AbortSignal): Promise<SearchResult> {
    try {
      return await this.client.search(
        {
          query: params.query,
          page: params.page,
          size: params.size,
          target: params.target,
        },
        signal,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("UNKNOWN", "검색 중 알 수 없는 오류가 발생했습니다.");
    }
  }
}
