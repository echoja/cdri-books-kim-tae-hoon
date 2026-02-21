import * as Popover from '@radix-ui/react-popover'
import * as Select from '@radix-ui/react-select'
import { useEffect, useRef } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { SEARCH_TARGET_OPTIONS } from '@/domain/search-utils'
import type { SearchTarget } from '@/domain/types'
import { motionDuration, safeAnimate } from '@/lib/animation'
import { Button } from '@/components/ui/button'

interface DetailSearchPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: SearchTarget
  keyword: string
  onTargetChange: (target: SearchTarget) => void
  onKeywordChange: (keyword: string) => void
  onSearch: (keywordOverride?: string) => void
}

export function DetailSearchPanel({
  open,
  onOpenChange,
  target,
  keyword,
  onTargetChange,
  onKeywordChange,
  onSearch,
}: DetailSearchPanelProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open || !contentRef.current) {
      return
    }

    safeAnimate({
      targets: contentRef.current,
      opacity: [0, 1],
      translateY: [-8, 0],
      duration: motionDuration(220),
      ease: 'outQuad',
    })
  }, [open])

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <Button variant="outline" className="max-[767px]:self-end">
          상세검색
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="relative z-30 min-h-[160px] w-[360px] rounded-lg bg-palette-white px-6 py-9 shadow-[0_4px_14px_6px_rgba(151,151,151,0.15)] max-[767px]:w-[calc(100vw-32px)] max-[767px]:max-w-[360px]"
          data-testid="detail-search-popover"
          forceMount
        >
          <div ref={contentRef}>
            <button
              type="button"
              className="absolute right-2 top-2 cursor-pointer border-none bg-transparent text-text-secondary"
              aria-label="상세검색 닫기"
              onClick={() => onOpenChange(false)}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-1 max-[767px]:flex-wrap">
              <Select.Root value={target} onValueChange={(value) => onTargetChange(value as SearchTarget)}>
                <Select.Trigger
                  className="inline-flex min-h-9 w-[100px] items-center justify-between rounded-lg border border-divider bg-palette-white px-[10px] text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary max-[767px]:w-full"
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
                    className="z-40 h-[60px] min-w-[100px] overflow-hidden rounded-lg border border-divider bg-palette-white"
                    position="popper"
                    sideOffset={4}
                  >
                  <Select.Viewport>
                      {SEARCH_TARGET_OPTIONS.map((option) => (
                        <Select.Item
                          key={option.value}
                          value={option.value}
                          className="flex min-h-[30px] w-full cursor-pointer items-center justify-between px-[10px] text-sm text-text-primary data-[highlighted]:bg-surface-secondary data-[highlighted]:outline-none"
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
                className="min-h-9 w-[208px] rounded-lg border border-divider px-[10px] text-text-primary placeholder:text-text-subtitle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary max-[767px]:w-full"
                data-testid="detail-search-keyword"
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="검색어 입력"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onSearch(event.currentTarget.value)
                  }
                }}
              />
            </div>

            <Button variant="primary" className="mt-4 min-h-9 w-full p-0" onClick={() => onSearch()}>
              검색하기
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
