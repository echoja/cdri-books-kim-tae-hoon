import type { Book } from "./types";

export function hasSalePrice(book: Book): boolean {
  return typeof book.salePrice === "number" && book.salePrice > 0;
}

export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}

export function buildBookId(title: string, publisher: string): string {
  return `${title}:${publisher}`;
}
