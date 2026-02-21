import type { ReactNode } from 'react'
import { AppHeader } from '@/components/app-header'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <AppHeader />
      <main className="pb-page-bottom flex w-full justify-center">
        <div className="mt-page-top max-w-page-content max-[1279px]:max-w-page-content max-[767px]:mt-page-top-mobile w-[calc(100%-var(--spacing-page-pad-trim))] max-[1279px]:w-[calc(100%-var(--spacing-page-pad-trim))] max-[767px]:w-[calc(100%-var(--spacing-page-pad-trim-mobile))]">
          {children}
        </div>
      </main>
    </>
  )
}
