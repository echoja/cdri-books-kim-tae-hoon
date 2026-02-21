import type { Book } from '@/domain/types'
import { BookListItem } from '@/features/books/book-list-item'

interface BookListProps {
  books: Book[]
  favoriteIds: string[]
  favoriteDisabled?: boolean
  onToggleFavorite: (book: Book, willFavorite: boolean) => void
}

export function BookList({
  books,
  favoriteIds,
  favoriteDisabled = false,
  onToggleFavorite,
}: BookListProps) {
  return (
    <section className="book-list" aria-live="polite">
      {books.map((book) => (
        <BookListItem
          key={`${book.isbn}-${book.title}`}
          book={book}
          isFavorite={favoriteIds.includes(book.isbn)}
          favoriteDisabled={favoriteDisabled}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  )
}
