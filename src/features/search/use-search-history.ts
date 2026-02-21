import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchHistoryRepository } from "@/repositories/search-history-repository";
import type { SearchHistoryRecord, SearchTarget } from "@/domain/types";

const searchHistoryQueryOptions = queryOptions({
  queryKey: ["search-history"],
  queryFn: () => searchHistoryRepository.list(),
  initialData: [] as SearchHistoryRecord[],
  staleTime: 0,
  refetchOnMount: "always",
});

export function useSearchHistory() {
  return useQuery(searchHistoryQueryOptions);
}

export function useUpsertSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ keyword, target }: { keyword: string; target?: SearchTarget }) =>
      searchHistoryRepository.upsert(keyword, target),
    onSuccess: (records) => {
      queryClient.setQueryData(searchHistoryQueryOptions.queryKey, records);
    },
  });
}

export function useRemoveSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => searchHistoryRepository.remove(key),
    onSuccess: (records) => {
      queryClient.setQueryData(searchHistoryQueryOptions.queryKey, records);
    },
  });
}
