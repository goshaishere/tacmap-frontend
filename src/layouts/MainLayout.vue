<template>
  <v-app id="inspire">
          <v-app-bar
        color="surface"
        height="72"
        flat
        fixed
        app
      >
        <div class="toolbar-main d-flex align-center w-100" style="flex-wrap:nowrap; min-width:0;">
          <div class="toolbar-left d-flex align-center" style="flex-shrink:0;">
        <v-app-bar-nav-icon 
          @click="toggleDrawer" 
          class="d-md-none"
          style="cursor: pointer;"
        ></v-app-bar-nav-icon>
        </div>
          <div class="toolbar-actions-flex" style="flex:1 1 0%; min-width:0; overflow-x:auto; display:flex; align-items:center; gap:4px;">
      <RoleActions class="role-actions-appbar align-self-center" />
          </div>
          <div class="toolbar-right d-flex align-center ms-2 ms-sm-2 ms-md-0" style="flex-shrink:0; min-width:0;">
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-avatar size="32" v-bind="props" class="me-4" style="cursor:pointer;">
            <template v-if="profileStore.user?.avatar">
              <v-img :src="profileStore.user?.avatar" />
            </template>
            <template v-else>
              <v-icon size="24">mdi-account</v-icon>
            </template>
          </v-avatar>
        </template>
        <v-list>
          <v-list-item @click="navigate('/profile')">
            <template #prepend>
              <v-icon>mdi-account-edit</v-icon>
            </template>
            <v-list-item-title>{{ t('nav.profile') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigate('/settings')">
            <template #prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title>{{ t('nav.settings') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigate('/help')">
            <template #prepend>
              <v-icon>mdi-help-circle</v-icon>
            </template>
            <v-list-item-title>{{ t('nav.help') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <template #prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>{{ t('nav.logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn icon variant="text" v-bind="props" :title="t('settings.language')">
            <span class="text-body-2">{{ locale.toUpperCase() }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="setLocale('ru')">
            <v-list-item-title>Русский</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setLocale('en')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon variant="text" @click="toggleTheme" :title="isDark ? t('common.themeLight') : t('common.themeDark')">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
          </div>
    </div>
    </v-app-bar>

    <v-navigation-drawer
      color="surface"
      v-model="drawer"
      :rail="rail && $vuetify.display.mdAndUp"
      :temporary="$vuetify.display.smAndDown"
      @click:overlay="drawer = false"
      :model-value="drawer"
      app
    >
              <v-list>
          <v-list-item @click="rail = false" class="profile-list-item" style="cursor: pointer;">
            <template #prepend>
              <v-avatar size="32">
                <template v-if="profileStore.user?.avatar">
                  <v-img :src="profileStore.user?.avatar" />
                </template>
                <template v-else>
                  <v-icon size="24">mdi-account</v-icon>
                </template>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">
              {{ profileStore.user?.firstName }} {{ profileStore.user?.lastName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ profileStore.user?.callsign }}</v-list-item-subtitle>
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
      <!-- Иерархия: уровень 1, уровень 2, звание (только military), роль/должность -->
      <div v-if="!rail" class="d-flex justify-center align-center mb-2 px-4 flex-wrap">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-avatar size="24" :color="companyStore.currentLevel1?.colorLight || 'surface-variant'" class="me-2" v-bind="props">
              <v-icon size="16">{{ companyStore.currentLevel1?.icon }}</v-icon>
            </v-avatar>
          </template>
          <span>{{ companyStore.currentLevel1?.title || t(companyStore.isCorporate ? 'profile.department' : 'profile.faction') }}</span>
        </v-tooltip>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-avatar size="24" color="surface-variant" class="me-2" v-bind="props">
              <v-icon size="16">{{ companyStore.currentLevel2?.icon }}</v-icon>
            </v-avatar>
          </template>
          <span>{{ companyStore.currentLevel2?.title || t(companyStore.isCorporate ? 'profile.team' : 'profile.squad') }}</span>
        </v-tooltip>
        <v-tooltip v-if="companyStore.isMilitary" location="top">
          <template #activator="{ props }">
            <v-avatar size="24" color="surface-variant" class="me-2" v-bind="props">
              <v-icon size="16">{{ profileStore.user?.rank?.icon }}</v-icon>
            </v-avatar>
          </template>
          <span>{{ profileStore.user?.rank?.title || t('profile.rank') }}</span>
        </v-tooltip>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-avatar size="24" color="surface-variant" v-bind="props">
              <v-icon size="16">{{ companyStore.currentRoleOrPosition?.icon }}</v-icon>
            </v-avatar>
          </template>
          <span>{{ companyStore.currentRoleOrPosition?.title || t(companyStore.isCorporate ? 'profile.position' : 'profile.role') }}</span>
        </v-tooltip>
      </div>
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
            <v-icon :style="route.path === item.to ? { color: theme.current.value?.colors?.accent } : {}">{{ item.icon }}</v-icon>
          </template>
          <template #title>
            <span :style="route.path === item.to ? { color: theme.current.value?.colors?.accent } : {}">{{ item.title }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main app>
      <router-view />
    </v-main>

  </v-app>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n.js'
import { useProfileStore } from '../store/profile.js'
import { useCompanyStore } from '../store/company.js'
import RoleActions from '../components/RoleActions.vue'

const profileStore = useProfileStore()
const companyStore = useCompanyStore()

const drawer = ref(false)
const rail = ref(false)
const route = useRoute()
const router = useRouter()
const theme = useTheme()

const isDark = computed(() => {
  const currentTheme = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
  return currentTheme === 'tacticalDark'
})

function applyThemeFromStorage() {
  const availableThemes = ['tacticalLight', 'tacticalDark']
  const savedTheme = localStorage.getItem('selectedTheme')
  theme.change(availableThemes.includes(savedTheme) ? savedTheme : 'tacticalLight')
}

onMounted(() => {
  applyThemeFromStorage()
  updateDrawerState()
  window.addEventListener('resize', updateDrawerState)
  window.addEventListener('storage', (e) => {
    if (e.key === 'selectedTheme') {
      applyThemeFromStorage()
    }
  })
  window.addEventListener('themeChanged', applyThemeFromStorage)
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

function toggleTheme() {
    const themeName = isDark.value ? 'tacticalLight' : 'tacticalDark'
    console.log('Current isDark:', isDark.value, 'Switching to:', themeName)
    theme.change(themeName)
    localStorage.setItem('selectedTheme', themeName)
}

function toggleDrawer() {
    console.log('Toggle drawer clicked, current state:', drawer.value)
    drawer.value = !drawer.value
}

const { t, locale } = useI18n()

const items = computed(() => [
  { to: '/', title: t('nav.home'), icon: 'mdi-home-city', exact: true },
  { to: '/map', title: t('nav.map'), icon: 'mdi-map' },
  { to: '/tasks', title: t('nav.tasks'), icon: 'mdi-clipboard-list' },
  { to: '/profile', title: t('nav.profile'), icon: 'mdi-account' },
  { to: '/settings/company', title: t('settings.companySettings'), icon: 'mdi-sitemap' },
  { to: '/messages', title: t('nav.messages'), icon: 'mdi-message' }
])
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
.role-actions-appbar {
  align-self: center !important;
  /* Для надёжности можно добавить: */
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  /* Можно добавить min-height, если нужно */
}
.toolbar-main {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  min-width: 0;
}
.toolbar-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.toolbar-actions-flex {
  display: flex;
  align-items: center;
  flex: 1 1 0%;
  min-width: 0;
  overflow-x: auto;
  gap: 4px;
  margin-left: 24px;
}
.toolbar-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
}


@media (max-width: 600px) {
  .toolbar-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;
    overflow: hidden;
  }
  .toolbar-left {
    display: flex;
    align-items: center;
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;
  }
  .toolbar-right {
    display: flex;
    align-items: center;
    margin-left: auto;
    flex-shrink: 0;
  }
  .toolbar-actions-flex {
    margin-left: 0;
  }
}
</style> 