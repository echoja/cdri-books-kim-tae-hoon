import { type ComponentProps } from "react";
import emptyBookIcon from "@/assets/icons/icon_book.png";
import { cn } from "@/lib/class-name";

interface EmptyStateProps extends Omit<ComponentProps<"section">, "children"> {
  message?: string;
}

export function EmptyState({
  message = "검색된 결과가 없습니다",
  className,
  style,
  ...props
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "flex min-h-[calc(100vh-500px)] flex-col items-center justify-center",
        "gap-6 text-center",
        className,
      )}
      aria-live="polite"
      style={style}
      {...props}
    >
      <img src={emptyBookIcon} width={80} height={80} alt="도서 아이콘" />
      <p className="text-caption text-text-secondary m-0">{message}</p>
    </section>
  );
}
