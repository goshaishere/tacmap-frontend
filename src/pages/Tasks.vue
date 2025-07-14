<template>
  <div class="tasks-page">
    <!-- Мобильный заголовок -->
    <div v-if="$vuetify.display.smAndDown" class="mobile-header">
      <v-app-bar flat color="surface" class="px-4">
        <v-app-bar-title class="text-h6">
          <v-icon class="me-2">mdi-clipboard-list</v-icon>
          Задачи
        </v-app-bar-title>
        <template #append>
          <v-btn icon @click="showCreateDialog = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn icon @click="showFilters = !showFilters">
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </template>
      </v-app-bar>
    </div>

    <!-- Десктопный заголовок -->
    <div v-else class="desktop-header pa-4">
          <div class="d-flex align-center justify-space-between mb-6">
        <h1 class="text-h4 text-on-surface">
              <v-icon class="me-3">mdi-clipboard-list</v-icon>
              Управление задачами
            </h1>
            <v-btn 
          color="primary" 
              variant="flat" 
          @click="showCreateDialog = true"
              prepend-icon="mdi-plus"
            >
              Создать задачу
            </v-btn>
          </div>
    </div>

      <!-- Статистика -->
    <div class="stats-section pa-4">
      <v-row>
        <v-col cols="6" md="3">
          <v-card color="primary" class="text-center stats-card">
            <v-card-text class="pa-3">
              <div class="text-h4 font-weight-bold">{{ tasksStore.totalTasks }}</div>
              <div class="text-subtitle-2">Всего задач</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="warning" class="text-center stats-card">
            <v-card-text class="pa-3">
              <div class="text-h4 font-weight-bold">{{ tasksStore.pendingTasks.length }}</div>
              <div class="text-subtitle-2">В ожидании</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="info" class="text-center stats-card">
            <v-card-text class="pa-3">
              <div class="text-h4 font-weight-bold">{{ tasksStore.inProgressTasks.length }}</div>
              <div class="text-subtitle-2">В работе</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="success" class="text-center stats-card">
            <v-card-text class="pa-3">
              <div class="text-h4 font-weight-bold">{{ tasksStore.completedTasks.length }}</div>
              <div class="text-subtitle-2">Завершено</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Мобильные фильтры -->
    <div v-if="$vuetify.display.smAndDown && showFilters" class="mobile-filters pa-4">
          <v-card>
            <v-card-text>
          <v-text-field
            v-model="tasksStore.filters.search"
            label="Поиск задач"
            placeholder="Поиск по названию или описанию"
            variant="outlined"
            prepend-icon="mdi-magnify"
            clearable
            class="mb-3"
          />
                  <v-select
            v-model="tasksStore.filters.status"
                    :items="statusOptions"
                    label="Статус"
                    clearable
                    variant="outlined"
            class="mb-3"
          />
                  <v-select
            v-model="tasksStore.filters.priority"
                    :items="priorityOptions"
                    label="Приоритет"
                    clearable
                    variant="outlined"
            class="mb-3"
          />
          <v-btn 
            variant="outlined" 
            @click="clearFilters"
            block
          >
            Очистить фильтры
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <!-- Десктопные фильтры -->
    <div v-if="!$vuetify.display.smAndDown" class="desktop-filters pa-4">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="tasksStore.filters.search"
                label="Поиск задач"
                placeholder="Поиск по названию или описанию"
                variant="outlined"
                prepend-icon="mdi-magnify"
                clearable
              />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                v-model="tasksStore.filters.status"
                :items="statusOptions"
                label="Статус"
                    clearable
                    variant="outlined"
              />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                v-model="tasksStore.filters.priority"
                :items="priorityOptions"
                label="Приоритет"
                    clearable
                    variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn 
                variant="outlined" 
                @click="clearFilters"
                block
              >
                Очистить фильтры
              </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
    </div>

    <!-- Вкладки (только на десктопе) -->
    <div v-if="!$vuetify.display.smAndDown" class="tabs-section pa-4">
          <v-card>
        <v-card-text>
              <v-chip-group>
                <v-chip 
                  v-for="status in ['all', 'pending', 'in-progress', 'completed']" 
                  :key="status"
              :color="activeTab === status ? 'primary' : undefined"
                  variant="outlined"
                  @click="activeTab = status"
                >
                  {{ getStatusLabel(status) }}
                </v-chip>
              </v-chip-group>
        </v-card-text>
      </v-card>
    </div>

    <!-- Список задач -->
    <div class="tasks-list pa-4">
      <!-- Мобильный список -->
      <div v-if="$vuetify.display.smAndDown" class="mobile-tasks">
        <TaskCard
          v-for="task in mobileTasks"
          :key="task.id"
          :task="task"
          @click="openTaskDetails(task)"
          @delete="handleTaskDelete"
          @status-change="handleStatusChange"
        />
        
        <!-- Пустое состояние -->
        <div v-if="mobileTasks.length === 0" class="empty-state text-center pa-8">
          <v-icon size="64" color="grey-lighten-1">mdi-clipboard-off</v-icon>
          <h3 class="text-h6 mt-4">Нет задач</h3>
          <p class="text-body-2 text-medium-emphasis">
            Создайте первую задачу, нажав на кнопку "+"
          </p>
        </div>
      </div>

      <!-- Десктопный список -->
      <div v-else class="desktop-tasks">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span>Список задач ({{ filteredTasks.length }})</span>
            <v-btn 
              color="primary" 
              variant="outlined" 
              size="small"
              @click="showCreateDialog = true"
            >
              <v-icon class="me-2">mdi-plus</v-icon>
              Добавить
            </v-btn>
            </v-card-title>
            <v-card-text>
            <TaskCard
                  v-for="task in filteredTasks"
                  :key="task.id"
              :task="task"
              @click="openTaskDetails(task)"
              @delete="handleTaskDelete"
              @status-change="handleStatusChange"
            />
            
            <!-- Пустое состояние -->
            <div v-if="filteredTasks.length === 0" class="empty-state text-center pa-8">
                <v-icon size="64" color="grey-lighten-1">mdi-clipboard-off</v-icon>
              <h3 class="text-h6 mt-4">Нет задач</h3>
              <p class="text-body-2 text-medium-emphasis">
                Создайте первую задачу, нажав на кнопку "Добавить"
              </p>
              </div>
            </v-card-text>
          </v-card>
      </div>
    </div>

    <!-- Диалог создания/редактирования задачи -->
    <TaskForm
      v-model="showCreateDialog"
      :task="editingTask"
      @saved="handleTaskSaved"
      @cancelled="handleTaskCancelled"
    />

    <!-- Диалог деталей задачи (мобильный) -->
    <v-dialog
      v-model="showTaskDetails"
      :fullscreen="$vuetify.display.smAndDown"
      :max-width="$vuetify.display.smAndDown ? '100%' : '600px'"
    >
      <v-card v-if="selectedTask" class="task-details-card">
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span class="text-h6">{{ selectedTask.title }}</span>
          <v-btn icon @click="showTaskDetails = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-4">
          <p class="text-body-1 mb-4">{{ selectedTask.description }}</p>
          
          <div class="task-details-meta">
            <div class="d-flex align-center mb-2">
              <v-icon :color="getStatusColor(selectedTask.status)" class="me-2">
                {{ getStatusIcon(selectedTask.status) }}
              </v-icon>
              <span>{{ getStatusLabel(selectedTask.status) }}</span>
            </div>
            
            <div class="d-flex align-center mb-2">
              <v-chip :color="getPriorityColor(selectedTask.priority)" size="small" class="me-2">
                {{ getPriorityLabel(selectedTask.priority) }}
              </v-chip>
            </div>
            
            <div v-if="selectedTask.assignedTo" class="d-flex align-center mb-2">
                      <v-avatar size="24" class="me-2">
                <v-img :src="selectedTask.assignedTo.avatar" />
                <v-icon v-if="!selectedTask.assignedTo.avatar" size="small">mdi-account</v-icon>
                      </v-avatar>
              <span>{{ selectedTask.assignedTo.name }}</span>
            </div>
            
            <div v-if="selectedTask.dueDate" class="d-flex align-center mb-2">
              <v-icon size="small" color="grey" class="me-2">mdi-calendar</v-icon>
              <span>{{ formatDate(selectedTask.dueDate) }}</span>
            </div>
            
            <div v-if="selectedTask.location" class="d-flex align-center">
              <v-icon size="small" color="grey" class="me-2">mdi-map-marker</v-icon>
              <span>{{ selectedTask.location }}</span>
            </div>
                    </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn 
            variant="outlined" 
            @click="editTask(selectedTask)"
            class="me-2"
          >
            Редактировать
          </v-btn>
          <v-btn 
            color="error" 
            variant="outlined"
            @click="deleteTask(selectedTask.id)"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '../store/tasks.js'
