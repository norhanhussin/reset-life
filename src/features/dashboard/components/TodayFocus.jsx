import { Sparkles } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

function TodayFocus() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden rounded-lg bg-[#285344] px-6 py-7 text-white sm:px-9 sm:py-9">
      <div className="pointer-events-none absolute -end-10 -top-16 h-52 w-52 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -end-2 -top-8 h-36 w-36 rounded-full border border-white/10" />
      <div className="relative max-w-2xl">
        <div className="flex items-center gap-2 text-[#cfe0d2]">
          <Sparkles aria-hidden="true" size={17} strokeWidth={1.7} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em]">
            {t('dashboard.focusLabel')}
          </p>
        </div>
        <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
          {t('dashboard.focusTitle')}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#dce9df] sm:text-base">
          {t('dashboard.focusDescription')}
        </p>
      </div>
    </section>
  )
}

export default TodayFocus