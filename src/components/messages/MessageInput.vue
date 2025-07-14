<template>
  <div class="message-input">
    <!-- Панель инструментов -->
    <div class="input-toolbar pa-3">
      <div class="d-flex align-center gap-2">
        <!-- Кнопка вложения -->
        <v-btn 
          icon 
          size="small" 
          @click="showAttachmentMenu = !showAttachmentMenu"
          :color="showAttachmentMenu ? 'primary' : undefined"
        >
          <v-icon>mdi-paperclip</v-icon>
        </v-btn>

        <!-- Кнопка эмодзи -->
        <v-btn 
          icon 
          size="small" 
          @click="showEmojiPicker = !showEmojiPicker"
          :color="showEmojiPicker ? 'primary' : undefined"
        >
          <v-icon>mdi-emoticon-outline</v-icon>
        </v-btn>

        <!-- Кнопка локации -->
        <v-btn 
          icon 
          size="small" 
          @click="shareLocation"
        >
          <v-icon>mdi-map-marker</v-icon>
        </v-btn>

        <!-- Кнопка голосового сообщения -->
        <v-btn 
          icon 
          size="small" 
          @click="startVoiceMessage"
          :color="isRecording ? 'error' : undefined"
        >
          <v-icon>{{ isRecording ? 'mdi-stop' : 'mdi-microphone' }}</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Меню вложений -->
    <v-expand-transition>
      <div v-if="showAttachmentMenu" class="attachment-menu pa-3">
        <v-card>
          <v-card-text>
            <div class="d-flex flex-wrap gap-2">
              <v-btn 
                variant="outlined" 
                size="small"
                @click="selectFile('image')"
                prepend-icon="mdi-image"
              >
                Фото
              </v-btn>
              <v-btn 
                variant="outlined" 
                size="small"
                @click="selectFile('video')"
                prepend-icon="mdi-video"
              >
                Видео
              </v-btn>
              <v-btn 
                variant="outlined" 
                size="small"
                @click="selectFile('document')"
                prepend-icon="mdi-file-document"
              >
                Документ
              </v-btn>
              <v-btn 
                variant="outlined" 
                size="small"
                @click="takePhoto"
                prepend-icon="mdi-camera"
              >
                Камера
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-expand-transition>

    <!-- Поле ввода -->
    <div class="input-field pa-3">
      <div class="d-flex align-end gap-2">
        <!-- Текстовое поле -->
        <v-textarea
          v-model="messageText"
          placeholder="Введите сообщение..."
          variant="outlined"
          :rows="1"
          auto-grow
          max-rows="4"
          hide-details
          class="message-textarea"
          @keydown.enter.prevent="handleEnter"
          @input="handleInput"
          ref="messageInput"
        />

        <!-- Кнопка отправки -->
        <v-btn 
          color="primary" 
          icon
          :disabled="!canSend"
          @click="sendMessage"
          class="send-button"
        >
          <v-icon>{{ isRecording ? 'mdi-stop' : 'mdi-send' }}</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Индикатор записи -->
    <div v-if="isRecording" class="recording-indicator pa-3">
      <v-card color="error" class="text-center">
        <v-card-text class="pa-3">
          <div class="d-flex align-center justify-center">
            <v-icon class="me-2" color="white">mdi-microphone</v-icon>
            <span class="text-white">Запись... {{ recordingTime }}с</span>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Скрытый input для файлов -->
    <input
      ref="fileInput"
      type="file"
      :accept="fileAccept"
      multiple
      style="display: none"
      @change="handleFileSelect"
    />

    <!-- Скрытый input для камеры -->
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      style="display: none"
      @change="handleCameraCapture"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Введите сообщение...'
  }
})

const emit = defineEmits(['send', 'typing', 'stop-typing'])

// Состояние
const messageText = ref('')
const showAttachmentMenu = ref(false)
const showEmojiPicker = ref(false)
const isRecording = ref(false)
const recordingTime = ref(0)
const recordingInterval = ref(null)
const fileAccept = ref('*/*')
const typingTimeout = ref(null)

// Refs
const messageInput = ref(null)
const fileInput = ref(null)
const cameraInput = ref(null)

// Вычисляемые свойства
const canSend = computed(() => {
  return messageText.value.trim().length > 0 || isRecording.value
})

// Обработчики событий
const handleEnter = (event) => {
  if (event.shiftKey) {
    // Shift+Enter для новой строки
    return
  }
  
  if (canSend.value) {
    sendMessage()
  }
}