import TaskCard from '../components/tasks/TaskCard.vue'
import TaskForm from '../components/tasks/TaskForm.vue'

// Store
const tasksStore = useTasksStore()

// Состояние
const showCreateDialog = ref(false)
const showFilters = ref(false)
const showTaskDetails = ref(false)
const activeTab = ref('all')
const editingTask = ref(null)
const selectedTask = ref(null)

// Опции для фильтров
const statusOptions = [
  { title: 'Все', value: 'all' },
  { title: 'Ожидает', value: 'pending' },
  { title: 'В работе', value: 'in-progress' },
  { title: 'Завершено', value: 'completed' },
  { title: 'Отменено', value: 'cancelled' },
  { title: 'Приостановлено', value: 'on-hold' }
]

const priorityOptions = [
  { title: 'Все', value: 'all' },
  { title: 'Низкий', value: 'low' },
  { title: 'Средний', value: 'medium' },
  { title: 'Высокий', value: 'high' },
  { title: 'Критический', value: 'critical' }
]

// Вычисляемые свойства
const filteredTasks = computed(() => {
  let tasks = tasksStore.filteredTasks

  // Фильтр по активной вкладке
  if (activeTab.value !== 'all') {
    tasks = tasks.filter(task => task.status === activeTab.value)
  }

  return tasks
})

