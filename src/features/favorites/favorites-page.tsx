import { EmptyState } from '@/components/empty-state'
import { BookList } from '@/features/books/book-list'
import {
  useFavoriteIds,
  useFavoriteRecords,
  useToggleFavorite,
} from '@/features/favorites/use-favorites'

export function FavoritesPage() {
  const favoritesQuery = useFavoriteRecords()
  const favoriteIdsQuery = useFavoriteIds()
  const toggleFavorite = useToggleFavorite()

  const records = favoritesQuery.data ?? []
  const books = records.map((record) => record.book)

  return (
    <section className="w-full">
      <div className="mb-3 flex flex-col items-start">
        <h1 className="text-page-heading text-text-title m-0">내가 찜한 책</h1>
        <div className="text-title text-text-primary mt-6 flex items-center gap-4">
          <span>찜한 책</span>
          <span>
            총 <strong className="text-palette-primary">{records.length}</strong>건
          </span>
        </div>
      </div>

      {books.length > 0 ? (
        <BookList
          books={books}
          favoriteIds={favoriteIdsQuery.data ?? []}
          favoriteDisabled={toggleFavorite.isPending}
          onToggleFavorite={(book, willFavorite) =>
            toggleFavorite.mutate({
              book,
              willFavorite,
            })
          }
        />
      ) : (
        <EmptyState message="찜한 책이 없습니다" />
      )}
    </section>
  )
}
