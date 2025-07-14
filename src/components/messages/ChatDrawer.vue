<template>
  <div class="chat-drawer">
    <!-- Мобильный оверлей -->
    <v-overlay
      v-model="showMobileOverlay"
      class="chat-drawer-overlay"
      @click="closeDrawer"
    />

    <!-- Основная панель -->
    <div 
      class="chat-drawer-panel"
      :class="{
        'chat-drawer-panel--mobile': $vuetify.display.smAndDown,
        'chat-drawer-panel--mini': miniMode && !$vuetify.display.smAndDown,
        'chat-drawer-panel--open': isOpen
      }"
    >
      <!-- Заголовок панели -->
      <div class="drawer-header">
        <div class="d-flex align-center justify-space-between pa-3">
          <div v-if="!miniMode || $vuetify.display.smAndDown" class="d-flex align-center">
            <v-icon class="me-2">mdi-chat</v-icon>
            <span class="text-h6">Чаты</span>
          </div>
          
          <div class="drawer-actions">
            <!-- Кнопка нового чата -->
            <v-btn
              icon
              size="small"
              color="primary"
              @click="showNewChat = true"
              class="me-2"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            
            <!-- Кнопка мини-режима (только на десктопе) -->
            <v-btn
              v-if="!$vuetify.display.smAndDown"
              icon
              size="small"
              @click="toggleMiniMode"
            >
              <v-icon>{{ miniMode ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
            </v-btn>
            
            <!-- Кнопка закрытия (только на мобильных) -->
            <v-btn
              v-if="$vuetify.display.smAndDown"
              icon
              size="small"
              @click="closeDrawer"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Поиск (скрыт в мини-режиме) -->
      <div v-if="(!miniMode || $vuetify.display.smAndDown) && !$vuetify.display.smAndDown" class="search-section pa-3">
        <v-text-field
          v-model="searchQuery"
          label="Поиск чатов"
          placeholder="Поиск..."
          variant="outlined"
          prepend-icon="mdi-magnify"
          clearable
          hide-details
          density="compact"
        />
      </div>

      <!-- Фильтры (скрыты в мини-режиме) -->
      <div v-if="(!miniMode || $vuetify.display.smAndDown) && !$vuetify.display.smAndDown" class="filters-section pa-3">
        <v-chip-group
          v-model="selectedFilter"
          selected-class="primary"
          mandatory
        >
          <v-chip
            value="all"
            variant="outlined"
            size="small"
          >
            Все
          </v-chip>
          <v-chip
            value="unread"
            variant="outlined"
            size="small"
          >
            <v-icon size="small" class="me-1">mdi-circle</v-icon>
            Новые
          </v-chip>
        </v-chip-group>
      </div>

      <!-- Список чатов -->
      <div class="conversations-container">
        <div v-if="filteredConversations.length === 0" class="empty-state text-center pa-4">
          <v-icon size="48" color="grey-lighten-1">mdi-chat-outline</v-icon>
          <h4 class="text-h6 mt-3">Нет чатов</h4>
          <p class="text-body-2 text-medium-emphasis">
            {{ getEmptyStateMessage() }}
          </p>
        </div>

        <div v-else class="conversation-items">
          <div
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="conversation-item"
            :class="{ 
              'conversation-item--active': activeConversationId === conversation.id,
              'conversation-item--mini': miniMode && !$vuetify.display.smAndDown
            }"
            @click="selectConversation(conversation)"
          >
            <!-- Мини-режим (только аватар) -->
            <div v-if="miniMode && !$vuetify.display.smAndDown" class="conversation-mini">
              <div class="conversation-avatar-mini">
                <v-avatar size="40">
                  <v-img :src="conversation.avatar" />
                  <v-icon v-if="!conversation.avatar">{{ getConversationIcon(conversation.type) }}</v-icon>
                </v-avatar>
                <div 
                  v-if="conversation.type === 'private' && conversation.online" 
                  class="online-indicator"
                />
                <div v-if="conversation.unreadCount > 0" class="unread-indicator">
                  <v-chip size="x-small" color="primary">
                    {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Полный режим -->
            <div v-else class="conversation-full">
              <div class="d-flex align-center pa-3">
                <!-- Аватар -->
                <div class="conversation-avatar me-3">
                  <v-avatar size="40">
                    <v-img :src="conversation.avatar" />
                    <v-icon v-if="!conversation.avatar">{{ getConversationIcon(conversation.type) }}</v-icon>
                  </v-avatar>
                  <div 
                    v-if="conversation.type === 'private' && conversation.online" 
                    class="online-indicator"
                  />
                </div>

                <!-- Информация о чате -->
                <div class="flex-grow-1 min-width-0">
                  <div class="d-flex align-center justify-space-between">
                    <h4 class="text-subtitle-2 font-weight-medium conversation-name">
                      {{ conversation.name }}
                    </h4>
                    <div class="conversation-meta">
                      <span class="text-caption text-medium-emphasis conversation-time">
                        {{ conversation.formattedTime }}
                      </span>
                      <v-icon 
                        v-if="conversation.pinned" 
                        size="small" 
                        color="warning"
                        class="ms-1"
                      >
                        mdi-pin
                      </v-icon>
                    </div>
                  </div>
                  
                  <p class="text-body-2 text-medium-emphasis conversation-preview">
                    {{ conversation.shortLastMessage }}
                  </p>
                </div>

                <!-- Бейджи -->
                <div class="conversation-badges">
                  <div v-if="conversation.unreadCount > 0" class="unread-badge">
                    <v-chip size="x-small" color="primary">
                      {{ conversation.unreadCount > 99 ? '99+' : conversation.unreadCount }}
                    </v-chip>
                  </div>
                  <div v-if="conversation.mentions > 0" class="mentions-badge">
                    <v-chip size="x-small" color="error">
                      @{{ conversation.mentions }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="loading-indicator text-center pa-4">
        <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
      </div>
    </div>

    <!-- Диалог создания нового чата -->
    <v-dialog
      v-model="showNewChat"
      :fullscreen="$vuetify.display.smAndDown"
      :max-width="$vuetify.display.smAndDown ? '100%' : '500px'"
    >
      <v-card class="new-chat-dialog">
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span class="text-h6">Новый чат</span>
          <v-btn icon @click="showNewChat = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="newChatForm" v-model="isNewChatValid">
            <v-text-field
              v-model="newChatData.name"
              label="Название чата"
              placeholder="Введите название чата"
              variant="outlined"
              :rules="[v => !!v || 'Название обязательно']"
              required
              class="mb-4"
            />
            <v-select
              v-model="newChatData.type"
              :items="chatTypeOptions"
              label="Тип чата"
              variant="outlined"
              class="mb-4"
            />
            <v-textarea
              v-model="newChatData.description"
              label="Описание"
              placeholder="Описание чата (необязательно)"
              variant="outlined"
              rows="3"
              class="mb-4"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="showNewChat = false"
            class="me-2"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!isNewChatValid"
            @click="createNewChat"
          >
            Создать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMessagesStore } from '../../store/messages.js'

// Store
const messagesStore = useMessagesStore()

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  miniMode: {
    type: Boolean,
    default: false
  },
  activeConversationId: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'select-conversation', 'toggle-mini', 'new-chat-created'])

