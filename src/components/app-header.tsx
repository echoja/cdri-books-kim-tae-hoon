import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/class-name";

const NAV_ITEMS = [
  { to: "/search", label: "도서 검색" },
  { to: "/favorites", label: "내가 찜한 책" },
] as const;

export function AppHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header className={cn("relative flex h-21 w-full px-40", "items-center justify-center")}>
      <div
        className={cn(
          "text-title-1 text-text-title absolute",
          "top-6 left-6 leading-6 font-bold lg:left-40",
        )}
        aria-label="CERTICOS BOOKS"
      >
        CERTICOS BOOKS
      </div>
      <nav className="flex items-center gap-14" aria-label="주요 메뉴">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              className={cn(
                "text-body-1 text-text-primary focus-visible:outline-palette-primary border-b border-transparent pb-2 focus-visible:outline-2 focus-visible:outline-offset-2",
                active && "border-palette-primary",
              )}
              to={item.to}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
