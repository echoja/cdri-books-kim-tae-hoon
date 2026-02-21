import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import { type ComponentProps } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { SEARCH_TARGET_OPTIONS, toSearchTarget } from "@/domain/search-utils";
import type { SearchTarget } from "@/domain/types";
import { cn } from "@/lib/class-name";
import { Button } from "@/components/ui/button";

interface DetailSearchPanelProps extends Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "onSearch"
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: SearchTarget;
  keyword: string;
  onTargetChange: (target: SearchTarget) => void;
  onKeywordChange: (keyword: string) => void;
  onSearch: (keywordOverride?: string) => void;
}

export function DetailSearchPanel({
  open,
  onOpenChange,
  target,
  keyword,
  onTargetChange,
  onKeywordChange,
  onSearch,
  className,
  ...props
}: DetailSearchPanelProps) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <Button variant="outline" className="text-body-2 h-9 px-2.5">
          상세검색
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="center"
          className={cn(
            "bg-palette-white relative z-30 min-h-40 w-90 px-6 py-9",
            "shadow-[0_4px_14px_6px_rgba(151,151,151,0.15)]",
            "data-[state=closed]:hidden",
          )}
          data-testid="detail-search-popover"
          forceMount
        >
          <div className={className} {...props}>
            <button
              type="button"
              className={cn(
                "text-text-secondary absolute top-2 right-2",
                "cursor-pointer border-none bg-transparent",
              )}
              aria-label="상세검색 닫기"
              onClick={() => onOpenChange(false)}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-1">
              <Select.Root
                value={target}
                onValueChange={(value) => onTargetChange(toSearchTarget(value))}
              >
                <Select.Trigger
                  className={cn(
                    "border-palette-divider bg-palette-white text-body-2 text-text-primary inline-flex min-h-9 w-25",
                    "items-center justify-between border-b px-2.5",
                    "data-[state=open]:border-b-palette-primary",
                    "focus-visible:border-b-palette-primary",
                  )}
                  aria-label="검색 기준"
                  data-testid="detail-search-target"
                >
                  <Select.Value placeholder="제목" />
                  <Select.Icon>
                    <ChevronDown size={16} />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content
                    className={cn(
                      "border-palette-divider bg-palette-white z-40 min-w-25 shadow-[0_0_4px_0_#00000040]",
                      "overflow-hidden border",
                    )}
                    position="popper"
                    sideOffset={4}
                  >
                    <Select.Viewport>
                      {SEARCH_TARGET_OPTIONS.map((option) => (
                        <Select.Item
                          key={option.value}
                          value={option.value}
                          className={cn(
                            "text-body-2 text-text-primary flex min-h-8 w-full",
                            "cursor-pointer items-center justify-between px-2.5",
                            "data-highlighted:bg-palette-light-gray data-highlighted:outline-none",
                          )}
                        >
                          <Select.ItemText>{option.label}</Select.ItemText>
                          <Select.ItemIndicator>
                            <Check size={14} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

              <input
                className={cn(
                  "border-b-palette-divider placeholder:text-text-subtitle h-9 w-52 border-b",
                  "text-text-primary px-2.5 focus-visible:outline-0",
                  "focus-visible:border-b-palette-primary",
                )}
                data-testid="detail-search-keyword"
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="검색어 입력"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onSearch(event.currentTarget.value);
                  }
                }}
              />
            </div>

            <Button
              variant="primary"
              className="mt-4 min-h-9 w-full p-0"
              onClick={() => onSearch()}
            >
              검색하기
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
