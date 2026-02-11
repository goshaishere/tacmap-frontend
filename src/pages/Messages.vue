<template>
  <div class="messages-page">
    <div
      class="messages-layout"
      :class="{
        'mobile-chat-open': isMobile && mobileChatOpen,
        'members-open': showMembersPanel && activeChat && !isMobile
      }"
    >
      <!-- Боковая панель: список чатов -->
      <aside class="messages-sidebar" :class="{ 'sidebar-hidden': isMobile && mobileChatOpen }">
        <div class="sidebar-header">
          <h1 class="sidebar-title">
            <v-icon color="accent" class="me-2">mdi-message-text</v-icon>
            {{ t('messages.title') }}
          </h1>
          <v-text-field
            v-model="searchQuery"
            :placeholder="t('messages.search')"
            density="compact"
            variant="outlined"
            hide-details
            rounded="lg"
            class="sidebar-search"
            bg-color="surface-variant"
          >
            <template #prepend-inner>
              <v-icon size="20" class="text-medium-emphasis">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </div>

        <div class="sidebar-list">
          <!-- Серверы и каналы -->
          <template v-for="server in servers" :key="'s-' + server.id">
            <div class="list-group">
              <button
                class="list-group-label"
                @click="currentServer = server"
              >
                <v-avatar size="28" :color="currentServer?.id === server.id ? 'accent' : 'surface-variant'">
                  <v-icon size="18" :color="currentServer?.id === server.id ? 'white' : undefined">{{ server.icon }}</v-icon>
                </v-avatar>
                <span class="group-name">{{ server.name }}</span>
              </button>
              <button
                v-for="ch in server.channels"
                :key="ch.id"
                class="list-item"
                :class="{ active: chatType === 'channel' && activeChannel?.id === ch.id }"
                @click="selectChannel(ch)"
              >
                <v-icon size="18" class="list-item-icon">mdi-pound</v-icon>
                <div class="list-item-body">
                  <span class="list-item-name">{{ ch.name }}</span>
                  <span class="list-item-preview">{{ getLastPreview('channel', ch.id) }}</span>
                </div>
                <span v-if="ch.unreadCount" class="unread-badge">{{ ch.unreadCount }}</span>
              </button>
            </div>
          </template>

          <!-- Личные сообщения -->
          <div class="list-group">
            <div class="list-group-label static">
              <v-icon size="18">mdi-account-multiple</v-icon>
              <span class="group-name">{{ t('messages.directMessages') }}</span>
            </div>
            <button
              v-for="dm in uniqueDMs"
              :key="dm.id"
              class="list-item"
              :class="{ active: chatType === 'dm' && activeDM?.id === dm.id }"
              @click="selectDM(dm)"
            >
              <v-avatar size="36" class="list-item-avatar" :class="{ online: dm.user.online }">
                <v-icon size="20">mdi-account</v-icon>
              </v-avatar>
              <div class="list-item-body">
                <span class="list-item-name">{{ dm.user.name }}</span>
                <span class="list-item-preview">{{ getLastPreview('dm', dm.id) }}</span>
              </div>
              <span v-if="dm.user.online" class="online-dot" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Область чата -->
      <main class="messages-main">
        <template v-if="!activeChat || !showChatView">
          <!-- Пустое состояние: чат не выбран или мобильный список -->
          <div class="empty-chat">
            <v-icon size="80" color="surface-variant" class="empty-icon">mdi-chat-outline</v-icon>
            <h2 class="text-h5 text-on-surface font-weight-medium mt-4">{{ t('messages.selectChat') }}</h2>
            <p class="text-body-2 text-medium-emphasis mt-2">{{ t('messages.selectChatHint') }}</p>
            <v-btn
              v-if="isMobile && mobileChatOpen"
              color="accent"
              variant="tonal"
              class="mt-4"
              prepend-icon="mdi-arrow-left"
              @click="mobileChatOpen = false"
            >
              {{ t('messages.backToChats') }}
            </v-btn>
          </div>
        </template>

        <template v-else-if="activeChat">
          <!-- Шапка чата -->
          <header class="chat-header">
            <v-btn
              v-if="isMobile"
              icon
              variant="text"
              class="back-btn"
              @click="mobileChatOpen = false"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-avatar size="40" class="header-avatar">
              <v-icon v-if="chatType === 'channel'">mdi-pound</v-icon>
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
            <div class="header-info">
              <span class="header-title">{{ chatTitle }}</span>
              <span v-if="chatType === 'dm' && activeDM?.user?.online" class="header-status text-caption text-success">
                {{ t('messages.online') }}
              </span>
            </div>
            <v-spacer />
            <v-btn icon variant="text" size="small" @click="showMembersPanel = !showMembersPanel">
              <v-icon>mdi-account-group-outline</v-icon>
            </v-btn>
          </header>

          <!-- Лента сообщений -->
          <div class="chat-feed" ref="chatFeedRef">
            <div
              v-for="(msg, idx) in displayMessages"
              :key="idx"
              class="message-row"
              :class="{ own: msg.sender === 'you' }"
            >
              <template v-if="msg.sender !== 'you'">
                <v-avatar
                  v-if="showAvatar(idx, true)"
                  size="32"
                  class="message-avatar"
                >
                  <v-icon size="18">mdi-account</v-icon>
                </v-avatar>
                <div v-else class="message-avatar-spacer" />
                <div class="message-bubble other">
                  <span v-if="showAvatar(idx, true)" class="message-sender">{{ msg.sender }}</span>
                  <p class="message-text">{{ msg.text }}</p>
                  <span class="message-time">{{ msg.time }}</span>
                </div>
              </template>
              <template v-else>
                <div class="message-bubble own">
                  <p class="message-text">{{ msg.text }}</p>
                  <span class="message-time">{{ msg.time }}</span>
                </div>
                <v-avatar
                  v-if="showAvatar(idx, false)"
                  size="32"
                  class="message-avatar own-avatar"
                >
                  <v-icon size="18">mdi-account</v-icon>
                </v-avatar>
                <div v-else class="message-avatar-spacer" />
              </template>
            </div>

            <div v-if="displayMessages.length === 0" class="empty-feed">
              <v-icon size="56" color="surface-variant">mdi-chat-plus-outline</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-3">{{ t('messages.noMessages') }}</p>
              <p class="text-caption text-medium-emphasis">{{ t('messages.noMessagesHint') }}</p>
            </div>
          </div>

          <!-- Поле ввода -->
          <footer class="chat-footer">
            <v-text-field
              v-model="messageText"
              :placeholder="t('messages.writePlaceholder')"
              variant="outlined"
              hide-details
              rounded="pill"
              density="comfortable"
              class="chat-input"
              autocomplete="off"
              @keydown.enter.exact.prevent="sendMessage"
            >
              <template #append-inner>
                <v-btn
                  icon
                  size="small"
                  color="accent"
                  :disabled="!messageText.trim()"
                  @click="sendMessage"
                >
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </footer>
        </template>
      </main>

      <!-- Панель участников (десктоп) -->
      <aside v-if="showMembersPanel && activeChat" class="members-panel">
        <div class="members-header">
          <span class="text-subtitle-2 font-weight-bold text-on-surface">
            {{ t('messages.membersCount', { n: serverUsers.length }) }}
          </span>
          <v-btn icon variant="text" size="x-small" @click="showMembersPanel = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-list density="compact" class="members-list">
          <v-list-item
            v-for="user in serverUsers"
            :key="user.id"
            class="member-item"
            @click="openDMByUser(user)"
          >
            <template #prepend>
              <v-avatar size="36" :class="{ online: user.online }">
                <v-icon size="20">mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2">{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{ user.status }}</v-list-item-subtitle>
            <template #append>
              <v-icon v-if="user.online" size="8" color="success">mdi-circle</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </aside>
    </div>

    <!-- Мобильный overlay (при открытом чате — тап закрывает панель участников или ничего) -->
    <div
      v-if="isMobile && mobileChatOpen && showMembersPanel"
      class="sidebar-overlay"
      @click="showMembersPanel = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// Данные
