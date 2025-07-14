<template>
  <div class="message-list">
    <!-- Заголовок чата -->
    <v-card flat class="chat-header" v-if="conversation">
      <v-card-text class="pa-3">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="40" class="me-3">
              <v-img :src="conversation.avatar" />
              <v-icon v-if="!conversation.avatar">{{ getConversationIcon(conversation.type) }}</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6">{{ conversation.name }}</h3>
              <p class="text-caption text-medium-emphasis">
                {{ getConversationStatus(conversation) }}
              </p>
            </div>
          </div>
          <v-btn icon @click="$emit('close')" v-if="$vuetify.display.smAndDown">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Список сообщений -->
    <div class="messages-container" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state pa-8">
        <div class="d-flex flex-column align-center justify-center" style="height: 100%;">
          <v-icon size="64" color="grey-lighten-1">mdi-chat-outline</v-icon>
          <h3 class="text-h6 mt-4 text-center">Нет сообщений</h3>
          <p class="text-body-2 text-medium-emphasis text-center">
            Начните разговор, отправив первое сообщение
          </p>
        </div>
      </div>

      <div v-else class="messages-wrapper">
        <div
          v-for="(message, idx) in messages"
          :key="message.id"
          class="message-item"
          :class="{ 'message-item--own': message.senderId === currentUserId }"
        >
          <div class="message-row" :class="{ 'message-row--own': message.senderId === currentUserId }">
            <!-- Для чужих сообщений: аватарка и имя только у первого в серии -->
            <template v-if="message.senderId !== currentUserId">
              <template v-if="idx === 0 || messages[idx-1].senderId !== message.senderId">
                <div class="message-avatar-name">
                  <v-avatar size="28" class="me-2">
                    <v-img :src="message.senderAvatar" />
                    <v-icon v-if="!message.senderAvatar">mdi-account</v-icon>
                  </v-avatar>
                  <span class="message-sender text-caption font-weight-medium">{{ message.senderName }}</span>
                </div>
              </template>
            </template>
            <!-- Для своих сообщений: аватарка справа только у первого в серии -->
            <template v-if="message.senderId === currentUserId">
              <template v-if="idx === 0 || messages[idx-1].senderId !== message.senderId">
                <div class="message-avatar-self">
                  <v-avatar size="28">
                    <v-img :src="message.senderAvatar" />
                    <v-icon v-if="!message.senderAvatar">mdi-account</v-icon>
                  </v-avatar>
                </div>
              </template>
            </template>
            <div class="message-main">
              <!-- Пузырь сообщения -->
              <div
                class="message-bubble-modern"
                :class="{ 'message-bubble--own': message.senderId === currentUserId }"
              >
                <!-- Содержимое сообщения (оставить все типы как было) -->
                <template v-if="message.type === 'text'">
                  <span>{{ message.content }}</span>
                </template>
                <template v-else-if="message.type === 'image'">
                  <v-img 
                    :src="message.content" 
                    :alt="message.senderName"
                    class="message-img"
                    @click="openImage(message.content)"
                    style="max-width: 200px; max-height: 200px; cursor: pointer;"
                  />
                </template>
                <template v-else-if="message.type === 'file'">
                  <div class="d-flex align-center justify-center">
                    <v-icon class="me-3">mdi-file</v-icon>
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">{{ message.fileName }}</div>
                      <div class="text-caption text-medium-emphasis">{{ formatFileSize(message.fileSize) }}</div>
                    </div>
                    <v-btn icon size="small" @click="downloadFile(message)">
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </div>
                </template>
                <template v-else-if="message.type === 'location'">
                  <div class="d-flex align-center justify-center">
                    <v-icon class="me-3" color="primary">mdi-map-marker</v-icon>
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">Локация</div>
                      <div class="text-caption text-medium-emphasis">{{ message.location }}</div>
                    </div>
                    <v-btn icon size="small" @click="openLocation(message)">
                      <v-icon>mdi-open-in-new</v-icon>
                    </v-btn>
                  </div>
                </template>
                <template v-else-if="message.type === 'system'">
                  <v-chip size="small" variant="tonal" color="grey">
                    {{ message.content }}
                  </v-chip>
                </template>
                <!-- Время -->
                <div class="message-meta-modern">
                  <span class="text-caption text-medium-emphasis">{{ formatMessageTime(message.timestamp) }}</span>
                  <v-icon 
                    v-if="message.senderId === currentUserId" 
                    size="small" 
                    :color="getStatusColor(message.status)"
                    class="message-status ms-1"
                  >
                    {{ getStatusIcon(message.status) }}
                  </v-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <v-card flat v-if="loading" class="loading-indicator">
      <v-card-text class="pa-4">
        <div class="d-flex justify-center">
          <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
        </div>
      </v-card-text>
    </v-card>

    <!-- Индикатор печати -->
    <v-card flat v-if="isTyping" class="typing-indicator">
      <v-card-text class="pa-3">
        <div class="d-flex align-center">
          <v-avatar size="24" class="me-2">
            <v-icon size="small">mdi-account</v-icon>
          </v-avatar>
          <span class="text-caption text-medium-emphasis">{{ typingUser }} печатает...</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  conversation: {
    type: Object,
    default: null
  },
  currentUserId: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  isTyping: {
    type: Boolean,
    default: false
  },
  typingUser: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'open-image', 'download-file', 'open-location'])

