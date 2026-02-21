import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchHistoryRepository } from "@/repositories/search-history-repository";
import type { SearchTarget } from "@/domain/types";

const SEARCH_HISTORY_QUERY_KEY = ["search-history"] as const;

export function useSearchHistory() {
  return useQuery({
    queryKey: SEARCH_HISTORY_QUERY_KEY,
    queryFn: () => searchHistoryRepository.list(),
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
