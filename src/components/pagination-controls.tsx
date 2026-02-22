import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/class-name";

interface PaginationControlsProps extends Omit<ComponentProps<"nav">, "children"> {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationControlsProps) {
  const handlePageChange = (nextPage: number) => {
    onPageChange(nextPage);
    window.scrollTo({ top: 0 });
  };

  return (
    <nav
      className={cn("mt-5 flex items-center justify-center gap-3", className)}
      aria-label="페이지 이동"
      {...props}
    >
      <Button
        variant="secondary"
        className="gap-0 px-4.5 py-2.5"
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
      >
        이전
      </Button>
      <span>
        {page} / {totalPages}
      </span>
      <Button
        variant="secondary"
        className="gap-0 px-4.5 py-2.5"
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        다음
      </Button>
    </nav>
  );
}
