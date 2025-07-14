<template>
  <div class="conversation-list">
    <!-- Заголовок -->
    <div class="list-header pa-3">
      <div class="d-flex align-center justify-space-between">
        <h3 class="text-h6">Чаты</h3>
        <v-btn 
          color="primary" 
          variant="outlined" 
          size="small"
          @click="$emit('new-chat')"
        >
          <v-icon class="me-2">mdi-plus</v-icon>
          Новый
        </v-btn>
      </div>
    </div>

    <!-- Поиск -->
    <div class="search-section pa-3">
      <v-text-field
        v-model="searchQuery"
        label="Поиск чатов"
        placeholder="Поиск по названию или сообщениям"
        variant="outlined"
        prepend-icon="mdi-magnify"
        clearable
        hide-details
        density="compact"
      />
    </div>

    <!-- Фильтры -->
    <div class="filters-section pa-3">
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
          Непрочитанные
        </v-chip>
        <v-chip
          value="private"
          variant="outlined"
          size="small"
        >
          Личные
        </v-chip>
        <v-chip
          value="group"
          variant="outlined"
          size="small"
        >
          Группы
        </v-chip>
      </v-chip-group>
    </div>

    <!-- Список чатов -->
    <div class="conversations-container">
      <div v-if="filteredConversations.length === 0" class="empty-state text-center pa-8">
        <v-icon size="64" color="grey-lighten-1">mdi-chat-outline</v-icon>
        <h3 class="text-h6 mt-4">Нет чатов</h3>
        <p class="text-body-2 text-medium-emphasis">
          {{ getEmptyStateMessage() }}
        </p>
      </div>

      <div v-else class="conversation-items">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          class="conversation-item"
          :class="{ 'conversation-item--active': activeConversationId === conversation.id }"
          @click="selectConversation(conversation)"
        >
          <div class="d-flex align-center pa-3">
            <!-- Аватар -->
            <div class="conversation-avatar me-3">
              <v-avatar :size="$vuetify.display.smAndDown ? 48 : 40">
                <v-img :src="conversation.avatar" />
                <v-icon v-if="!conversation.avatar">{{ getConversationIcon(conversation.type) }}</v-icon>
              </v-avatar>
              <!-- Индикатор онлайн -->
              <div 
                v-if="conversation.type === 'private' && conversation.online" 
                class="online-indicator"
              />
            </div>

            <!-- Информация о чате -->
            <div class="flex-grow-1 min-width-0">
              <div class="d-flex align-center justify-space-between">
                <h4 class="text-subtitle-1 font-weight-medium conversation-name">
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
              
              <!-- Дополнительная информация -->
              <div class="conversation-info">
                <span v-if="conversation.type !== 'private'" class="text-caption text-medium-emphasis">
                  {{ conversation.memberCount }} участников
                </span>
                <span v-if="conversation.muted" class="text-caption text-medium-emphasis ms-2">
                  <v-icon size="small">mdi-volume-off</v-icon>
                </span>
              </div>
            </div>

            <!-- Бейджи -->
            <div class="conversation-badges">
              <div v-if="conversation.unreadCount > 0" class="unread-badge">
                <v-chip 
                  :size="$vuetify.display.smAndDown ? 'small' : 'x-small'" 
                  color="primary"
                >
                  {{ conversation.unreadCount > 99 ? '99+' : conversation.unreadCount }}
                </v-chip>
              </div>
              <div v-if="conversation.mentions > 0" class="mentions-badge">
                <v-chip 
                  :size="$vuetify.display.smAndDown ? 'small' : 'x-small'" 
                  color="error"
                >
                  @{{ conversation.mentions }}
                </v-chip>
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
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  conversations: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['select-conversation', 'new-chat'])

// Состояние
const searchQuery = ref('')
const selectedFilter = ref('all')

// Вычисляемые свойства
const filteredConversations = computed(() => {
  let conversations = [...props.conversations]
  
  // Фильтр по поиску
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    conversations = conversations.filter(conv => 
      conv.name.toLowerCase().includes(query) ||
      conv.shortLastMessage.toLowerCase().includes(query)
    )
  }
  
  // Фильтр по типу
  switch (selectedFilter.value) {
    case 'unread':
      conversations = conversations.filter(conv => conv.unreadCount > 0)
      break
    case 'private':
      conversations = conversations.filter(conv => conv.type === 'private')
      break
    case 'group':
      conversations = conversations.filter(conv => conv.type === 'group')
      break
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
}

const getEmptyStateMessage = () => {
  if (searchQuery.value) {
    return 'По вашему запросу ничего не найдено'
  }
  
  switch (selectedFilter.value) {
    case 'unread':
      return 'У вас нет непрочитанных сообщений'
    case 'private':
      return 'У вас нет личных чатов'
    case 'group':
      return 'У вас нет групповых чатов'
    default:
      return 'Создайте первый чат, нажав на кнопку "Новый"'
  }
}
</script>

<style scoped>
.conversation-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.list-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
}

.search-section {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.filters-section {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.conversation-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.conversation-item--active {
  background: rgba(25, 118, 210, 0.1);
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
  border: 2px solid white;
  border-radius: 50%;
}

.conversation-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.conversation-meta {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.conversation-time {
  flex-shrink: 0;
}

.conversation-info {
  display: flex;
  align-items: center;
  margin-top: 2px;
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
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.empty-state {
  color: rgba(0, 0, 0, 0.6);
}

/* Мобильные стили */
@media (max-width: 768px) {
  .conversation-item {
    padding: 8px 16px;
  }
  
  .list-header, .search-section, .filters-section {
    padding: 12px 16px;
  }
  
  .conversation-preview {
    max-width: 150px;
  }
}
</style> 