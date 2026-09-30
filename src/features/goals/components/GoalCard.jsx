import { CalendarDays, Clock3, Pencil, Trash2 } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

const STATUS_STYLES = {
  active: 'bg-[#e8f1e7] text-[#356347]',
  completed: 'bg-[#e9efeb] text-[#5a7063]',
  paused: 'bg-[#f5eee2] text-[#8b693d]',
}

function formatDate(value, language) {
  if (!value) return null
  const isDateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  const parsed = new Date(isDateOnly ? `${value}T00:00:00` : value)
  if (Number.isNaN(parsed.getTime())) return null

  return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function GoalCard({ goal, isDeleting, onDelete, onEdit }) {
  const { language, t } = useI18n()
  const status = String(goal.status || 'active').toLowerCase()
  const statusStyle = STATUS_STYLES[status] || 'bg-[#edf0eb] text-[#59685e]'
  const createdDate = formatDate(goal.created_at, language)
  const updatedDate = goal.updated_at
    ? formatDate(goal.updated_at, language)
    : null
  const translatedCategory = t(`categories.${String(goal.category).toLowerCase()}`)

  return (
    <article className="flex h-full flex-col rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle}`}>
              {t(`goals.${status}`)}
            </span>
            {goal.category && (
              <span className="rounded-full bg-[#f4f3ed] px-2.5 py-1 text-xs font-medium text-[#657368]">
                {translatedCategory === `categories.${String(goal.category).toLowerCase()}`
                  ? goal.category
                  : translatedCategory}
              </span>
            )}
          </div>
          <h2 className="mt-3 break-words text-base font-semibold leading-6 text-[#20372f]">
            {goal.title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label={t('goals.editAria', { title: goal.title })}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#718278] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            onClick={() => onEdit(goal)}
            title={t('common.edit')}
            type="button"
          >
            <Pencil aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
          <button
            aria-label={t('goals.deleteAria', { title: goal.title })}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#92766e] transition hover:bg-[#fbefeb] hover:text-[#873f31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#873f31] disabled:cursor-wait disabled:opacity-50"
            disabled={isDeleting}
            onClick={() => onDelete(goal)}
            title={t('common.delete')}
            type="button"
          >
            <Trash2 aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#64766c]">
          {goal.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5 text-xs text-[#89978d]">
        {goal.target_date ? (
          <p className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" size={14} />
            {t('goals.target', { date: formatDate(goal.target_date, language) || t('goals.noTargetDate') })}
          </p>
        ) : (
          <p className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" size={14} />
            {t('goals.noTargetDate')}
          </p>
        )}
        {(createdDate || updatedDate) && (
          <p className="inline-flex items-center gap-1.5">
            <Clock3 aria-hidden="true" size={14} />
            {createdDate && t('goals.created', { date: createdDate })}
            {!createdDate && updatedDate && t('goals.updated', { date: updatedDate })}
            {createdDate && updatedDate && updatedDate !== createdDate
              ? t('goals.updatedBoth', { date: updatedDate })
              : ''}
          </p>
        )}
      </div>
    </article>
  )
}

export default GoalCard