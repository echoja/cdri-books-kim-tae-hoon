import { Link, useRouterState } from "@tanstack/react-router";
import { cn, cva } from "@/lib/class-name";

const NAV_ITEMS = [
  { to: "/search", label: "도서 검색" },
  { to: "/favorites", label: "내가 찜한 책" },
] as const;

const navLinkVariants = cva(
  "border-b border-transparent pb-2 text-body-1 text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary max-md:text-base",
  {
    variants: {
      active: {
        true: "border-palette-primary",
      },
    },
  },
);

export function AppHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header
      className={cn(
        "h-header-height px-header-pad-desktop relative flex w-full items-center justify-center",
        "max-xl:px-header-pad-tablet",
        "max-md:h-header-height-mobile max-md:px-header-pad-mobile",
      )}
    >
      <div
        className={cn(
          "left-header-pad-desktop text-title-1 text-text-title absolute leading-6 font-bold",
          "max-xl:left-8",
          "max-md:static max-md:mr-auto max-md:text-lg max-md:font-semibold",
        )}
        aria-label="CERTICOS BOOKS"
      >
        CERTICOS BOOKS
      </div>
      <nav className="gap-nav-gap flex items-center max-md:gap-5" aria-label="주요 메뉴">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.to);

          return (
            <Link key={item.to} className={navLinkVariants({ active })} to={item.to}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