const servers = ref([
  {
    id: 1,
    name: 'Фракция',
    icon: 'mdi-flag',
    channels: [
      { id: 1, name: 'общий', description: 'Общий чат', unreadCount: 0 },
      { id: 2, name: 'новости', description: 'Новости', unreadCount: 2 },
    ],
  },
  {
    id: 2,
    name: 'Alpha Squad',
    icon: 'mdi-account-group',
    channels: [
      { id: 3, name: 'alpha-общий', unreadCount: 1 },
      { id: 4, name: 'alpha-игра', unreadCount: 0 },
    ],
  },
  {
    id: 3,
    name: 'Beta Squad',
    icon: 'mdi-account-group',
    channels: [
      { id: 5, name: 'beta-общий', unreadCount: 0 },
      { id: 6, name: 'beta-игра', unreadCount: 0 },
    ],
  },
])

const dms = ref([
  { id: 'dm-1', user: { id: 2, name: 'Алексей Сидоров', online: true } },
  { id: 'dm-2', user: { id: 3, name: 'Мария Козлова', online: true } },
  { id: 'dm-3', user: { id: 4, name: 'Дмитрий Волков', online: false } },
])

const messages = ref({
  1: [
    { sender: 'Иван Петров', text: 'Всем привет от фракции!', time: '10:00' },
    { sender: 'Виктория Лебедева', text: 'Фракция — сила!', time: '10:01' },
    { sender: 'Алексей Сидоров', text: 'Кто сегодня на собрании?', time: '10:02' },
  ],
  2: [
    { sender: 'Иван Петров', text: 'Сегодня важное объявление!', time: '09:00' },
    { sender: 'Григорий Мельник', text: 'Жду новостей!', time: '09:01' },
  ],
  3: [
    { sender: 'Сергей Иванов', text: 'Alpha squad, на связи!', time: '12:00' },
    { sender: 'Екатерина Орлова', text: 'Привет, Alpha!', time: '12:01' },
  ],
  4: [], 5: [], 6: [],
  'dm-1': [
    { sender: 'Иван Петров', text: 'Привет! Как дела?', time: '15:00' },
    { sender: 'you', text: 'Привет! Всё отлично, спасибо!', time: '15:01' },
  ],
  'dm-2': [
    { sender: 'Алексей Сидоров', text: 'Пойдём сегодня играть?', time: '16:00' },
    { sender: 'you', text: 'Да, я за!', time: '16:01' },
  ],
  'dm-3': [
    { sender: 'Мария Козлова', text: 'Ты видел обнову?', time: '17:00' },
    { sender: 'you', text: 'Да, круто сделали!', time: '17:01' },
  ],
})

