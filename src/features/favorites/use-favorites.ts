import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyOptimisticFavorite } from "@/domain/favorites-utils";
import type { Book, FavoriteRecord } from "@/domain/types";
import { favoritesRepository } from "@/repositories/favorites-repository";
import { syncAdapter } from "@/adapters/sync-adapter";

export const FAVORITES_QUERY_KEY = ["favorites"] as const;
export const FAVORITE_IDS_QUERY_KEY = ["favorite-ids"] as const;

export function useFavoriteRecords() {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: () => favoritesRepository.list(),
    initialData: [] as FavoriteRecord[],
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useFavoriteIds() {
  return useQuery({
    queryKey: FAVORITE_IDS_QUERY_KEY,
    queryFn: () => favoritesRepository.listIsbns(),
    initialData: [] as string[],
    staleTime: 0,
    refetchOnMount: "always",
  });
}

interface ToggleFavoriteInput {
  book: Book;
  willFavorite: boolean;
}

interface FavoriteMutationContext {
  previousFavorites: FavoriteRecord[];
  previousFavoriteIds: string[];
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ToggleFavoriteInput, FavoriteMutationContext>({
    mutationFn: async ({ book, willFavorite }) => {
      if (willFavorite) {
        await favoritesRepository.upsert(book);
        await syncAdapter.pushFavorites(await favoritesRepository.list());
      } else {
        await favoritesRepository.remove(book.isbn);
      }
    },
    onMutate: async ({ book, willFavorite }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: FAVORITE_IDS_QUERY_KEY });

      const previousFavorites =
        queryClient.getQueryData<FavoriteRecord[]>(FAVORITES_QUERY_KEY) ?? [];
      const previousFavoriteIds = queryClient.getQueryData<string[]>(FAVORITE_IDS_QUERY_KEY) ?? [];

      queryClient.setQueryData<FavoriteRecord[]>(FAVORITES_QUERY_KEY, (current = []) =>
        applyOptimisticFavorite(current, book, willFavorite),
      );

      queryClient.setQueryData<string[]>(FAVORITE_IDS_QUERY_KEY, (current = []) => {
        if (willFavorite) {
          return Array.from(new Set([book.isbn, ...current]));
        }

        return current.filter((isbn) => isbn !== book.isbn);
      });

      return {
        previousFavorites,
        previousFavoriteIds,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      queryClient.setQueryData(FAVORITE_IDS_QUERY_KEY, context.previousFavoriteIds);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: FAVORITE_IDS_QUERY_KEY });
    },
  });
}
