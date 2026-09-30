import { Check, Circle, Repeat2 } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

function HabitsCard({ error, habits }) {
  const { t } = useI18n()
  return (
    <section className="rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">
            {t('dashboard.dailyRhythm')}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#20372f]">{t('common.habits')}</h2>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#eaf1ee] text-[#4d7165]">
          <Repeat2 aria-hidden="true" size={18} strokeWidth={1.8} />
        </span>
      </div>

      {error ? (
        <p className="mt-6 rounded-md bg-[#f8f6f0] px-4 py-3 text-sm leading-5 text-[#718278]">
          {t('dashboard.habitsUnavailable')}
        </p>
      ) : habits.length === 0 ? (
        <div className="mt-6 rounded-md bg-[#f8f6f0] px-4 py-5">
          <p className="text-sm font-medium text-[#42584c]">{t('dashboard.noHabits')}</p>
          <p className="mt-1 text-sm leading-5 text-[#718278]">
            {t('dashboard.noHabitsDescription')}
          </p>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-[#edf0eb]">
          {habits.map((habit) => (
            <li className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0" key={habit.id}>
              <span className="min-w-0 break-words text-sm font-medium text-[#354b41]">
                {habit.title}
              </span>
              <span
                aria-label={habit.completedToday ? t('habits.completedToday') : t('dashboard.notCompleted')}
                className={habit.completedToday ? 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e6f1e7] text-[#4c8561]' : 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3f4ef] text-[#9aa89c]'}
              >
                {habit.completedToday ? (
                  <Check aria-hidden="true" size={15} strokeWidth={2} />
                ) : (
                  <Circle aria-hidden="true" size={15} strokeWidth={1.8} />
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default HabitsCard