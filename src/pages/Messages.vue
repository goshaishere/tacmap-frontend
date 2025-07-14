<template>
  <div class="messages-page">
    <!-- Чат -->
    <div class="chat-container">
      <div v-if="!activeConversation" class="no-chat-selected text-center pa-8">
        <v-icon size="64" color="grey-lighten-1">mdi-chat-outline</v-icon>
        <h3 class="text-h6 mt-4">Выберите канал</h3>
        <p class="text-body-2 text-medium-emphasis">
          Выберите канал из левой панели для начала общения
        </p>
      </div>

      <div v-else class="chat-wrapper">
        <MessageList
          :messages="activeMessages"
          :conversation="activeConversation"
          :current-user-id="currentUserId"
          :loading="loading"
          :is-typing="isTyping"
          :typing-user="typingUser"
          @open-image="openImage"
          @download-file="downloadFile"
          @open-location="openLocation"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessagesStore } from '../store/messages.js'
import MessageList from '../components/messages/MessageList.vue'

// Store
const messagesStore = useMessagesStore()

// Состояние
const loading = ref(false)
const isTyping = ref(false)
const typingUser = ref('')

// Текущий пользователь (в реальном приложении из auth store)
const currentUserId = ref('user1')

// Computed
const activeConversation = computed(() => messagesStore.activeConversation)
const activeMessages = computed(() => messagesStore.getMessagesByConversation(messagesStore.activeConversation))

// Методы
const openConversation = (conversationId) => {
  messagesStore.setActiveConversation(conversationId)
}

const openImage = (imageUrl) => {
  // Отправляем событие в лейаут
  window.dispatchEvent(new CustomEvent('openImage', { detail: imageUrl }))
}

const downloadFile = (message) => {
  // Создаем ссылку для скачивания
  const link = document.createElement('a')
  link.href = message.content
  link.download = message.fileName || 'file'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const openLocation = (message) => {
  const [lat, lon] = message.content.split(', ')
  const url = `https://www.google.com/maps?q=${lat},${lon}`
  window.open(url, '_blank')
}

// Инициализация
onMounted(() => {
  // Добавляем тестовые данные, если их нет
  if (messagesStore.conversations.length === 0) {
    const testConversations = [
      {
        id: 'general',
        name: 'Общий канал',
        type: 'channel',
        description: 'Общий канал для всех участников',
        memberCount: 12
      },
      {
        id: 'team',
        name: 'Команда Alpha',
        type: 'group',
        description: 'Чат команды Alpha',
        memberCount: 5
      },
      {
        id: 'private',
        name: 'Иван Петров',
        type: 'private',
        description: 'Личный чат с Иваном',
        online: true
      }
    ]
    
    testConversations.forEach(conv => {
      const conversation = messagesStore.addConversation(conv)
      
      // Добавляем тестовые сообщения
      const testMessages = [
        {
          conversationId: conversation.id,
          senderId: 'user2',
          senderName: conv.name,
          senderAvatar: '',
          type: 'text',
          content: 'Привет! Как дела?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          conversationId: conversation.id,
          senderId: currentUserId.value,
          senderName: 'Вы',
          senderAvatar: '',
          type: 'text',
          content: 'Привет! Все хорошо, спасибо!',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          conversationId: conversation.id,
          senderId: 'user2',
          senderName: conv.name,
          senderAvatar: '',
          type: 'image',
          content: 'https://picsum.photos/300/200',
          fileName: 'image.jpg',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          conversationId: conversation.id,
          senderId: 'user2',
          senderName: conv.name,
          senderAvatar: '',
          type: 'file',
          content: 'https://example.com/document.pdf',
          fileName: 'document.pdf',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          conversationId: conversation.id,
          senderId: 'user2',
          senderName: conv.name,
          senderAvatar: '',
          type: 'location',
          content: '55.7558, 37.6176',
          fileName: 'Москва, Россия',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        }
      ]
      
      testMessages.forEach(msg => messagesStore.addMessage(msg))
    })
  }
  
  // Устанавливаем активный канал по умолчанию
  if (messagesStore.conversations.length > 0) {
    messagesStore.setActiveConversation(messagesStore.conversations[0].id)
  }
})
</script>

<style scoped>
.messages-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
}

.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
}

.chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
}

.no-chat-selected {
  color: rgb(var(--v-theme-on-surface-variant));
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.new-chat-dialog {
  border-radius: 12px;
}

.image-dialog {
  border-radius: 12px;
}

.empty-state {
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Мобильные стили */
@media (max-width: 768px) {
  .new-chat-dialog {
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .image-dialog {
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
}
</style> 