// Типовые команды (корпоративная иерархия — второй уровень)
export const defaultTeams = [
  { key: 'product_a', title: 'Команда продукта A', icon: 'mdi-package-variant', description: 'Разработка и поддержка продукта A' },
  { key: 'product_b', title: 'Команда продукта B', icon: 'mdi-package-variant', description: 'Разработка и поддержка продукта B' },
  { key: 'dev', title: 'Команда разработки', icon: 'mdi-code-tags', description: 'Backend и frontend' },
  { key: 'analytics', title: 'Команда аналитики', icon: 'mdi-chart-bar', description: 'Аналитика и отчётность' },
  { key: 'design', title: 'Команда дизайна', icon: 'mdi-palette', description: 'UI/UX и бренд' },
  { key: 'qa', title: 'QA', icon: 'mdi-bug-check', description: 'Тестирование' },
]

export function createTeam({ key, title, icon, description }) {
  return { key, title, icon: icon || 'mdi-account-group', description: description || '' }
}