const allUsers = ref([
  { id: 1, name: 'Иван Петров', status: 'Онлайн', online: true },
  { id: 2, name: 'Алексей Сидоров', status: 'В игре', online: true },
  { id: 3, name: 'Мария Козлова', status: 'Не беспокоить', online: true },
  { id: 4, name: 'Дмитрий Волков', status: 'Не в сети', online: false },
  { id: 5, name: 'Сергей Иванов', status: 'В сети', online: true },
  { id: 6, name: 'Ольга Смирнова', status: 'Не в сети', online: false },
  { id: 7, name: 'Павел Кузнецов', status: 'В сети', online: true },
  { id: 8, name: 'Екатерина Орлова', status: 'В игре', online: true },
  { id: 9, name: 'Виктория Лебедева', status: 'В сети', online: true },
  { id: 10, name: 'Григорий Мельник', status: 'Не в сети', online: false },
])

const channelUsers = ref({
  1: [1, 2, 9], 2: [1, 9, 10], 3: [2, 5, 8, 9], 4: [5, 6, 7],
  5: [3, 4, 8, 10], 6: [3, 4, 7, 8],
})

const currentServer = ref(servers.value[0])
const activeChannel = ref(null)
const activeDM = ref(null)
const chatType = ref('channel')
const searchQuery = ref('')
const messageText = ref('')
const showMembersPanel = ref(false)
const chatFeedRef = ref(null)

