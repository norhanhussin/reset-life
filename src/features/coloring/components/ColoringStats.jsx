import { Brush, CheckCircle2, Heart, Sparkles } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

function ColoringStats({ stats }) {
  const { t } = useI18n()
  const values = [
    { key: 'artworksCreated', value: stats.artworksCreated, Icon: Brush, tint: 'bg-[#eaf1e9] text-[#55775f]' },
    { key: 'completed', value: stats.completed, Icon: CheckCircle2, tint: 'bg-[#e9efeb] text-[#587568]' },
    { key: 'favoriteCount', value: stats.favorites, Icon: Heart, tint: 'bg-[#f7eeeb] text-[#a86e72]' },
    { key: 'sessions', value: stats.sessions, Icon: Sparkles, tint: 'bg-[#f3efe5] text-[#8d784b]' },
  ]

  return (
    <section aria-label={t('coloring.stats')} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {values.map(({ key, value, Icon, tint }) => (
        <article className="rounded-lg border border-[#dfe5dc] bg-white p-4 sm:p-5" key={key}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium leading-5 text-[#718278] sm:text-sm">{t(`coloring.${key}`)}</p>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${tint}`}><Icon aria-hidden="true" size={16} strokeWidth={1.8} /></span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-[#20372f] sm:text-3xl">{value.toLocaleString()}</p>
        </article>
      ))}
    </section>
  )
}

export default ColoringStats