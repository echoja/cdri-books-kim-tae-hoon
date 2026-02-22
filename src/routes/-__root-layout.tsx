import { type ReactNode, useEffect, useMemo } from "react";
import { Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { Toaster } from "sonner";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/class-name";
import { queryClient } from "@/lib/query-client";
import { createQueryPersister } from "@/lib/query-persistence";

interface AppProvidersProps {
  children: ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
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
          <section
            role="alert"
            className="flex min-h-80 w-full flex-col items-center justify-center gap-2"
          >
            <h1 className="text-title-3 text-text-title m-0">오류가 발생했습니다.</h1>
            <p className="text-body-2 text-text-secondary m-0">
              페이지를 새로고침한 뒤 다시 시도해 주세요.
            </p>
          </section>
        )}
      >
        <a
          href="#main-content"
          className={cn(
            "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50",
            "rounded-button bg-palette-primary text-palette-white px-4 py-2",
          )}
        >
          본문으로 건너뛰기
        </a>
        <AppHeader />
        <main id="main-content" className="flex w-full justify-center pb-15">
          <div
            className={cn(
              "max-w-page-content mt-20",
              "w-[calc(100%-var(--spacing-page-pad-trim))]",
            )}
          >
            <Outlet />
          </div>
        </main>
      </ErrorBoundary>
      <Toaster
        theme="light"
        richColors={false}
        closeButton={false}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "rounded-button border border-palette-divider bg-palette-light-gray text-text-primary px-4 py-3 shadow-none flex items-start gap-2",
            title: "text-body-2 text-text-primary font-medium leading-none",
            description: "text-small text-text-secondary mt-1",
            content: "flex min-w-0 flex-1 flex-col gap-0 pt-1",
            icon: "text-text-subtitle mt-0.25",
            success: "[&_[data-icon]]:text-palette-primary",
            error: "[&_[data-icon]]:text-palette-red",
            actionButton:
              "rounded-button bg-palette-primary px-3 text-palette-white hover:bg-palette-primary-hover",
            cancelButton:
              "rounded-button border border-palette-divider bg-palette-white px-3 text-text-secondary hover:bg-palette-light-gray-hover",
          },
        }}
      />
    </AppProviders>
  );
}
