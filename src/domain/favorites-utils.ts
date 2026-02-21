import type { FavoriteRecord, Book } from './types'

export function applyOptimisticFavorite(
  current: FavoriteRecord[],
  book: Book,
  willFavorite: boolean,
): FavoriteRecord[] {
  if (willFavorite) {
    const now = new Date().toISOString()

    const next: FavoriteRecord = {
      isbn: book.isbn,
      book,
      likedAt: now,
      updatedAt: now,
      syncStatus: 'pending',
    }

    return [next, ...current.filter((entry) => entry.isbn !== book.isbn)]
  }

  return current.filter((entry) => entry.isbn !== book.isbn)
}
