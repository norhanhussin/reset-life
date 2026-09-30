import { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import { translateError } from '../../../i18n/translateError.js'

const CATEGORIES = [
  'Career',
  'Health',
  'Personal',
  'Finance',
  'Relationships',
  'Learning',
  'Spiritual',
  'Other',
]

function GoalForm({ goal, onCancel, onSave }) {
  const { t } = useI18n()
  const [title, setTitle] = useState(goal?.title || '')
  const [description, setDescription] = useState(goal?.description || '')
  const [category, setCategory] = useState(goal?.category || '')
  const [targetDate, setTargetDate] = useState(
    goal?.target_date ? String(goal.target_date).slice(0, 10) : '',
  )
  const [status, setStatus] = useState(goal?.status || 'active')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const extraCategory = goal?.category && !CATEGORIES.includes(goal.category)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (!title.trim()) {
      setErrorMessage(t('goals.titleRequired'))
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        title: title.trim(),
        description,
        category,
        target_date: targetDate,
        status,
      })
    } catch (error) {
      setErrorMessage(translateError(error, t, 'goals.saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#17251fcc] p-0 sm:items-center sm:p-6">
      <section
        aria-labelledby="goal-form-title"
        aria-modal="true"
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-xl bg-[#fbfcf8] p-5 shadow-2xl sm:max-w-xl sm:rounded-lg sm:p-7"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">
              {goal ? t('goals.editEyebrow') : t('goals.addEyebrow')}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#20372f]" id="goal-form-title">
              {goal ? t('goals.editGoal') : t('goals.addGoalTitle')}
            </h2>
          </div>
          <button
            aria-label={t('goals.formCloseAria')}
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
            <label className="mb-1.5 block text-sm font-medium text-[#354b41]" htmlFor="goal-title">
              {t('goals.title')} <span className="text-[#9a5a48]">*</span>
            </label>
            <input
              autoFocus
              className="w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
              id="goal-title"
              maxLength={160}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t('goals.titlePlaceholder')}
              required
              value={title}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#354b41]" htmlFor="goal-description">
              {t('goals.descriptionLabel')} <span className="font-normal text-[#89978d]">{t('common.optional')}</span>
            </label>
            <textarea
              className="min-h-24 w-full resize-y rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
              id="goal-description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t('goals.descriptionPlaceholder')}
              rows={3}
              value={description}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#354b41]" htmlFor="goal-category">
                {t('goals.category')} <span className="font-normal text-[#89978d]">{t('common.optional')}</span>
              </label>
              <select
                className="w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
                id="goal-category"
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                <option value="">{t('goals.chooseCategory')}</option>
                {extraCategory && <option value={goal.category}>{goal.category}</option>}
                {CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {t(`categories.${option.toLowerCase()}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#354b41]" htmlFor="goal-target-date">
                {t('goals.targetDate')} <span className="font-normal text-[#89978d]">{t('common.optional')}</span>
              </label>
              <input
                className="w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
                id="goal-target-date"
                onChange={(event) => setTargetDate(event.target.value)}
                type="date"
                value={targetDate}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#354b41]" htmlFor="goal-status">
              {t('goals.status')}
            </label>
            <select
              className="w-full rounded-md border border-[#d2dbd2] bg-white px-3.5 py-2.5 text-sm text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
              id="goal-status"
              onChange={(event) => setStatus(event.target.value)}
              value={status}
            >
              <option value="active">{t('goals.active')}</option>
              <option value="completed">{t('goals.completed')}</option>
              <option value="paused">{t('goals.paused')}</option>
            </select>
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
              {isSaving ? t('common.saving') : goal ? t('common.saveChanges') : t('goals.addGoal')}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default GoalForm