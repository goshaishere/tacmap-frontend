<template>
  <v-app id="inspire">
    <v-app-bar
      color="surface"
      height="72"
      flat
    >
      <v-avatar
        class="ms-2"
        color="surface-variant"
        size="32"
        variant="flat"
      ></v-avatar>
      <v-avatar
        class="mx-2"
        color="surface-variant"
        size="32"
        variant="flat"
      ></v-avatar>

      <v-btn
        class="me-2"
        color="grey"
        height="40"
        variant="flat"
        width="80"
      ></v-btn>

      <v-btn
        class="me-2"
        color="grey"
        height="40"
        variant="flat"
        width="100"
      ></v-btn>

      <v-btn
        class="me-2"
        color="grey"
        height="40"
        variant="flat"
        width="120"
      ></v-btn>

      <v-btn
        class="me-2"
        color="grey"
        height="40"
        variant="flat"
        width="120"
      ></v-btn>

      <v-spacer></v-spacer>
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-avatar size="32" v-bind="props" class="me-4" style="cursor:pointer;">
            <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" />
          </v-avatar>
        </template>
        <v-list>
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
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list>
        <v-list-item class="mt-4 mb-2">
          <template #prepend>
            <v-avatar size="32">
              <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" />
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold">Muerte Nortena</v-list-item-title>
          <!-- <v-list-item-subtitle>john.leider@gmail.com</v-list-item-subtitle> -->
          <template #append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
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
          @click="navigate(item.to)"
          class="custom-list-item"
        >
          <template #prepend>
            <v-icon :class="route.path === item.to ? 'active-link' : ''">{{ item.icon }}</v-icon>
          </template>
          <template #title>
            <span :class="route.path === item.to ? 'active-link' : ''">{{ item.title }}</span>
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
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

const drawer = ref(true)
const rail = ref(true)
const route = useRoute()
const router = useRouter()
const theme = useTheme()
const isDark = ref(theme.global.name.value === 'tacticalDark')

function setBodyThemeAttr() {
  document.documentElement.style.setProperty('--v-theme-accent', isDark.value ? '#90CAF9' : '#1976D2')
}
setBodyThemeAttr()

watch(isDark, () => {
  setBodyThemeAttr()
})

function toggleTheme() {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'tacticalDark' : 'tacticalLight'
}

const items = [
  { to: '/', title: 'Главная', icon: 'mdi-home-city', exact: true },
  { to: '/map', title: 'Карта', icon: 'mdi-map' },
  { to: '/profile', title: 'Профиль', icon: 'mdi-account' },
  { to: '/messages', title: 'Сообщения', icon: 'mdi-message' }
]
function navigate(to) {
  if (route.path !== to) router.push(to)
}
function logout() {
  // Здесь должна быть логика выхода из аккаунта
  alert('Выход из аккаунта');
}
</script>
<style>

</style> 