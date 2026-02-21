import emptyBookIcon from '../../assets/icons/icon_book.png'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = '검색된 결과가 없습니다' }: EmptyStateProps) {
  return (
    <section
      className="flex min-h-[calc(100vh-320px)] flex-col items-center justify-center gap-6 text-center"
      aria-live="polite"
    >
      <img src={emptyBookIcon} width={80} height={80} alt="도서 아이콘" />
      <p className="text-heading text-text-primary m-0">{message}</p>
    </section>
  )
}
