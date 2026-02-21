import { expect, test, type Page } from '@playwright/test'

function createResponse(page: number, keyword = '고양이') {
  return {
    meta: {
      total_count: 12,
      pageable_count: 12,
      is_end: page >= 2,
    },
    documents: Array.from({ length: page === 1 ? 10 : 2 }, (_, index) => {
      const seed = (page - 1) * 10 + index + 1

      return {
        title: `${keyword} 도서 ${seed}`,
        contents: `${keyword} 소개 ${seed}`,
        url: `https://example.com/book/${seed}`,
        isbn: `isbn-${seed}`,
        datetime: '2026-01-01T00:00:00.000Z',
        authors: ['작가명'],
        publisher: '출판사',
        thumbnail: '',
        price: 16000,
        sale_price: 13500,
      }
    }),
  }
}

async function gotoReady(page: Page) {
  await page.goto('/')
  await page.waitForSelector('body[data-app-ready="true"]')
}

test.beforeEach(async ({ page }) => {
  await page.route('https://dapi.kakao.com/v3/search/book**', async (route) => {
    const url = new URL(route.request().url())
    const query = url.searchParams.get('query') ?? '검색어'
    const pageNo = Number(url.searchParams.get('page') ?? '1')
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(createResponse(pageNo, query)),
    })
  })
})

test('Enter 검색 -> 리스트 렌더 -> 페이지 이동', async ({ page }) => {
  await gotoReady(page)

  const searchInput = page.getByPlaceholder('검색어 입력')
  await searchInput.fill('하루키')
  await searchInput.press('Enter')

  await expect(page.getByText('하루키 도서 1', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '다음' }).click()
  await expect(page.getByText('하루키 도서 11', { exact: true })).toBeVisible()
})

test('상세검색 선택/검색 동작', async ({ page }) => {
  await gotoReady(page)

  await page.getByRole('button', { name: '상세검색' }).click()
  await expect(page.locator('.detail-search-popover')).toBeVisible()
  await page.locator('.detail-select').click()
  await page.getByRole('option', { name: '저자명' }).click()
  await page.locator('.detail-input').fill('무라카미')
  await page.getByRole('button', { name: '검색하기' }).click()

  await expect(page.getByText('무라카미 도서 1', { exact: true })).toBeVisible()
})

test('찜 추가/해제 및 내가 찜한 책 동기화', async ({ page }) => {
  await gotoReady(page)

  const searchInput = page.getByPlaceholder('검색어 입력')
  await searchInput.fill('찜테스트')
  await searchInput.press('Enter')

  await page.getByRole('button', { name: '찜 추가' }).first().click()

  await page.getByRole('link', { name: '내가 찜한 책' }).click()
  await expect(page.getByText('찜테스트 도서 1', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '찜 해제' }).first().click()
  await expect(page.getByText('찜한 책이 없습니다')).toBeVisible()
})

test('새로고침 후 검색기록/찜 유지', async ({ page }) => {
  await gotoReady(page)

  const searchInput = page.getByPlaceholder('검색어 입력')
  await searchInput.fill('기록테스트')
  await searchInput.press('Enter')
  await page.getByRole('button', { name: '찜 추가' }).first().click()

  await page.getByRole('link', { name: '내가 찜한 책' }).click()
  await expect(page.getByText('기록테스트 도서 1', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: '도서 검색' }).click()

  await page.reload()

  await page.getByPlaceholder('검색어 입력').click()
  await expect(page.getByRole('button', { name: '기록테스트', exact: true })).toBeVisible()

  await page.getByRole('link', { name: '내가 찜한 책' }).click()
  await expect(page.getByText('기록테스트 도서 1', { exact: true })).toBeVisible()
})

test('API 장애 시 캐시 fallback 표시', async ({ page }) => {
  let shouldFail = false

  await page.route('https://dapi.kakao.com/v3/search/book**', async (route) => {
    if (shouldFail) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'error' }),
      })
      return
    }

    const url = new URL(route.request().url())
    const query = url.searchParams.get('query') ?? '검색어'
    const pageNo = Number(url.searchParams.get('page') ?? '1')

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(createResponse(pageNo, query)),
    })
  })

  await gotoReady(page)

  const searchInput = page.getByPlaceholder('검색어 입력')
  await searchInput.fill('캐시테스트')
  await searchInput.press('Enter')
  await expect(page.getByText('캐시테스트 도서 1', { exact: true })).toBeVisible()

  shouldFail = true
  await searchInput.press('Enter')

  await expect(page.getByText('캐시 데이터')).toBeVisible()
})
