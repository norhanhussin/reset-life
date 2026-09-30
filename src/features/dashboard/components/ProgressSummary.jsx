import { ChartNoAxesColumnIncreasing } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

function ProgressSummary({ progress }) {
  const { t } = useI18n()
  return (
    <section className="rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">
            {t('dashboard.atAGlance')}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#20372f]">
            {t('dashboard.progressSummary')}
          </h2>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#f3eee9] text-[#956c4d]">
          <ChartNoAxesColumnIncreasing aria-hidden="true" size={18} strokeWidth={1.8} />
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {progress.map((item) => (
          <div key={item.labelKey}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-[#42584c]">{t(item.labelKey)}</p>
              <p className="text-xs text-[#718278]">{t(item.detailKey, item.detailParams)}</p>
            </div>
            <div
              aria-label={`${t(item.labelKey)}: ${item.value}%`}
              className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf0eb]"
              role="img"
            >
              <div
                className="me-auto h-full rounded-full bg-[#6e9675] transition-[width] duration-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 border-t border-[#edf0eb] pt-4 text-xs leading-5 text-[#89978d]">
        {t('dashboard.progressNote')}
      </p>
    </section>
  )
}

export default ProgressSummary