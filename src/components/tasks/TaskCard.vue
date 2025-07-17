<template>
  <v-card 
    class="task-card mb-3" 
    flat
    @click="handleCardClick"
  >
    <v-card-text class="pa-4">
      <!-- Заголовок и приоритет -->
      <div class="d-flex align-center justify-space-between mb-3">
        <h3 class="text-h6 font-weight-medium task-title">
          {{ task.title }}
        </h3>
        <v-chip 
          :color="getPriorityColor(task.priority)" 
          size="small"
          class="priority-chip"
        >
          {{ getPriorityLabel(task.priority) }}
        </v-chip>
      </div>

      <!-- Описание -->
      <p class="text-body-2 text-medium-emphasis mb-3 task-description">
        {{ task.shortDescription || task.description }}
      </p>

      <!-- Мета-информация -->
      <div class="task-meta">
        <!-- Статус -->
        <div class="d-flex align-center mb-2">
          <v-icon 
            :color="getStatusIconColor(task.status)" 
            size="small" 
            class="me-2"
          >
            {{ getStatusIcon(task.status) }}
          </v-icon>
          <span class="text-caption">{{ getStatusLabel(task.status) }}</span>
        </div>

        <!-- Назначенный -->
        <div v-if="task.assignedTo" class="mb-2 task-avatar-row">
          <v-avatar size="24" class="me-2 task-avatar-wrap">
            <template v-if="task.assignedTo.avatar">
              <v-img :src="task.assignedTo.avatar" />
            </template>
            <template v-else>
              <v-icon size="small">mdi-account</v-icon>
            </template>
          </v-avatar>
          <span class="text-caption">{{ task.assignedTo.name }}</span>
        </div>

        <!-- Дата -->
        <div v-if="task.dueDate" class="d-flex align-center mb-2">
          <v-icon size="small" color="grey" class="me-2">mdi-calendar</v-icon>
          <span class="text-caption">{{ formatDate(task.dueDate) }}</span>
        </div>

        <!-- Локация -->
        <div v-if="task.location" class="d-flex align-center">
          <v-icon size="small" color="grey" class="me-2">mdi-map-marker</v-icon>
          <span class="text-caption">{{ task.location }}</span>
        </div>
      </div>

      <!-- Действия (только на десктопе) -->
      <div v-if="!$vuetify.display.smAndDown" class="task-actions mt-3 task-card-footer">
        <v-btn 
          v-if="task.status === 'created'"
          color="accent" 
          variant="outlined" 
          size="small"
          @click.stop="openAssignDialog"
        >
          Назначить
        </v-btn>
        <v-btn 
          v-if="task.status === 'assigned'"
          color="primary" 
          variant="outlined" 
          size="small"
          @click.stop="startTask"
        >
          Начать
        </v-btn>
        <v-btn 
          v-if="task.status === 'in-progress'"
          color="success" 
          variant="outlined" 
          size="small"
          @click.stop="completeTask"
        >
          Завершить
        </v-btn>
        <v-btn 
          v-if="task.status === 'review'"
          color="success" 
          variant="outlined" 
          size="small"
          @click.stop="acceptTask"
        >
          Принять
        </v-btn>
        <v-btn 
          v-if="task.status === 'review'"
          color="warning" 
          variant="outlined" 
          size="small"
          @click.stop="returnTask"
        >
          Вернуть
        </v-btn>
        <v-btn 
          color="error" 
          variant="outlined" 
          size="small"
          @click.stop="deleteTask"
        >
          Удалить
        </v-btn>
      </div>
      <!-- Мобильные действия (swipe) -->
      <div v-if="$vuetify.display.smAndDown" class="task-swipe-actions task-card-footer pa-2">
        <v-btn 
          v-if="task.status === 'created'"
          color="accent" 
          variant="flat"
          @click.stop="openAssignDialog"
        >
          Назначить
        </v-btn>
        <v-btn 
          v-if="task.status === 'assigned'"
          color="primary" 
          variant="flat"
          @click.stop="startTask"
        >
          Начать
        </v-btn>
        <v-btn 
          v-if="task.status === 'in-progress'"
          color="success" 
          variant="flat"
          @click.stop="completeTask"
        >
          Завершить
        </v-btn>
        <v-btn 
          v-if="task.status === 'review'"
          color="success" 
          variant="flat"
          @click.stop="acceptTask"
        >
          Принять
        </v-btn>
        <v-btn 
          v-if="task.status === 'review'"
          color="warning" 
          variant="flat"
          @click.stop="returnTask"
        >
          Вернуть
        </v-btn>
        <v-btn 
          color="error" 
          variant="flat"
          @click.stop="deleteTask"
        >
          Удалить
        </v-btn>
      </div>
      <!-- Диалог назначения -->
      <v-dialog v-model="assignDialog" max-width="340px">
        <v-card>
          <v-card-title class="text-h6">Назначить исполнителя</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedUser"
              :items="userOptions"
              label="Выберите пользователя"
              item-title="title"
              item-value="value"
              return-object
              variant="outlined"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="assignDialog = false">Отмена</v-btn>
            <v-btn color="accent" variant="flat" :disabled="!selectedUser" @click="assignTask">Назначить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useTasksStore } from '../../store/tasks.js'
import {
  getPriorityColor,
  getPriorityLabel,
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  formatDate,
  getStatusIconColor
} from '../../utils/taskUtils.js'
import '../../styles/TaskCard.module.scss'
import { ref } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'edit', 'delete', 'status-change'])
const tasksStore = useTasksStore()

const handleCardClick = () => emit('click', props.task)
const startTask = () => {
  tasksStore.updateTaskStatus(props.task.id, 'in-progress')
  emit('status-change', { taskId: props.task.id, status: 'in-progress' })
}
const completeTask = () => {
  tasksStore.updateTaskStatus(props.task.id, 'review')
  emit('status-change', { taskId: props.task.id, status: 'review' })
}
const deleteTask = () => {
  if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
    tasksStore.deleteTask(props.task.id)
    emit('delete', props.task.id)
  }
}

const assignDialog = ref(false)
const selectedUser = ref(null)
const userOptions = [
  { title: 'Иван Петров', value: { name: 'Иван Петров', avatar: '' } },
  { title: 'Мария Сидорова', value: { name: 'Мария Сидорова', avatar: '' } },
  { title: 'Алексей Козлов', value: { name: 'Алексей Козлов', avatar: '' } },
  { title: 'Елена Воробьева', value: { name: 'Елена Воробьева', avatar: '' } },
]

const openAssignDialog = () => {
  assignDialog.value = true
  selectedUser.value = null
}
const assignTask = () => {
  if (!selectedUser.value) return
  tasksStore.updateTask({
    ...props.task,
    assignedTo: selectedUser.value,
    status: 'assigned',
  })
  assignDialog.value = false
}
const acceptTask = () => {
  tasksStore.updateTaskStatus(props.task.id, 'completed')
  emit('status-change', { taskId: props.task.id, status: 'completed' })
}
const returnTask = () => {
  tasksStore.updateTaskStatus(props.task.id, 'assigned')
  emit('status-change', { taskId: props.task.id, status: 'assigned' })
}
</script> 

<style scoped>
.task-avatar-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.task-avatar-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  max-width: 24px;
  min-height: 24px;
  max-height: 24px;
  margin-right: 6px;
}
.task-avatar-row .text-caption {
  display: flex;
  align-items: center;
  height: 24px;
  line-height: 24px;
}
.task-actions,
.task-swipe-actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}
</style> 