import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { stagger } from 'animejs'
import { motionDuration, safeAnimate } from '@/lib/animation'
import type { SearchHistoryRecord } from '@/domain/types'

interface SearchHistoryLayerProps {
  records: SearchHistoryRecord[]
  onSelect: (record: SearchHistoryRecord) => void
  onRemove: (key: string) => void
}

export function SearchHistoryLayer({
  records,
  onSelect,
  onRemove,
}: SearchHistoryLayerProps) {
  const listRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    if (!listRef.current || records.length === 0) {
      return
    }

    safeAnimate({
      targets: listRef.current.querySelectorAll('[data-history-row]'),
      opacity: [0, 1],
      translateY: [6, 0],
      duration: motionDuration(180),
      delay: stagger(30),
      ease: 'outQuad',
    })
  }, [records])

  return (
    <section
      className="absolute left-0 top-[53px] z-20 max-h-[153px] min-h-[153px] w-[480px] overflow-y-auto rounded-pill bg-surface-secondary px-5 py-4 max-[767px]:w-full"
      aria-label="검색 기록"
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
              className="cursor-pointer border-none bg-transparent text-sm text-text-primary"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(record)}
            >
              {record.keyword}
            </button>
            <button
              type="button"
              className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-text-primary hover:bg-surface-hover-soft"
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
  )
}
