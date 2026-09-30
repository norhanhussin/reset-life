import { ArrowUpRight, CalendarDays, Target } from 'lucide-react'
import { formatDashboardDate } from '../dashboardModel.js'
import { useI18n } from '../../../i18n/useI18n.js'

function GoalsCard({ error, goals }) {
  const { language, t } = useI18n()
  return (
    <section className="rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">
            {t('dashboard.bigPicture')}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#20372f]">{t('dashboard.activeGoals')}</h2>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#f5eee4] text-[#997344]">
          <Target aria-hidden="true" size={18} strokeWidth={1.8} />
        </span>
      </div>

      {error ? (
        <p className="mt-6 rounded-md bg-[#f8f6f0] px-4 py-3 text-sm leading-5 text-[#718278]">
          {t('dashboard.goalsUnavailable')}
        </p>
      ) : goals.length === 0 ? (
        <div className="mt-6 rounded-md bg-[#f8f6f0] px-4 py-5">
          <p className="text-sm font-medium text-[#42584c]">{t('dashboard.noGoals')}</p>
          <p className="mt-1 text-sm leading-5 text-[#718278]">
            {t('dashboard.noGoalsDescription')}
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {goals.map((goal) => (
            <li className="rounded-md border border-[#edf0eb] p-4" key={goal.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-[#354b41]">
                    {goal.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#718278]">
                    {t(`categories.${String(goal.category).toLowerCase()}`) ===
                    `categories.${String(goal.category).toLowerCase()}`
                      ? goal.category
                      : t(`categories.${String(goal.category).toLowerCase()}`)}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#4d765c]">
                  <ArrowUpRight aria-hidden="true" size={14} />
                  {t(`goals.${String(goal.status).toLowerCase()}`) ===
                  `goals.${String(goal.status).toLowerCase()}`
                    ? goal.status
                    : t(`goals.${String(goal.status).toLowerCase()}`)}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-[#89978d]">
                <CalendarDays aria-hidden="true" size={14} />
                {t('dashboard.target', {
                  date: formatDashboardDate(goal.targetDate, language),
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default GoalsCard