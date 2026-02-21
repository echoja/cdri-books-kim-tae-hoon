import { type ReactNode, useEffect, useMemo } from 'react'
import { Outlet } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { AppShell } from '@/components/app-shell'
import { queryClient } from '@/lib/query-client'
import { createQueryPersister } from '@/lib/query-persistence'

export function AppProviders({ children }: { children: ReactNode }) {
  const persister = useMemo(() => createQueryPersister(), [])

  useEffect(() => {
    const [unsubscribe, restorePromise] = persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 60 * 24,
    })

    void restorePromise.catch(() => undefined)

    return unsubscribe
  }, [persister])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
      </ErrorBoundary>
    </AppProviders>
  )
}
