<template>
  <v-app id="messages-app">
    <!-- Системная панель -->
    <v-system-bar color="surface-variant" height="24">
      <v-icon size="16" class="me-2 systembar-back" @click="navigateToHome" style="cursor:pointer;">mdi-arrow-left</v-icon>
      <v-spacer></v-spacer>
      <v-icon size="16">mdi-wifi</v-icon>
      <v-icon size="16">mdi-signal</v-icon>
      <v-icon size="16">mdi-battery</v-icon>
    </v-system-bar>

    <!-- Левая rail-панель серверов -->
    <v-navigation-drawer
      color="background"
      rail
      permanent
      class="servers-panel"
      width="72"
      
    >
      <v-list nav density="compact">
        <v-list-item
          v-for="server in servers"
          :key="server.id"
          :active="currentServer?.id === server.id && chatType === 'channel'"
          @click="selectServer(server)"
          link
          class="server-item d-flex justify-center"
        >
          <v-avatar size="40" :color="currentServer?.id === server.id ? 'grey-lighten-4' : 'grey-lighten-2'">
            <v-icon size="28" :color="currentServer?.id === server.id ? accentColor : 'grey-darken-1'">{{ server.icon }}</v-icon>
          </v-avatar>
        </v-list-item>
        <v-divider class="my-4" :style="{ borderColor: accentColor }"></v-divider>
        <v-list-item
          v-for="dm in uniqueDMs"
          :key="dm.id"
          :active="activeDM?.id === dm.id && chatType === 'dm'"
          @click="selectDM(dm)"
          link
          class="dm-item d-flex justify-center"
        >
          <v-avatar size="32" :color="activeDM?.id === dm.id && chatType === 'dm' ? 'grey-lighten-4' : 'grey-lighten-2'">
            <v-icon size="20" :color="activeDM?.id === dm.id && chatType === 'dm' ? accentColor : 'grey-darken-1'">mdi-account</v-icon>
          </v-avatar>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Панель каналов (drawer/rail) -->
    <v-navigation-drawer
      v-model="channelsDrawer"
      :permanent="!isMobile"
      :temporary="isMobile"
      :rail="!isMobile && channelsRail"
      width="244"
      color="background"
      class="channels-panel"
      
    >
      <v-sheet color="surface" height="72" class="d-flex align-center px-3">
        <v-btn icon variant="text" :color="accentColor" @click="toggleChannelsRail" v-if="!isMobile" style="margin-right: 4px;" rounded="0">
          <v-icon>{{ channelsRail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
        </v-btn>
        <v-btn icon size="small" @click="toggleChannelsDrawer" v-if="isMobile">
          <v-icon :color="accentColor">{{ channelsDrawer ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
        </v-btn>
        <span v-if="!channelsRail" class="text-h6 font-weight-bold ml-2" :style="{ color: accentColor }">{{ currentServer?.name || '...' }}</span>
      </v-sheet>
      <v-list nav>
        <v-list-subheader class="text-uppercase text-caption font-weight-bold d-flex align-center" :style="{ color: accentColor }">
          <v-icon size="18" :color="accentColor">mdi-pound</v-icon>
          <span v-if="!channelsRail" class="ml-2">Текстовые каналы</span>
        </v-list-subheader>
        <v-list-item
          v-for="channel in channels"
          :key="channel.id"
          :active="activeChannel?.id === channel.id && chatType === 'channel'"
          @click="selectChannel(channel)"
          link
          class="channel-item"
          :style="activeChannel?.id === channel.id && chatType === 'channel' ? { background: accentColor + '22' } : {}"
        >
          <template #prepend>
            <v-icon size="18" :color="activeChannel?.id === channel.id && chatType === 'channel' ? accentColor : undefined">mdi-pound</v-icon>
          </template>
          <v-list-item-title v-if="!channelsRail" class="text-body-2" :style="activeChannel?.id === channel.id && chatType === 'channel' ? { color: accentColor } : {}">{{ channel.name }}</v-list-item-title>
        </v-list-item>
        <v-divider class="my-3" :style="{ borderColor: accentColor }"></v-divider>
        <v-list-subheader class="text-uppercase text-caption font-weight-bold d-flex align-center" :style="{ color: accentColor }">
          <v-icon size="18" :color="accentColor">mdi-account-group</v-icon>
          <span v-if="!channelsRail" class="ml-2">Онлайн — {{ onlineServerUsers.length }}</span>
        </v-list-subheader>
        <v-list-item
          v-for="user in onlineServerUsers"
          :key="user.id"
          link
          class="user-item"
          @click="openDMByUser(user)"
        >
          <template #prepend>
            <v-avatar size="24" class="me-2">
              <v-icon size="16">mdi-account</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2">{{ user.name }}</v-list-item-title>
          <template #append>
            <v-icon size="12" color="success">mdi-circle</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Верхний app-bar -->
    <v-app-bar color="surface" height="72" flat class="chat-header px-3">
      <template v-if="isMobile">
        <v-btn icon size="small" @click="toggleChannelsDrawer" class="mr-2">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <span class="text-h6 font-weight-bold" :style="{ color: accentColor }">{{ chatTitle }}</span>
      <v-spacer></v-spacer>
      <v-responsive max-width="200">
        <v-text-field
          v-model="searchQuery"
          placeholder="Поиск..."
          density="compact"
          rounded="pill"
          variant="solo-filled"
          flat
          hide-details
        ></v-text-field>
      </v-responsive>
      <v-btn icon size="small" @click="toggleMembersPanel">
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
      <v-btn icon size="small" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Центр: сообщения -->
    <v-main class="chat-main">
      <div class="messages-area px-4 py-2" style="height:calc(100vh - 200px); overflow-y:auto;">
        <div v-for="(msg, idx) in currentMessages" :key="idx" class="d-flex align-center mb-2">
          <v-avatar size="28" class="me-2">
            <v-icon size="18">mdi-account</v-icon>
          </v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold">{{ msg.sender }}</div>
            <div class="text-body-2">{{ msg.text }}</div>
            <div class="text-caption text-medium-emphasis">{{ msg.time }}</div>
          </div>
        </div>
        <div v-if="currentMessages.length === 0" class="text-caption text-medium-emphasis">Нет сообщений</div>
      </div>
    </v-main>

    <!-- Правый drawer -->
    <v-navigation-drawer
      location="right"
      width="240"
      color="background"
      v-model="showMembersPanel"
      class="members-panel"
      
    >
      <v-list>
        <v-list-subheader class="text-uppercase text-caption font-weight-bold">
          Участники — {{ serverUsers.length }}
        </v-list-subheader>
        <v-list-item
          v-for="user in serverUsers"
          :key="user.id"
          link
          class="member-item"
          @click="openDMByUser(user)"
        >
          <template #prepend>
            <v-avatar size="32" class="me-3">
              <v-icon size="20">mdi-account</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2">{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle class="text-caption">{{ user.status }}</v-list-item-subtitle>
          <template #append>
            <v-icon size="12" :color="user.online ? 'success' : 'grey'">mdi-circle</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Футер -->
    <v-footer height="72" app>
      <v-text-field
        v-model="messageText"
        placeholder="Написать сообщение..."
        density="compact"
        rounded="pill"
        variant="solo-filled"
        flat
        hide-details
        @keydown.enter="sendMessage"
        class="message-input"
      >
        <template #append-inner>
          <v-btn icon size="small" @click="sendMessage" :disabled="!messageText.trim()">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
const router = useRouter()

const theme = useTheme()
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// Моковые данные (оставляем как раньше)
const servers = ref([
  { id: 1, name: 'Фракция', icon: 'mdi-flag', color: 'primary', description: 'Главный сервер фракции',
    channels: [
      { id: 1, name: 'общий', description: 'Общий чат фракции', unreadCount: 0 },
      { id: 2, name: 'новости', description: 'Новости фракции', unreadCount: 2 }
    ]
  },
  { id: 2, name: 'Alpha Squad', icon: 'mdi-account-group', color: 'success', description: 'Команда Alpha',
    channels: [
      { id: 3, name: 'alpha-общий', description: 'Общий канал Alpha', unreadCount: 1 },
      { id: 4, name: 'alpha-игра', description: 'Игровой канал Alpha', unreadCount: 0 }
    ]
  },
  { id: 3, name: 'Beta Squad', icon: 'mdi-account-group', color: 'warning', description: 'Команда Beta',
    channels: [
      { id: 5, name: 'beta-общий', description: 'Общий канал Beta', unreadCount: 0 },
      { id: 6, name: 'beta-игра', description: 'Игровой канал Beta', unreadCount: 0 }
    ]
  }
])
const dms = ref([
  { id: 'dm-1', user: { id: 2, name: 'Алексей Сидоров', avatar: '', online: true } },
  { id: 'dm-2', user: { id: 3, name: 'Мария Козлова', avatar: '', online: true } },
  { id: 'dm-3', user: { id: 4, name: 'Дмитрий Волков', avatar: '', online: false } }
])
// Моковые сообщения для каналов и ЛС
const messages = ref({
  1: [ // фракция-общий
    { sender: 'Иван Петров', text: 'Всем привет от фракции!', time: '10:00' },
    { sender: 'Виктория Лебедева', text: 'Фракция — сила!', time: '10:01' },
    { sender: 'Алексей Сидоров', text: 'Кто сегодня на собрании?', time: '10:02' }
  ],
  2: [ // фракция-новости
    { sender: 'Иван Петров', text: 'Сегодня важное объявление!', time: '09:00' },
    { sender: 'Григорий Мельник', text: 'Жду новостей!', time: '09:01' },
    { sender: 'Виктория Лебедева', text: 'Буду на связи.', time: '09:02' }
  ],
  3: [ // alpha-общий
    { sender: 'Сергей Иванов', text: 'Alpha squad, на связи!', time: '12:00' },
    { sender: 'Екатерина Орлова', text: 'Привет, Alpha!', time: '12:01' },
    { sender: 'Виктория Лебедева', text: 'Всем привет!', time: '12:02' },
    { sender: 'Алексей Сидоров', text: 'Готовимся к миссии.', time: '12:03' }
  ],
  4: [ // alpha-игра
    { sender: 'Павел Кузнецов', text: 'Когда стартуем?', time: '13:00' },
    { sender: 'Сергей Иванов', text: 'Через 10 минут!', time: '13:01' },
    { sender: 'Ольга Смирнова', text: 'Я уже в игре.', time: '13:02' }
  ],
  5: [ // beta-общий
    { sender: 'Мария Козлова', text: 'Beta squad, привет!', time: '14:00' },
    { sender: 'Екатерина Орлова', text: 'Всем привет!', time: '14:01' },
    { sender: 'Григорий Мельник', text: 'Готов к бою!', time: '14:02' },
    { sender: 'Дмитрий Волков', text: 'Я подтянусь позже.', time: '14:03' }
  ],
  6: [ // beta-игра
    { sender: 'Мария Козлова', text: 'Кто сегодня играет за Beta?', time: '15:00' },
    { sender: 'Павел Кузнецов', text: 'Я точно буду!', time: '15:01' },
    { sender: 'Екатерина Орлова', text: 'Я тоже!', time: '15:02' }
  ],
  // ЛС (оставляю как раньше)
  'dm-1': [
    { sender: 'Иван Петров', text: 'Привет! Как дела?', time: '15:00' },
    { sender: 'Вы', text: 'Привет! Всё отлично, спасибо!', time: '15:01' }
  ],
  'dm-2': [
    { sender: 'Алексей Сидоров', text: 'Пойдём сегодня играть?', time: '16:00' },
    { sender: 'Вы', text: 'Да, я за!', time: '16:01' }
  ],
  'dm-3': [
    { sender: 'Мария Козлова', text: 'Ты видел обнову?', time: '17:00' },
    { sender: 'Вы', text: 'Да, круто сделали!', time: '17:01' }
  ],
  'dm-4': [
    { sender: 'Дмитрий Волков', text: 'Когда следующая встреча?', time: '18:00' },
    { sender: 'Вы', text: 'В пятницу вечером!', time: '18:01' }
  ],
  'dm-5': [
    { sender: 'Сергей Иванов', text: 'Есть вопросы по тактике.', time: '19:00' },
    { sender: 'Вы', text: 'Пиши, помогу!', time: '19:01' }
  ],
  'dm-6': [
    { sender: 'Ольга Смирнова', text: 'Я не смогу сегодня.', time: '20:00' },
    { sender: 'Вы', text: 'Ок, напиши как сможешь.', time: '20:01' }
  ],
  'dm-7': [
    { sender: 'Павел Кузнецов', text: 'Где все?', time: '21:00' },
    { sender: 'Вы', text: 'Скоро подтянутся!', time: '21:01' }
  ],
  'dm-8': [
    { sender: 'Екатерина Орлова', text: 'Ты в какой команде?', time: '22:00' },
    { sender: 'Вы', text: 'В Alpha, а ты?', time: '22:01' }
  ],
  'dm-9': [
    { sender: 'Виктория Лебедева', text: 'Привет! Как настрой?', time: '23:00' },
    { sender: 'Вы', text: 'Боевой!', time: '23:01' }
  ],
  'dm-10': [
    { sender: 'Григорий Мельник', text: 'Завтра будешь?', time: '09:00' },
    { sender: 'Вы', text: 'Постараюсь быть.', time: '09:01' }
  ]
})
// Моковые данные пользователей и распределение по каналам
const allUsers = ref([
  { id: 1, name: 'Иван Петров', avatar: '', status: 'Онлайн', online: true },
  { id: 2, name: 'Алексей Сидоров', avatar: '', status: 'В игре', online: true },
  { id: 3, name: 'Мария Козлова', avatar: '', status: 'Не беспокоить', online: true },
  { id: 4, name: 'Дмитрий Волков', avatar: '', status: 'Не в сети', online: false },
  { id: 5, name: 'Сергей Иванов', avatar: '', status: 'В сети', online: true },
  { id: 6, name: 'Ольга Смирнова', avatar: '', status: 'Не в сети', online: false },
  { id: 7, name: 'Павел Кузнецов', avatar: '', status: 'В сети', online: true },
  { id: 8, name: 'Екатерина Орлова', avatar: '', status: 'В игре', online: true },
  { id: 9, name: 'Виктория Лебедева', avatar: '', status: 'В сети', online: true },
  { id: 10, name: 'Григорий Мельник', avatar: '', status: 'Не в сети', online: false }
])
// channelId -> userIds (разные тусовки)
const channelUsers = ref({
  1: [1,2,9],        // фракция-общий: Иван, Алексей, Виктория
  2: [1,9,10],      // фракция-новости: Иван, Виктория, Григорий
  3: [2,5,8,9],     // alpha-общий: Алексей, Сергей, Екатерина, Виктория
  4: [5,6,7],       // alpha-игра: Сергей, Ольга, Павел
  5: [3,4,8,10],    // beta-общий: Мария, Дмитрий, Екатерина, Григорий
  6: [3,4,7,8],     // beta-игра: Мария, Дмитрий, Павел, Екатерина
})

const currentServer = ref(servers.value[0])
const activeChannel = ref(currentServer.value.channels[0])
const activeDM = ref(null)
const chatType = ref('channel')
const channelsDrawer = ref(true)
const channelsRail = ref(false)
const showMembersPanel = ref(false)
const messageText = ref('')
const searchQuery = ref('')

const channels = computed(() => currentServer.value?.channels || [])
const currentMessages = computed(() => {
  if (chatType.value === 'channel' && activeChannel.value) {
    return messages.value[activeChannel.value.id] || []
  }
  if (chatType.value === 'dm' && activeDM.value) {
    return messages.value[activeDM.value.id] || []
  }
  return []
})
const chatTitle = computed(() => {
  if (chatType.value === 'channel' && activeChannel.value) {
    return '#' + activeChannel.value.name
  }
  if (chatType.value === 'dm' && activeDM.value) {
    return activeDM.value.user.name
  }
  return 'Выберите чат'
})
const onlineUsers = computed(() => allUsers.value.filter(u => u.online))
const isDark = computed(() => {
  const currentTheme = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
  return currentTheme === 'tacticalDark'
})
const accentColor = computed(() => {
  return theme.current.value?.colors?.accent || '#1976D2'
})

// serverId -> userIds (разные участники на разных серверах)
const serverUsers = computed(() => {
  if (!currentServer.value) return []
  // Собираем всех пользователей, которые есть хотя бы в одном канале этого сервера
  const ids = new Set()
  for (const ch of currentServer.value.channels) {
    (channelUsers.value[ch.id] || []).forEach(id => ids.add(id))
  }
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

function selectServer(server) {
  currentServer.value = server
  activeChannel.value = server.channels[0] || null
  activeDM.value = null
  chatType.value = 'channel'
}
function selectChannel(channel) {
  activeChannel.value = channel
  activeDM.value = null
  chatType.value = 'channel'
}
function selectDM(dm) {
  activeDM.value = dm
  activeChannel.value = null
  chatType.value = 'dm'
}
function sendMessage() {
  if (!messageText.value.trim()) return
  let chatId = null
  if (chatType.value === 'channel' && activeChannel.value) chatId = activeChannel.value.id
  if (chatType.value === 'dm' && activeDM.value) chatId = activeDM.value.id
  if (!chatId) return
  if (!messages.value[chatId]) messages.value[chatId] = []
  messages.value[chatId].push({
    sender: 'Вы',
    text: messageText.value,
    time: new Date().toLocaleTimeString().slice(0,5)
  })
  messageText.value = ''
}
function toggleChannelsRail() {
  channelsRail.value = !channelsRail.value
}
function toggleChannelsDrawer() {
  channelsDrawer.value = !channelsDrawer.value
}
function toggleMembersPanel() {
  showMembersPanel.value = !showMembersPanel.value
}
function toggleTheme() {
  const currentTheme = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
  const newTheme = currentTheme === 'tacticalLight' ? 'tacticalDark' : 'tacticalLight'
  localStorage.setItem('selectedTheme', newTheme)
  theme.change(newTheme)
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }))
}
function navigateToHome() {
  router.push('/')
}
function openDMByUser(user) {
  let dm = dms.value.find(dm => dm.user.id === user.id)
  if (!dm) {
    dm = { id: 'dm-' + user.id, user }
    dms.value.push(dm)
  }
  activeDM.value = dm
  activeChannel.value = null
  chatType.value = 'dm'
}
</script>

<style scoped>
.channels-panel .v-list-subheader {
  min-height: 40px;
  padding-left: 0 !important;
  padding-right: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.channels-panel .v-list-subheader .v-icon {
  min-width: 32px;
  min-height: 32px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.channels-panel .v-list-subheader .ml-2 {
  margin-left: 8px !important;
}
.channels-panel[rail] .v-list-subheader span {
  display: none !important;
}
.channels-panel[rail] .v-list-subheader {
  justify-content: center;
}

.servers-panel .v-list-item,
.servers-panel .v-avatar {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.servers-panel .v-avatar {
  margin: 0 auto !important;
}
.servers-panel .v-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 auto !important;
}
.systembar-back {
  transition: color 0.2s;
}
.systembar-back:hover {
  color: var(--v-theme-accent, #1976D2);
}
</style> 