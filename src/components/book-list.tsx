import { type ComponentProps, useEffect, useRef } from "react";
import { stagger } from "animejs";
import type { Book } from "@/domain/types";
import { BookListItem } from "./book-list-item";
import { motionDuration, runAnimate } from "@/lib/animation";
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
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || books.length === 0) {
      return;
    }

    const items = sectionRef.current.querySelectorAll("article");

    if (items.length === 0) {
      return;
    }

    runAnimate(items, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: motionDuration(300),
      delay: stagger(40),
      ease: "outQuad",
    });
  }, [books]);

  return (
    <section ref={sectionRef} className={cn("mt-9", className)} aria-live="polite" {...props}>
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
