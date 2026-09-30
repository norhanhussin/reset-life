import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

function BookCover({ book, className = '' }) {
  const { t } = useI18n()
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#e7ece5] ${className}`}>
      {book.cover_url && !hasError ? (
        <img
          alt={t('reading.coverAlt', { title: book.title })}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
          src={book.cover_url}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-2 text-center text-[#718278]">
          <BookOpen aria-hidden="true" size={23} strokeWidth={1.5} />
          <span className="text-[10px] leading-3">{t('reading.coverUnavailable')}</span>
        </div>
      )}
    </div>
  )
}

export default BookCover