<template>
  <v-app id="inspire">
          <v-app-bar
        color="surface"
        height="72"
        flat
      >
        <!-- Мобильная кнопка меню -->
        <v-app-bar-nav-icon 
          @click="toggleDrawer" 
          class="d-md-none"
          style="cursor: pointer;"
        ></v-app-bar-nav-icon>

        <!-- Десктопные аватары званий/ролей -->
        <div class="d-none d-md-flex align-center">
          <v-avatar
            class="ms-2"
            color="surface-variant"
            size="32"
            variant="flat"
            aria-label="Сквад"
            :title="profileStore.user.squad.title"
          >
        <v-tooltip activator="parent" location="bottom">Сквад: {{ profileStore.user.squad.title }}</v-tooltip>
        <v-icon>{{ profileStore.user.squad.icon }}</v-icon>
      </v-avatar>
      <v-avatar
        class="mx-2"
        color="surface-variant"
        size="32"
        variant="flat"
        aria-label="Звание"
        :title="profileStore.user.rank.title"
      >
        <v-tooltip activator="parent" location="bottom">Звание: {{ profileStore.user.rank.title }}</v-tooltip>
        <v-icon>{{ profileStore.user.rank.icon }}</v-icon>
      </v-avatar>
              <v-avatar
          class="me-2"
          color="surface-variant"
          size="32"
          variant="flat"
          aria-label="Должность"
          :title="profileStore.user.role.title"
        >
          <v-tooltip activator="parent" location="bottom">Должность: {{ profileStore.user.role.title }}</v-tooltip>
          <v-icon>{{ profileStore.user.role.icon }}</v-icon>
        </v-avatar>
        </div>

      <!-- RoleActions только на десктопе -->
      <div class="d-none d-md-block">
        <RoleActions />
      </div>

      <v-spacer></v-spacer>
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-avatar size="32" v-bind="props" class="me-4" style="cursor:pointer;">
            <v-img :src="profileStore.user.avatar" />
          </v-avatar>
        </template>
        <v-list>
          <v-list-item @click="navigate('/profile')">
            <template #prepend>
              <v-icon>mdi-account-edit</v-icon>
            </template>
            <v-list-item-title>Профиль</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigate('/settings')">
            <template #prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title>Настройки</v-list-item-title>
          </v-list-item>

          <v-list-item @click="navigate('/help')">
            <template #prepend>
              <v-icon>mdi-help-circle</v-icon>
            </template>
            <v-list-item-title>Помощь</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <template #prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon variant="text" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      color="surface"
      v-model="drawer"
      :rail="rail && $vuetify.display.mdAndUp"
      :temporary="$vuetify.display.smAndDown"
      @click:overlay="drawer = false"
      :model-value="drawer"
    >
              <v-list>
          <v-list-item @click="rail = false" class="profile-list-item" style="cursor: pointer;">
            <template #prepend>
              <v-avatar size="32">
                <v-img :src="profileStore.user.avatar" />
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">
              {{ profileStore.user.firstName }} {{ profileStore.user.lastName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ profileStore.user.callsign }}</v-list-item-subtitle>
            <template #append>
              <v-btn
                v-if="$vuetify.display.mdAndUp"
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = true"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      <v-divider class="mx-2 mb-2"></v-divider>
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :exact="item.exact"
          :active="route.path === item.to"
          link
          class="custom-list-item"
        >
          <template #prepend>
            <v-icon :style="route.path === item.to ? { color: theme.current.value.colors.accent } : {}">{{ item.icon }}</v-icon>
          </template>
          <template #title>
            <span :style="route.path === item.to ? { color: theme.current.value.colors.accent } : {}">{{ item.title }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useProfileStore } from '../store/profile.js'
import RoleActions from '../components/RoleActions.vue'

const drawer = ref(false)
const rail = ref(false)
const route = useRoute()
const router = useRouter()
const theme = useTheme()
const isDark = ref(false)
const profileStore = useProfileStore()

// Загружаем сохраненную тему из localStorage
function loadThemeFromLS() {
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme) {
        isDark.value = savedTheme === 'tacticalDark'
        theme.global.name.value = savedTheme
    } else {
        // По умолчанию светлая тема
        isDark.value = false
        theme.global.name.value = 'tacticalLight'
    }
}

// Сохраняем тему в localStorage
function saveThemeToLS(themeName) {
    localStorage.setItem('selectedTheme', themeName)
}

function setBodyThemeAttr() {
    document.documentElement.style.setProperty('--v-theme-accent', isDark.value ? '#90CAF9' : '#1976D2')
}

// Инициализируем тему при загрузке компонента
onMounted(() => {
    loadThemeFromLS()
    setBodyThemeAttr()
    
    // Устанавливаем начальное состояние в зависимости от размера экрана
    updateDrawerState()
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', updateDrawerState)
})

function updateDrawerState() {
    if (window.innerWidth < 960) {
        // Мобильные устройства
        drawer.value = false
        rail.value = false
    } else {
        // Десктоп
        drawer.value = true
        rail.value = true
    }
}

watch(isDark, () => {
    setBodyThemeAttr()
})

function toggleTheme() {
    isDark.value = !isDark.value
    const themeName = isDark.value ? 'tacticalDark' : 'tacticalLight'
    theme.global.name.value = themeName
    saveThemeToLS(themeName)
}

function toggleDrawer() {
    console.log('Toggle drawer clicked, current state:', drawer.value)
    drawer.value = !drawer.value
}

const items = [
  { to: '/', title: 'Главная', icon: 'mdi-home-city', exact: true },
  { to: '/map', title: 'Карта', icon: 'mdi-map' },
  { to: '/tasks', title: 'Задачи', icon: 'mdi-clipboard-list' },
  { to: '/profile', title: 'Профиль', icon: 'mdi-account' },
  { to: '/messages', title: 'Сообщения', icon: 'mdi-message' }
]
function navigate(to) {
  if (route.path !== to) {
    router.push(to)
    // На мобильных закрываем сайдбар после навигации
    if (window.innerWidth < 960) {
      drawer.value = false
    }
  }
}
function logout() {
  // Здесь должна быть логика выхода из аккаунта
  alert('Выход из аккаунта');
}
</script>
<style>
.profile-list-item {
  padding-left: 11px !important;
}
</style> 