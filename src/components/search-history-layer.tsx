import { type ComponentProps } from "react";
import { X } from "lucide-react";
import type { SearchHistoryRecord } from "@/lib/types";
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
  return (
    <section
      className={cn(
        "rounded-b-pill bg-palette-light-gray",
        "w-full overflow-y-auto px-5 py-4",
        className,
      )}
      aria-label="검색 기록"
      {...props}
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {records.map((record) => (
          <li key={record.key} className="flex min-h-7 items-center justify-between">
            <button
              type="button"
              className={cn(
                "text-text-subtitle text-caption",
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
