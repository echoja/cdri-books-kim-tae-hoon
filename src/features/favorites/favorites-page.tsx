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
    <section className="page-section">
      <div className="search-box favorites-box">
        <h1 className="page-title">내가 찜한 책</h1>
        <div className="count-row">
          <span>찜한 책</span>
          <span>
            총 <strong>{records.length}</strong>건
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