const handleInput = () => {
  // Отправляем событие печати
  emit('typing')
  
  // Очищаем предыдущий таймаут
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
  
  // Устанавливаем новый таймаут для остановки печати
  typingTimeout.value = setTimeout(() => {
    emit('stop-typing')
  }, 1000)
}

const sendMessage = () => {
  if (!canSend.value || props.disabled) return
  
  const text = messageText.value.trim()
  if (text) {
    emit('send', {
      type: 'text',
      content: text
    })
    messageText.value = ''
  }
  
  // Останавливаем печатание
  emit('stop-typing')
  
  // Фокусируемся обратно на поле ввода
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

const selectFile = (type) => {
  showAttachmentMenu.value = false
  
  switch (type) {
    case 'image':
      fileAccept.value = 'image/*'
      break
    case 'video':
      fileAccept.value = 'video/*'
      break
    case 'document':
      fileAccept.value = '.pdf,.doc,.docx,.txt,.xls,.xlsx'
      break
    default:
      fileAccept.value = '*/*'
  }
  
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      let type = 'file'
      let content = e.target.result
      
      // Определяем тип файла
      if (file.type.startsWith('image/')) {
        type = 'image'
      } else if (file.type.startsWith('video/')) {
        type = 'video'
      }
      
      emit('send', {
        type,
        content,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })
    }
    
    reader.readAsDataURL(file)
  })
  
  // Очищаем input
  event.target.value = ''
}

const takePhoto = () => {
  showAttachmentMenu.value = false
  cameraInput.value.click()
}

const handleCameraCapture = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      emit('send', {
        type: 'image',
        content: e.target.result,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })
    }
    reader.readAsDataURL(file)
  }
  
  // Очищаем input
  event.target.value = ''
}

const shareLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        emit('send', {
          type: 'location',
          content: `${latitude}, ${longitude}`,
          location: `Координаты: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        })
      },
      (error) => {
        console.error('Ошибка получения геолокации:', error)
        // Fallback - отправляем системное сообщение
        emit('send', {
          type: 'system',
          content: 'Не удалось получить вашу локацию'
        })
      }
    )
  } else {
    emit('send', {
      type: 'system',
      content: 'Геолокация не поддерживается в вашем браузере'
    })
  }
}

const startVoiceMessage = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = () => {
  // Здесь должна быть логика записи голосового сообщения
  // Для демонстрации просто показываем индикатор
  isRecording.value = true
  recordingTime.value = 0
  
  recordingInterval.value = setInterval(() => {
    recordingTime.value++
  }, 1000)
}

const stopRecording = () => {
  isRecording.value = false
  
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value)
    recordingInterval.value = null
  }
  
  // Отправляем голосовое сообщение
  emit('send', {
    type: 'voice',
    content: `Голосовое сообщение (${recordingTime.value}с)`,
    duration: recordingTime.value
  })
  
  recordingTime.value = 0
}

// Закрываем меню при клике вне его
const closeMenus = (event) => {
  if (!event.target.closest('.message-input')) {
    showAttachmentMenu.value = false
    showEmojiPicker.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', closeMenus)
  
  // Фокусируемся на поле ввода
  if (messageInput.value) {
    messageInput.value.focus()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
  
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
  
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value)
  }
})

// Следим за изменением disabled
watch(() => props.disabled, (disabled) => {
  if (disabled && isRecording.value) {
    stopRecording()
  }
})
</script>

<style scoped>
.message-input {
  border-top: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-surface));
}

.input-toolbar {
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
}

.attachment-menu {
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
}

.input-field {
  background: rgb(var(--v-theme-surface));
}

.message-textarea {
  flex: 1;
}

.message-textarea :deep(.v-field__input) {
  min-height: 40px;
  max-height: 120px;
  padding: 8px 12px;
}

.send-button {
  flex-shrink: 0;
  height: 40px;
  width: 40px;
}

.recording-indicator {
  border-top: 1px solid rgb(var(--v-theme-outline));
}

/* Мобильные стили */
@media (max-width: 768px) {
  .input-toolbar {
    padding: 8px 12px;
  }
  
  .input-field {
    padding: 8px 12px;
  }
  
  .attachment-menu {
    padding: 8px 12px;
  }
  
  .message-textarea :deep(.v-field__input) {
    font-size: 16px; /* Предотвращает зум на iOS */
  }
  
  .send-button {
    height: 44px;
    width: 44px;
  }
}

/* Анимации */
.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.3s ease;
}

.v-expand-transition-enter-from,
.v-expand-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 