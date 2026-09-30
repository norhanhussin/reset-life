import { CheckCircle2, Circle, ListChecks } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

function PrioritiesCard({ error, tasks }) {
  const { t } = useI18n()
  return (
    <section className="rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">
            {t('dashboard.yourDay')}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#20372f]">
            {t('dashboard.prioritiesTitle')}
          </h2>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#edf3eb] text-[#416955]">
          <ListChecks aria-hidden="true" size={18} strokeWidth={1.8} />
        </span>
      </div>

      {error ? (
        <p className="mt-6 rounded-md bg-[#f8f6f0] px-4 py-3 text-sm leading-5 text-[#718278]">
          {t('dashboard.prioritiesUnavailable')}
        </p>
      ) : tasks.length === 0 ? (
        <div className="mt-6 rounded-md bg-[#f8f6f0] px-4 py-5">
          <p className="text-sm font-medium text-[#42584c]">{t('dashboard.noPriorities')}</p>
          <p className="mt-1 text-sm leading-5 text-[#718278]">
            {t('dashboard.noPrioritiesDescription')}
          </p>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-[#edf0eb]">
          {tasks.map((task) => (
            <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0" key={task.id}>
              <span className={task.completed ? 'mt-0.5 text-[#4c8561]' : 'mt-0.5 text-[#a1afa3]'}>
                {task.completed ? (
                  <CheckCircle2 aria-label={t('dashboard.completed')} size={19} strokeWidth={1.8} />
                ) : (
                  <Circle aria-label={t('dashboard.notCompleted')} size={19} strokeWidth={1.8} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className={task.completed ? 'text-sm text-[#87958b] line-through' : 'text-sm font-medium text-[#354b41]'}>
                  {task.title}
                </p>
                {task.priority && (
                  <p className="mt-1 text-xs capitalize text-[#89978d]">
                    {t('dashboard.priorityLevel', { priority: String(task.priority) })}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PrioritiesCard