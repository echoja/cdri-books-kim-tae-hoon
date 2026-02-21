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
  await page.waitForSelector('h1')
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

test('찜한 책 페이지 첫 방문 시 빈 상태 표시', async ({ page }) => {
  await page.goto('/favorites')
  await page.waitForSelector('h1')

  await expect(page.getByText('찜한 책이 없습니다')).toBeVisible()
  await expect(page.getByText('총 0건')).toBeVisible()
})

test('검색에서 찜 추가 → 찜 페이지에서 확인 및 건수 표시', async ({ page }) => {
  await gotoReady(page)

  const searchInput = page.getByPlaceholder('검색어 입력')
  await searchInput.fill('찜확인')
  await searchInput.press('Enter')
  await expect(page.getByText('찜확인 도서 1', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '찜 추가' }).first().click()

  await page.getByRole('link', { name: '내가 찜한 책' }).click()
  await expect(page.getByText('찜확인 도서 1', { exact: true })).toBeVisible()
  await expect(page.getByText('총 1건')).toBeVisible()
})

test('찜 페이지에서 찜 해제 → 빈 상태 복귀', async ({ page }) => {
  await gotoReady(page)

  const searchInput = page.getByPlaceholder('검색어 입력')
  await searchInput.fill('해제테스트')
  await searchInput.press('Enter')
  await expect(page.getByText('해제테스트 도서 1', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '찜 추가' }).first().click()

  await page.getByRole('link', { name: '내가 찜한 책' }).click()
  await expect(page.getByText('해제테스트 도서 1', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '찜 해제' }).first().click()
  await expect(page.getByText('찜한 책이 없습니다')).toBeVisible()
})

test('찜 목록이 새로고침 후에도 유지', async ({ page }) => {
  await gotoReady(page)

  const searchInput = page.getByPlaceholder('검색어 입력')
  await searchInput.fill('유지테스트')
  await searchInput.press('Enter')
  await expect(page.getByText('유지테스트 도서 1', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '찜 추가' }).first().click()

  await page.getByRole('link', { name: '내가 찜한 책' }).click()
  await expect(page.getByText('유지테스트 도서 1', { exact: true })).toBeVisible()

  await page.reload()
  await page.waitForSelector('h1')

  await expect(page.getByText('유지테스트 도서 1', { exact: true })).toBeVisible()
})
