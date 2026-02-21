import { QueryClient } from "@tanstack/react-query";
import { AppError } from "@/domain/errors";

const RETRYABLE_CODES = new Set(["RATE_LIMIT", "SERVER", "NETWORK"]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 86_400_000,
      retry: (failureCount, error) => {
        if (failureCount >= 2) {
          return false;
        }

        if (error instanceof AppError) {
          return RETRYABLE_CODES.has(error.code);
        }

        return true;
      },
      retryDelay: (attemptIndex) => Math.min(2 ** attemptIndex * 400, 2_500),
    },
  },
});
