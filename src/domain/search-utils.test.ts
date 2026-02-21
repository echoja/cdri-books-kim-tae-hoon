import { describe, expect, it } from 'vitest'
import { getSearchHistoryLimit, toSearchTarget, upsertSearchHistory } from '@/domain/search-utils'

describe('search-utils', () => {
  it('검색 기록은 최대 8개까지만 유지한다', () => {
    let records: ReturnType<typeof upsertSearchHistory> = []

    for (let idx = 0; idx < 10; idx += 1) {
      records = upsertSearchHistory(records, `키워드-${idx}`, 'title')
    }

    expect(records).toHaveLength(getSearchHistoryLimit())
    expect(records[0].keyword).toBe('키워드-9')
    expect(records.at(-1)?.keyword).toBe('키워드-2')
  })

  it('중복 검색어는 최신 위치로 이동한다', () => {
    let records: ReturnType<typeof upsertSearchHistory> = []
    records = upsertSearchHistory(records, '하루키', 'title')
    records = upsertSearchHistory(records, '제인오스틴', 'title')
    records = upsertSearchHistory(records, '하루키', 'title')

    expect(records).toHaveLength(2)
    expect(records[0].keyword).toBe('하루키')
  })

  it('상세검색 타겟을 안전하게 변환한다', () => {
    expect(toSearchTarget('person')).toBe('person')
    expect(toSearchTarget('publisher')).toBe('publisher')
    expect(toSearchTarget(undefined)).toBe('title')
    expect(toSearchTarget('unknown')).toBe('title')
  })
})
