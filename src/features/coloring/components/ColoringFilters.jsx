import { Heart } from 'lucide-react'
import { COLORING_CATEGORIES } from '../designs.js'
import { useI18n } from '../../../i18n/useI18n.js'

function ColoringFilters({ value, onChange }) {
  const { t } = useI18n()
  const filters = [
    ['all', 'coloring.all'],
    ...COLORING_CATEGORIES.map((category) => [category, `coloring.categories.${category}`]),
    ['favorites', 'coloring.favorites'],
  ]

  return (
    <div aria-label={t('coloring.filters')} className="flex max-w-full gap-1 overflow-x-auto rounded-md bg-[#edf0eb] p-1" role="tablist">
      {filters.map(([id, key]) => (
        <button
          aria-selected={value === id}
          className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] sm:text-sm ${value === id ? 'bg-white text-[#285344] shadow-sm' : 'text-[#718278] hover:text-[#354b41]'}`}
          key={id}
          onClick={() => onChange(id)}
          role="tab"
          type="button"
        >
          {id === 'favorites' && <Heart aria-hidden="true" size={14} />}
          {t(key)}
        </button>
      ))}
    </div>
  )
}

export default ColoringFilters