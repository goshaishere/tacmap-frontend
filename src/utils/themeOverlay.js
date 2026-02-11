/**
 * Применение кастомной темы из localStorage через CSS-переменные.
 * Vuetify использует --v-theme-{key} в формате R,G,B (без rgb()).
 */

const STORAGE_USE_CUSTOM = 'themeUseCustom'
const STORAGE_CUSTOM_LIGHT = 'customThemeLight'
const STORAGE_CUSTOM_DARK = 'customThemeDark'
const OVERLAY_ID = 'custom-theme-overlay'

function hexToRgbString(hex) {
  if (!hex || hex.length < 4) return null
  const m = hex.replace(/^#/, '').match(/^(.{2})(.{2})(.{2})$/)
  if (!m) return null
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`
}

function getOrCreateOverlayElement() {
  let el = document.getElementById(OVERLAY_ID)
  if (!el) {
    el = document.createElement('style')
    el.id = OVERLAY_ID
    document.head.appendChild(el)
  }
  return el
}

/**
 * Применить кастомные цвета к :root.
 * @param {Record<string, string>} colors - объект ключ -> hex
 */
export function applyCustomColors(colors) {
  if (!colors || typeof colors !== 'object') return
  const lines = Object.entries(colors)
    .filter(([, v]) => v && typeof v === 'string')
    .map(([key, hex]) => {
      const varName = `--v-theme-${key}`
      const rgb = hexToRgbString(hex)
      if (!rgb) return ''
      return `  ${varName}: ${rgb};`
    })
    .filter(Boolean)
  const el = getOrCreateOverlayElement()
  el.textContent = lines.length ? `:root {\n${lines.join('\n')}\n}` : ''
}

/**
 * Удалить оверлей кастомной темы.
 */
export function clearCustomThemeOverlay() {
  const el = document.getElementById(OVERLAY_ID)
  if (el) el.remove()
}

/**
 * Прочитать из localStorage и применить кастомную тему, если включена.
 * @param {boolean} isDark - текущий режим светлая/тёмная
 */
export function applyCustomThemeFromStorage(isDark) {
  try {
    const useCustom = localStorage.getItem(STORAGE_USE_CUSTOM) === 'true'
    if (!useCustom) {
      clearCustomThemeOverlay()
      return
    }
    const key = isDark ? STORAGE_CUSTOM_DARK : STORAGE_CUSTOM_LIGHT
    const raw = localStorage.getItem(key)
    if (!raw) {
      clearCustomThemeOverlay()
      return
    }
    const colors = JSON.parse(raw)
    applyCustomColors(colors)
  } catch {
    clearCustomThemeOverlay()
  }
}

export const themeStorageKeys = {
  useCustom: STORAGE_USE_CUSTOM,
  customLight: STORAGE_CUSTOM_LIGHT,
  customDark: STORAGE_CUSTOM_DARK,
}

export function getUseCustomTheme() {
  return localStorage.getItem(STORAGE_USE_CUSTOM) === 'true'
}

export function getStoredCustomTheme(isDark) {
  const key = isDark ? STORAGE_CUSTOM_DARK : STORAGE_CUSTOM_LIGHT
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredCustomTheme(isDark, colors) {
  const key = isDark ? STORAGE_CUSTOM_DARK : STORAGE_CUSTOM_LIGHT
  localStorage.setItem(key, JSON.stringify(colors))
}

export function setUseCustomTheme(value) {
  localStorage.setItem(STORAGE_USE_CUSTOM, value ? 'true' : 'false')
}

export function clearStoredCustomThemes() {
  localStorage.removeItem(STORAGE_USE_CUSTOM)
  localStorage.removeItem(STORAGE_CUSTOM_LIGHT)
  localStorage.removeItem(STORAGE_CUSTOM_DARK)
}
