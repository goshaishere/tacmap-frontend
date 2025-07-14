<template>
  <v-app id="messages-app">
    <!-- Системная панель (опционально) -->
    <v-system-bar color="surface-variant" height="24">
      <v-spacer></v-spacer>
      <v-icon size="16" class="me-2">mdi-wifi</v-icon>
      <v-icon size="16" class="me-2">mdi-signal</v-icon>
      <v-icon size="16">mdi-battery</v-icon>
    </v-system-bar>

    <!-- Левая навигация (серверы/каналы) -->
    <v-navigation-drawer
      color="background"
      rail
      permanent
      class="servers-panel"
    >
      <!-- Серверы/каналы -->
      <v-list density="compact" nav>
        <!-- Кнопка назад -->
        <v-list-item
          class="back-button"
          @click="navigateToHome"
          link
        >
          <template #prepend>
            <v-icon size="20" :style="{ color: accentColor }">mdi-arrow-left</v-icon>
          </template>
        </v-list-item>

        <v-divider class="mx-3 my-4" color="outline"></v-divider>

        <v-list-item
          v-for="(server, index) in servers"
          :key="index"
          :active="currentServer?.id === server.id"
          @click="selectServer(server)"
          link
          class="server-item"
        >
          <template #prepend>
            <v-icon size="20" :style="currentServer?.id === server.id ? { color: accentColor } : {}">
              {{ server.icon }}
            </v-icon>
          </template>
        </v-list-item>

        <!-- Кнопка добавления сервера -->
        <v-list-item
          @click="showAddServer = true"
          link
          class="add-server-item"
        >
          <template #prepend>
            <v-icon size="20" :style="{ color: accentColor }">mdi-plus</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Центральная панель (каналы) -->
    <v-navigation-drawer
      width="240"
      color="background"
      permanent
      class="channels-panel"
    >
      <!-- Заголовок сервера -->
      <v-sheet
        color="surface"
        height="72"
        class="d-flex align-center px-4"
      >
        <div class="d-flex align-center w-100">
          <v-icon class="me-3" :style="{ color: accentColor }">{{ currentServer?.icon || 'mdi-server' }}</v-icon>
          <div class="flex-grow-1">
            <div class="text-h6 font-weight-bold" :style="{ color: accentColor }">{{ currentServer?.name || 'Выберите сервер' }}</div>
            <div class="text-caption text-medium-emphasis">{{ currentServer?.description || '' }}</div>
          </div>
          <v-btn icon size="small" @click="showServerMenu = true">
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </div>
      </v-sheet>

      <!-- Каналы -->
      <v-list density="compact" nav class="channels-list">
        <v-list-subheader class="text-uppercase text-caption font-weight-bold">
          Текстовые каналы
        </v-list-subheader>
        
        <v-list-item
          v-for="channel in channels"
          :key="channel.id"
          :active="activeChannel?.id === channel.id"
          @click="selectChannel(channel)"
          link
          class="channel-item"
        >
          <template #prepend>
            <v-icon size="18" class="me-2" :style="activeChannel?.id === channel.id ? { color: accentColor } : {}">mdi-pound</v-icon>
          </template>
          <v-list-item-title class="text-body-2" :style="activeChannel?.id === channel.id ? { color: accentColor } : {}">{{ channel.name }}</v-list-item-title>
          <template #append>
            <v-badge
              v-if="channel.unreadCount > 0"
              :content="channel.unreadCount"
              color="error"
              size="small"
            ></v-badge>
          </template>
        </v-list-item>

        <!-- Кнопка добавления канала -->
        <v-list-item @click="showAddChannel = true" link class="add-channel-item">
          <template #prepend>
            <v-icon size="18" class="me-2" :style="{ color: accentColor }">mdi-plus</v-icon>
          </template>
          <v-list-item-title class="text-body-2" :style="{ color: accentColor }">Создать канал</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider class="mx-3 my-4" color="outline"></v-divider>

      <!-- Пользователи онлайн -->
      <v-list density="compact" nav class="users-list">
        <v-list-subheader class="text-uppercase text-caption font-weight-bold">
          Онлайн — {{ onlineUsers.length }}
        </v-list-subheader>
        
        <v-list-item
          v-for="user in onlineUsers"
          :key="user.id"
          link
          class="user-item"
        >
          <template #prepend>
            <v-avatar size="24" class="me-2">
              <template v-if="user.avatar">
                <v-img :src="user.avatar" />
              </template>
              <template v-else>
                <v-icon size="16">mdi-account</v-icon>
              </template>
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2">{{ user.name }}</v-list-item-title>
          <template #append>
            <v-icon size="12" color="success">mdi-circle</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Основная область чата -->
    <v-main class="chat-main">
      <!-- Заголовок чата -->
      <v-app-bar
        color="surface"
        height="72"
        flat
        class="chat-header"
      >
        <div class="d-flex align-center w-100 px-4">
          <div class="flex-grow-1">
            <div class="d-flex align-center">
              <v-icon class="me-2">mdi-pound</v-icon>
              <span class="text-h6 font-weight-bold">{{ activeChannel?.name || 'Выберите канал' }}</span>
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ activeChannel?.description || 'Начните общение' }}
            </div>
          </div>
          
          <div class="d-flex align-center gap-2">
            <!-- Поиск -->
            <v-text-field
              v-model="searchQuery"
              placeholder="Поиск сообщений..."
              density="compact"
              rounded="pill"
              variant="solo-filled"
              flat
              hide-details
              class="search-field"
              style="max-width: 200px;"
            >
              <template #prepend-inner>
                <v-icon size="18">mdi-magnify</v-icon>
              </template>
            </v-text-field>

            <!-- Уведомления -->
            <v-btn icon size="small">
              <v-icon>mdi-bell</v-icon>
            </v-btn>

            <!-- Закрепленные сообщения -->
            <v-btn icon size="small">
              <v-icon>mdi-pin</v-icon>
            </v-btn>

            <!-- Участники -->
            <v-btn icon size="small" @click="toggleMembersPanel">
              <v-icon>mdi-account-group</v-icon>
            </v-btn>

            <!-- Кнопка изменения темы -->
            <v-btn icon size="small" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
              <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
            </v-btn>

            <!-- Меню -->
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn icon size="small" v-bind="props">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="showChannelSettings = true">
                  <template #prepend>
                    <v-icon>mdi-cog</v-icon>
                  </template>
                  <v-list-item-title>Настройки канала</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showInviteDialog = true">
                  <template #prepend>
                    <v-icon>mdi-account-plus</v-icon>
                  </template>
                  <v-list-item-title>Пригласить участников</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </v-app-bar>

      <!-- Область сообщений -->
      <div class="messages-area">
        <router-view />
      </div>

      <!-- Поле ввода сообщения -->
      <v-footer
        height="80"
        app
        class="message-input-footer"
      >
        <div class="d-flex align-center w-100 px-4">
          <v-text-field
            v-model="messageText"
            placeholder="Написать сообщение..."
            variant="outlined"
            rounded="pill"
            hide-details
            class="message-input"
            @keydown.enter="sendMessage"
          >
            <template #prepend-inner>
              <v-btn icon size="small" class="me-2">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <template #append-inner>
              <v-btn icon size="small" class="me-2">
                <v-icon>mdi-emoticon</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="sendMessage" :disabled="!messageText.trim()">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>
      </v-footer>
    </v-main>

    <!-- Правая панель участников -->
    <v-navigation-drawer
      location="right"
      width="240"
      color="background"
      v-model="showMembersPanel"
      class="members-panel"
    >
      <v-list>
        <v-list-subheader class="text-uppercase text-caption font-weight-bold">
          Участники — {{ allUsers.length }}
        </v-list-subheader>
        
        <v-list-item
          v-for="user in allUsers"
          :key="user.id"
          link
          class="member-item"
        >
          <template #prepend>
            <v-avatar size="32" class="me-3">
              <template v-if="user.avatar">
                <v-img :src="user.avatar" />
              </template>
              <template v-else>
                <v-icon size="20">mdi-account</v-icon>
              </template>
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2">{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle class="text-caption">{{ user.status }}</v-list-item-subtitle>
          <template #append>
            <v-icon 
              size="12" 
              :color="user.online ? 'success' : 'grey'"
            >
              mdi-circle
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Диалоги -->
    <v-dialog v-model="showAddServer" max-width="400">
      <v-card>
        <v-card-title>Создать сервер</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newServer.name"
            label="Название сервера"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="newServer.description"
            label="Описание"
            variant="outlined"
            rows="3"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="showAddServer = false">Отмена</v-btn>
          <v-btn color="primary" @click="createServer">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAddChannel" max-width="400">
      <v-card>
        <v-card-title>Создать канал</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newChannel.name"
            label="Название канала"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="newChannel.description"
            label="Описание"
            variant="outlined"
            rows="3"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="showAddChannel = false">Отмена</v-btn>
          <v-btn color="primary" @click="createChannel">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог просмотра изображения -->
    <v-dialog
      v-model="showImageDialog"
      :fullscreen="$vuetify.display.smAndDown"
      :max-width="$vuetify.display.smAndDown ? '100%' : '800px'"
    >
      <v-card class="image-dialog">
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span>Изображение</span>
          <v-btn icon @click="showImageDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-4 text-center">
          <v-img
            :src="selectedImage"
            max-height="600"
            contain
            class="mx-auto"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useProfileStore } from '../store/profile.js'
