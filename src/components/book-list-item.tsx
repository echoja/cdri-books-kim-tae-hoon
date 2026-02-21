import { type ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import lineHeart from "@/assets/icons/line.svg";
import fillHeart from "@/assets/icons/fill.svg";
import emptyBookIcon from "@/assets/icons/icon_book.png";
import { formatPrice, getCollapsedDisplayPrice, hasSalePrice } from "@/domain/book-utils";
import type { Book } from "@/domain/types";
import { motionDuration, runAnimate } from "@/lib/animation";
import { Button, LinkButton } from "@/components/ui/button";
import { cn, cva } from "@/lib/class-name";

const favoriteBadgeVariants = cva(
  "absolute inline-flex items-center justify-center rounded-full border-none bg-transparent p-0",
  {
    variants: {
      size: {
        collapsed: "right-0 top-0 h-4 w-4",
        expanded: "right-2 top-2 h-6 w-6",
      },
    },
    defaultVariants: {
      size: "collapsed",
    },
  },
);

interface BookListItemProps extends Omit<ComponentProps<"article">, "children"> {
  book: Book;
  isFavorite: boolean;
  favoriteDisabled?: boolean;
  onToggleFavorite: (book: Book, willFavorite: boolean) => void;
}

export function BookListItem({
  book,
  isFavorite,
  favoriteDisabled = false,
  onToggleFavorite,
  className,
  ...props
}: BookListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [renderExpanded, setRenderExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const authors = useMemo(() => {
    if (!book.authors || book.authors.length === 0) {
      return "-";
    }

    return book.authors.join(", ");
  }, [book.authors]);

  const thumbnailSrc = book.thumbnail || emptyBookIcon;

  useEffect(() => {
    if (expanded) {
      setRenderExpanded(true);
    }
  }, [expanded]);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    if (expanded) {
      panel.style.display = "block";
      panel.style.overflow = "hidden";
      panel.style.height = "0px";

      const targetHeight = Math.min(panel.scrollHeight, window.innerWidth <= 767 ? 640 : 520);

      runAnimate(panel, {
        opacity: [0, 1],
        height: [0, targetHeight],
        duration: motionDuration(220),
        ease: "outQuad",
        onComplete: () => {
          panel.style.height = "auto";
          panel.style.overflow = "visible";
        },
      });
      return;
    }

    if (!renderExpanded) {
      return;
    }

    panel.style.overflow = "hidden";

    runAnimate(panel, {
      opacity: [1, 0],
      height: [panel.scrollHeight, 0],
      duration: motionDuration(180),
      ease: "outQuad",
      onComplete: () => {
        setRenderExpanded(false);
      },
    });
  }, [expanded, renderExpanded]);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <article className={cn("w-full", className)} {...props}>
      <div
        className={cn(
          "flex min-h-25 items-center px-4 py-4 pl-12",
          "max-md:flex-wrap max-md:gap-y-3 max-md:p-4",
        )}
      >
        <div className="relative mr-12 w-12 min-w-12 max-md:mr-5">
          <img
            className={cn(
              "h-book-thumb-small-height w-book-thumb-small-width",
              "bg-surface-secondary-soft object-cover",
            )}
            src={thumbnailSrc}
            alt={`${book.title} 표지`}
          />
          <button
            type="button"
            className={favoriteBadgeVariants({ size: "collapsed" })}
            onClick={() => onToggleFavorite(book, !isFavorite)}
            disabled={favoriteDisabled}
            aria-label={isFavorite ? "찜 해제" : "찜 추가"}
          >
            <img src={isFavorite ? fillHeart : lineHeart} width={16} height={16} alt="" />
          </button>
        </div>

        <div
          className={cn(
            "mr-layout-gap-5 flex w-102 items-center gap-4",
            "max-md:mr-0 max-md:w-[calc(100%-68px)]",
            "max-md:flex-col max-md:items-start max-md:gap-1.5",
          )}
        >
          <p className="text-title text-text-primary m-0 line-clamp-1">{book.title}</p>
          <p className="text-body-small text-text-secondary m-0 line-clamp-1">{authors}</p>
        </div>

        <div
          className={cn(
            "ml-auto flex shrink-0 items-center gap-14",
            "max-md:ml-0 max-md:w-full",
            "max-md:justify-between max-md:gap-4",
          )}
        >
          <p className="text-title text-text-primary m-0 text-right">
            {formatPrice(getCollapsedDisplayPrice(book))}
          </p>
          <div className="flex items-center gap-2 max-md:gap-1.5">
            <LinkButton
              variant="primary"
              href={book.url || "#"}
              target="_blank"
              rel="noreferrer"
              disabled={!book.url}
            >
              구매하기
            </LinkButton>
            <Button variant="secondary" className="min-w-28.75" onClick={toggleExpanded}>
              상세보기
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>
      </div>

      {renderExpanded ? (
        <div ref={panelRef} className="min-h-86" style={{ display: expanded ? "block" : "none" }}>
          <div
            className={cn(
              "flex max-h-130 min-h-86 items-start overflow-hidden px-4 py-6 pl-13.5",
              "max-md:max-h-160 max-md:flex-col max-md:gap-4",
              "max-md:overflow-y-auto max-md:px-4 max-md:py-5",
            )}
          >
            <div
              className={cn(
                "min-w-book-thumb-large-width w-book-thumb-large-width relative mr-8",
                "max-md:mr-0",
              )}
            >
              <img
                className={cn(
                  "h-book-thumb-large-height w-book-thumb-large-width",
                  "bg-surface-secondary-soft object-cover",
                )}
                src={thumbnailSrc}
                alt={`${book.title} 표지 확대`}
              />
              <button
                type="button"
                className={favoriteBadgeVariants({ size: "expanded" })}
                onClick={() => onToggleFavorite(book, !isFavorite)}
                disabled={favoriteDisabled}
                aria-label={isFavorite ? "찜 해제" : "찜 추가"}
              >
                <img src={isFavorite ? fillHeart : lineHeart} width={24} height={24} alt="" />
              </button>
            </div>

            <section
              className={cn(
                "mr-40.75 flex w-81 flex-col gap-4",
                "max-xl:mr-12",
                "max-md:mr-0 max-md:w-full",
              )}
            >
              <div className="flex items-center gap-4">
                <p className="text-title text-text-primary m-0 line-clamp-2">{book.title}</p>
                <p className="text-body-small text-text-secondary m-0 line-clamp-1">{authors}</p>
              </div>

              <section className="flex flex-col gap-3">
                <h3 className="text-body-small text-text-secondary m-0 leading-4.5 font-bold">
                  책 소개
                </h3>
                <p
                  className={cn(
                    "text-small text-text-primary m-0 line-clamp-8",
                    "max-md:line-clamp-6",
                  )}
                >
                  {book.contents || "책 소개 정보가 없습니다."}
                </p>
              </section>
            </section>

            <aside
              className={cn(
                "ml-auto flex h-full min-w-45 flex-col items-end justify-between gap-4",
                "max-md:w-full max-md:min-w-0 max-md:items-stretch",
              )}
            >
              <Button variant="secondary" className="min-w-28.75" onClick={toggleExpanded}>
                상세보기
                <ChevronUp size={16} />
              </Button>

              <div className="flex w-45 flex-col gap-2 max-md:w-full">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-small text-text-subtitle">원가</span>
                  <strong className="text-title text-text-primary">
                    {formatPrice(book.price)}
                  </strong>
                </div>
                {hasSalePrice(book) ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-small text-text-subtitle">할인가</span>
                    <strong className="text-title text-text-primary">
                      {formatPrice(book.salePrice ?? 0)}
                    </strong>
                  </div>
                ) : null}
                <LinkButton
                  variant="primary"
                  className="w-full justify-center"
                  href={book.url || "#"}
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
      <div className="bg-divider h-px w-full" />
    </article>
  );
}
