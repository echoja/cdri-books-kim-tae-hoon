import { AppError } from "@/lib/errors";
import type { BookSearchParams, SearchResult } from "@/lib/types";

interface BookSearchClient {
  search(options: BookSearchParams, signal?: AbortSignal): Promise<SearchResult>;
}

export class BookRepository {
  private readonly client: BookSearchClient;

  constructor(client: BookSearchClient) {
    this.client = client;
  }

  async search(params: BookSearchParams, signal?: AbortSignal): Promise<SearchResult> {
    try {
      return await this.client.search(params, signal);
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
