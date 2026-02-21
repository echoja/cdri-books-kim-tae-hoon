import type { ComponentProps } from "react";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/class-name";

interface AppShellProps extends ComponentProps<"main"> {}

export function AppShell({ children, className, ...props }: AppShellProps) {
  return (
    <>
      <AppHeader />
      <main className={cn("pb-page-bottom flex w-full justify-center", className)} {...props}>
        <div
          className={cn(
            "mt-page-top max-w-page-content w-[calc(100%-var(--spacing-page-pad-trim))]",
            "max-xl:max-w-page-content max-xl:w-[calc(100%-var(--spacing-page-pad-trim))]",
            "max-md:mt-page-top-mobile max-md:w-[calc(100%-var(--spacing-page-pad-trim-mobile))]",
          )}
        >
          {children}
        </div>
      </main>
    </>
  );
}
