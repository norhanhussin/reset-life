import { useI18n } from '../../../i18n/useI18n.js'

const FILTERS = [
  ['all', 'reading.all'],
  ['reading', 'reading.statusReading'],
  ['want_to_read', 'reading.statusWantToRead'],
  ['completed', 'reading.statusCompleted'],
]

function ReadingFilters({ value, onChange }) {
  const { t } = useI18n()

  return (
    <div aria-label={t('reading.libraryFilters')} className="flex max-w-full gap-1 overflow-x-auto rounded-md bg-[#edf0eb] p-1" role="tablist">
      {FILTERS.map(([filter, labelKey]) => (
        <button
          aria-selected={value === filter}
          className={`min-h-9 shrink-0 rounded px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] sm:text-sm ${value === filter ? 'bg-white text-[#285344] shadow-sm' : 'text-[#718278] hover:text-[#354b41]'}`}
          key={filter}
          onClick={() => onChange(filter)}
          role="tab"
          type="button"
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  )
}

export default ReadingFilters