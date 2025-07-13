<template>
  <div class="page-container">
    <v-container>
      <!-- Заголовок и статистика -->
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6 flex-wrap">
            <h1 class="text-h4 text-on-surface mb-4">
              <v-icon class="me-3">mdi-clipboard-list</v-icon>
              Управление задачами
            </h1>
            <v-btn 
              color="accent" 
              variant="flat" 
              @click="showCreateDialog = true"
              class="d-flex justify-center align-center gap-2 d-block d-md-inline-flex w-100 w-md-auto mb-2 mb-md-0"
            >
              <v-icon class="me-2">mdi-plus</v-icon>
              Создать задачу
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Статистика -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="primary" class="text-center">
            <v-card-text>
              <div class="text-h4 font-weight-bold">{{ totalTasks }}</div>
              <div class="text-subtitle-1">Всего задач</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="warning" class="text-center">
            <v-card-text>
              <div class="text-h4 font-weight-bold">{{ pendingTasks }}</div>
              <div class="text-subtitle-1">В ожидании</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="info" class="text-center">
            <v-card-text>
              <div class="text-h4 font-weight-bold">{{ inProgressTasks }}</div>
              <div class="text-subtitle-1">В работе</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="success" class="text-center">
            <v-card-text>
              <div class="text-h4 font-weight-bold">{{ completedTasks }}</div>
              <div class="text-subtitle-1">Завершено</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Фильтры -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filters.status"
                    :items="statusOptions"
                    label="Статус"
                    clearable
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filters.priority"
                    :items="priorityOptions"
                    label="Приоритет"
                    clearable
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filters.assignedTo"
                    :items="assignedToOptions"
                    label="Назначено"
                    clearable
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filters.actionType"
                    :items="actionTypeOptions"
                    label="Тип действия"
                    clearable
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Список задач -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between text-on-surface">
              <span>Список задач</span>
              <v-chip-group>
                <v-chip 
                  v-for="status in ['all', 'pending', 'in-progress', 'completed']" 
                  :key="status"
                  :color="status === activeTab ? 'primary' : undefined"
                  variant="outlined"
                  @click="activeTab = status"
                >
                  {{ getStatusLabel(status) }}
                </v-chip>
              </v-chip-group>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="task in filteredTasks"
                  :key="task.id"
                  class="mb-3"
                >
                  <template #prepend>
                    <v-avatar :color="getStatusColor(task.status)" size="40">
                      <v-icon>{{ getActionIcon(task.actionType) }}</v-icon>
                    </v-avatar>
                  </template>
                  
                  <v-list-item-title class="d-flex align-center">
                    {{ task.title }}
                    <v-chip 
                      :color="getPriorityColor(task.priority)" 
                      size="small" 
                      class="ms-2"
                    >
                      {{ task.priority }}
                    </v-chip>
                  </v-list-item-title>
                  
                  <v-list-item-subtitle>
                    {{ task.description }}
                  </v-list-item-subtitle>
                  
                  <template #append>
                    <div class="d-flex align-center">
                      <v-avatar size="32" class="me-2">
                        <v-img :src="task.assignedTo?.avatar || ''" />
                        <v-icon v-if="!task.assignedTo?.avatar">mdi-account</v-icon>
                      </v-avatar>
                      <v-menu>
                        <template #activator="{ props }">
                          <v-btn icon v-bind="props">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item @click="editTask(task)">
                            <template #prepend>
                              <v-icon>mdi-pencil</v-icon>
                            </template>
                            <v-list-item-title>Редактировать</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="changeStatus(task, 'in-progress')" v-if="task.status === 'pending'">
                            <template #prepend>
                              <v-icon>mdi-play</v-icon>
                            </template>
                            <v-list-item-title>Начать работу</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="changeStatus(task, 'completed')" v-if="task.status === 'in-progress'">
                            <template #prepend>
                              <v-icon>mdi-check</v-icon>
                            </template>
                            <v-list-item-title>Завершить</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="deleteTask(task.id)" color="error">
                            <template #prepend>
                              <v-icon color="error">mdi-delete</v-icon>
                            </template>
                            <v-list-item-title>Удалить</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
              
              <div v-if="filteredTasks.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1">mdi-clipboard-off</v-icon>
                <div class="text-h6 text-grey mt-4">Задачи не найдены</div>
                <div class="text-body-2 text-grey">Попробуйте изменить фильтры или создать новую задачу</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Диалог создания/редактирования задачи -->
    <v-dialog v-model="showCreateDialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ editingTask ? 'Редактировать задачу' : 'Создать задачу' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="taskForm" v-model="isFormValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="taskForm.title"
                  label="Название задачи"
                  :rules="[rules.required]"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="taskForm.description"
                  label="Описание"
                  :rules="[rules.required]"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="taskForm.actionType"
                  :items="actionTypeOptions"
                  label="Тип действия"
                  :rules="[rules.required]"
                  variant="outlined"
                >
                  <template #selection="{ item }">
                    <v-icon class="me-2">{{ item.raw.icon }}</v-icon>
                    {{ item.raw.title }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="taskForm.priority"
                  :items="priorityOptions"
                  label="Приоритет"
                  :rules="[rules.required]"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="taskForm.assignedTo"
                  :items="assignedToOptions"
                  label="Назначить на"
                  variant="outlined"
                >
                  <template #selection="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar size="24" class="me-2">
                        <v-img :src="item.raw.avatar || ''" />
                        <v-icon v-if="!item.raw.avatar" size="16">mdi-account</v-icon>
                      </v-avatar>
                      {{ item.raw.name }}
                    </div>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="taskForm.status"
                  :items="statusOptions"
                  label="Статус"
                  :rules="[rules.required]"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="taskForm.location"
                  label="Локация"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="taskForm.estimatedTime"
                  label="Оценка времени (часы)"
                  type="number"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showCreateDialog = false">Отмена</v-btn>
          <v-btn 
            color="accent" 
            variant="flat" 
            @click="saveTask"
            :disabled="!isFormValid"
          >
            {{ editingTask ? 'Сохранить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProfileStore } from '../store/profile.js'
import { ranks } from '../data/ranks.js'
import { roles } from '../data/roles.js'
import { defaultSquads } from '../data/squads.js'

const profileStore = useProfileStore()

// Состояние
const showCreateDialog = ref(false)
const editingTask = ref(null)
const isFormValid = ref(false)
const activeTab = ref('all')

// Фильтры
const filters = ref({
  status: null,
  priority: null,
  assignedTo: null,
  actionType: null
})

// Форма задачи
const taskForm = ref({
  title: '',
  description: '',
  actionType: '',
  priority: 'medium',
  assignedTo: null,
  status: 'pending',
  location: '',
  estimatedTime: ''
})

// Правила валидации
const rules = {
  required: v => !!v || 'Это поле обязательно'
}

// Опции для селектов
const statusOptions = [
  { title: 'В ожидании', value: 'pending' },
  { title: 'В работе', value: 'in-progress' },
  { title: 'Завершено', value: 'completed' }
]

const priorityOptions = [
  { title: 'Низкий', value: 'low' },
  { title: 'Средний', value: 'medium' },
  { title: 'Высокий', value: 'high' },
  { title: 'Критический', value: 'critical' }
]

const actionTypeOptions = [
  { title: 'Оказать помощь', value: 'heal', icon: 'mdi-medical-bag' },
  { title: 'Эвакуировать', value: 'evac', icon: 'mdi-helicopter' },
  { title: 'Прикрыть', value: 'cover', icon: 'mdi-crosshairs' },
  { title: 'Устранить цель', value: 'eliminate', icon: 'mdi-target' },
  { title: 'Взломать', value: 'breach', icon: 'mdi-door' },
  { title: 'Штурмовать', value: 'storm', icon: 'mdi-shield' },
  { title: 'Подавить', value: 'suppress', icon: 'mdi-robot-industrial' },
  { title: 'Починить', value: 'repair', icon: 'mdi-tools' },
  { title: 'Развернуть оборудование', value: 'deploy', icon: 'mdi-radar' },
  { title: 'Отдать приказ', value: 'command', icon: 'mdi-account-group' },
  { title: 'Отметить цель', value: 'mark', icon: 'mdi-map-marker' },
  { title: 'Разведать', value: 'recon', icon: 'mdi-binoculars' },
  { title: 'Взорвать', value: 'blast', icon: 'mdi-bomb' },
  { title: 'Дымовая завеса', value: 'smoke', icon: 'mdi-smoke' }
]

// Моковые пользователи для назначения задач
const mockUsers = [
  { id: 1, name: 'Иван Иванов', avatar: '', rank: ranks[0], role: roles[0] },
  { id: 2, name: 'Петр Петров', avatar: '', rank: ranks[1], role: roles[1] },
  { id: 3, name: 'Сергей Сергеев', avatar: '', rank: ranks[2], role: roles[2] },
  { id: 4, name: 'Алексей Алексеев', avatar: '', rank: ranks[0], role: roles[3] }
]

const assignedToOptions = computed(() => {
  return mockUsers.map(user => ({
    title: `${user.name} (${user.rank.title} - ${user.role.title})`,
    value: user.id,
    name: user.name,
    avatar: user.avatar
  }))
})

// Моковые задачи
const tasks = ref([
  {
    id: 1,
    title: 'Эвакуировать раненого',
    description: 'Требуется эвакуация бойца с позиции Alpha-3',
    actionType: 'evac',
    priority: 'high',
    assignedTo: mockUsers[0],
    status: 'pending',
    location: 'Alpha-3',
    estimatedTime: 2,
    createdAt: new Date('2024-01-15T10:00:00')
  },
  {
    id: 2,
    title: 'Починить рацию',
    description: 'Неисправность связи в секторе Bravo',
    actionType: 'repair',
    priority: 'medium',
    assignedTo: mockUsers[3],
    status: 'in-progress',
    location: 'Bravo-1',
    estimatedTime: 1,
    createdAt: new Date('2024-01-15T09:30:00')
  },
  {
    id: 3,
    title: 'Разведать подходы',
    description: 'Разведка северного подхода к объекту',
    actionType: 'recon',
    priority: 'low',
    assignedTo: mockUsers[2],
    status: 'completed',
    location: 'North Approach',
    estimatedTime: 3,
    createdAt: new Date('2024-01-15T08:00:00')
  }
])

// Вычисляемые свойства
const totalTasks = computed(() => tasks.value.length)
const pendingTasks = computed(() => tasks.value.filter(t => t.status === 'pending').length)
const inProgressTasks = computed(() => tasks.value.filter(t => t.status === 'in-progress').length)
const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed').length)

const filteredTasks = computed(() => {
  let filtered = tasks.value

  // Фильтр по активной вкладке
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(task => task.status === activeTab.value)
  }

  // Фильтры
  if (filters.value.status) {
    filtered = filtered.filter(task => task.status === filters.value.status)
  }
  if (filters.value.priority) {
    filtered = filtered.filter(task => task.priority === filters.value.priority)
  }
  if (filters.value.assignedTo) {
    filtered = filtered.filter(task => task.assignedTo?.id === filters.value.assignedTo)
  }
  if (filters.value.actionType) {
    filtered = filtered.filter(task => task.actionType === filters.value.actionType)
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Методы
function getStatusLabel(status) {
  const labels = {
    'all': 'Все',
    'pending': 'В ожидании',
    'in-progress': 'В работе',
    'completed': 'Завершено'
  }
  return labels[status] || status
}

function getStatusColor(status) {
  const colors = {
    'pending': 'warning',
    'in-progress': 'info',
    'completed': 'success'
  }
  return colors[status] || 'grey'
}

function getPriorityColor(priority) {
  const colors = {
    'low': 'success',
    'medium': 'info',
    'high': 'warning',
    'critical': 'error'
  }
  return colors[priority] || 'grey'
}

function getActionIcon(actionType) {
  const action = actionTypeOptions.find(a => a.value === actionType)
  return action?.icon || 'mdi-help'
}

function resetTaskForm() {
  taskForm.value = {
    title: '',
    description: '',
    actionType: '',
    priority: 'medium',
    assignedTo: null,
    status: 'pending',
    location: '',
    estimatedTime: ''
  }
  editingTask.value = null
}

function editTask(task) {
  editingTask.value = task
  taskForm.value = { ...task }
  showCreateDialog.value = true
}

function saveTask() {
  if (editingTask.value) {
    // Обновляем существующую задачу
    const index = tasks.value.findIndex(t => t.id === editingTask.value.id)
    if (index !== -1) {
      tasks.value[index] = { ...editingTask.value, ...taskForm.value }
    }
  } else {
    // Создаем новую задачу
    const newTask = {
      id: Date.now(),
      ...taskForm.value,
      assignedTo: mockUsers.find(u => u.id === taskForm.value.assignedTo),
      createdAt: new Date()
    }
    tasks.value.unshift(newTask)
  }
  
  showCreateDialog.value = false
  resetTaskForm()
}

function changeStatus(task, newStatus) {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value[index].status = newStatus
  }
}

function deleteTask(taskId) {
  const index = tasks.value.findIndex(t => t.id === taskId)
  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
}

// Инициализация
onMounted(() => {
  // Загружаем задачи из localStorage если есть
  const savedTasks = localStorage.getItem('tasks')
  if (savedTasks) {
    try {
      tasks.value = JSON.parse(savedTasks)
    } catch {
      // Если ошибка парсинга, используем моковые данные
    }
  }
})

// Сохраняем задачи в localStorage при изменении
watch(tasks, (newTasks) => {
  localStorage.setItem('tasks', JSON.stringify(newTasks))
}, { deep: true })
</script> 