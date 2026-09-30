import { useState } from 'react'
import { ArrowLeft, Plus, Repeat2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.js'
import HabitCard from '../features/habits/components/HabitCard.jsx'
import HabitForm from '../features/habits/components/HabitForm.jsx'
import { buildHabitsModel } from '../features/habits/habitsModel.js'
import {
  createHabit,
  deleteHabit,
  updateHabit,
} from '../features/habits/habitsService.js'
import { useHabitsData } from '../features/habits/useHabitsData.js'
import { useI18n } from '../i18n/useI18n.js'
import { translateError } from '../i18n/translateError.js'

function HabitsPage() {
  const { user } = useAuth()
  const { language, t } = useI18n()
  const {
    habits,
    habitLogs,
    today,
    error,
    isLoading,
    reload,
    setTodayCompletion,
  } = useHabitsData(user?.id)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [isDeletingId, setIsDeletingId] = useState(null)
  const [isUpdatingId, setIsUpdatingId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')
  const model = buildHabitsModel(habits, habitLogs)

  function openNewHabitForm() {
    setEditingHabit(null)
    setActionError('')
    setNotice('')
    setIsFormOpen(true)
  }

  function openEditHabitForm(habit) {
    setEditingHabit(habit)
    setActionError('')
    setNotice('')
    setIsFormOpen(true)
  }

  async function handleSave(values) {
    if (editingHabit) {
      await updateHabit(user.id, editingHabit.id, values)
      setNotice(t('habits.updateSuccess'))
    } else {
      await createHabit(user.id, values)
      setNotice(t('habits.createSuccess'))
    }

    setIsFormOpen(false)
    setEditingHabit(null)
    reload()
  }

  async function handleDelete(habit) {
    const confirmed = window.confirm(
      t('habits.deleteConfirm', { name: habit.name }),
    )
    if (!confirmed) return

    setActionError('')
    setNotice('')
    setIsDeletingId(habit.id)
    try {
      await deleteHabit(user.id, habit.id)
      setNotice(t('habits.deleteSuccess'))
      reload()
    } catch (deleteError) {
      setActionError(translateError(deleteError, t, 'habits.deleteError'))
    } finally {
      setIsDeletingId(null)
    }
  }

  async function handleToggle(habit, completed) {
    setActionError('')
    setNotice('')
    setIsUpdatingId(habit.id)
    try {
      await setTodayCompletion(habit.id, completed)
    } catch (toggleError) {
      setActionError(translateError(toggleError, t, 'habits.completionError'))
    } finally {
      setIsUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f0] text-[#20372f]">
      <header className="border-b border-[#dce3dc] bg-[#fbfcf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-[0.2em] text-[#285344]">
            RESET
          </span>
          <Link
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#53695c] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            to="/dashboard"
          >
            <ArrowLeft aria-hidden="true" className="rtl:rotate-180" size={16} />
            {t('common.backToDashboard')}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718278]">
              {t('habits.eyebrow')}
            </p>
            <h1 className="mt-2 font-serif text-3xl text-[#24483c] sm:text-4xl">
              {t('common.habits')}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#718278]">
              {t('habits.description')}
            </p>
          </div>
          <button
            className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            onClick={openNewHabitForm}
            type="button"
          >
            <Plus aria-hidden="true" size={17} />
            {t('habits.addHabit')}
          </button>
        </div>

        <section className="mt-7 rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#354b41]">
                {t('habits.completedCount', { completed: model.completedCount, total: model.totalCount })}
              </p>
              <p className="mt-1 text-xs text-[#89978d]">{t('habits.today')} · {new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en').format(new Date(`${today}T00:00:00`))}</p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#eaf1ee] text-[#4d7165]">
              <Repeat2 aria-hidden="true" size={19} strokeWidth={1.8} />
            </span>
          </div>
          <div
            aria-label={t('habits.progressAria', { percent: model.completionPercent })}
            className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#edf0eb]"
            role="img"
          >
            <div
              className="me-auto h-full rounded-full bg-[#6e9675] transition-[width] duration-500"
              style={{ width: `${model.completionPercent}%` }}
            />
          </div>
        </section>

        {(actionError || error) && (
          <section className="mt-6 flex flex-col gap-3 rounded-lg border border-[#e6c8bd] bg-[#fcf2ee] px-4 py-4 text-sm leading-5 text-[#7d3f32] sm:flex-row sm:items-center sm:justify-between">
            <p role="alert">
              {actionError || translateError(error, t, 'common.loadError')}
            </p>
            {error && (
              <button
                className="w-fit shrink-0 rounded-md border border-[#d9b4a8] px-3 py-2 text-sm font-semibold transition hover:bg-[#f8e5de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d3f32]"
                onClick={reload}
                type="button"
              >
                {t('common.tryAgain')}
              </button>
            )}
          </section>
        )}

        {notice && (
          <p className="mt-6 rounded-lg border border-[#cdddcf] bg-[#edf5ee] px-4 py-3 text-sm text-[#315c42]" role="status">
            {notice}
          </p>
        )}

        <section aria-labelledby="habits-list-title" className="mt-8">
          <h2 className="mb-4 text-sm font-semibold text-[#42584c]" id="habits-list-title">
            {isLoading ? t('habits.listTitle') : `${t('habits.listTitle')}${habits.length ? ` · ${habits.length}` : ''}`}
          </h2>

          {isLoading ? (
            <div className="flex min-h-52 items-center justify-center rounded-lg border border-[#dfe5dc] bg-white">
              <div className="text-center text-[#53695c]" role="status">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#cdd9ce] border-t-[#285344]" />
                <p className="mt-3 text-sm font-medium">{t('habits.loading')}</p>
              </div>
            </div>
          ) : error ? null : habits.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-[#cbd7cd] bg-[#fbfcf8] px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f0e8] text-[#4b7459]">
                <Repeat2 aria-hidden="true" size={22} strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#354b41]">{t('habits.noHabits')}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#718278]">
                {t('habits.emptyDescription')}
              </p>
              <button
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#bfcfc2] px-4 py-2.5 text-sm font-semibold text-[#285344] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
                onClick={openNewHabitForm}
                type="button"
              >
                <Plus aria-hidden="true" size={16} />
                {t('habits.addFirst')}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {model.habits.map((habit) => (
                <HabitCard
                  habit={habit}
                  isDeleting={isDeletingId === habit.id}
                  isUpdating={isUpdatingId === habit.id}
                  key={habit.id}
                  onDelete={handleDelete}
                  onEdit={openEditHabitForm}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {isFormOpen && (
        <HabitForm
          habit={editingHabit}
          key={editingHabit?.id || 'new-habit'}
          onCancel={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default HabitsPage