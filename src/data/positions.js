// Типовые должности (корпоратив) с действиями для быстрого создания задач
export const positions = [
  { key: 'manager', title: 'Руководитель', icon: 'mdi-account-tie', description: 'Управление подразделением, согласования.', actions: ['approve', 'review', 'assign', 'meeting'] },
  { key: 'pm', title: 'Менеджер проекта', icon: 'mdi-clipboard-check', description: 'Планирование и контроль проектов.', actions: ['plan', 'assign', 'review', 'report'] },
  { key: 'analyst', title: 'Аналитик', icon: 'mdi-chart-box', description: 'Анализ данных, отчёты.', actions: ['analyze', 'report', 'review'] },
  { key: 'developer', title: 'Разработчик', icon: 'mdi-code-braces', description: 'Разработка и поддержка ПО.', actions: ['develop', 'fix', 'review', 'deploy'] },
  { key: 'designer', title: 'Дизайнер', icon: 'mdi-palette', description: 'UI/UX, визуал.', actions: ['design', 'review', 'prototype'] },
  { key: 'hr_manager', title: 'HR-менеджер', icon: 'mdi-account-tie-woman', description: 'Подбор, адаптация, развитие.', actions: ['recruit', 'onboard', 'train', 'review'] },
  { key: 'accountant', title: 'Бухгалтер', icon: 'mdi-calculator', description: 'Учёт и отчётность.', actions: ['report', 'reconcile', 'approve'] },
  { key: 'support', title: 'Специалист поддержки', icon: 'mdi-headset', description: 'Поддержка пользователей.', actions: ['support', 'escalate', 'document'] },
  { key: 'sales_rep', title: 'Менеджер по продажам', icon: 'mdi-handshake', description: 'Продажи и клиенты.', actions: ['contact', 'present', 'deal', 'report'] },
]

// Действия по должностям (ключ → иконка и ключ для типа задачи)
export const positionActions = {
  approve: { key: 'approve', icon: 'mdi-check-decagram', taskType: 'approval' },
  review: { key: 'review', icon: 'mdi-eye-check', taskType: 'review' },
  assign: { key: 'assign', icon: 'mdi-account-arrow-right', taskType: 'assignment' },
  meeting: { key: 'meeting', icon: 'mdi-account-group', taskType: 'meeting' },
  plan: { key: 'plan', icon: 'mdi-clipboard-outline', taskType: 'planning' },
  report: { key: 'report', icon: 'mdi-file-document', taskType: 'report' },
  analyze: { key: 'analyze', icon: 'mdi-chart-bar', taskType: 'analysis' },
  develop: { key: 'develop', icon: 'mdi-code-tags', taskType: 'development' },
  fix: { key: 'fix', icon: 'mdi-wrench', taskType: 'fix' },
  deploy: { key: 'deploy', icon: 'mdi-rocket-launch', taskType: 'deployment' },
  design: { key: 'design', icon: 'mdi-palette', taskType: 'design' },
  prototype: { key: 'prototype', icon: 'mdi-vector-square', taskType: 'prototype' },
  recruit: { key: 'recruit', icon: 'mdi-account-plus', taskType: 'recruitment' },
  onboard: { key: 'onboard', icon: 'mdi-account-check', taskType: 'onboarding' },
  train: { key: 'train', icon: 'mdi-school', taskType: 'training' },
  reconcile: { key: 'reconcile', icon: 'mdi-calculator', taskType: 'reconciliation' },
  support: { key: 'support', icon: 'mdi-headset', taskType: 'support' },
  escalate: { key: 'escalate', icon: 'mdi-arrow-up-bold', taskType: 'escalation' },
  document: { key: 'document', icon: 'mdi-file-document-outline', taskType: 'documentation' },
  contact: { key: 'contact', icon: 'mdi-phone', taskType: 'contact' },
  present: { key: 'present', icon: 'mdi-presentation', taskType: 'presentation' },
  deal: { key: 'deal', icon: 'mdi-handshake', taskType: 'deal' },
}
