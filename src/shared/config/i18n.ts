import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'de'], // English and German
    debug: import.meta.env.DEV, // Enable debug mode only in development

    interpolation: {
      escapeValue: false, // React already safeguards against XSS
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Cache user language in localStorage
    },
  })

export default i18n
