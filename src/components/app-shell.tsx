import type { ReactNode } from 'react'
import { AppHeader } from '@/components/app-header'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <AppHeader />
      <main className="flex w-full justify-center pb-[60px]">
        <div className="mt-20 w-[960px] max-[1279px]:w-[calc(100%-64px)] max-[1279px]:max-w-[960px] max-[767px]:mt-12 max-[767px]:w-[calc(100%-32px)]">
          {children}
        </div>
      </main>
    </>
  )
}
