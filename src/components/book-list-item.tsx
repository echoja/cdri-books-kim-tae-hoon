import { type ComponentProps, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
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
      <div className={cn("px-4 py-4 pl-12 transition-[padding] duration-300", "max-md:p-4")}>
        <div
          className={cn(
            "flex transition-[gap,min-height] duration-300 ease-out",
            expanded ? "min-h-40 items-start gap-8" : "min-h-25 items-center gap-12",
            "max-md:flex-wrap max-md:gap-x-5 max-md:gap-y-3",
          )}
        >
          <div
            className={cn(
              "relative shrink-0 transition-[width] duration-300",
              expanded
                ? "min-w-book-thumb-large-width w-book-thumb-large-width"
                : "min-w-book-thumb-small-width w-book-thumb-small-width",
            )}
          >
            <img
              className={cn(
                "bg-palette-light-gray-soft object-cover transition-[width,height] duration-300",
                expanded
                  ? "h-book-thumb-large-height w-book-thumb-large-width"
                  : "h-book-thumb-small-height w-book-thumb-small-width",
              )}
              src={thumbnailSrc}
              alt={`${book.title} 표지`}
            />
            <button
              type="button"
              className={favoriteBadgeVariants({ size: expanded ? "expanded" : "collapsed" })}
              onClick={() => onToggleFavorite(book, !isFavorite)}
              disabled={favoriteDisabled}
              aria-label={isFavorite ? "찜 해제" : "찜 추가"}
            >
              <img
                src={isFavorite ? fillHeart : lineHeart}
                className={cn(
                  "transition-[width,height] duration-300",
                  expanded ? "h-6 w-6" : "h-4 w-4",
                )}
                alt=""
              />
            </button>
          </div>

          <div
            className={cn("flex min-w-0 flex-1 items-start gap-6", "max-md:w-full max-md:flex-col")}
          >
            <div
              className={cn(
                "mr-layout-gap-5 flex min-w-0 flex-1 items-center gap-4",
                "max-md:mr-0 max-md:w-full",
                "max-md:flex-col max-md:items-start max-md:gap-1.5",
              )}
            >
              <p
                className={cn(
                  "text-title-3 text-text-primary m-0 transition-all duration-200",
                  expanded ? "line-clamp-2" : "line-clamp-1",
                )}
              >
                {book.title}
              </p>
              <p className="text-body-2 text-text-secondary m-0 line-clamp-1">{authors}</p>
            </div>

            <aside
              className={cn(
                "ml-auto flex shrink-0 items-center gap-4",
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
                <Button
                  variant="secondary"
                  className="w-28 px-0"
                  onClick={toggleExpanded}
                  aria-expanded={expanded}
                >
                  상세보기
                  <ChevronDown
                    size={20}
                    className={cn("transition-transform duration-240", expanded && "rotate-180")}
                  />
                </Button>
              </div>
            </aside>
          </div>
        </div>
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out",
            expanded
              ? "mt-6 grid-rows-[1fr] opacity-100"
              : "pointer-events-none mt-0 grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className={cn("flex items-start gap-8", "max-md:flex-col max-md:gap-4")}>
              <div
                className={cn(
                  "shrink-0 transition-[width] duration-300",
                  expanded ? "w-book-thumb-large-width" : "w-book-thumb-small-width",
                  "max-md:hidden",
                )}
              />
              <section
                className={cn(
                  "flex min-w-0 flex-1 flex-col gap-3 transition-[opacity,transform] duration-260 ease-out",
                  expanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
              >
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

              <aside
                className={cn(
                  "w-45 shrink-0 transition-[opacity,transform] delay-75 duration-260 ease-out",
                  expanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                  "max-md:w-full",
                )}
              >
                <div className="flex flex-col gap-2">
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
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-palette-divider h-px w-full" />
    </article>
  );
}