const activeChat = computed(() => (chatType.value === 'channel' ? activeChannel.value : activeDM.value) ?? null)

const mobileChatOpen = ref(false)
const showChatView = computed(() => !isMobile.value || mobileChatOpen.value)

const channels = computed(() => currentServer.value?.channels ?? [])
const serverUsers = computed(() => {
  if (!currentServer.value) return []
  const ids = new Set()
  for (const ch of currentServer.value.channels)
    (channelUsers.value[ch.id] || []).forEach(id => ids.add(id))
  return allUsers.value.filter(u => ids.has(u.id))
})
const onlineServerUsers = computed(() => serverUsers.value.filter(u => u.online))
const uniqueDMs = computed(() => {
  const seen = new Set()
  return dms.value.filter(dm => {
    if (seen.has(dm.user.id)) return false
    seen.add(dm.user.id)
    return true
  })
})

const displayMessages = computed(() => {
  let list = []
  if (chatType.value === 'channel' && activeChannel.value)
    list = messages.value[activeChannel.value.id] || []
  else if (chatType.value === 'dm' && activeDM.value)
    list = messages.value[activeDM.value.id] || []
  return list.map(m => ({
    ...m,
    sender: m.sender === 'you' ? t('messages.you') : m.sender,
  }))
})

const chatTitle = computed(() => {
  if (chatType.value === 'channel' && activeChannel.value) return '#' + activeChannel.value.name
  if (chatType.value === 'dm' && activeDM.value) return activeDM.value.user.name
  return ''
})

function getLastPreview(type, id) {
  const list = messages.value[id] || []
  if (list.length === 0) return ''
  const last = list[list.length - 1]
  const text = last.sender === 'you' ? t('messages.you') + ': ' + last.text : last.text
  return text.length > 40 ? text.slice(0, 40) + '…' : text
}

function showAvatar(idx, isOther) {
  const list = displayMessages.value
  if (idx === 0) return true
  const prev = list[idx - 1]
  return prev.sender !== (isOther ? list[idx].sender : 'you')
}

function selectChannel(channel) {
  activeChannel.value = channel
  activeDM.value = null
  chatType.value = 'channel'
  if (isMobile.value) mobileChatOpen.value = true
}

function selectDM(dm) {
  activeDM.value = dm
  activeChannel.value = null
  chatType.value = 'dm'
  if (isMobile.value) mobileChatOpen.value = true
}

function sendMessage() {
  if (!messageText.value.trim()) return
  let chatId = null
  if (chatType.value === 'channel' && activeChannel.value) chatId = activeChannel.value.id
  if (chatType.value === 'dm' && activeDM.value) chatId = activeDM.value.id
  if (!chatId) return
  if (!messages.value[chatId]) messages.value[chatId] = []
  messages.value[chatId].push({
    sender: 'you',
    text: messageText.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })
  messageText.value = ''
  nextTick(() => scrollFeedToBottom())
}

function openDMByUser(user) {
  let dm = dms.value.find(d => d.user.id === user.id)
  if (!dm) {
    dm = { id: 'dm-' + user.id, user: { ...user } }
    dms.value.push(dm)
  }
  selectDM(dm)
  showMembersPanel.value = false
}

function scrollFeedToBottom() {
  if (chatFeedRef.value)
    chatFeedRef.value.scrollTop = chatFeedRef.value.scrollHeight
}

watch([activeChannel, activeDM], () => nextTick(() => scrollFeedToBottom()))
</script>

<style scoped>
.messages-page {
  height: calc(100vh - 72px);
  min-height: 360px;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.messages-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 1fr;
  height: 100%;
  position: relative;
}

