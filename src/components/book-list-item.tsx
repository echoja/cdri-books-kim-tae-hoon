import { type ComponentProps, useState } from "react";
import { ChevronDown } from "lucide-react";
import emptyBookIcon from "@/assets/icons/icon_book.png";
import { formatPrice, hasSalePrice } from "@/domain/book-utils";
import type { Book } from "@/domain/types";
import { Button, LinkButton } from "@/components/ui/button";
import { FavoriteBadge } from "@/components/favorite-badge";
import { cn } from "@/lib/class-name";

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

  const authors = !book.authors || book.authors.length === 0 ? "-" : book.authors.join(", ");

  const thumbnailSrc = book.thumbnail || emptyBookIcon;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <article className={cn("w-full", className)} {...props}>
      <div className="pl-12">
        <div
          className={cn(
            "flex",
            expanded ? "min-h-40 gap-8 pt-6.5 pb-12" : "min-h-25 items-center gap-12",
          )}
        >
          <div
            className="relative shrink-0"
            style={{ width: expanded ? 210 : 48, minWidth: expanded ? 210 : 48 }}
          >
            <img
              width={expanded ? 210 : 48}
              height={expanded ? 280 : 68}
              className={cn("bg-palette-light-gray-soft object-cover")}
              src={thumbnailSrc}
              alt={`${book.title} 표지`}
            />
            <FavoriteBadge
              isFavorite={isFavorite}
              size={expanded ? "expanded" : "collapsed"}
              onClick={() => onToggleFavorite(book, !isFavorite)}
              disabled={favoriteDisabled}
            />
          </div>

          <div className="flex min-w-0 flex-1 gap-12">
            <div className="mt-4 flex min-w-0 flex-col gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <p
                  className={cn(
                    "text-title-3 text-text-primary m-0",
                    expanded ? "line-clamp-2" : "line-clamp-1",
                  )}
                >
                  {book.title}
                </p>
                <p className="text-body-2 text-text-subtitle m-0 line-clamp-1">{authors}</p>
              </div>

              {expanded ? (
                <section className="flex min-w-0 flex-col gap-4">
                  <h3 className="text-body-2 text-text-secondary m-0 leading-4.5 font-bold">
                    책 소개
                  </h3>
                  <p className="text-small text-text-primary m-0 line-clamp-8 leading-4">
                    {book.contents || "책 소개 정보가 없습니다."}
                  </p>
                </section>
              ) : null}
            </div>

            <aside
              className={cn(
                "ml-auto gap-4",
                expanded
                  ? "flex w-60 shrink-0 flex-col justify-between"
                  : "flex shrink-0 items-center",
              )}
            >
              {!expanded ? (
                <p className="text-title-3 text-text-primary m-0 mr-8 text-right whitespace-nowrap">
                  {formatPrice(book.salePrice ?? book.price)}
                </p>
              ) : null}
              <div className={cn("flex items-center justify-end gap-2", expanded && "w-full")}>
                {!expanded ? (
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
                ) : null}
                <Button
                  variant="secondary"
                  className="w-28 px-0"
                  onClick={toggleExpanded}
                  aria-expanded={expanded}
                >
                  상세보기
                  <span
                    className={cn("inline-flex transition-transform", expanded ? "rotate-180" : "")}
                  >
                    <ChevronDown size={20} />
                  </span>
                </Button>
              </div>

              {expanded ? (
                <div className="flex flex-col gap-7.5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-small text-text-subtitle">원가</span>
                      <strong
                        className={cn(
                          "text-title-3 text-text-primary",
                          hasSalePrice(book) ? "font-light line-through" : "",
                        )}
                      >
                        {formatPrice(book.price)}
                      </strong>
                    </div>
                    {hasSalePrice(book) ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-small text-text-subtitle">할인가</span>
                        <strong className="text-title-3 text-text-primary">
                          {formatPrice(book.salePrice ?? 0)}
                        </strong>
                      </div>
                    ) : null}
                  </div>
                  <LinkButton
                    variant="primary"
                    className="justify-center px-0"
                    href={book.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    disabled={!book.url}
                  >
                    구매하기
                  </LinkButton>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
      <div className="bg-palette-divider h-px w-full" />
    </article>
  );
}
