import { createI18n } from 'vue-i18n'
import ru from './locales/ru.js'
import en from './locales/en.js'

const LS_LOCALE = 'appLocale'
const defaultLocale = () => {
  try {
    return localStorage.getItem(LS_LOCALE) || 'ru'
  } catch {
    return 'ru'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale(),
  fallbackLocale: 'ru',
  messages: { ru, en },
})

export function setLocale(locale) {
  i18n.global.locale.value = locale
  try {
    localStorage.setItem(LS_LOCALE, locale)
  } catch {}
}

export function getLocale() {
  return i18n.global.locale.value
}
