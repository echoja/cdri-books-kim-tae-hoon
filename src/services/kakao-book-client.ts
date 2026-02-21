import { z } from "zod";
import { AppError } from "@/domain/errors";
import { buildBookId } from "@/domain/book-utils";
import type { Book, SearchParams, SearchResultPayload } from "@/domain/types";

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

// Kakao REST API error response: { code: number, msg: string }
// Ref: https://developers.kakao.com/docs/latest/ko/rest-api/reference#response
const kakaoErrorSchema = z.object({
  code: z.number(),
  msg: z.string(),
});

// Kakao REST API rate limits (ref: https://developers.kakao.com/docs/latest/ko/getting-started/quota):
// - Book search (Daum Search): 30,000 req/day, 50,000/day across all search types
// - Monthly cap: 3,000,000 req across all APIs
// - Returns 429 when per-second or daily quota is exceeded
// - Kakao does NOT provide a Retry-After header on 429 responses.
async function parseResponse(response: Response): Promise<SearchResultPayload> {
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

export class KakaoBookClient {
  private readonly apiKey: string;

  constructor(apiKey: string | undefined) {
    this.apiKey = apiKey?.trim() ?? "";
  }

  // sort 파라미터 미전송 → 기본값 "accuracy" (정확도순) 적용
  // "latest" (발간일순) 도 가능하나 현재 요구사항에 없음
  async search(params: SearchParams, signal?: AbortSignal): Promise<SearchResultPayload> {
    if (!this.apiKey) {
      throw new AppError("API_KEY_MISSING", "VITE_KAKAO_REST_API_KEY 환경 변수가 필요합니다.");
    }

    const query = new URLSearchParams({
      query: params.query,
      page: String(params.page),
      size: String(params.size),
    });

    if (params.target) {
      query.set("target", params.target);
    }

    let response: Response;

    try {
      response = await fetch(`${KAKAO_BASE_URL}?${query.toString()}`, {
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
