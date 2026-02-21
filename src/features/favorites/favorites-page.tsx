import { useEffect, useRef } from "react";
import { stagger } from "animejs";
import { toUserMessage } from "@/domain/errors";
import { EmptyState } from "@/components/empty-state";
import { BookList } from "@/components/book-list";
import {
  useFavoriteIds,
  useFavoriteRecords,
  useToggleFavorite,
} from "@/features/favorites/use-favorites";
import { motionDuration, runAnimate } from "@/lib/animation";

export function FavoritesPage() {
  const favoritesQuery = useFavoriteRecords();
  const favoriteIdsQuery = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();
  const listRef = useRef<HTMLDivElement | null>(null);

  const records = favoritesQuery.data ?? [];
  const books = records.map((record) => record.book);

  useEffect(() => {
    if (!listRef.current || books.length === 0) {
      return;
    }

    const items = listRef.current.querySelectorAll("article");

    if (items.length === 0) {
      return;
    }

    runAnimate(items, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: motionDuration(300),
      delay: stagger(50),
      ease: "outQuad",
    });
  }, [books.length]);

  return (
    <section className="w-full">
      <div className="mb-3 flex flex-col items-start">
        <h1 className="text-title-2 text-text-title m-0">내가 찜한 책</h1>
        <div className="text-title-3 text-text-primary mt-6 flex items-center gap-4">
          <span>찜한 책</span>
          <span>
            총 <strong className="text-palette-primary">{records.length}</strong>건
          </span>
        </div>
      </div>

      {favoritesQuery.isError ? (
        <p className="text-body-2 text-palette-red mt-5">{toUserMessage(favoritesQuery.error)}</p>
      ) : null}

      {favoritesQuery.isLoading ? (
        <p className="text-body-2 mt-5">찜한 책을 불러오는 중입니다...</p>
      ) : null}

      {!favoritesQuery.isLoading && books.length > 0 ? (
        <div ref={listRef}>
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
        </div>
      ) : null}

      {!favoritesQuery.isLoading && !favoritesQuery.isError && books.length === 0 ? (
        <EmptyState message="찜한 책이 없습니다" />
      ) : null}
    </section>
  );
}
