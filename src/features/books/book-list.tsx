import { useEffect, useRef } from 'react'
import { stagger } from 'animejs'
import type { Book } from '@/domain/types'
import { BookListItem } from '@/features/books/book-list-item'
import { motionDuration, safeAnimate } from '@/lib/animation'

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
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current || books.length === 0) {
      return
    }

    const items = sectionRef.current.querySelectorAll('article')

    if (items.length === 0) {
      return
    }

    safeAnimate(items, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: motionDuration(300),
      delay: stagger(40),
      ease: 'outQuad',
    })
  }, [books])

  return (
    <section ref={sectionRef} className="mt-9" aria-live="polite">
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
