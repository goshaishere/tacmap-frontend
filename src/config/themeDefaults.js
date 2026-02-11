/**
 * Стандартные палитры тем приложения.
 * Используются в main.js и при сбросе кастомной темы.
 */

export const defaultLight = {
  dark: false,
  colors: {
    background: '#F5F6FA',
    surface: '#FFFFFF',
    'surface-variant': '#E8EAED',
    'surface-bright': '#FFFFFF',
    primary: '#3BA55D',
    secondary: '#2C3E50',
    accent: '#6B8E23',
    info: '#2196F3',
    success: '#43A047',
    warning: '#FFC107',
    error: '#E53935',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#232B2F',
    'on-surface-variant': '#5F6368',
    'on-error': '#FFFFFF',
    'outline': '#DADCE0',
    'outline-variant': '#E8EAED',
  },
}

export const defaultDark = {
  dark: true,
  colors: {
    background: '#12181B',
    surface: '#181F22',
    'surface-variant': '#2C353A',
    'surface-bright': '#222A30',
    primary: '#3BA55D',
    secondary: '#22313A',
    accent: '#ddb77b',
    info: '#64B5F6',
    success: '#66BB6A',
    warning: '#FFD54F',
    error: '#EF5350',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#B0BEC5',
    'on-surface-variant': '#9AA0A6',
    'on-error': '#FFFFFF',
    'outline': '#3C4043',
    'outline-variant': '#2C353A',
  },
}

/** Ключи цветов для отображения в настройках (порядок и метки для i18n) */
export const themeColorKeys = [
  'background',
  'surface',
  'surface-variant',
  'surface-bright',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
  'on-primary',
  'on-secondary',
  'on-surface',
  'on-surface-variant',
  'on-error',
  'outline',
  'outline-variant',
]
