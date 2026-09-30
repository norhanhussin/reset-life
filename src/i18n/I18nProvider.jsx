import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { I18nContext } from './I18nContext.js'
import ar from './translations/ar.js'
import en from './translations/en.js'

const LANGUAGE_STORAGE_KEY = 'reset-language'
const DICTIONARIES = { en, ar }

function getInitialLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'ar' ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

function getTranslation(dictionary, key) {
  return key.split('.').reduce((value, part) => value?.[part], dictionary)
}

function translate(dictionary, key, params) {
  const value = getTranslation(dictionary, key)
  if (typeof value !== 'string') return key

  return value.replace(/\{([^}]+)\}/g, (_, name) => String(params?.[name] ?? ''))
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  useLayoutEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const setLanguage = useCallback((nextLanguage) => {
    if (!Object.hasOwn(DICTIONARIES, nextLanguage)) return
    setLanguageState(nextLanguage)

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    } catch {
      // Keep the language change available for this session if storage is blocked.
    }
  }, [])

  const t = useCallback(
    (key, params) => translate(DICTIONARIES[language], key, params),
    [language],
  )

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}