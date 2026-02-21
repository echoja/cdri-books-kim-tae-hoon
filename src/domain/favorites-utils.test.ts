import { describe, expect, it } from 'vitest'
import { applyOptimisticFavorite } from '@/domain/favorites-utils'
import type { Book, FavoriteRecord } from '@/domain/types'

const BOOK: Book = {
  isbn: 'isbn-1',
  title: '책',
  authors: ['작가'],
  publisher: '출판사',
  thumbnail: '',
  contents: '',
  price: 10000,
  url: 'https://example.com',
}

function createFavorite(isbn: string): FavoriteRecord {
  return {
    isbn,
    book: { ...BOOK, isbn, title: `책-${isbn}` },
    likedAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    syncStatus: 'synced',
  }
}

describe('favorites-utils', () => {
  it('찜 추가 optimistic 업데이트 시 목록 최상단에 반영한다', () => {
    const current = [createFavorite('existing')]
    const next = applyOptimisticFavorite(current, BOOK, true)

    expect(next[0].isbn).toBe('isbn-1')
    expect(next).toHaveLength(2)
  })

  it('찜 해제 optimistic 업데이트 시 대상 아이템을 제거한다', () => {
    const current = [createFavorite('isbn-1'), createFavorite('existing')]
    const next = applyOptimisticFavorite(current, BOOK, false)

    expect(next.find((item) => item.isbn === 'isbn-1')).toBeUndefined()
    expect(next).toHaveLength(1)
  })
})
