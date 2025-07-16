<template>
  <v-card 
    class="task-card mb-3" 
    :class="{ 'task-card--mobile': $vuetify.display.smAndDown }"
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
            :color="getStatusColor(task.status)" 
            size="small" 
            class="me-2"
          >
            {{ getStatusIcon(task.status) }}
          </v-icon>
          <span class="text-caption">{{ getStatusLabel(task.status) }}</span>
        </div>

        <!-- Назначенный -->
        <div v-if="task.assignedTo" class="d-flex align-center mb-2">
          <v-avatar size="24" class="me-2">
            <v-img :src="task.assignedTo.avatar" />
            <v-icon v-if="!task.assignedTo.avatar" size="small">mdi-account</v-icon>
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
      <div v-if="!$vuetify.display.smAndDown" class="task-actions mt-3">
        <v-btn 
          v-if="task.status === 'pending'"
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
          color="error" 
          variant="outlined" 
          size="small"
          @click.stop="deleteTask"
        >
          Удалить
        </v-btn>
      </div>
    </v-card-text>

    <!-- Мобильные действия (swipe) -->
    <div v-if="$vuetify.display.smAndDown" class="task-swipe-actions">
      <v-btn 
        v-if="task.status === 'pending'"
        color="primary" 
        variant="flat"
        @click="startTask"
      >
        Начать
      </v-btn>
      <v-btn 
        v-if="task.status === 'in-progress'"
        color="success" 
        variant="flat"
        @click="completeTask"
      >
        Завершить
      </v-btn>
      <v-btn 
        color="error" 
        variant="flat"
        @click="deleteTask"
      >
        Удалить
      </v-btn>
    </div>
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
  formatDate
} from '../../utils/taskUtils.js'
import '../../styles/TaskCard.module.scss'

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
  tasksStore.changeTaskStatus(props.task.id, 'in-progress')
  emit('status-change', { taskId: props.task.id, status: 'in-progress' })
}
const completeTask = () => {
  tasksStore.changeTaskStatus(props.task.id, 'completed')
  emit('status-change', { taskId: props.task.id, status: 'completed' })
}
const deleteTask = () => {
  if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
    tasksStore.deleteTask(props.task.id)
    emit('delete', props.task.id)
  }
}
</script> 