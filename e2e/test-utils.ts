import type { Page } from "@playwright/test";
import type { KakaoSearchResponse } from "@/services/kakao-book-client";

export function createResponse(page: number, keyword = "고양이"): KakaoSearchResponse {
  return {
    meta: {
      total_count: 12,
      pageable_count: 12,
      is_end: page >= 2,
    },
    documents: Array.from({ length: page === 1 ? 10 : 2 }, (_, index) => {
      const seed = (page - 1) * 10 + index + 1;

      return {
        title: `${keyword} 도서 ${seed}`,
        contents: `${keyword} 소개 ${seed}`,
        url: `https://example.com/book/${seed}`,
        isbn: `isbn-${seed}`,
        datetime: "2026-01-01T00:00:00.000Z",
        authors: ["작가명"],
        publisher: "출판사",
        thumbnail: "",
        price: 16000,
        sale_price: 13500,
      };
    }),
  };
}

export async function gotoReady(page: Page) {
  await page.goto("/");
  await page.waitForSelector("h1");
}