// Состояние
const searchQuery = ref('')
const selectedFilter = ref('all')
const showNewChat = ref(false)
const isNewChatValid = ref(false)
const showMobileOverlay = ref(false)

// Данные для нового чата
const newChatData = ref({
  name: '',
  type: 'private',
  description: ''
})

// Опции для типов чатов
const chatTypeOptions = [
  { title: 'Личный чат', value: 'private' },
  { title: 'Групповой чат', value: 'group' },
  { title: 'Канал', value: 'channel' },
  { title: 'Трансляция', value: 'broadcast' }
]

// Вычисляемые свойства
const filteredConversations = computed(() => {
  let conversations = messagesStore.getConversationsForMobile()
  
  // Фильтр по поиску
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    conversations = conversations.filter(conv => 
      conv.name.toLowerCase().includes(query) ||
      conv.shortLastMessage.toLowerCase().includes(query)
    )
  }
  
  // Фильтр по типу
  if (selectedFilter.value === 'unread') {
    conversations = conversations.filter(conv => conv.unreadCount > 0)
  }
  
  // Сортировка: сначала закрепленные, потом по времени
  conversations.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  })
  
  return conversations
})

// Методы
const getConversationIcon = (type) => {
  const icons = {
    private: 'mdi-account',
    group: 'mdi-account-group',
    channel: 'mdi-broadcast',
    broadcast: 'mdi-bullhorn'
  }
  return icons[type] || 'mdi-chat'
}

