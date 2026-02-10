// Типовые отделы (корпоративная иерархия — верхний уровень)
export const defaultDepartments = [
  { key: 'executive', title: 'Руководство', icon: 'mdi-domain', colorLight: '#1565C0', colorDark: '#42A5F5', iconColorLight: '#fff', iconColorDark: '#fff' },
  { key: 'hr', title: 'HR', icon: 'mdi-account-group', colorLight: '#7B1FA2', colorDark: '#AB47BC', iconColorLight: '#fff', iconColorDark: '#fff' },
  { key: 'finance', title: 'Финансы', icon: 'mdi-currency-usd', colorLight: '#2E7D32', colorDark: '#66BB6A', iconColorLight: '#fff', iconColorDark: '#fff' },
  { key: 'it', title: 'IT', icon: 'mdi-laptop', colorLight: '#0277BD', colorDark: '#29B6F6', iconColorLight: '#fff', iconColorDark: '#fff' },
  { key: 'sales', title: 'Продажи', icon: 'mdi-chart-line', colorLight: '#E65100', colorDark: '#FF9800', iconColorLight: '#fff', iconColorDark: '#fff' },
  { key: 'marketing', title: 'Маркетинг', icon: 'mdi-bullhorn', colorLight: '#C62828', colorDark: '#EF5350', iconColorLight: '#fff', iconColorDark: '#fff' },
  { key: 'legal', title: 'Юридический', icon: 'mdi-gavel', colorLight: '#37474F', colorDark: '#78909C', iconColorLight: '#fff', iconColorDark: '#fff' },
  { key: 'operations', title: 'Операции', icon: 'mdi-cog', colorLight: '#455A64', colorDark: '#90A4AE', iconColorLight: '#fff', iconColorDark: '#fff' },
  { key: 'support', title: 'Поддержка', icon: 'mdi-headset', colorLight: '#00695C', colorDark: '#26A69A', iconColorLight: '#fff', iconColorDark: '#fff' },
]

export function createDepartment({ key, title, icon, colorLight, colorDark, iconColorLight, iconColorDark }) {
  return { key, title, icon: icon || 'mdi-domain', colorLight: colorLight || '#1976D2', colorDark: colorDark || '#42A5F5', iconColorLight: iconColorLight || '#fff', iconColorDark: iconColorDark || '#fff' }
}
