<template>
  <v-dialog 
    v-model="dialog" 
    :fullscreen="$vuetify.display.smAndDown"
    :max-width="$vuetify.display.smAndDown ? '100%' : '600px'"
    persistent
  >
    <v-card class="task-form-card">
      <!-- Заголовок -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6">
          {{ isEditing ? 'Редактировать задачу' : 'Создать задачу' }}
        </span>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form ref="form" v-model="isValid">
          <!-- Название -->
          <v-text-field
            v-model="formData.title"
            label="Название задачи"
            placeholder="Введите название задачи"
            variant="outlined"
            :rules="[v => !!v || 'Название обязательно']"
            required
            class="mb-4"
          />

          <!-- Описание -->
          <v-textarea
            v-model="formData.description"
            label="Описание"
            placeholder="Подробное описание задачи"
            variant="outlined"
            :rows="$vuetify.display.smAndDown ? 3 : 4"
            auto-grow
            class="mb-4"
          />

          <!-- Тип задачи -->
          <v-select
            v-model="formData.type"
            :items="taskTypeOptions"
            label="Тип задачи"
            variant="outlined"
            class="mb-4"
          />

          <!-- Приоритет -->
          <v-select
            v-model="formData.priority"
            :items="priorityOptions"
            label="Приоритет"
            variant="outlined"
            class="mb-4"
          />

          <!-- Назначенный -->
          <v-select
            v-model="formData.assignedTo"
            :items="assignedToOptions"
            label="Назначить"
            variant="outlined"
            clearable
            class="mb-4"
          />

          <!-- Дата выполнения -->
          <v-text-field
            v-model="formData.dueDate"
            label="Дата выполнения"
            type="datetime-local"
            variant="outlined"
            class="mb-4"
          />

          <!-- Локация -->
          <v-text-field
            v-model="formData.location"
            label="Локация"
            placeholder="Координаты или адрес"
            variant="outlined"
            class="mb-4"
            prepend-icon="mdi-map-marker"
          />

          <!-- Дополнительные поля -->
          <v-expand-transition>
            <div v-if="showAdvanced">
              <!-- Теги -->
              <v-combobox
                v-model="formData.tags"
                :items="availableTags"
                label="Теги"
                variant="outlined"
                multiple
                chips
                class="mb-4"
              />

              <!-- Зависимости -->
              <v-select
                v-model="formData.dependencies"
                :items="availableTasks"
                label="Зависимости"
                variant="outlined"
                multiple
                chips
                class="mb-4"
              />

              <!-- Файлы -->
              <v-file-input
                v-model="formData.attachments"
                label="Вложения"
                variant="outlined"
                multiple
                prepend-icon="mdi-paperclip"
                class="mb-4"
              />
            </div>
          </v-expand-transition>

          <!-- Кнопка расширенных настроек -->
          <v-btn
            variant="text"
            @click="showAdvanced = !showAdvanced"
            class="mb-4"
          >
            <v-icon class="me-2">
              {{ showAdvanced ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
            {{ showAdvanced ? 'Скрыть' : 'Расширенные настройки' }}
          </v-btn>
        </v-form>
      </v-card-text>

      <!-- Действия -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="closeDialog"
          class="me-2"
        >
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!isValid"
          @click="saveTask"
        >
          {{ isEditing ? 'Сохранить' : 'Создать' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useTasksStore } from '../../store/tasks.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved', 'cancelled'])

const tasksStore = useTasksStore()

// Состояние
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref(null)
const isValid = ref(false)
const loading = ref(false)
const showAdvanced = ref(false)

// Форма
const formData = reactive({
  title: '',
  description: '',
  type: 'support',
  priority: 'medium',
  assignedTo: null,
  dueDate: '',
  location: '',
  tags: [],
  dependencies: [],
  attachments: []
})

// Опции для селектов
const taskTypeOptions = [
  { title: 'Разведка', value: 'reconnaissance' },
  { title: 'Боевая задача', value: 'combat' },
  { title: 'Поддержка', value: 'support' },
  { title: 'Медицинская', value: 'medical' },
  { title: 'Транспорт', value: 'transport' },
  { title: 'Связь', value: 'communication' }
]

const priorityOptions = [
  { title: 'Низкий', value: 'low' },
  { title: 'Средний', value: 'medium' },
  { title: 'Высокий', value: 'high' },
  { title: 'Критический', value: 'critical' }
]

const assignedToOptions = [
  { title: 'Иван Петров', value: 'user1' },
  { title: 'Мария Сидорова', value: 'user2' },
  { title: 'Алексей Козлов', value: 'user3' },
  { title: 'Елена Воробьева', value: 'user4' }
]

const availableTags = [
  'Срочно', 'Важно', 'Проверка', 'Документация', 'Тестирование'
]

const availableTasks = computed(() => {
  return tasksStore.tasks.map(task => ({
    title: task.title,
    value: task.id
  }))
})

// Вычисляемые свойства
const isEditing = computed(() => !!props.task)

// Методы
const resetForm = () => {
  Object.assign(formData, {
    title: '',
    description: '',
    type: 'support',
    priority: 'medium',
    assignedTo: null,
    dueDate: '',
    location: '',
    tags: [],
    dependencies: [],
    attachments: []
  })
  
  if (form.value) {
    form.value.reset()
  }
}

const closeDialog = () => {
  dialog.value = false
  emit('cancelled')
}

const saveTask = async () => {
  if (!form.value.validate()) return

  loading.value = true

  try {
    const taskData = {
      ...formData,
      // Форматируем дату
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    }

    if (isEditing.value) {
      // Обновляем существующую задачу
      tasksStore.updateTask(props.task.id, taskData)
    } else {
      // Создаем новую задачу
      const newTask = tasksStore.addTask(taskData)
    }

    emit('saved', taskData)
    closeDialog()
  } catch (error) {
    console.error('Ошибка сохранения задачи:', error)
  } finally {
    loading.value = false
  }
}

// Наблюдатели
watch(() => props.task, (newTask) => {
  if (newTask) {
    // Заполняем форму данными для редактирования
    Object.assign(formData, {
      title: newTask.title || '',
      description: newTask.description || '',
      type: newTask.type || 'support',
      priority: newTask.priority || 'medium',
      assignedTo: newTask.assignedTo || null,
      dueDate: newTask.dueDate || '',
      location: newTask.location || '',
      tags: newTask.tags || [],
      dependencies: newTask.dependencies || [],
      attachments: newTask.attachments || []
    })
  } else {
    // Сбрасываем форму
    resetForm()
  }
}, { immediate: true })
</script>

<style scoped>
.task-form-card {
  border-radius: 12px;
}

/* Мобильные стили */
@media (max-width: 768px) {
  .task-form-card {
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .v-card-text {
    flex: 1;
    overflow-y: auto;
  }
  
  .v-card-actions {
    border-top: 1px solid rgb(var(--v-theme-outline));
  }
}
</style> 