const mobileTasks = computed(() => {
  return tasksStore.getTasksForMobile()
})

// Методы
const clearFilters = () => {
  tasksStore.clearFilters()
}

const getStatusLabel = (status) => {
  const labels = {
    all: 'Все',
    pending: 'Ожидает',
    'in-progress': 'В работе',
    completed: 'Завершено',
    cancelled: 'Отменено',
    'on-hold': 'Приостановлено'
  }
  return labels[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    'in-progress': 'info',
    completed: 'success',
    cancelled: 'error',
    'on-hold': 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    pending: 'mdi-clock-outline',
    'in-progress': 'mdi-play-circle-outline',
    completed: 'mdi-check-circle-outline',
    cancelled: 'mdi-close-circle-outline',
    'on-hold': 'mdi-pause-circle-outline'
  }
  return icons[status] || 'mdi-help-circle-outline'
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'grey',
    medium: 'blue',
    high: 'orange',
    critical: 'red'
  }
  return colors[priority] || 'grey'
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический'
  }
  return labels[priority] || priority
}

const formatDate = (date) => {
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

// Обработчики событий
const openTaskDetails = (task) => {
  selectedTask.value = task
  showTaskDetails.value = true
}

const editTask = (task) => {
  editingTask.value = task
  showCreateDialog.value = true
  showTaskDetails.value = false
}

const deleteTask = (taskId) => {
  if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
    tasksStore.deleteTask(taskId)
    showTaskDetails.value = false
  }
}

const handleTaskSaved = (taskData) => {
  editingTask.value = null
  showCreateDialog.value = false
}

const handleTaskCancelled = () => {
  editingTask.value = null
  showCreateDialog.value = false
}

const handleTaskDelete = (taskId) => {
  tasksStore.deleteTask(taskId)
}

const handleStatusChange = ({ taskId, status }) => {
  tasksStore.changeTaskStatus(taskId, status)
}

// Инициализация
onMounted(() => {
  // Добавляем тестовые данные, если их нет
  if (tasksStore.tasks.length === 0) {
    const testTasks = [
      {
        title: 'Разведка местности',
        description: 'Провести разведку северного сектора для выявления позиций противника',
        type: 'reconnaissance',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        location: '55.751574, 37.573856'
      },
      {
        title: 'Эвакуация раненых',
        description: 'Организовать эвакуацию раненых из зоны боевых действий',
        type: 'medical',
        priority: 'critical',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        location: '55.7558, 37.6176'
      },
      {
        title: 'Доставка боеприпасов',
        description: 'Доставить боеприпасы на передовую позицию',
        type: 'transport',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: '55.7539, 37.6208'
      }
    ]
    
    testTasks.forEach(task => tasksStore.addTask(task))
  }
})
</script>

<style scoped>
.tasks-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-surface));
}

.mobile-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.stats-card {
  border-radius: 12px;
}

.mobile-filters {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline));
}

.desktop-filters {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline));
}

.tabs-section {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline));
}

.tasks-list {
  background: rgb(var(--v-theme-surface));
}

.mobile-tasks {
  padding-bottom: 80px; /* Место для FAB */
}

.desktop-tasks {
  background: rgb(var(--v-theme-surface));
  border-radius: 12px;
}

.task-details-card {
  border-radius: 12px;
}

.task-details-meta {
  border-top: 1px solid rgb(var(--v-theme-outline));
  padding-top: 16px;
}

.empty-state {
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Мобильные стили */
@media (max-width: 768px) {
  .stats-card {
    border-radius: 8px;
  }
  
  .mobile-tasks {
    padding: 0 16px 80px 16px;
  }
  
  .task-details-card {
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .task-details-card .v-card-text {
    flex: 1;
    overflow-y: auto;
  }
}
</style> 