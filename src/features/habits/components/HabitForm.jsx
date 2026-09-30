import { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import { translateError } from '../../../i18n/translateError.js'

const CATEGORIES = [
  'Health',
  'Career',
  'Personal',
  'Learning',
  'Spiritual',
  'Fitness',
  'Other',
]

function HabitForm({ habit, onCancel, onSave }) {
  const { t } = useI18n()
  const [name, setName] = useState(habit?.name || '')
  const [category, setCategory] = useState(habit?.category || '')
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const extraCategory = habit?.category && !CATEGORIES.includes(habit.category)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (!name.trim()) {
      setErrorMessage(t('habits.nameRequired'))
      return
    }

    setIsSaving(true)
    try {
      await onSave({ name: name.trim(), category, frequency })
    } catch (error) {
      setErrorMessage(translateError(error, t, 'habits.saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#17251fcc] p-0 sm:items-center sm:p-6">
      <section
        aria-labelledby="habit-form-title"
        aria-modal="true"
        className="w-full rounded-t-xl bg-[#fbfcf8] p-5 shadow-2xl sm:max-w-lg sm:rounded-lg sm:p-7"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">
              {habit ? t('habits.editEyebrow') : t('habits.addEyebrow')}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#20372f]" id="habit-form-title">
              {habit ? t('habits.editHabit') : t('habits.addHabitTitle')}
            </h2>
          </div>
          <button
            aria-label={t('habits.formCloseAria')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#718278] transition hover:bg-[#edf1eb] hover:text-[#20372f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:opacity-50"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#354b41]" htmlFor="habit-name">
              {t('habits.name')} <span className="text-[#9a5a48]">*</span>
            </label>
            <input
              autoFocus
              className="w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
              id="habit-name"
              maxLength={120}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('habits.namePlaceholder')}
              required
              value={name}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#354b41]" htmlFor="habit-category">
                {t('habits.category')} <span className="font-normal text-[#89978d]">{t('common.optional')}</span>
              </label>
              <select
                className="w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
                id="habit-category"
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                <option value="">{t('habits.chooseCategory')}</option>
                {extraCategory && <option value={habit.category}>{habit.category}</option>}
                {CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {t(`categories.${option.toLowerCase()}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#354b41]" htmlFor="habit-frequency">
                {t('habits.frequency')}
              </label>
              <select
                className="w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
                id="habit-frequency"
                onChange={(event) => setFrequency(event.target.value)}
                value={frequency}
              >
                <option value="daily">{t('habits.daily')}</option>
                <option value="weekly">{t('habits.weekly')}</option>
              </select>
            </div>
          </div>

          {errorMessage && (
            <p className="rounded-md border border-[#e6c8bd] bg-[#fcf2ee] px-3.5 py-3 text-sm leading-5 text-[#7d3f32]" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-[#e7ebe4] pt-5 sm:flex-row sm:justify-end">
            <button
              className="rounded-md border border-[#cbd7cd] px-4 py-2.5 text-sm font-medium text-[#42584c] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:opacity-60"
              disabled={isSaving}
              onClick={onCancel}
              type="button"
            >
              {t('common.cancel')}
            </button>
            <button
              className="rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? t('common.saving') : habit ? t('common.saveChanges') : t('habits.addHabit')}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default HabitForm