import { useMessagesStore } from '../store/messages.js'

const profileStore = useProfileStore()
const router = useRouter()
const theme = useTheme()
const messagesStore = useMessagesStore()

// Состояние
const showMembersPanel = ref(false)
const showAddServer = ref(false)
const showAddChannel = ref(false)
const showServerMenu = ref(false)
const showChannelSettings = ref(false)
const showInviteDialog = ref(false)
const searchQuery = ref('')
const messageText = ref('')

// Данные
const currentServer = ref(null)
const activeChannel = ref(null)

// Тестовые данные
const servers = ref([
  { id: 1, name: 'TacMap', icon: 'mdi-map', color: 'primary', description: 'Основной сервер' },
  { id: 2, name: 'Alpha Squad', icon: 'mdi-account-group', color: 'success', description: 'Команда Alpha' },
  { id: 3, name: 'Beta Squad', icon: 'mdi-account-group', color: 'warning', description: 'Команда Beta' }
])

const channels = ref([
  { id: 1, name: 'общий', description: 'Общий канал', unreadCount: 0 },
  { id: 2, name: 'команда', description: 'Командный канал', unreadCount: 3 },
  { id: 3, name: 'новости', description: 'Новости и объявления', unreadCount: 0 }
])

const onlineUsers = ref([
  { id: 1, name: 'Иван Петров', avatar: '', online: true },
  { id: 2, name: 'Алексей Сидоров', avatar: '', online: true },
  { id: 3, name: 'Мария Козлова', avatar: '', online: true }
])

