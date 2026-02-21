import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import lineHeart from '../../../assets/icons/line.svg'
import fillHeart from '../../../assets/icons/fill.svg'
import emptyBookIcon from '../../../assets/icons/icon_book.png'
import { formatPrice, getCollapsedDisplayPrice, hasSalePrice } from '@/domain/book-utils'
import type { Book } from '@/domain/types'
import { motionDuration, safeAnimate } from '@/lib/animation'

interface BookListItemProps {
  book: Book
  isFavorite: boolean
  favoriteDisabled?: boolean
  onToggleFavorite: (book: Book, willFavorite: boolean) => void
}

export function BookListItem({
  book,
  isFavorite,
  favoriteDisabled = false,
  onToggleFavorite,
}: BookListItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [renderExpanded, setRenderExpanded] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const authors = useMemo(() => {
    if (!book.authors || book.authors.length === 0) {
      return '-'
    }

    return book.authors.join(', ')
  }, [book.authors])

  const thumbnailSrc = book.thumbnail || emptyBookIcon

  useEffect(() => {
    if (expanded) {
      setRenderExpanded(true)
    }
  }, [expanded])

  useEffect(() => {
    const panel = panelRef.current

    if (!panel) {
      return
    }

    if (expanded) {
      panel.style.display = 'block'
      panel.style.overflow = 'hidden'
      panel.style.height = '0px'

      const targetHeight = Math.min(panel.scrollHeight, window.innerWidth <= 767 ? 640 : 520)

      safeAnimate({
        targets: panel,
        opacity: [0, 1],
        height: [0, targetHeight],
        duration: motionDuration(220),
        ease: 'outQuad',
        onComplete: () => {
          panel.style.height = 'auto'
          panel.style.overflow = 'visible'
        },
      })
      return
    }

    if (!renderExpanded) {
      return
    }

    panel.style.overflow = 'hidden'

    safeAnimate({
      targets: panel,
      opacity: [1, 0],
      height: [panel.scrollHeight, 0],
      duration: motionDuration(180),
      ease: 'outQuad',
      onComplete: () => {
        setRenderExpanded(false)
      },
    })
  }, [expanded, renderExpanded])

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <article className="book-list-item">
      <div className="book-collapsed-row">
        <div className="book-thumbnail-wrap book-thumbnail-wrap-collapsed">
          <img className="book-thumbnail-collapsed" src={thumbnailSrc} alt={`${book.title} 표지`} />
          <button
            type="button"
            className="favorite-badge favorite-badge-collapsed"
            onClick={() => onToggleFavorite(book, !isFavorite)}
            disabled={favoriteDisabled}
            aria-label={isFavorite ? '찜 해제' : '찜 추가'}
          >
            <img src={isFavorite ? fillHeart : lineHeart} width={16} height={16} alt="" />
          </button>
        </div>

        <div className="book-meta-row">
          <p className="book-title-clamp-1">{book.title}</p>
          <p className="book-author-clamp-1">{authors}</p>
        </div>

        <div className="book-right-row">
          <p className="book-price-main">{formatPrice(getCollapsedDisplayPrice(book))}</p>
          <div className="book-actions-inline">
            <a
              className={`btn btn-primary${book.url ? '' : ' is-disabled-link'}`}
              href={book.url || '#'}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!book.url}
              onClick={(event) => {
                if (!book.url) {
                  event.preventDefault()
                }
              }}
            >
              구매하기
            </a>
            <button type="button" className="btn btn-secondary detail-btn" onClick={toggleExpanded}>
              상세보기
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {renderExpanded ? (
        <div ref={panelRef} className="book-expanded-panel" style={{ display: expanded ? 'block' : 'none' }}>
          <div className="book-expanded-row">
            <div className="book-thumbnail-wrap book-thumbnail-wrap-expanded">
              <img className="book-thumbnail-expanded" src={thumbnailSrc} alt={`${book.title} 표지 확대`} />
              <button
                type="button"
                className="favorite-badge favorite-badge-expanded"
                onClick={() => onToggleFavorite(book, !isFavorite)}
                disabled={favoriteDisabled}
                aria-label={isFavorite ? '찜 해제' : '찜 추가'}
              >
                <img src={isFavorite ? fillHeart : lineHeart} width={24} height={24} alt="" />
              </button>
            </div>

            <section className="book-expanded-main">
              <div className="book-expanded-meta">
                <p className="book-title-clamp-2">{book.title}</p>
                <p className="book-author-clamp-1">{authors}</p>
              </div>

              <section className="book-intro-block">
                <h3>책 소개</h3>
                <p className="book-intro-text">{book.contents || '책 소개 정보가 없습니다.'}</p>
              </section>
            </section>

            <aside className="book-expanded-side">
              <button type="button" className="btn btn-secondary detail-btn" onClick={toggleExpanded}>
                상세보기
                <ChevronUp size={16} />
              </button>

              <div className="book-price-box">
                <div className="book-price-row">
                  <span>원가</span>
                  <strong>{formatPrice(book.price)}</strong>
                </div>
                {hasSalePrice(book) ? (
                  <div className="book-price-row">
                    <span>할인가</span>
                    <strong>{formatPrice(book.salePrice ?? 0)}</strong>
                  </div>
                ) : null}
                <a
                  className={`btn btn-primary book-buy-block${book.url ? '' : ' is-disabled-link'}`}
                  href={book.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!book.url}
                  onClick={(event) => {
                    if (!book.url) {
                      event.preventDefault()
                    }
                  }}
                >
                  구매하기
                </a>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
      <div className="book-divider" />
    </article>
  )
}
