import { z } from 'zod'
import { AppError } from '@/domain/errors'
import { buildBookId } from '@/domain/book-utils'
import type { Book, SearchParams, SearchResultPayload } from '@/domain/types'

const KAKAO_BASE_URL = 'https://dapi.kakao.com/v3/search/book'

const kakaoDocumentSchema = z.object({
  title: z.string().default(''),
  contents: z.string().default(''),
  url: z.string().default(''),
  isbn: z.string().default(''),
  datetime: z.string().optional(),
  authors: z.array(z.string()).default([]),
  publisher: z.string().default(''),
  thumbnail: z.string().default(''),
  price: z.number().nonnegative().default(0),
  sale_price: z.number().default(0),
})

const kakaoResponseSchema = z.object({
  meta: z.object({
    total_count: z.number().nonnegative(),
    pageable_count: z.number().nonnegative(),
    is_end: z.boolean(),
  }),
  documents: z.array(kakaoDocumentSchema),
})

function toBook(doc: z.infer<typeof kakaoDocumentSchema>): Book {
  const isbn = doc.isbn.trim().split(' ').find(Boolean)

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
  }
}

function parseRetryAfter(response: Response): number | undefined {
  const header = response.headers.get('Retry-After')

  if (!header) {
    return undefined
  }

  const seconds = Number(header)

  if (Number.isNaN(seconds) || seconds <= 0) {
    return undefined
  }

  return seconds * 1000
}

async function parseResponse(response: Response): Promise<SearchResultPayload> {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new AppError('UNAUTHORIZED', '인증되지 않은 요청입니다.', response.status)
    }

    if (response.status === 429) {
      const retryAfter = parseRetryAfter(response)
      const message = retryAfter
        ? `요청 제한에 도달했습니다. ${Math.ceil(retryAfter / 1000)}초 후 다시 시도해 주세요.`
        : '요청 제한에 도달했습니다.'

      throw new AppError('RATE_LIMIT', message, response.status)
    }

    if (response.status >= 500) {
      throw new AppError('SERVER', '카카오 책 검색 서버 오류가 발생했습니다.', response.status)
    }

    throw new AppError('UNKNOWN', '검색 요청을 처리할 수 없습니다.', response.status)
  }

  const json = await response.json()
  const parsed = kakaoResponseSchema.safeParse(json)

  if (!parsed.success) {
    throw new AppError('UNKNOWN', '검색 응답 형식이 올바르지 않습니다.')
  }

  return {
    books: parsed.data.documents.map(toBook),
    totalCount: parsed.data.meta.total_count,
    pageableCount: parsed.data.meta.pageable_count,
    isEnd: parsed.data.meta.is_end,
  }
}

export class KakaoBookClient {
  private readonly apiKey: string

  constructor(apiKey: string | undefined) {
    this.apiKey = apiKey?.trim() ?? ''
  }

  async search(params: SearchParams, signal?: AbortSignal): Promise<SearchResultPayload> {
    if (!this.apiKey) {
      throw new AppError(
        'API_KEY_MISSING',
        'VITE_KAKAO_REST_API_KEY 환경 변수가 필요합니다.',
      )
    }

    const query = new URLSearchParams({
      query: params.query,
      page: String(params.page),
      size: String(params.size),
    })

    if (params.target) {
      query.set('target', params.target)
    }

    let response: Response

    try {
      response = await fetch(`${KAKAO_BASE_URL}?${query.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${this.apiKey}`,
        },
        signal,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      throw new AppError('NETWORK', '네트워크 오류로 검색에 실패했습니다.')
    }

    return parseResponse(response)
  }
}

export const kakaoBookClient = new KakaoBookClient(import.meta.env.VITE_KAKAO_REST_API_KEY)
