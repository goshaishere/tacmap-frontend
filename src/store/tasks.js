import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
    // Состояние
    const tasks = ref([])
    const loading = ref(false)
    const error = ref(null)
    const filters = ref({
        status: 'all',
        priority: 'all',
        assignedTo: 'all',
        search: ''
    })

    // Типы задач
    const taskTypes = {
        RECONNAISSANCE: 'reconnaissance',
        COMBAT: 'combat',
        SUPPORT: 'support',
        MEDICAL: 'medical',
        TRANSPORT: 'transport',
        COMMUNICATION: 'communication'
    }

    // Статусы задач
    const taskStatuses = {
        PENDING: 'pending',
        IN_PROGRESS: 'in-progress',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled',
        ON_HOLD: 'on-hold'
    }

    // Приоритеты
    const priorities = {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        CRITICAL: 'critical'
    }

    // Геттеры
    const totalTasks = computed(() => tasks.value.length)

    const pendingTasks = computed(() =>
        tasks.value.filter(task => task.status === taskStatuses.PENDING)
    )

    const inProgressTasks = computed(() =>
        tasks.value.filter(task => task.status === taskStatuses.IN_PROGRESS)
    )

    const completedTasks = computed(() =>
        tasks.value.filter(task => task.status === taskStatuses.COMPLETED)
    )

    const filteredTasks = computed(() => {
        let filtered = tasks.value

        // Фильтр по статусу
        if (filters.value.status !== 'all') {
            filtered = filtered.filter(task => task.status === filters.value.status)
        }

        // Фильтр по приоритету
        if (filters.value.priority !== 'all') {
            filtered = filtered.filter(task => task.priority === filters.value.priority)
        }

        // Фильтр по назначенному
        if (filters.value.assignedTo !== 'all') {
            filtered = filtered.filter(task => task.assignedTo === filters.value.assignedTo)
        }

        // Поиск
        if (filters.value.search) {
            const searchLower = filters.value.search.toLowerCase()
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower)
            )
        }

        return filtered
    })

    // Действия
    const addTask = (task) => {
        const newTask = {
            id: Date.now() + Math.random(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: taskStatuses.PENDING,
            ...task
        }
        tasks.value.unshift(newTask)
        return newTask
    }

    const updateTask = (taskId, updates) => {
        const index = tasks.value.findIndex(task => task.id === taskId)
        if (index !== -1) {
            tasks.value[index] = {
                ...tasks.value[index],
                ...updates,
                updatedAt: new Date().toISOString()
            }
        }
    }

    const deleteTask = (taskId) => {
        const index = tasks.value.findIndex(task => task.id === taskId)
        if (index !== -1) {
            tasks.value.splice(index, 1)
        }
    }

    const changeTaskStatus = (taskId, newStatus) => {
        updateTask(taskId, { status: newStatus })
    }

    const assignTask = (taskId, userId) => {
        updateTask(taskId, { assignedTo: userId })
    }

    const setFilters = (newFilters) => {
        filters.value = {...filters.value, ...newFilters }
    }

    const clearFilters = () => {
        filters.value = {
            status: 'all',
            priority: 'all',
            assignedTo: 'all',
            search: ''
        }
    }

    const getTaskById = (taskId) => {
        return tasks.value.find(task => task.id === taskId)
    }

    const getTasksByStatus = (status) => {
        return tasks.value.filter(task => task.status === status)
    }

    const getTasksByPriority = (priority) => {
        return tasks.value.filter(task => task.priority === priority)
    }

    // Мобильные утилиты
    const getTasksForMobile = () => {
        return filteredTasks.value.map(task => ({
            id: task.id,
            title: task.title,
            status: task.status,
            priority: task.priority,
            assignedTo: task.assignedTo,
            dueDate: task.dueDate,
            location: task.location,
            // Сокращенное описание для мобильных
            shortDescription: task.description && task.description.length > 100 ?
                task.description.substring(0, 100) + '...' :
                task.description
        }))
    }

    return {
        // Состояние
        tasks,
        loading,
        error,
        filters,

        // Константы
        taskTypes,
        taskStatuses,
        priorities,

        // Геттеры
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        filteredTasks,

        // Действия
        addTask,
        updateTask,
        deleteTask,
        changeTaskStatus,
        assignTask,
        setFilters,
        clearFilters,
        getTaskById,
        getTasksByStatus,
        getTasksByPriority,

        // Мобильные утилиты
        getTasksForMobile
    }
})