const messagesContainer = ref(null)

// Автопрокрутка к последнему сообщению
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Следим за новыми сообщениями
watch(() => props.messages.length, () => {
  scrollToBottom()
})

// Показывать ли дату для сообщения
const shouldShowDate = (message) => {
  const index = props.messages.findIndex(m => m.id === message.id)
  if (index === 0) return true
  
  const prevMessage = props.messages[index - 1]
  const messageDate = new Date(message.timestamp).toDateString()
  const prevDate = new Date(prevMessage.timestamp).toDateString()
  
  return messageDate !== prevDate
}

// Форматирование даты сообщения
const formatMessageDate = (timestamp) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера'
  } else {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long' 
    })
  }
}

// Форматирование времени сообщения
const formatMessageTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Форматирование размера файла
const formatFileSize = (bytes) => {
  if (!bytes) return ''
  
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// Иконка типа чата
const getConversationIcon = (type) => {
  const icons = {
    private: 'mdi-account',
    group: 'mdi-account-group',
    channel: 'mdi-broadcast',
    broadcast: 'mdi-bullhorn'
  }
  return icons[type] || 'mdi-chat'
}

// Статус чата
const getConversationStatus = (conversation) => {
  if (conversation.type === 'private') {
    return conversation.online ? 'В сети' : 'Не в сети'
  } else {
    return `${conversation.memberCount || 0} участников`
  }
}

// Цвет статуса сообщения
const getStatusColor = (status) => {
  const colors = {
    sent: 'grey',
    delivered: 'blue',
    read: 'green'
  }
  return colors[status] || 'grey'
}

// Иконка статуса сообщения
const getStatusIcon = (status) => {
  const icons = {
    sent: 'mdi-check',
    delivered: 'mdi-check-all',
    read: 'mdi-check-all'
  }
  return icons[status] || 'mdi-clock'
}

// Обработчики событий
const openImage = (imageUrl) => {
  emit('open-image', imageUrl)
}

const downloadFile = (message) => {
  emit('download-file', message)
}

const openLocation = (message) => {
  emit('open-location', message)
}

// Инициализация
scrollToBottom()
</script>

<style scoped>
.message-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  border-bottom: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-surface));
  position: sticky;
  top: 0;
  z-index: 10;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-item {
  display: flex;
  flex-direction: column;
}

.message-item--own {
  align-items: flex-end;
}

.message-date-divider {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0 8px 0;
}

.message-bubble {
  display: flex;
  max-width: 70%;
  gap: 8px;
  align-items: flex-start;
}

.message-item--own .message-bubble {
  flex-direction: row-reverse;
  margin-left: auto;
}

.message-avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.message-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message-item--own .message-content {
  align-items: flex-end;
}

.message-sender {
  margin-bottom: 4px;
}

.message-card {
  align-self: flex-start;
  max-width: 100%;
  border-radius: 18px;
}

.message-card--own {
  align-self: flex-end;
  max-width: 100%;
  border-radius: 18px;
}

.message-system {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
}

.message-status {
  margin-left: 4px;
}

.typing-indicator {
  background: rgb(var(--v-theme-surface-container));
  border-top: 1px solid rgb(var(--v-theme-outline));
}

.loading-indicator {
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgb(var(--v-theme-outline));
}

.empty-state {
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Мобильные стили */
@media (max-width: 768px) {
  .messages-container {
    padding: 8px;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .message-img {
    max-width: 150px;
    max-height: 150px;
  }
  
  .chat-header {
    padding: 8px 16px;
  }
}
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 2px;
}
.message-row--own {
  flex-direction: row-reverse;
}
.message-avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.message-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 70vw;
}
.message-bubble-modern {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 10px 16px 6px 16px;
  margin-bottom: 2px;
  max-width: 420px;
  min-width: 60px;
  position: relative;
  word-break: break-word;
}
.message-bubble--own {
  background: rgb(var(--v-theme-accent));
  color: rgb(var(--v-theme-on-accent));
}
@media (prefers-color-scheme: dark) {
  .message-bubble-modern {
    box-shadow: 0 2px 8px rgba(255,255,255,0.08);
  }
}
.message-meta-modern {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}
.message-sender {
  margin-left: 4px;
  margin-bottom: 2px;
}
.message-avatar-name {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}
.message-avatar-self {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  margin-left: 8px;
}
@media (max-width: 768px) {
  .message-main { max-width: 90vw; }
  .message-bubble-modern { max-width: 90vw; }
}
</style> 