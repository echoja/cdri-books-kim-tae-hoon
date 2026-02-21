import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchHistoryRepository } from "@/repositories/search-history-repository";
import type { SearchTarget } from "@/domain/types";

export const SEARCH_HISTORY_QUERY_KEY = ["search-history"] as const;

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function useSearchHistory() {
  return useQuery({
    queryKey: SEARCH_HISTORY_QUERY_KEY,
    queryFn: () => searchHistoryRepository.list(),
    enabled: isClient(),
    initialData: [],
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useUpsertSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ keyword, target }: { keyword: string; target?: SearchTarget }) =>
      searchHistoryRepository.upsert(keyword, target),
    onSuccess: (records) => {
      queryClient.setQueryData(SEARCH_HISTORY_QUERY_KEY, records);
    },
  });
}

export function useRemoveSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => searchHistoryRepository.remove(key),
    onSuccess: (records) => {
      queryClient.setQueryData(SEARCH_HISTORY_QUERY_KEY, records);
    },
  });
}
