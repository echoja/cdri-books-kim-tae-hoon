import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applyOptimisticFavorite } from "@/domain/favorites-utils";
import type { Book, FavoriteRecord } from "@/domain/types";
import { FavoritesRepository } from "@/repositories/favorites-repository";
import { syncAdapter } from "@/adapters/sync-adapter";

const favoritesRepository = new FavoritesRepository(syncAdapter);

const favoritesQueryOptions = queryOptions({
  queryKey: ["favorites"],
  queryFn: () => favoritesRepository.list(),
  initialData: [] as FavoriteRecord[],
  staleTime: 0,
  refetchOnMount: "always",
});

const favoriteIdsQueryOptions = queryOptions({
  queryKey: ["favorite-ids"],
  queryFn: () => favoritesRepository.listIsbns(),
  initialData: [] as string[],
  staleTime: 0,
  refetchOnMount: "always",
});

export function useFavoriteRecords() {
  return useQuery(favoritesQueryOptions);
}

export function useFavoriteIds() {
  return useQuery(favoriteIdsQueryOptions);
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
      } else {
        await favoritesRepository.remove(book.isbn);
      }
    },
    onMutate: async ({ book, willFavorite }) => {
      await queryClient.cancelQueries({ queryKey: favoritesQueryOptions.queryKey });
      await queryClient.cancelQueries({ queryKey: favoriteIdsQueryOptions.queryKey });

      const previousFavorites = queryClient.getQueryData(favoritesQueryOptions.queryKey) ?? [];
      const previousFavoriteIds = queryClient.getQueryData(favoriteIdsQueryOptions.queryKey) ?? [];

      queryClient.setQueryData(favoritesQueryOptions.queryKey, (current = []) =>
        applyOptimisticFavorite(current, book, willFavorite),
      );

      queryClient.setQueryData(favoriteIdsQueryOptions.queryKey, (current = []) => {
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
    onSuccess: (_data, { willFavorite }) => {
      toast.success(willFavorite ? "찜에 추가했어요." : "찜을 해제했어요.");
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(favoritesQueryOptions.queryKey, context.previousFavorites);
      queryClient.setQueryData(favoriteIdsQueryOptions.queryKey, context.previousFavoriteIds);

      toast.error(
        variables.willFavorite
          ? "찜 추가에 실패했어요. 다시 시도해 주세요."
          : "찜 해제에 실패했어요.",
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: favoritesQueryOptions.queryKey });
      await queryClient.invalidateQueries({ queryKey: favoriteIdsQueryOptions.queryKey });
    },
  });
}
