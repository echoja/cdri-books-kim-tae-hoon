import { type ComponentProps, useState } from "react";
import type { Book } from "@/lib/types";
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
  const [expandedIsbn, setExpandedIsbn] = useState<string | null>(null);

  return (
    <section className={cn("mt-9", className)} aria-live="polite" {...props}>
      {books.map((book) => (
        <BookListItem
          key={`${book.isbn}-${book.title}`}
          book={book}
          expanded={expandedIsbn === book.isbn}
          onToggleExpanded={() =>
            setExpandedIsbn((prev) => (prev === book.isbn ? null : book.isbn))
          }
          isFavorite={favoriteIds.includes(book.isbn)}
          favoriteDisabled={favoriteDisabled}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}
