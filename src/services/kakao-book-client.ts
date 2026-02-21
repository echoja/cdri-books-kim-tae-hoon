import { z } from "zod";
import { AppError } from "@/lib/errors";
import { buildBookId } from "@/lib/book-utils";
import type { Book, SearchResult } from "@/lib/types";

/**
 * Kakao 도서 검색 API 요청 파라미터.
 *
 * 필드명과 타입을 실제 API 스펙에 맞춘다.
 *
 * @see https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book-request
 */
interface KakaoBookSearchOptions {
  /** 검색을 원하는 질의어 (필수). */
  query: string;
  /** 결과 문서 정렬 방식. 기본값 `"accuracy"` (정확도순). */
  sort?: "accuracy" | "latest";
  /** 결과 페이지 번호. 1–50, 기본값 1. */
  page?: number;
  /** 한 페이지에 보여질 문서 수. 1–50, 기본값 10. */
  size?: number;
  /** 검색 필드 제한. 미지정 시 전체 필드 대상. */
  target?: "title" | "isbn" | "publisher" | "person";
}

const KAKAO_BASE_URL = "https://dapi.kakao.com/v3/search/book";

const kakaoDocumentSchema = z.object({
  title: z.string().default(""),
  contents: z.string().default(""),
  url: z.string().default(""),
  isbn: z.string().default(""),
  datetime: z.string().optional(),
  authors: z.array(z.string()).default([]),
  publisher: z.string().default(""),
  thumbnail: z.string().default(""),
  price: z.number().nonnegative().default(0),
  sale_price: z.number().default(0),
});

const kakaoResponseSchema = z.object({
  meta: z.object({
    total_count: z.number().nonnegative(),
    pageable_count: z.number().nonnegative(),
    is_end: z.boolean(),
  }),
  documents: z.array(kakaoDocumentSchema),
});

/** Kakao 도서 검색 API 응답 타입. 테스트 mock에서 사용. */
export type KakaoSearchResponse = z.infer<typeof kakaoResponseSchema>;

/** Kakao 도서 문서를 내부 Book 타입으로 변환한다. */
function toBook(doc: z.infer<typeof kakaoDocumentSchema>): Book {
  const isbn = doc.isbn.trim().split(" ").find(Boolean);

  return {
    isbn: isbn ?? buildBookId(doc.title, doc.publisher),
    title: doc.title,
    authors: doc.authors,
    publisher: doc.publisher,
    thumbnail: doc.thumbnail,
    contents: doc.contents,
    price: doc.price,
    salePrice: doc.sale_price > 0 ? doc.sale_price : undefined,
    url: doc.url,
    datetime: doc.datetime,
  };
}

/**
 * Kakao REST API 에러 응답 스키마.
 *
 * ```json
 * { "code": -1, "msg": "..." }
 * ```
 *
 * @see https://developers.kakao.com/docs/latest/ko/rest-api/reference#response
 */
const kakaoErrorSchema = z.object({
  code: z.number(),
  msg: z.string(),
});

/**
 * Kakao REST API 응답을 파싱하고, 에러 상태일 경우 {@link AppError}를 던진다.
 *
 * Rate-limit 정책 (429):
 * - Book search (Daum Search): 30,000 req/day, 50,000/day across all search types
 * - Monthly cap: 3,000,000 req across all APIs
 * - Kakao does NOT provide a `Retry-After` header on 429 responses.
 *
 * @see https://developers.kakao.com/docs/latest/ko/getting-started/quota
 */
async function parseResponse(response: Response): Promise<SearchResult> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const kakaoError = kakaoErrorSchema.safeParse(body);
    const serverMsg = kakaoError.success ? kakaoError.data.msg : undefined;

    if (response.status === 401 || response.status === 403) {
      throw new AppError("UNAUTHORIZED", serverMsg ?? "인증되지 않은 요청입니다.", response.status);
    }

    if (response.status === 429) {
      throw new AppError("RATE_LIMIT", serverMsg ?? "요청 제한에 도달했습니다.", response.status);
    }

    if (response.status >= 500) {
      throw new AppError(
        "SERVER",
        serverMsg ?? "카카오 책 검색 서버 오류가 발생했습니다.",
        response.status,
      );
    }

    throw new AppError("UNKNOWN", serverMsg ?? "검색 요청을 처리할 수 없습니다.", response.status);
  }

  const json = await response.json();
  const parsed = kakaoResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new AppError("UNKNOWN", "검색 응답 형식이 올바르지 않습니다.");
  }

  return {
    books: parsed.data.documents.map(toBook),
    totalCount: parsed.data.meta.total_count,
    pageableCount: parsed.data.meta.pageable_count,
    isEnd: parsed.data.meta.is_end,
  };
}

/** Kakao 도서 검색 API 클라이언트. */
class KakaoBookClient {
  private readonly apiKey: string;

  constructor(apiKey: string | undefined) {
    this.apiKey = apiKey?.trim() ?? "";
  }

  /**
   * 도서를 검색한다.
   *
   * @param options - Kakao 도서 검색 API 요청 파라미터.
   * @param signal - 요청 취소를 위한 {@link AbortSignal}.
   * @see https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book
   */
  async search(options: KakaoBookSearchOptions, signal?: AbortSignal): Promise<SearchResult> {
    if (!this.apiKey) {
      throw new AppError("API_KEY_MISSING", "VITE_KAKAO_REST_API_KEY 환경 변수가 필요합니다.");
    }

    const params = new URLSearchParams({ query: options.query });

    if (options.sort) {
      params.set("sort", options.sort);
    }

    if (options.page !== undefined) {
      params.set("page", String(options.page));
    }

    if (options.size !== undefined) {
      params.set("size", String(options.size));
    }

    if (options.target) {
      params.set("target", options.target);
    }

    let response: Response;

    try {
      response = await fetch(`${KAKAO_BASE_URL}?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${this.apiKey}`,
        },
        signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      throw new AppError("NETWORK", "네트워크 오류로 검색에 실패했습니다.");
    }

    return parseResponse(response);
  }
}

export const kakaoBookClient = new KakaoBookClient(import.meta.env.VITE_KAKAO_REST_API_KEY);
