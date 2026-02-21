import { Link, useRouterState } from '@tanstack/react-router'
import { cva } from '@/lib/class-name'

const NAV_ITEMS = [
  { to: '/', label: '도서 검색' },
  { to: '/favorites', label: '내가 찜한 책' },
] as const

const navLinkVariants = cva(
  'border-b border-transparent pb-2 typography-body text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary max-[767px]:text-base',
  {
    variants: {
      active: {
        true: 'border-palette-primary',
      },
    },
  },
)

export function AppHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <header className="relative flex h-header-height w-full items-center justify-center px-header-pad-desktop max-[1279px]:px-header-pad-tablet max-[767px]:h-header-height-mobile max-[767px]:px-header-pad-mobile">
      <div
        className="absolute left-header-pad-desktop text-2xl leading-6 font-bold text-text-title max-[1279px]:left-8 max-[767px]:static max-[767px]:mr-auto max-[767px]:text-lg max-[767px]:font-semibold"
        aria-label="CERTICOS BOOKS"
      >
        CERTICOS BOOKS
      </div>
      <nav className="flex items-center gap-nav-gap max-[767px]:gap-5" aria-label="주요 메뉴">
        {NAV_ITEMS.map((item) => {
          const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)

          return (
            <Link
              key={item.to}
              className={navLinkVariants({ active })}
              to={item.to}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
