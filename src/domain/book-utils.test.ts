import { describe, expect, it } from 'vitest'
import { formatPrice, getCollapsedDisplayPrice, hasSalePrice } from '@/domain/book-utils'
import type { Book } from '@/domain/types'

const BASE_BOOK: Book = {
  isbn: '1',
  title: '테스트',
  authors: ['작가'],
  publisher: '출판사',
  thumbnail: '',
  contents: '',
  price: 16000,
  url: 'https://example.com',
}

describe('book-utils', () => {
  it('할인가가 있으면 접힘 상태 가격은 할인가를 사용한다', () => {
    expect(getCollapsedDisplayPrice({ ...BASE_BOOK, salePrice: 13500 })).toBe(13500)
  })

  it('할인가가 없으면 접힘 상태 가격은 원가를 사용한다', () => {
    expect(getCollapsedDisplayPrice(BASE_BOOK)).toBe(16000)
  })

  it('가격을 한국 원화 형식으로 포맷한다', () => {
    expect(formatPrice(13500)).toBe('13,500원')
  })

  it('할인가 존재 여부를 판별한다', () => {
    expect(hasSalePrice({ ...BASE_BOOK, salePrice: 12000 })).toBe(true)
    expect(hasSalePrice(BASE_BOOK)).toBe(false)
  })
})
