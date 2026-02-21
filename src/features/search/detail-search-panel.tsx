import * as Popover from '@radix-ui/react-popover'
import * as Select from '@radix-ui/react-select'
import { useEffect, useRef } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { SEARCH_TARGET_OPTIONS } from '@/domain/search-utils'
import type { SearchTarget } from '@/domain/types'
import { motionDuration, safeAnimate } from '@/lib/animation'

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
        <button type="button" className="btn btn-outline">
          상세검색
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8} align="start" className="detail-search-popover" forceMount>
          <div ref={contentRef}>
            <button
              type="button"
              className="detail-close"
              aria-label="상세검색 닫기"
              onClick={() => onOpenChange(false)}
            >
              <X size={20} />
            </button>

            <div className="detail-row">
              <Select.Root value={target} onValueChange={(value) => onTargetChange(value as SearchTarget)}>
                <Select.Trigger className="detail-select" aria-label="검색 기준">
                  <Select.Value placeholder="제목" />
                  <Select.Icon>
                    <ChevronDown size={16} />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="detail-select-content" position="popper" sideOffset={4}>
                    <Select.Viewport>
                      {SEARCH_TARGET_OPTIONS.map((option) => (
                        <Select.Item key={option.value} value={option.value} className="detail-select-item">
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
                className="detail-input"
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

            <button type="button" className="btn btn-primary detail-submit" onClick={() => onSearch()}>
              검색하기
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
