import type { ComponentProps } from "react";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/class-name";

interface AppShellProps extends ComponentProps<"main"> {}

export function AppShell({ children, className, ...props }: AppShellProps) {
  return (
    <>
      <AppHeader />
      <main className={cn("pb-page-bottom flex w-full justify-center", className)} {...props}>
        <div className="mt-page-top max-w-page-content w-[calc(100%-var(--spacing-page-pad-trim))]">
          {children}
        </div>
      </main>
    </>
  );
}
