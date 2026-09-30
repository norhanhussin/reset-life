import { useState } from 'react'
import { ArrowLeft, Plus, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import GoalCard from '../features/goals/components/GoalCard.jsx'
import GoalForm from '../features/goals/components/GoalForm.jsx'
import { createGoal, deleteGoal, updateGoal } from '../features/goals/goalsService.js'
import { useGoals } from '../features/goals/useGoals.js'
import { useAuth } from '../features/auth/useAuth.js'
import { useI18n } from '../i18n/useI18n.js'
import { translateError } from '../i18n/translateError.js'

function GoalsPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const { goals, error, isLoading, reload } = useGoals(user?.id)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [isDeletingId, setIsDeletingId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')

  function openNewGoalForm() {
    setEditingGoal(null)
    setActionError('')
    setNotice('')
    setIsFormOpen(true)
  }

  function openEditGoalForm(goal) {
    setEditingGoal(goal)
    setActionError('')
    setNotice('')
    setIsFormOpen(true)
  }

  async function handleSave(values) {
    if (editingGoal) {
      await updateGoal(user.id, editingGoal.id, values)
      setNotice(t('goals.updateSuccess'))
    } else {
      await createGoal(user.id, values)
      setNotice(t('goals.createSuccess'))
    }

    setIsFormOpen(false)
    setEditingGoal(null)
    reload()
  }

  async function handleDelete(goal) {
    const confirmed = window.confirm(t('goals.deleteConfirm', { title: goal.title }))
    if (!confirmed) return

    setActionError('')
    setNotice('')
    setIsDeletingId(goal.id)
    try {
      await deleteGoal(user.id, goal.id)
      setNotice(t('goals.deleteSuccess'))
      reload()
    } catch (deleteError) {
      setActionError(translateError(deleteError, t, 'goals.deleteError'))
    } finally {
      setIsDeletingId(null)
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
              {t('goals.eyebrow')}
            </p>
            <h1 className="mt-2 font-serif text-3xl text-[#24483c] sm:text-4xl">
              {t('common.goals')}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#718278]">
              {t('goals.description')}
            </p>
          </div>
          <button
            className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
            onClick={openNewGoalForm}
            type="button"
          >
            <Plus aria-hidden="true" size={17} />
            {t('goals.addGoal')}
          </button>
        </div>

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

        <section aria-labelledby="goals-list-title" className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-[#42584c]" id="goals-list-title">
              {isLoading ? t('goals.listTitle') : `${t('goals.listTitle')}${goals.length ? ` · ${goals.length}` : ''}`}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex min-h-52 items-center justify-center rounded-lg border border-[#dfe5dc] bg-white">
              <div className="text-center text-[#53695c]" role="status">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#cdd9ce] border-t-[#285344]" />
                <p className="mt-3 text-sm font-medium">{t('goals.loading')}</p>
              </div>
            </div>
          ) : error ? null : goals.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-[#cbd7cd] bg-[#fbfcf8] px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f0e8] text-[#4b7459]">
                <Target aria-hidden="true" size={22} strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#354b41]">{t('goals.noGoals')}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#718278]">
                {t('goals.emptyDescription')}
              </p>
              <button
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#bfcfc2] px-4 py-2.5 text-sm font-semibold text-[#285344] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
                onClick={openNewGoalForm}
                type="button"
              >
                <Plus aria-hidden="true" size={16} />
                {t('goals.addFirst')}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard
                  goal={goal}
                  isDeleting={isDeletingId === goal.id}
                  key={goal.id}
                  onDelete={handleDelete}
                  onEdit={openEditGoalForm}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {isFormOpen && (
        <GoalForm
          goal={editingGoal}
          key={editingGoal?.id || 'new-goal'}
          onCancel={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default GoalsPage