import { type ComponentProps, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { stagger } from "animejs";
import { motionDuration, runAnimate } from "@/lib/animation";
import type { SearchHistoryRecord } from "@/domain/types";
import { cn } from "@/lib/class-name";

interface SearchHistoryLayerProps extends Omit<ComponentProps<"section">, "children" | "onSelect"> {
  records: SearchHistoryRecord[];
  onSelect: (record: SearchHistoryRecord) => void;
  onRemove: (key: string) => void;
}

export function SearchHistoryLayer({
  records,
  onSelect,
  onRemove,
  className,
  ...props
}: SearchHistoryLayerProps) {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!listRef.current || records.length === 0) {
      return;
    }

    runAnimate(listRef.current.querySelectorAll("[data-history-row]"), {
      opacity: [0, 1],
      translateY: [6, 0],
      duration: motionDuration(180),
      delay: stagger(30),
      ease: "outQuad",
    });
  }, [records]);

  return (
    <section
      className={cn(
        "rounded-pill bg-palette-light-gray absolute top-13.25 left-0 z-20",
        "max-h-38.25 min-h-38.25 w-120 overflow-y-auto px-5 py-4",
        "max-md:w-full",
        className,
      )}
      aria-label="검색 기록"
      {...props}
    >
      <ul ref={listRef} className="m-0 flex list-none flex-col gap-2 p-0">
        {records.map((record) => (
          <li
            key={record.key}
            data-history-row
            className="flex min-h-7 items-center justify-between opacity-0"
          >
            <button
              type="button"
              className={cn(
                "text-body-2 text-text-primary",
                "cursor-pointer border-none bg-transparent",
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(record)}
            >
              {record.keyword}
            </button>
            <button
              type="button"
              className={cn(
                "text-text-primary inline-flex h-6 w-6 items-center justify-center rounded-md",
                "hover:bg-palette-light-gray-hover-soft cursor-pointer border-none bg-transparent",
              )}
              onMouseDown={(event) => event.preventDefault()}
              aria-label={`${record.keyword} 기록 삭제`}
              onClick={() => onRemove(record.key)}
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
