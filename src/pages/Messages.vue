<template>
  <div class="messages-page">
    <div class="chat-container">
      <div v-if="!activeConversationId" class="no-chat-selected text-center pa-8">
        <h3 class="text-h6 mt-4">Выберите канал</h3>
        <p class="text-body-2 text-medium-emphasis">
          Выберите канал для начала общения
        </p>
      </div>
      <div v-else class="chat-wrapper">
        <MessageList
          :messages="activeMessages"
          :conversation="activeConversationId"
          :current-user-id="currentUserId"
          :loading="loading"
          @open-image="openImage"
          @download-file="downloadFile"
          @open-location="openLocation"
        />
      </div>
    </div>
    <div v-if="error" class="error-message">Ошибка: {{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessagesStore } from '../store/messages.js'
import MessageList from '../components/messages/MessageList.vue'
import styles from '../styles/MessagesPage.module.scss'

// Store
const messagesStore = useMessagesStore()

// Состояние
const loading = computed(() => messagesStore.loading)
const error = computed(() => messagesStore.error)
const currentUserId = ref('user1')
const activeConversationId = ref(null)

// Computed
const activeMessages = computed(() => {
  if (!activeConversationId.value) return []
  return messagesStore.messagesByConversation(activeConversationId.value)
})

// Методы
const openConversation = (conversationId) => {
  activeConversationId.value = conversationId
  messagesStore.fetchMessages(conversationId)
}

const openImage = (imageUrl) => {
  window.dispatchEvent(new CustomEvent('openImage', { detail: imageUrl }))
}

const downloadFile = (message) => {
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

onMounted(() => {
  // Пример: сразу открываем первый чат, если есть
  if (messagesStore.messages.length > 0) {
    activeConversationId.value = messagesStore.messages[0].conversationId
    messagesStore.fetchMessages(activeConversationId.value)
  }
})
</script> 