const allUsers = ref([
  { id: 1, name: 'Иван Петров', avatar: '', status: 'Онлайн', online: true },
  { id: 2, name: 'Алексей Сидоров', avatar: '', status: 'В игре', online: true },
  { id: 3, name: 'Мария Козлова', avatar: '', status: 'Не беспокоить', online: true },
  { id: 4, name: 'Дмитрий Волков', avatar: '', status: 'Не в сети', online: false }
])

const newServer = ref({ name: '', description: '' })
const newChannel = ref({ name: '', description: '' })

// Методы
const navigateToHome = () => {
  router.push('/')
}

const selectServer = (server) => {
  currentServer.value = server
  // Здесь можно загрузить каналы сервера
}

const selectChannel = (channel) => {
  activeChannel.value = channel
  // Здесь можно загрузить сообщения канала
}

const toggleMembersPanel = () => {
  showMembersPanel.value = !showMembersPanel.value
}

const sendMessage = () => {
  if (messageText.value.trim()) {
    // Создаем сообщение
    const message = {
      conversationId: activeChannel.value?.id || 'general',
      senderId: currentUserId.value,
      senderName: 'Вы',
      senderAvatar: '',
      type: 'text',
      content: messageText.value,
      timestamp: new Date().toISOString()
    }
    
    // Добавляем в store
    messagesStore.addMessage(message)
    
    // Очищаем поле ввода
    messageText.value = ''
    
    console.log('Отправка сообщения:', message)
  }
}

