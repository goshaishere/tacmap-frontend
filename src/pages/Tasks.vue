<template>
  <div class="tasks-page">
    <v-container fluid class="pa-0 pa-md-4">
      <!-- Шапка Kanban -->
      <v-row>
        <v-col cols="12">
          <v-card class="kanban-header-card mb-6" color="surface" flat>
            <v-card-title class="d-flex align-center justify-space-between">
              <span class="text-h4 text-on-surface d-flex align-center mb-0">
                <v-icon class="me-3" color="accent">mdi-clipboard-list</v-icon>
                Управление задачами
              </span>
              <v-btn 
                color="accent" 
                variant="flat" 
                @click="showCreateDialog = true"
                prepend-icon="mdi-plus"
              >
                Создать задачу
              </v-btn>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <template v-if="isMobile">
        <div class="mobile-filter-row d-flex align-center mb-2">
          <v-slide-group
            class="task-mobile-filter"
            show-arrows
          >
            <v-slide-group-item value="all">
              <v-chip
                :variant="!mobileStatusFilter.length ? 'flat' : 'outlined'"
                color="primary"
                class="ma-1"
                @click="resetMobileStatusFilter"
              >
                Все
              </v-chip>
            </v-slide-group-item>
            <v-slide-group-item
              v-for="col in statusColumns"
              :key="col.status"
              :value="col.status"
            >
              <v-chip
                :color="col.color"
                :variant="mobileStatusFilter.includes(col.status) ? 'flat' : 'outlined'"
                class="ma-1"
                @click="toggleMobileStatusFilter(col.status)"
              >
                {{ col.label }}
              </v-chip>
            </v-slide-group-item>
          </v-slide-group>
          <v-btn
            v-if="mobileStatusFilter.length"
            icon
            size="small"
            color="accent"
            variant="outlined"
            class="filter-clear-x-outer ms-2"
            style="border-radius: 50%; border-width: 1.5px;"
            @click="resetMobileStatusFilter"
          >
            <v-icon color="accent">mdi-close</v-icon>
          </v-btn>
        </div>
        <v-list class="task-list-mobile">
          <TaskCard
            v-for="task in filteredMobileTasks"
            :key="task.id"
            :task="task"
            class="mb-4"
            @click="openTaskDetails(task)"
            @delete="deleteTask"
            @action="handleTaskAction"
          />
        </v-list>
      </template>
      <template v-else>
        <div class="kanban-board-horizontal">
          <div class="kanban-board-row">
            <div
              v-for="col in statusColumns"
              :key="col.status"
              class="kanban-column-horizontal"
            >
              <v-card class="themed-kanban" color="surface" flat>
                <div class="d-flex align-center mb-4 pa-4 pb-2 kanban-card-header">
                  <v-icon :color="col.color" class="me-2">mdi-checkbox-blank-circle</v-icon>
                  <span class="text-h6 text-on-surface">{{ col.label }}</span>
                </div>
                <div class="kanban-tasks pa-2">
                  <draggable
                    :list="tasksByStatus(col.status)"
                    group="tasks-kanban"
                    item-key="id"
                    @change="evt => onTaskDrop(evt, col.status)"
                    :move="() => true"
                  >
                    <template #item="{ element }">
                      <TaskCard
                        :task="element"
                        @click="openTaskDetails(element)"
                        @delete="deleteTask"
                        @action="handleTaskAction"
                      />
                    </template>
                  </draggable>
                  <div v-if="tasksByStatus(col.status).length === 0" class="empty-state text-center pa-4 text-medium-emphasis">
                    <span class="text-body-2">Нет задач</span>
                  </div>
                </div>
              </v-card>
            </div>
          </div>
        </div>
      </template>
      <TaskForm
        v-model="showCreateDialog"
        :task="editingTask"
        @saved="handleTaskSaved"
        @cancelled="handleTaskCancelled"
      />
      <v-dialog v-model="showTaskDetails" max-width="600px">
        <v-card v-if="selectedTask" class="task-details-card">
          <v-card-title class="d-flex align-center justify-space-between pa-4">
            <span class="text-h6">{{ selectedTask.title }}</span>
            <v-btn icon @click="showTaskDetails = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-4">
            <p class="text-body-1 mb-4">{{ selectedTask.description }}</p>
            <div class="task-details-meta mb-4">
              <div class="d-flex align-center mb-2">
                <v-chip :color="getStatusColor(selectedTask.status)" size="small" class="me-2">
                  {{ getStatusLabel(selectedTask.status) }}
                </v-chip>
                <span>{{ selectedTask.assignedTo ? selectedTask.assignedTo.name : 'Не назначена' }}</span>
              </div>
              <div v-if="selectedTask.dueDate" class="d-flex align-center mb-2">
                <v-icon size="small" color="grey" class="me-2">mdi-calendar</v-icon>
                <span>{{ selectedTask.dueDate }}</span>
              </div>
              <div v-if="selectedTask.location" class="d-flex align-center">
                <v-icon size="small" color="grey" class="me-2">mdi-map-marker</v-icon>
                <span>{{ selectedTask.location }}</span>
              </div>
            </div>
            <!-- Комментарии -->
            <div class="task-comments mb-2">
              <h4 class="text-subtitle-1 mb-2">Комментарии</h4>
              <div v-if="comments.length === 0" class="text-body-2 text-medium-emphasis mb-2">Нет комментариев</div>
              <div v-for="comment in comments" :key="comment.id" class="comment mb-2 pa-2" style="background:#f5f5f5;border-radius:6px;">
                <div class="d-flex align-center mb-1">
                  <span class="font-weight-bold me-2">{{ comment.author }}</span>
                  <span class="text-caption text-grey">{{ formatCommentDate(comment.date) }}</span>
                </div>
                <div>{{ comment.text }}</div>
              </div>
              <v-textarea
                v-model="newCommentText"
                label="Добавить комментарий"
                auto-grow
                rows="2"
                class="mb-2"
              />
              <v-btn color="primary" @click="addComment" :disabled="!newCommentText.trim()">Отправить</v-btn>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn variant="outlined" @click="editTask(selectedTask)" class="me-2">Редактировать</v-btn>
            <v-btn color="error" variant="outlined" @click="deleteTask(selectedTask.id)">Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useTasksStore } from '../store/tasks.js'
