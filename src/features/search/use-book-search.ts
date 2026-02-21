import { useQuery } from "@tanstack/react-query";
import type { SearchParams } from "@/domain/types";
import { BookRepository } from "@/repositories/book-repository";
import { kakaoBookClient } from "@/services/kakao-book-client";

export const bookRepository = new BookRepository(kakaoBookClient);

export function createBookSearchQueryKey(params: SearchParams | null) {
  return ["book-search", params] as const;
}

export function useBookSearch(params: SearchParams | null) {
  return useQuery({
    queryKey: createBookSearchQueryKey(params),
    queryFn: ({ signal }) => {
      if (!params) {
        throw new Error("검색 파라미터가 없습니다.");
      }

      return bookRepository.search(params, signal);
    },
    enabled: !!params,
    placeholderData: (previousData) => previousData,
  });
}
