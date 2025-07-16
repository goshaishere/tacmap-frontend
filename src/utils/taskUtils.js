// Цвета приоритетов
export function getPriorityColor(priority) {
    const colors = {
        low: 'grey',
        medium: 'blue',
        high: 'orange',
        critical: 'red'
    }
    return colors[priority] || 'grey'
}

// Лейблы приоритетов
export function getPriorityLabel(priority) {
    const labels = {
        low: 'Низкий',
        medium: 'Средний',
        high: 'Высокий',
        critical: 'Критический'
    }
    return labels[priority] || priority
}

// Цвета статусов
export function getStatusColor(status) {
    const colors = {
        pending: 'warning',
        'in-progress': 'info',
        completed: 'success',
        cancelled: 'error',
        'on-hold': 'grey'
    }
    return colors[status] || 'grey'
}

// Иконки статусов
export function getStatusIcon(status) {
    const icons = {
        pending: 'mdi-clock-outline',
        'in-progress': 'mdi-play-circle-outline',
        completed: 'mdi-check-circle-outline',
        cancelled: 'mdi-close-circle-outline',
        'on-hold': 'mdi-pause-circle-outline'
    }
    return icons[status] || 'mdi-help-circle-outline'
}

// Лейблы статусов
export function getStatusLabel(status) {
    const labels = {
        pending: 'Ожидает',
        'in-progress': 'В работе',
        completed: 'Завершено',
        cancelled: 'Отменено',
        'on-hold': 'Приостановлено'
    }
    return labels[status] || status
}

// Форматирование даты
export function formatDate(date) {
    if (!date) return ''
    const taskDate = new Date(date)
    const now = new Date()
    const diffInDays = Math.floor((taskDate - now) / (1000 * 60 * 60 * 24))
    if (diffInDays < 0) {
        return `Просрочено ${Math.abs(diffInDays)} дн.`
    } else if (diffInDays === 0) {
        return 'Сегодня'
    } else if (diffInDays === 1) {
        return 'Завтра'
    } else {
        return taskDate.toLocaleDateString('ru-RU')
    }
}