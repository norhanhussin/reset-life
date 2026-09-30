import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth.js'
import { useI18n } from '../../i18n/useI18n.js'
import { translateError } from '../../i18n/translateError.js'

function AuthForm({ mode }) {
  const isSignup = mode === 'signup'
  const { signIn, signUp, sessionError } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      if (isSignup) {
        const data = await signUp({ email: email.trim(), password })

        if (data.session) {
          navigate('/dashboard', { replace: true })
        } else {
          setSuccessMessage(t('auth.signupConfirmation'))
        }
      } else {
        await signIn({ email: email.trim(), password })
        const destination = location.state?.from?.pathname || '/dashboard'
        navigate(destination, { replace: true })
      }
    } catch (error) {
      setErrorMessage(translateError(error, t, 'common.errorGeneric'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f7f2] text-[#20372f] lg:grid-cols-2">
      <section className="flex min-h-[240px] flex-col justify-between bg-[#e6eee6] px-7 py-8 sm:px-12 sm:py-10 lg:min-h-screen lg:px-16 lg:py-14">
        <Link
          className="w-fit text-sm font-semibold tracking-[0.2em] text-[#24483c]"
          to="/"
        >
          RESET
        </Link>
        <div className="max-w-md py-10 lg:py-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#557365]">
            {t('auth.tagline')}
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-[#24483c] sm:text-5xl">
            {t('auth.headline')}
          </h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-[#52685d]">
            {t('auth.description')}
          </p>
        </div>
        <p className="hidden text-xs text-[#718278] lg:block">
          {t('auth.footer')}
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <p className="text-sm font-medium text-[#718278]">
            {isSignup ? t('auth.signupEyebrow') : t('auth.loginEyebrow')}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#20372f]">
            {isSignup ? t('auth.signupTitle') : t('auth.loginTitle')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#718278]">
            {isSignup
              ? t('auth.signupDescription')
              : t('auth.loginDescription')}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-[#354b41]"
                htmlFor={`${mode}-email`}
              >
                {t('auth.email')}
              </label>
              <input
                autoComplete="email"
                className="w-full rounded-md border border-[#d2dbd2] bg-white px-4 py-3 text-base text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
                dir="ltr"
                id={`${mode}-email`}
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                type="email"
                value={email}
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-[#354b41]"
                htmlFor={`${mode}-password`}
              >
                {t('auth.password')}
              </label>
              <input
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className="w-full rounded-md border border-[#d2dbd2] bg-white px-4 py-3 text-base text-[#20372f] outline-none transition focus:border-[#557365] focus:ring-2 focus:ring-[#557365]/20"
                id={`${mode}-password`}
                minLength={isSignup ? 6 : undefined}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>

            {(errorMessage || sessionError) && (
              <p
                className="rounded-md border border-[#e5c5bc] bg-[#fbefeb] px-4 py-3 text-sm leading-5 text-[#873f31]"
                role="alert"
              >
                {errorMessage || translateError(sessionError, t, 'common.errorGeneric')}
              </p>
            )}
            {successMessage && (
              <p
                className="rounded-md border border-[#c9dccd] bg-[#edf5ee] px-4 py-3 text-sm leading-5 text-[#315c42]"
                role="status"
              >
                {successMessage}
              </p>
            )}

            <button
              className="w-full rounded-md bg-[#285344] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSignup
                ? isSubmitting
                  ? t('auth.creatingAccount')
                  : t('auth.createAccount')
                : isSubmitting
                  ? t('auth.signingIn')
                  : t('auth.loginTitle')}
            </button>
          </form>

          <p className="mt-7 text-sm text-[#718278]">
            {isSignup ? t('auth.alreadyAccount') : t('auth.newToReset')}{' '}
            <Link
              className="font-semibold text-[#285344] underline decoration-[#9fb4a4] underline-offset-4 hover:text-[#1e4336]"
              to={isSignup ? '/login' : '/signup'}
            >
              {isSignup ? t('auth.loginLink') : t('auth.signupLink')}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default AuthForm