// Добавляем методы для работы с сообщениями
const openImage = (imageUrl) => {
  selectedImage.value = imageUrl
  showImageDialog.value = true
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

const createServer = () => {
  if (newServer.value.name) {
    const server = {
      id: Date.now(),
      name: newServer.value.name,
      description: newServer.value.description,
      icon: 'mdi-server',
      color: 'primary'
    }
    servers.value.push(server)
    newServer.value = { name: '', description: '' }
    showAddServer.value = false
  }
}

const createChannel = () => {
  if (newChannel.value.name) {
    const channel = {
      id: Date.now(),
      name: newChannel.value.name,
      description: newChannel.value.description,
      unreadCount: 0
    }
    channels.value.push(channel)
    newChannel.value = { name: '', description: '' }
    showAddChannel.value = false
  }
}

// Состояние для диалогов
const showImageDialog = ref(false)
const selectedImage = ref('')

// Текущий пользователь
const currentUserId = ref('user1')

// Логика темы
const isDark = computed(() => {
  const currentTheme = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
  return currentTheme === 'tacticalDark'
})

const accentColor = computed(() => {
  return theme.current.value?.colors?.accent || '#1976D2'
})

function applyThemeFromStorage() {
  const availableThemes = ['tacticalLight', 'tacticalDark']
  const savedTheme = localStorage.getItem('selectedTheme')
  theme.change(availableThemes.includes(savedTheme) ? savedTheme : 'tacticalLight')
}

const toggleTheme = () => {
  const currentTheme = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
  const newTheme = currentTheme === 'tacticalLight' ? 'tacticalDark' : 'tacticalLight'
  localStorage.setItem('selectedTheme', newTheme)
  theme.change(newTheme)
  
  // Отправляем событие для обновления темы в других компонентах
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }))
}

// Инициализация
onMounted(() => {
  // Инициализация темы
  applyThemeFromStorage()
  window.addEventListener('storage', (e) => {
    if (e.key === 'selectedTheme') {
      applyThemeFromStorage()
    }
  })
  window.addEventListener('themeChanged', applyThemeFromStorage)
  
  // Обработчик событий от компонентов сообщений
  window.addEventListener('openImage', (e) => {
    selectedImage.value = e.detail
    showImageDialog.value = true
  })
  
  // Инициализация данных
  if (servers.value.length > 0) {
    currentServer.value = servers.value[0]
  }
  if (channels.value.length > 0) {
    activeChannel.value = channels.value[0]
  }
})
</script>

<style scoped>
.messages-app {
  height: 100vh;
}

.servers-panel {
  border-right: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-background));
}

.channels-panel {
  border-right: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-background));
}

.chat-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgb(var(--v-theme-background));
}

.chat-header {
  border-bottom: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-surface));
}

.messages-area {
  flex: 1;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
}

.message-input-footer {
  border-top: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-surface));
}

.message-input {
  max-width: none;
}

.members-panel {
  border-left: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-background));
}

/* Выравнивание иконок в стиле MainLayout */
.back-button {
  padding: 4px 8px !important;
  min-height: 40px;
}

.server-item {
  padding: 4px 8px !important;
  min-height: 40px;
  margin: 1px 0;
}

.add-server-item {
  padding: 4px 8px !important;
  min-height: 40px;
  margin: 1px 0;
}

.server-item--active {
  background-color: rgb(var(--v-theme-surface-container));
}

.channels-panel .v-list-item {
  padding-left: 16px;
  padding-right: 16px;
}

.channels-panel .v-list-item--active {
  background-color: rgb(var(--v-theme-surface-container));
}

.image-dialog {
  border-radius: 12px;
}

/* Темизация текста */
.v-list-subheader {
  color: rgb(var(--v-theme-on-surface-variant));
}

.v-list-item-title {
  color: rgb(var(--v-theme-on-surface));
}

.v-list-item-subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Адаптивность */
@media (max-width: 768px) {
  .channels-panel {
    width: 200px !important;
  }
  
  .members-panel {
    width: 200px !important;
  }
  
  .search-field {
    max-width: 150px;
  }
  
  .image-dialog {
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
}
</style> 