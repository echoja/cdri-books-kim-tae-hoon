import { useEffect, useMemo, type ReactNode } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import appCss from '../styles.css?url'
import { AppShell } from '@/components/app-shell'
import { queryClient } from '@/lib/query-client'
import { createQueryPersister } from '@/lib/query-persistence'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'CDRI Books',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function AppProviders({ children }: { children: ReactNode }) {
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

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

function RootLayout() {
  useEffect(() => {
    document.body.dataset.appReady = 'true'

    return () => {
      delete document.body.dataset.appReady
    }
  }, [])

  return (
    <AppProviders>
      <ErrorBoundary
        fallbackRender={() => (
          <section className="flex min-h-80 w-full flex-col items-center justify-center gap-2">
            <h1 className="m-0 typography-title text-text-title">오류가 발생했습니다.</h1>
            <p className="m-0 typography-body-small text-text-secondary">페이지를 새로고침한 뒤 다시 시도해 주세요.</p>
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

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {import.meta.env.DEV ? (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
