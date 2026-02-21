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
      targets: listRef.current.querySelectorAll('.history-row'),
      opacity: [0, 1],
      translateY: [6, 0],
      duration: motionDuration(180),
      delay: stagger(30),
      ease: 'outQuad',
    })
  }, [records])

  return (
    <section className="search-history-layer" aria-label="검색 기록">
      <ul ref={listRef}>
        {records.map((record) => (
          <li key={record.key} className="history-row">
            <button
              type="button"
              className="history-keyword"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(record)}
            >
              {record.keyword}
            </button>
            <button
              type="button"
              className="history-remove"
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
