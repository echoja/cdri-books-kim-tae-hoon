import type { ReactNode } from 'react'
import { AppHeader } from '@/components/app-header'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <AppHeader />
      <main className="app-main">
        <div className="content-container">{children}</div>
      </main>
    </>
  )
}
