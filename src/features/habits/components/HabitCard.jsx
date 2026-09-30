import { Check, Circle, Pencil, Trash2 } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

function HabitCard({
  habit,
  isDeleting,
  isUpdating,
  onDelete,
  onEdit,
  onToggle,
}) {
  const { t } = useI18n()
  const categoryKey = `categories.${String(habit.category).toLowerCase()}`
  const frequencyKey = `habits.${String(habit.frequency || 'daily').toLowerCase()}`

  return (
    <article className={`rounded-lg border p-5 transition-colors sm:p-6 ${habit.completedToday ? 'border-[#c8dccb] bg-[#f4f9f3]' : 'border-[#dfe5dc] bg-white'}`}>
      <div className="flex items-start gap-4">
        <button
          aria-label={habit.completedToday ? t('habits.markIncomplete', { name: habit.name }) : t('habits.markComplete', { name: habit.name })}
          aria-pressed={habit.completedToday}
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-60 ${habit.completedToday ? 'bg-[#4c8561] text-white hover:bg-[#3c704f]' : 'border border-[#bdcbbf] bg-white text-[#8b9a8e] hover:border-[#6d9876] hover:text-[#4c8561]'}`}
          disabled={isUpdating}
          onClick={() => onToggle(habit, !habit.completedToday)}
          type="button"
        >
          {isUpdating ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : habit.completedToday ? (
            <Check aria-hidden="true" size={18} strokeWidth={2.4} />
          ) : (
            <Circle aria-hidden="true" size={18} strokeWidth={1.8} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={`break-words text-base font-semibold leading-6 ${habit.completedToday ? 'text-[#587361]' : 'text-[#20372f]'}`}>
              {habit.name}
            </h2>
            {habit.completedToday && (
              <span className="rounded-full bg-[#e2efe2] px-2 py-0.5 text-[11px] font-semibold text-[#3f704e]">
                {t('habits.completedToday')}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#718278]">
            <span>{t(frequencyKey) === frequencyKey ? habit.frequency : t(frequencyKey)}</span>
            {habit.category && (
              <span>{t(categoryKey) === categoryKey ? habit.category : t(categoryKey)}</span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            aria-label={t('habits.editAria', { name: habit.name })}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#718278] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            onClick={() => onEdit(habit)}
            title={t('common.edit')}
            type="button"
          >
            <Pencil aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
          <button
            aria-label={t('habits.deleteAria', { name: habit.name })}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#92766e] transition hover:bg-[#fbefeb] hover:text-[#873f31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#873f31] disabled:cursor-wait disabled:opacity-50"
            disabled={isDeleting}
            onClick={() => onDelete(habit)}
            title={t('common.delete')}
            type="button"
          >
            <Trash2 aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default HabitCard