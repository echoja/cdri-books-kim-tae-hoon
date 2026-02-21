import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import lineHeart from '../../../assets/icons/line.svg'
import fillHeart from '../../../assets/icons/fill.svg'
import emptyBookIcon from '../../../assets/icons/icon_book.png'
import { formatPrice, getCollapsedDisplayPrice, hasSalePrice } from '@/domain/book-utils'
import type { Book } from '@/domain/types'
import { motionDuration, safeAnimate } from '@/lib/animation'
import { Button, LinkButton } from '@/components/ui/button'
import { cva } from '@/lib/class-name'

const favoriteBadgeVariants = cva(
  'absolute inline-flex items-center justify-center rounded-full border-none bg-transparent p-0',
  {
    variants: {
      size: {
        collapsed: 'right-0 top-0 h-4 w-4',
        expanded: 'right-2 top-2 h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'collapsed',
    },
  },
)

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
    <article className="w-full">
      <div className="flex min-h-[100px] items-center px-4 py-4 pl-12 max-[767px]:flex-wrap max-[767px]:gap-y-3 max-[767px]:p-4">
        <div className="relative mr-12 w-12 min-w-12 max-[767px]:mr-5">
          <img className="h-[68px] w-12 object-cover bg-[#eceff2]" src={thumbnailSrc} alt={`${book.title} 표지`} />
          <button
            type="button"
            className={favoriteBadgeVariants({ size: 'collapsed' })}
            onClick={() => onToggleFavorite(book, !isFavorite)}
            disabled={favoriteDisabled}
            aria-label={isFavorite ? '찜 해제' : '찜 추가'}
          >
            <img src={isFavorite ? fillHeart : lineHeart} width={16} height={16} alt="" />
          </button>
        </div>

        <div className="mr-[22px] flex w-[408px] items-center gap-4 max-[767px]:mr-0 max-[767px]:w-[calc(100%-68px)] max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-[6px]">
          <p className="m-0 line-clamp-1 text-[18px] leading-[18px] font-bold text-[#353c49]">{book.title}</p>
          <p className="m-0 line-clamp-1 text-sm leading-[14px] font-medium text-[#6d7582]">{authors}</p>
        </div>

        <div className="ml-auto flex items-center gap-14 max-[767px]:ml-0 max-[767px]:w-full max-[767px]:justify-between max-[767px]:gap-4">
          <p className="m-0 text-right text-[18px] leading-[18px] font-bold text-[#353c49]">
            {formatPrice(getCollapsedDisplayPrice(book))}
          </p>
          <div className="flex items-center gap-2 max-[767px]:gap-[6px]">
            <LinkButton
              variant="primary"
              href={book.url || '#'}
              target="_blank"
              rel="noreferrer"
              disabled={!book.url}
            >
              구매하기
            </LinkButton>
            <Button variant="secondary" className="min-w-[115px]" onClick={toggleExpanded}>
              상세보기
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>
      </div>

      {renderExpanded ? (
        <div ref={panelRef} className="min-h-[344px]" style={{ display: expanded ? 'block' : 'none' }}>
          <div className="flex min-h-[344px] max-h-[520px] items-start overflow-hidden px-4 py-6 pl-[54px] max-[767px]:max-h-[640px] max-[767px]:flex-col max-[767px]:gap-4 max-[767px]:overflow-y-auto max-[767px]:px-4 max-[767px]:py-5">
            <div className="relative mr-8 w-[210px] min-w-[210px] max-[767px]:mr-0">
              <img
                className="h-[280px] w-[210px] object-cover bg-[#eceff2]"
                src={thumbnailSrc}
                alt={`${book.title} 표지 확대`}
              />
              <button
                type="button"
                className={favoriteBadgeVariants({ size: 'expanded' })}
                onClick={() => onToggleFavorite(book, !isFavorite)}
                disabled={favoriteDisabled}
                aria-label={isFavorite ? '찜 해제' : '찜 추가'}
              >
                <img src={isFavorite ? fillHeart : lineHeart} width={24} height={24} alt="" />
              </button>
            </div>

            <section className="mr-[163px] flex w-[324px] flex-col gap-4 max-[1279px]:mr-12 max-[767px]:mr-0 max-[767px]:w-full">
              <div className="flex items-center gap-4">
                <p className="m-0 line-clamp-2 text-2xl leading-[30px] font-bold text-[#353c49]">{book.title}</p>
                <p className="m-0 line-clamp-1 text-sm leading-[14px] font-medium text-[#6d7582]">{authors}</p>
              </div>

              <section className="flex flex-col gap-3">
                <h3 className="m-0 text-base leading-[18px] text-[#6d7582]">책 소개</h3>
                <p className="m-0 line-clamp-8 text-[10px] leading-4 text-[#353c49] max-[767px]:line-clamp-6">
                  {book.contents || '책 소개 정보가 없습니다.'}
                </p>
              </section>
            </section>

            <aside className="ml-auto flex h-full min-w-[180px] flex-col items-end justify-between gap-4 max-[767px]:w-full max-[767px]:min-w-0 max-[767px]:items-stretch">
              <Button variant="secondary" className="min-w-[115px]" onClick={toggleExpanded}>
                상세보기
                <ChevronUp size={16} />
              </Button>

              <div className="flex w-[180px] flex-col gap-2 max-[767px]:w-full">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#8d94a0]">원가</span>
                  <strong className="text-[18px] leading-[18px] text-[#353c49]">
                    {formatPrice(book.price)}
                  </strong>
                </div>
                {hasSalePrice(book) ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#8d94a0]">할인가</span>
                    <strong className="text-[18px] leading-[18px] text-[#353c49]">
                      {formatPrice(book.salePrice ?? 0)}
                    </strong>
                  </div>
                ) : null}
                <LinkButton
                  variant="primary"
                  className="w-full justify-center"
                  href={book.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  disabled={!book.url}
                >
                  구매하기
                </LinkButton>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
      <div className="h-px w-full bg-[#d2d6da]" />
    </article>
  )
}