.messages-layout.mobile-chat-open {
  grid-template-columns: 0 1fr;
}

.messages-layout.members-open {
  grid-template-columns: 280px 1fr 260px;
}

@media (max-width: 960px) {
  .messages-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  .messages-layout .messages-sidebar,
  .messages-layout .messages-main {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    transition: transform 0.25s ease;
  }
  .messages-layout .messages-sidebar {
    z-index: 2;
  }
  .messages-layout .messages-main {
    z-index: 1;
    transform: translateX(100%);
  }
  .messages-layout.mobile-chat-open .messages-sidebar {
    transform: translateX(-100%);
  }
  .messages-layout.mobile-chat-open .messages-main {
    transform: translateX(0);
  }
}

.messages-sidebar {
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
  transition: transform 0.25s ease;
}

.sidebar-hidden {
  transform: translateX(-100%);
}

.sidebar-header {
  padding: 16px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
}

.sidebar-search {
  --v-input-border-opacity: 0.3;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.list-group {
  margin-bottom: 8px;
}

.list-group-label {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.875rem;
  font-weight: 600;
  text-align: left;
  transition: background 0.15s;
}

.list-group-label:hover {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.list-group-label.static {
  cursor: default;
  color: rgb(var(--v-theme-on-surface-variant));
}

.group-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  position: relative;
}

.list-item:hover {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.list-item.active {
  background: rgba(var(--v-theme-accent), 0.12);
}

.list-item.active .list-item-name {
  color: rgb(var(--v-theme-accent));
  font-weight: 600;
}

.list-item-icon {
  flex-shrink: 0;
  color: rgb(var(--v-theme-on-surface-variant));
}

.list-item.active .list-item-icon {
  color: rgb(var(--v-theme-accent));
}

.list-item-avatar {
  flex-shrink: 0;
}

.list-item-avatar.online::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: rgb(var(--v-theme-success));
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-surface));
}

.list-item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.list-item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-preview {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  flex-shrink: 0;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: rgb(var(--v-theme-accent));
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.online-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-success));
  flex-shrink: 0;
}

/* Main chat area */
.messages-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: rgb(var(--v-theme-surface-variant));
  background-opacity: 0.3;
}

.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.empty-icon {
  opacity: 0.5;
}

.chat-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.back-btn {
  margin-left: -4px;
}

.header-avatar {
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.header-status {
  font-size: 0.75rem;
}

.chat-feed {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 85%;
}

.message-row.own {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar-spacer {
  width: 32px;
  flex-shrink: 0;
}

.message-avatar {
  flex-shrink: 0;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
}

.message-avatar.own-avatar {
  background: rgb(var(--v-theme-accent));
  color: white;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  max-width: 100%;
  word-break: break-word;
}

.message-bubble.other {
  background: rgb(var(--v-theme-surface));
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.message-bubble.own {
  background: rgb(var(--v-theme-accent));
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.message-sender {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-accent));
  margin-bottom: 4px;
}

.message-text {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.4;
  color: inherit;
}

.message-bubble.other .message-text {
  color: rgb(var(--v-theme-on-surface));
}

.message-time {
  display: block;
  font-size: 0.6875rem;
  opacity: 0.75;
  margin-top: 4px;
}

.chat-footer {
  flex-shrink: 0;
  padding: 12px 16px;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.chat-input {
  max-width: 100%;
}

.chat-input :deep(.v-field) {
  background: rgb(var(--v-theme-surface-variant));
}

.empty-feed {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

/* Members panel */
.members-panel {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
}

@media (max-width: 960px) {
  .members-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 3;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  }
}

.members-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.members-list {
  flex: 1;
  overflow-y: auto;
}

.member-item {
  cursor: pointer;
}

.member-item .v-avatar.online::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: rgb(var(--v-theme-success));
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-surface));
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

@media (max-width: 960px) {
  .sidebar-overlay {
    display: block;
  }
}
</style>
