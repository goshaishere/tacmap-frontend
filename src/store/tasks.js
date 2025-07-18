import { defineStore } from 'pinia';
import { useMapStore } from './map.js'
import demoMarkers from '../data/demoMarkers.js'

const mapStore = useMapStore();

export const useTasksStore = defineStore('tasks', {
    state: () => ({
        tasks: [{
                id: 1,
                title: 'Разведка местности',
                description: 'Провести разведку в секторе А-1',
                status: 'created',
                priority: 'medium',
                type: 'reconnaissance',
                assignedTo: null,
                dueDate: null,
                markers: [demoMarkers[0], demoMarkers[1]],
                comments: [{
                    id: 1,
                    author: 'Алексей',
                    text: 'Проверьте сектор на наличие мин.',
                    date: '2024-05-01T10:00:00Z',
                }]
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
                markers: [demoMarkers[2]],
                comments: [{
                    id: 2,
                    author: 'Сергей',
                    text: 'Медик должен быть на месте к 12:00.',
                    date: '2024-05-01T11:00:00Z',
                }]
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
                markers: [demoMarkers[3]],
                comments: [{
                    id: 3,
                    author: 'Дмитрий',
                    text: 'Ожидаем подкрепление перед началом штурма.',
                    date: '2024-05-01T12:00:00Z',
                }]
            }
        ],
        loading: false,
        error: null,
        filters: {
            search: '',
            status: 'all',
            priority: 'all',
        },
        activeTab: 'all',
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
        getCommentsByTaskId: (state) => (taskId) => {
            const task = state.tasks.find(t => t.id === taskId);
            return task ? task.comments : [];
        },
    },
    actions: {
        addComment(taskId, comment) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.comments.push({
                    id: Date.now() + Math.random(),
                    author: comment.author,
                    text: comment.text,
                    date: new Date().toISOString(),
                });
            }
        },
        fetchComments(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            return task ? task.comments : [];
        },
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
            // Пушим маркеры задачи на карту
            if (task.markers) {
                mapStore.pushTaskMarkers(task.markers);
            }
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
    },
});