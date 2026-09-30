import { CalendarDays, CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import { getColoringDesign } from '../designs.js'
import ColoringDesignSvg from './ColoringDesignSvg.jsx'

function formatDate(value, language) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(date)
}

function ArtworkCard({ artwork, onContinue, onDelete }) {
  const { language, t } = useI18n()
  const design = getColoringDesign(artwork.design_id)
  const displayTitle = design ? t(design.titleKey) : artwork.title || t('coloring.untitledArtwork')

  return (
    <article className="overflow-hidden rounded-lg border border-[#dfe5dc] bg-white transition-shadow hover:shadow-sm">
      <div className="aspect-[5/6] overflow-hidden bg-[#f2f4ef] p-3">
        <div className="h-full overflow-hidden rounded-md border border-[#e0e5dd] bg-[#fffefa]">
          {design ? (
            <ColoringDesignSvg artworkData={artwork.artwork_data} className="h-full w-full" design={design} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#718278]">{displayTitle}</div>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="break-words text-base font-semibold text-[#20372f]">{artwork.title || displayTitle}</h3>
            {design && <p className="mt-1 text-xs text-[#718278]">{t(`coloring.categories.${design.category}`)}</p>}
          </div>
          {artwork.is_completed && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e8f1e7] px-2.5 py-1 text-xs font-semibold text-[#356347]">
              <CheckCircle2 aria-hidden="true" size={13} />{t('coloring.completed')}
            </span>
          )}
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#89978d]">
          <CalendarDays aria-hidden="true" size={13} />
          {t('coloring.artworkDate', { date: formatDate(artwork.updated_at, language) })}
        </p>
        <div className="mt-4 flex items-center gap-2 border-t border-[#edf0eb] pt-3">
          <button className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-md bg-[#edf3eb] px-3 py-2 text-sm font-semibold text-[#285344] transition hover:bg-[#e1ebe0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]" onClick={() => onContinue(artwork)} type="button">
            <Pencil aria-hidden="true" size={15} />{t('coloring.continueColoring')}
          </button>
          <button aria-label={t('coloring.deleteArtwork')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#92766e] transition hover:bg-[#fbefeb] hover:text-[#873f31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#873f31]" onClick={() => onDelete(artwork)} title={t('common.delete')} type="button">
            <Trash2 aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ArtworkCard