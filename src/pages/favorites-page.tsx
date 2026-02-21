import { toUserMessage } from "@/lib/errors";
import { EmptyState } from "@/components/empty-state";
import { BookList } from "@/components/book-list";
import { useFavoriteIds, useFavoriteRecords, useToggleFavorite } from "@/hooks/use-favorites";

export function FavoritesPage() {
  const favoritesQuery = useFavoriteRecords();
  const favoriteIdsQuery = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();

  const records = favoritesQuery.data ?? [];
  const books = records.map((record) => record.book);

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
        <div>
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
