import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '@/domain/errors'
import { KakaoBookClient } from './kakao-book-client'

describe('KakaoBookClient', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  it('sale_price가 음수여도 검색 응답 파싱이 실패하지 않는다', async () => {
    fetchSpy.mockResolvedValue(
      new Response(
        JSON.stringify({
          meta: {
            total_count: 1,
            pageable_count: 1,
            is_end: true,
          },
          documents: [
            {
              title: '테스트 책',
              contents: '내용',
              url: 'https://example.com/book',
              isbn: 'isbn-1',
              datetime: '2026-01-01T00:00:00.000+09:00',
              authors: ['저자'],
              publisher: '출판사',
              thumbnail: 'https://example.com/cover.jpg',
              price: 15000,
              sale_price: -1,
            },
          ],
        }),
        { status: 200 },
      ),
    )

    const client = new KakaoBookClient('ok')
    const result = await client.search({ query: '테스트', page: 1, size: 10 })

    expect(result.totalCount).toBe(1)
    expect(result.books).toHaveLength(1)
    expect(result.books[0].salePrice).toBeUndefined()
  })

  it('API 키가 없으면 명시적 오류를 던진다', async () => {
    const client = new KakaoBookClient(undefined)

    await expect(client.search({ query: '테스트', page: 1, size: 10 })).rejects.toThrow(
      AppError,
    )
  })
})
