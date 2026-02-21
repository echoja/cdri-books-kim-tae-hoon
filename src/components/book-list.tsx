import { type ComponentProps } from "react";
import type { Book } from "@/domain/types";
import { BookListItem } from "./book-list-item";
import { cn } from "@/lib/class-name";

interface BookListProps extends Omit<ComponentProps<"section">, "children"> {
  books: Book[];
  favoriteIds: string[];
  favoriteDisabled?: boolean;
  onToggleFavorite: (book: Book, willFavorite: boolean) => void;
}

export function BookList({
  books,
  favoriteIds,
  favoriteDisabled = false,
  onToggleFavorite,
  className,
  ...props
}: BookListProps) {
  return (
    <section className={cn("mt-9", className)} aria-live="polite" {...props}>
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
  );
}
