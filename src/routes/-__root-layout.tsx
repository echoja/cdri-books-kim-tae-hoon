import { type ReactNode, useEffect, useMemo } from "react";
import { Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { Toaster } from "sonner";
import { AppShell } from "@/components/app-shell";
import { queryClient } from "@/lib/query-client";
import { createQueryPersister } from "@/lib/query-persistence";

export function AppProviders({ children }: { children: ReactNode }) {
  const persister = useMemo(() => createQueryPersister(), []);

  useEffect(() => {
    const [unsubscribe, restorePromise] = persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 60 * 24,
    });

    void restorePromise.catch(() => undefined);

    return unsubscribe;
  }, [persister]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function RootLayout() {
  return (
    <AppProviders>
      <ErrorBoundary
        fallbackRender={() => (
          <section className="flex min-h-80 w-full flex-col items-center justify-center gap-2">
            <h1 className="text-title text-text-title m-0">오류가 발생했습니다.</h1>
            <p className="text-body-small text-text-secondary m-0">
              페이지를 새로고침한 뒤 다시 시도해 주세요.
            </p>
          </section>
        )}
      >
        <AppShell>
          <Outlet />
        </AppShell>
        <Toaster
          theme="light"
          richColors={false}
          closeButton={false}
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "rounded-button border border-divider bg-surface-secondary text-text-primary px-4 py-3 shadow-none flex items-start gap-2",
              title: "text-body-small text-text-primary font-medium leading-none",
              description: "text-small text-text-secondary mt-1",
              content: "flex min-w-0 flex-1 flex-col gap-0",
              icon: "text-text-subtitle mt-0.25",
              success: "[&_[data-icon]]:text-palette-primary",
              error: "[&_[data-icon]]:text-text-error",
              actionButton:
                "rounded-button bg-palette-primary px-3 text-palette-white hover:bg-palette-primary-hover",
              cancelButton:
                "rounded-button border border-divider bg-palette-white px-3 text-text-secondary hover:bg-surface-hover",
            },
          }}
        />
      </ErrorBoundary>
    </AppProviders>
  );
}
