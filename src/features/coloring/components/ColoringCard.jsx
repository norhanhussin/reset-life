import { Heart, Palette } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import ColoringDesignSvg from './ColoringDesignSvg.jsx'

function ColoringCard({ design, isFavorite, onFavorite, onStart }) {
  const { t } = useI18n()

  return (
    <article className="group overflow-hidden rounded-lg border border-[#dfe5dc] bg-white transition-shadow hover:shadow-sm">
      <div className="relative bg-[#f2f4ef] p-3">
        <div className="overflow-hidden rounded-md border border-[#e0e5dd] bg-[#fffefa]">
          <ColoringDesignSvg
            className="aspect-[5/6] h-auto w-full"
            design={design}
          />
        </div>
        <button
          aria-label={t(isFavorite ? 'coloring.unfavorite' : 'coloring.favorite', { title: t(design.titleKey) })}
          aria-pressed={isFavorite}
          className={`absolute end-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-sm transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] ${isFavorite ? 'text-[#b96772]' : 'text-[#718278]'}`}
          onClick={() => onFavorite(design)}
          title={t(isFavorite ? 'coloring.unfavorite' : 'coloring.favorite', { title: t(design.titleKey) })}
          type="button"
        >
          <Heart aria-hidden="true" className={isFavorite ? 'fill-current' : ''} size={17} strokeWidth={1.8} />
        </button>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="break-words text-base font-semibold text-[#20372f]">{t(design.titleKey)}</h3>
            <p className="mt-1 text-xs font-medium text-[#718278]">{t(`coloring.categories.${design.category}`)}</p>
          </div>
          <Palette aria-hidden="true" className="mt-0.5 shrink-0 text-[#88a08a]" size={17} strokeWidth={1.6} />
        </div>
        <button
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#edf3eb] px-4 py-2.5 text-sm font-semibold text-[#285344] transition hover:bg-[#e1ebe0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
          onClick={() => onStart(design)}
          type="button"
        >
          {t('coloring.startColoring')}
        </button>
      </div>
    </article>
  )
}

export default ColoringCard