import type { ReactNode } from 'react'
import { AppHeader } from '@/components/app-header'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <AppHeader />
      <main className="flex w-full justify-center pb-page-bottom">
        <div className="mt-page-top w-[calc(100%-var(--spacing-page-pad-trim))] max-w-page-content max-[1279px]:w-[calc(100%-var(--spacing-page-pad-trim))] max-[1279px]:max-w-page-content max-[767px]:mt-page-top-mobile max-[767px]:w-[calc(100%-var(--spacing-page-pad-trim-mobile))]">
          {children}
        </div>
      </main>
    </>
  )
}
