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
    switch (status) {
        case 'created':
            return 'warning'
        case 'assigned':
            return 'info'
        case 'in-progress':
            return 'primary'
        case 'review':
            return 'purple'
        case 'completed':
            return 'success'
        case 'on-hold':
            return 'grey'
        case 'cancelled':
            return 'error'
        default:
            return 'grey'
    }
}

// Иконки статусов
export function getStatusIcon(status) {
    switch (status) {
        case 'created':
            return 'mdi-folder-plus-outline'
        case 'assigned':
            return 'mdi-account-arrow-right-outline'
        case 'in-progress':
            return 'mdi-progress-clock'
        case 'review':
            return 'mdi-eye-check-outline'
        case 'completed':
            return 'mdi-check-circle-outline'
        case 'on-hold':
            return 'mdi-pause-circle-outline'
        case 'cancelled':
            return 'mdi-close-circle-outline'
        default:
            return 'mdi-checkbox-blank-circle-outline'
    }
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

export function getStatusIconColor(status) {
    switch (status) {
        case 'created':
            return 'warning' // всегда жёлтый, независимо от темы
        case 'assigned':
            return 'info'
        case 'in-progress':
            return 'primary'
        case 'review':
            return 'purple'
        case 'completed':
            return 'success'
        case 'on-hold':
            return 'grey'
        case 'cancelled':
            return 'error'
        default:
            return 'grey'
    }
}