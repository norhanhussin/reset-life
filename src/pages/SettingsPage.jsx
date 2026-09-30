import { ArrowLeft, Languages } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n.js'

function SettingsPage() {
  const { language, setLanguage, t } = useI18n()

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

      <main className="mx-auto max-w-4xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718278]">
          {t('settings.eyebrow')}
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#24483c] sm:text-4xl">
          {t('settings.title')}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#718278]">
          {t('settings.description')}
        </p>

        <section className="mt-8 rounded-lg border border-[#dfe5dc] bg-white p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#eaf1ee] text-[#4d7165]">
              <Languages aria-hidden="true" size={19} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-[#20372f]">
                {t('settings.language')}
              </h2>
              <p className="mt-1 text-sm leading-5 text-[#718278]">
                {t('settings.languageDescription')}
              </p>
              <div
                aria-label={t('settings.language')}
                className="mt-5 grid max-w-md grid-cols-2 gap-2 rounded-lg bg-[#f3f5f0] p-1"
                role="group"
              >
                <button
                  aria-pressed={language === 'en'}
                  className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] ${language === 'en' ? 'bg-white text-[#285344] shadow-sm' : 'text-[#718278] hover:text-[#354b41]'}`}
                  onClick={() => setLanguage('en')}
                  type="button"
                >
                  {t('settings.english')}
                </button>
                <button
                  aria-pressed={language === 'ar'}
                  className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] ${language === 'ar' ? 'bg-white text-[#285344] shadow-sm' : 'text-[#718278] hover:text-[#354b41]'}`}
                  onClick={() => setLanguage('ar')}
                  type="button"
                >
                  {t('settings.arabic')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default SettingsPage