import { defineStore } from 'pinia';
import { onMounted } from 'vue';

export const useTasksStore = defineStore('tasks', {
    state: () => ({
        tasks: [],
        loading: false,
        error: null,
        filters: {
            search: '',
            status: 'all',
            priority: 'all',
        },
        activeTab: 'all',
        comments: {}, // { [taskId]: [{id, author, text, date}] }
    }),
    getters: {
        totalTasks: (state) => state.tasks.length,
        pendingTasks: (state) => state.tasks.filter(t => t.status === 'pending'),
        inProgressTasks: (state) => state.tasks.filter(t => t.status === 'in-progress'),
        completedTasks: (state) => state.tasks.filter(t => t.status === 'completed'),
        filteredTasks: (state) => {
            let filtered = state.tasks;
            if (state.filters.status !== 'all') {
                filtered = filtered.filter(task => task.status === state.filters.status);
            }
            if (state.filters.priority !== 'all') {
                filtered = filtered.filter(task => task.priority === state.filters.priority);
            }
            if (state.filters.search) {
                const searchLower = state.filters.search.toLowerCase();
                filtered = filtered.filter(task =>
                    task.title.toLowerCase().includes(searchLower) ||
                    task.description.toLowerCase().includes(searchLower)
                );
            }
            if (state.activeTab !== 'all') {
                filtered = filtered.filter(task => task.status === state.activeTab);
            }
            return filtered;
        },
        getCommentsByTaskId: (state) => (taskId) => state.comments[taskId] || [],
    },
    actions: {
        async fetchTasks() {
            this.loading = true;
            try {
                // TODO: заменить на реальный API-запрос
                // const res = await fetch('/api/tasks');
                // this.tasks = await res.json();
                this.tasks = [];
                this.error = null;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async addTask(task) {
            // TODO: заменить на реальный API-запрос
            this.tasks.push(task);
        },
        async deleteTask(id) {
            this.tasks = this.tasks.filter(t => t.id !== id);
        },
        setFilter(key, value) {
            this.filters[key] = value;
        },
        clearFilters() {
            this.filters = { search: '', status: 'all', priority: 'all' };
        },
        setActiveTab(tab) {
            this.activeTab = tab;
        },
        addDemoTasks() {
            this.tasks = [{
                    id: 1,
                    title: 'Разведка местности',
                    description: 'Провести разведку в секторе А-1',
                    status: 'created',
                    priority: 'medium',
                    type: 'reconnaissance',
                    assignedTo: null,
                    dueDate: null,
                    location: 'Сектор А-1',
                },
                {
                    id: 2,
                    title: 'Назначить медика',
                    description: 'Назначить медика для группы Браво',
                    status: 'assigned',
                    priority: 'high',
                    type: 'medical',
                    assignedTo: { name: 'Иван Петров', avatar: '' },
                    dueDate: null,
                    location: 'База',
                },
                {
                    id: 3,
                    title: 'Штурм здания',
                    description: 'Начать штурм здания 12',
                    status: 'in-progress',
                    priority: 'critical',
                    type: 'combat',
                    assignedTo: { name: 'Мария Сидорова', avatar: '' },
                    dueDate: null,
                    location: 'Здание 12',
                },
                {
                    id: 4,
                    title: 'Проверка связи',
                    description: 'Провести тест радиосвязи',
                    status: 'review',
                    priority: 'low',
                    type: 'communication',
                    assignedTo: { name: 'Алексей Козлов', avatar: '' },
                    dueDate: null,
                    location: 'Пункт связи',
                },
                {
                    id: 5,
                    title: 'Доставка боеприпасов',
                    description: 'Доставить боеприпасы на передовую',
                    status: 'completed',
                    priority: 'medium',
                    type: 'transport',
                    assignedTo: { name: 'Елена Воробьева', avatar: '' },
                    dueDate: null,
                    location: 'Передовая',
                },
                {
                    id: 6,
                    title: 'Ожидание приказа',
                    description: 'Ожидать дальнейших указаний',
                    status: 'on-hold',
                    priority: 'low',
                    type: 'support',
                    assignedTo: null,
                    dueDate: null,
                    location: 'Штаб',
                },
                {
                    id: 7,
                    title: 'Отмена операции',
                    description: 'Операция отменена по приказу штаба',
                    status: 'cancelled',
                    priority: 'critical',
                    type: 'combat',
                    assignedTo: null,
                    dueDate: null,
                    location: 'Сектор D',
                },
            ];
        },
        updateTaskStatus(id, newStatus) {
            const idx = this.tasks.findIndex(t => t.id === id);
            if (idx !== -1) {
                this.tasks[idx].status = newStatus;
            }
        },
        updateTask(updatedTask) {
            const idx = this.tasks.findIndex(t => t.id === updatedTask.id);
            if (idx !== -1) {
                this.tasks[idx] = {...this.tasks[idx], ...updatedTask };
            }
        },
        addComment(taskId, comment) {
            if (!this.comments[taskId]) {
                this.comments[taskId] = [];
            }
            this.comments[taskId].push({
                id: Date.now() + Math.random(),
                author: comment.author,
                text: comment.text,
                date: new Date().toISOString(),
            });
        },
        fetchComments(taskId) {
            // Здесь может быть запрос к API, сейчас просто возвращаем из state
            return this.comments[taskId] || [];
        },
        // Можно добавить updateTask и другие actions
    },
});