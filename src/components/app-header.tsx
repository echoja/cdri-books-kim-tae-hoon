import { Link, useRouterState } from '@tanstack/react-router'

const NAV_ITEMS = [
  { to: '/', label: '도서 검색' },
  { to: '/favorites', label: '내가 찜한 책' },
] as const

export function AppHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <header className="app-header">
      <div className="header-brand" aria-label="CDRI Books">
        CDRI Books
      </div>
      <nav className="header-nav" aria-label="주요 메뉴">
        {NAV_ITEMS.map((item) => {
          const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)

          return (
            <Link
              key={item.to}
              className={`header-nav-link${active ? ' is-active' : ''}`}
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
