import { type ComponentProps, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import lineHeart from "@/assets/icons/line.svg";
import fillHeart from "@/assets/icons/fill.svg";
import emptyBookIcon from "@/assets/icons/icon_book.png";
import { formatPrice, getCollapsedDisplayPrice, hasSalePrice } from "@/domain/book-utils";
import type { Book } from "@/domain/types";
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

  const authors = useMemo(() => {
    if (!book.authors || book.authors.length === 0) {
      return "-";
    }

    return book.authors.join(", ");
  }, [book.authors]);

  const thumbnailSrc = book.thumbnail || emptyBookIcon;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <article className={cn("w-full", className)} {...props}>
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity,transform] duration-220 ease-out",
          "flex min-h-25 items-center px-4 py-4 pl-12",
          "max-md:flex-wrap max-md:gap-y-3 max-md:p-4",
          expanded
            ? "pointer-events-none max-h-0 -translate-y-1 opacity-0"
            : "max-h-40 translate-y-0 opacity-100 max-md:max-h-80",
        )}
      >
        <div className="relative mr-12 w-12 min-w-12 max-md:mr-5">
          <img
            className={cn(
              "h-book-thumb-small-height w-book-thumb-small-width",
              "bg-palette-light-gray-soft object-cover",
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
          <p className="text-title-3 text-text-primary m-0 line-clamp-1">{book.title}</p>
          <p className="text-body-2 text-text-secondary m-0 line-clamp-1">{authors}</p>
        </div>

        <div
          className={cn(
            "ml-auto flex shrink-0 items-center gap-14",
            "max-md:ml-0 max-md:w-full",
            "max-md:justify-between max-md:gap-4",
          )}
        >
          <p className="text-title-3 text-text-primary m-0 text-right">
            {formatPrice(getCollapsedDisplayPrice(book))}
          </p>
          <div className="flex items-center gap-2 max-md:gap-1.5">
            <LinkButton
              variant="primary"
              className="w-28 px-0"
              href={book.url || "#"}
              target="_blank"
              rel="noreferrer"
              disabled={!book.url}
            >
              구매하기
            </LinkButton>
            <Button variant="secondary" className="w-28 px-0" onClick={toggleExpanded}>
              상세보기
              <ChevronDown size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-280 ease-out",
          expanded
            ? "pointer-events-auto grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "flex max-h-130 min-h-86 items-start overflow-hidden px-4 py-6 pl-13.5",
              "max-md:max-h-160 max-md:flex-col max-md:gap-4",
              "max-md:overflow-y-auto max-md:px-4 max-md:py-5",
            )}
          >
            <div
              className={cn(
                "transition-[opacity,transform] duration-300 ease-out",
                expanded
                  ? "translate-x-0 scale-100 opacity-100"
                  : "-translate-x-2 scale-95 opacity-0",
                "min-w-book-thumb-large-width w-book-thumb-large-width relative mr-8",
                "max-md:mr-0",
              )}
            >
              <img
                className={cn(
                  "h-book-thumb-large-height w-book-thumb-large-width",
                  "bg-palette-light-gray-soft object-cover",
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
                "transition-[opacity,transform] delay-75 duration-260 ease-out",
                expanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                "mr-40.75 flex w-81 flex-col gap-4",
                "max-xl:mr-12",
                "max-md:mr-0 max-md:w-full",
              )}
            >
              <div className="flex items-center gap-4">
                <p className="text-title-3 text-text-primary m-0 line-clamp-2">{book.title}</p>
                <p className="text-body-2 text-text-secondary m-0 line-clamp-1">{authors}</p>
              </div>

              <section className="flex flex-col gap-3">
                <h3 className="text-body-2 text-text-secondary m-0 leading-4.5 font-bold">
                  책 소개
                </h3>
                <p
                  className={cn(
                    "text-small text-text-primary m-0 line-clamp-8 leading-4",
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
              <Button variant="secondary" className="w-28 px-0" onClick={toggleExpanded}>
                상세보기
                <ChevronUp size={20} />
              </Button>

              <div
                className={cn(
                  "transition-[opacity,transform] delay-100 duration-240 ease-out",
                  expanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                  "flex w-45 flex-col gap-2 max-md:w-full",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-small text-text-subtitle">원가</span>
                  <strong className="text-title-3 text-text-primary">
                    {formatPrice(book.price)}
                  </strong>
                </div>
                {hasSalePrice(book) ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-small text-text-subtitle">할인가</span>
                    <strong className="text-title-3 text-text-primary">
                      {formatPrice(book.salePrice ?? 0)}
                    </strong>
                  </div>
                ) : null}
                <LinkButton
                  variant="primary"
                  className="w-28 justify-center px-0"
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
      </div>
      <div className="bg-palette-divider h-px w-full" />
    </article>
  );
}