const selectConversation = (conversation) => {
  emit('select-conversation', conversation)
  
  // На мобильных закрываем панель после выбора
  if (props.$vuetify?.display?.smAndDown) {
    closeDrawer()
  }
}

const closeDrawer = () => {
  emit('close')
}

const toggleMiniMode = () => {
  emit('toggle-mini')
}

const createNewChat = () => {
  const newChat = messagesStore.addConversation({
    name: newChatData.value.name,
    type: newChatData.value.type,
    description: newChatData.value.description
  })
  
  // Сбрасываем форму
  newChatData.value = {
    name: '',
    type: 'private',
    description: ''
  }
  
  showNewChat.value = false
  emit('new-chat-created', newChat)
}

const getEmptyStateMessage = () => {
  if (searchQuery.value) {
    return 'По вашему запросу ничего не найдено'
  }
  
  if (selectedFilter.value === 'unread') {
    return 'У вас нет непрочитанных сообщений'
  }
  
  return 'Создайте первый чат'
}

// Следим за открытием/закрытием на мобильных
watch(() => props.isOpen, (isOpen) => {
  if (props.$vuetify?.display?.smAndDown) {
    showMobileOverlay.value = isOpen
  }
})
</script>

<style scoped>
.chat-drawer {
  position: relative;
}

.chat-drawer-overlay {
  z-index: 200;
}

.chat-drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  background: rgb(var(--v-theme-surface));
  border-left: 1px solid rgb(var(--v-theme-outline));
  display: flex;
  flex-direction: column;
  z-index: 201;
  transition: all 0.3s ease;
  box-shadow: -2px 0 8px rgba(var(--v-theme-shadow), 0.1);
}

.chat-drawer-panel--mobile {
  width: 100%;
  transform: translateX(100%);
}

.chat-drawer-panel--mobile.chat-drawer-panel--open {
  transform: translateX(0);
}

.chat-drawer-panel--mini {
  width: 80px;
}

.chat-drawer-panel:not(.chat-drawer-panel--mobile):not(.chat-drawer-panel--mini) {
  width: 320px;
}

.drawer-header {
  border-bottom: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-surface));
  flex-shrink: 0;
}

.drawer-actions {
  display: flex;
  align-items: center;
}

.search-section, .filters-section {
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
  background: rgb(var(--v-theme-surface));
  flex-shrink: 0;
}

.conversations-container {
  flex: 1;
  overflow-y: auto;
}

.conversation-items {
  padding-bottom: 16px;
}

.conversation-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
}

.conversation-item:hover {
  background: rgb(var(--v-theme-surface-variant));
}

.conversation-item--active {
  background: rgb(var(--v-theme-primary-container));
}

.conversation-item--mini {
  padding: 8px;
  text-align: center;
}

.conversation-mini {
  display: flex;
  justify-content: center;
}

.conversation-avatar-mini {
  position: relative;
}

.conversation-avatar {
  position: relative;
  flex-shrink: 0;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4caf50;
  border: 2px solid rgb(var(--v-theme-surface));
  border-radius: 50%;
}

.unread-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
}

.conversation-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(var(--v-theme-on-surface));
}

.conversation-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.conversation-meta {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.conversation-time {
  flex-shrink: 0;
  color: rgb(var(--v-theme-on-surface-variant));
}

.conversation-badges {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.unread-badge, .mentions-badge {
  display: flex;
  justify-content: center;
}

.loading-indicator {
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgb(var(--v-theme-outline));
  flex-shrink: 0;
}

.empty-state {
  color: rgb(var(--v-theme-on-surface-variant));
}

.new-chat-dialog {
  border-radius: 12px;
}

/* Мобильные стили */
@media (max-width: 768px) {
  .conversation-item {
    padding: 8px 16px;
  }
  
  .drawer-header, .search-section, .filters-section {
    padding: 12px 16px;
  }
  
  .conversation-preview {
    max-width: 150px;
  }
  
  .new-chat-dialog {
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
}
</style> 