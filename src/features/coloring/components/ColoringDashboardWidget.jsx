import { Link } from 'react-router-dom'
import { Palette } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import { getColoringDesign } from '../designs.js'
import ColoringDesignSvg from './ColoringDesignSvg.jsx'

function ColoringDashboardWidget({ artwork, error, isLoading }) {
  const { t } = useI18n()
  const design = artwork ? getColoringDesign(artwork.design_id) : null

  return (
    <section className="rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">{t('coloring.title')}</p>
          {artwork && <h2 className="mt-1 text-lg font-semibold text-[#20372f]">{design ? t(design.titleKey) : artwork.title}</h2>}
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#f2eee7] text-[#8a7550]">
          <Palette aria-hidden="true" size={18} strokeWidth={1.7} />
        </span>
      </div>
      {isLoading ? (
        <div className="mt-4 h-20 animate-pulse rounded-md bg-[#f1f3ee]" role="status" />
      ) : error ? (
        <p className="mt-4 text-sm leading-5 text-[#718278]">{t('common.loadError')}</p>
      ) : artwork ? (
        <div className="mt-4 flex items-center gap-4">
          <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md border border-[#e0e5dd] bg-[#fffefa]">
            {design && <ColoringDesignSvg artworkData={artwork.artwork_data} className="h-full w-full" design={design} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-5 text-[#718278]">{t('coloring.dashboardText')}</p>
            <Link className="mt-3 inline-flex min-h-9 items-center rounded-md bg-[#edf3eb] px-3 py-2 text-xs font-semibold text-[#285344] transition hover:bg-[#e1ebe0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] sm:text-sm" state={{ artworkId: artwork.id }} to="/coloring">
              {t('coloring.continueColoring')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm leading-5 text-[#718278]">{t('coloring.dashboardText')}</p>
          <Link className="mt-3 inline-flex min-h-9 items-center rounded-md border border-[#cbd7cd] px-3 py-2 text-xs font-semibold text-[#285344] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] sm:text-sm" to="/coloring">
            {t('coloring.startColoring')}
          </Link>
        </div>
      )}
    </section>
  )
}

export default ColoringDashboardWidget