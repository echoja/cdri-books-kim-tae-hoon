import { useEffect, useRef } from "react";
import emptyBookIcon from "@/assets/icons/icon_book.png";
import { motionDuration, runAnimate } from "@/lib/animation";
import { cn } from "@/lib/class-name";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "검색된 결과가 없습니다" }: EmptyStateProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    runAnimate(ref.current, {
      opacity: [0, 1],
      scale: [0.96, 1],
      duration: motionDuration(350),
      ease: "outQuad",
    });
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "flex min-h-[calc(100vh-320px)] flex-col items-center justify-center",
        "gap-6 text-center",
      )}
      aria-live="polite"
      style={{ opacity: 0 }}
    >
      <img src={emptyBookIcon} width={80} height={80} alt="도서 아이콘" />
      <p className="text-heading text-text-primary m-0">{message}</p>
    </section>
  );
}
