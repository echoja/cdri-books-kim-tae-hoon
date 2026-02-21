import emptyBookIcon from '../../assets/icons/icon_book.png'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = '검색된 결과가 없습니다' }: EmptyStateProps) {
  return (
    <section className="empty-state" aria-live="polite">
      <img src={emptyBookIcon} width={80} height={80} alt="도서 아이콘" />
      <p>{message}</p>
    </section>
  )
}
