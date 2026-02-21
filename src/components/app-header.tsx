import { Link, useRouterState } from '@tanstack/react-router'
import { cva } from '@/lib/class-name'

const NAV_ITEMS = [
  { to: '/', label: '도서 검색' },
  { to: '/favorites', label: '내가 찜한 책' },
] as const

const navLinkVariants = cva(
  'border-b border-transparent pb-[10px] text-[20px] leading-5 font-medium text-[#353c49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4880ee] max-[767px]:text-base',
  {
    variants: {
      active: {
        true: 'border-[#4880ee]',
      },
    },
  },
)

export function AppHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <header className="relative flex h-[84px] w-full items-center justify-center px-[160px] max-[1279px]:px-8 max-[767px]:h-[76px] max-[767px]:px-4">
      <div
        className="absolute left-[160px] text-2xl leading-6 font-bold text-[#1a1e27] max-[1279px]:left-8 max-[767px]:static max-[767px]:mr-auto max-[767px]:text-lg"
        aria-label="CERTICOS BOOKS"
      >
        CERTICOS BOOKS
      </div>
      <nav className="flex items-center gap-14 max-[767px]:gap-5" aria-label="주요 메뉴">
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
