import { BookCheck, BookOpen, Flame, LibraryBig } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

function ReadingStats({ stats }) {
  const { t } = useI18n()
  const cards = [
    { label: t('reading.booksCompleted'), value: stats.booksCompleted, icon: BookCheck, color: 'text-[#55775f]', tone: 'bg-[#eaf1e9]' },
    { label: t('reading.pagesRead'), value: stats.pagesRead.toLocaleString(), icon: BookOpen, color: 'text-[#8c704c]', tone: 'bg-[#f4efe5]' },
    { label: t('reading.readingStreak'), value: `${stats.readingStreak} ${t('reading.days')}`, icon: Flame, color: 'text-[#9b6a50]', tone: 'bg-[#f7eee8]' },
    { label: t('reading.currentlyReading'), value: stats.currentlyReading, icon: LibraryBig, color: 'text-[#59766d]', tone: 'bg-[#eaf1ef]' },
  ]

  return (
    <section aria-label={t('reading.statistics')} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color, tone }) => (
        <article className="rounded-lg border border-[#dfe5dc] bg-white p-4 sm:p-5" key={label}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium leading-5 text-[#718278] sm:text-sm">{label}</p>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${tone} ${color}`}>
              <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-[#20372f] sm:text-3xl">{value}</p>
        </article>
      ))}
    </section>
  )
}

export default ReadingStats