import TaskCard from '../components/tasks/TaskCard.vue'
import TaskForm from '../components/tasks/TaskForm.vue'
import draggable from 'vuedraggable'
import '../styles/TasksPage.module.scss'
import { getStatusColor, getStatusLabel } from '../utils/taskUtils.js'

const tasksStore = useTasksStore()
const display = useDisplay()
const isMobile = computed(() => display.smAndDown.value)
const allTasks = computed(() => tasksStore.tasks)

onMounted(() => {
  if (tasksStore.tasks.length === 0) {
    tasksStore.addDemoTasks()
  }
})

const showCreateDialog = ref(false)
const showTaskDetails = ref(false)
const editingTask = ref(null)
const selectedTask = ref(null)
const newCommentText = ref('')

const statusColumns = [
  { status: 'created', label: 'Создана', color: 'warning' },
  { status: 'assigned', label: 'Назначена', color: 'info' },
  { status: 'in-progress', label: 'В работе', color: 'primary' },
  { status: 'review', label: 'На проверке', color: 'purple' },
  { status: 'completed', label: 'Завершена', color: 'success' },
  { status: 'on-hold', label: 'Пауза', color: 'grey' },
  { status: 'cancelled', label: 'Отменена', color: 'error' },
]

const tasksByStatus = (status) => tasksStore.tasks.filter(t => t.status === status)

const onTaskDrop = (evt, newStatus) => {
  if (evt.added && evt.added.element && evt.added.element.status !== newStatus) {
    tasksStore.updateTaskStatus(evt.added.element.id, newStatus)
  }
}

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
  if (taskData.id) {
    tasksStore.updateTask(taskData)
  } else {
    tasksStore.addTask({
      ...taskData,
      id: Date.now() + Math.random(),
    })
  }
  editingTask.value = null
  showCreateDialog.value = false
}
const handleTaskCancelled = () => {
  editingTask.value = null
  showCreateDialog.value = false
}

const comments = computed(() => selectedTask.value ? tasksStore.getCommentsByTaskId(selectedTask.value.id) : [])
const addComment = () => {
  if (!selectedTask.value || !newCommentText.value.trim()) return
  tasksStore.addComment(selectedTask.value.id, {
    author: 'Вы',
    text: newCommentText.value.trim(),
  })
  newCommentText.value = ''
}
const formatCommentDate = (date) => {
  const d = new Date(date)
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const handleTaskAction = ({ taskId, action }) => {
  // Здесь логика переходов и действий по пайплайну (assign, start, complete, review, return, cancel, hold, resume, delete)
  tasksStore.handleTaskAction(taskId, action)
}

const mobileStatusFilter = ref([])
const toggleMobileStatusFilter = (status) => {
  if (mobileStatusFilter.value.includes(status)) {
    mobileStatusFilter.value = mobileStatusFilter.value.filter(s => s !== status)
  } else {
    mobileStatusFilter.value.push(status)
  }
}
const resetMobileStatusFilter = () => {
  mobileStatusFilter.value = []
}
const filteredMobileTasks = computed(() => {
  if (!mobileStatusFilter.value.length) return allTasks.value
  return allTasks.value.filter(t => mobileStatusFilter.value.includes(t.status))
})

</script> 

<style scoped>
.kanban-board-horizontal {
  overflow-x: auto;
  padding-bottom: 12px;
}
.kanban-board-row {
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
}
.kanban-column-horizontal {
  flex: 1 1 0%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
}
@media (max-width: 1200px) {
  .kanban-board-row {
    gap: 8px;
  }
  .kanban-column-horizontal {
    max-width: 260px;
  }
}
.task-list-mobile {
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
@media (max-width: 768px) {
  .tasks-page {
    overflow-x: hidden;
  }
}
.task-mobile-filter {
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
  margin-left: -16px;
  padding-left: 8px;
  padding-right: 8px;
}
.filter-clear-x {
  margin-left: 4px;
  display: flex;
  align-items: center;
}
.mobile-filter-row {
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
  margin-left: -16px;
  padding-left: 8px;
  padding-right: 8px;
  position: relative;
}
.filter-clear-x-outer {
  margin-left: 8px;
  flex-shrink: 0;
}
</style> 