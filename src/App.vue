<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { applyCustomThemeFromStorage, clearCustomThemeOverlay, getUseCustomTheme } from './utils/themeOverlay.js'
import MainLayout from './layouts/MainLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()
const theme = useTheme()

const layout = computed(() => {
  if (route.meta.layout === 'auth') return AuthLayout
  return MainLayout
})

function applyOverlay() {
  if (getUseCustomTheme()) {
    const name = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
    const isDark = name === 'tacticalDark'
    applyCustomThemeFromStorage(isDark)
  } else {
    clearCustomThemeOverlay()
  }
}

onMounted(() => {
  applyOverlay()
  window.addEventListener('customThemeUpdated', applyOverlay)
})

watch(
  () => theme.current.value?.name,
  () => applyOverlay(),
  { immediate: false }
)
</script>

<style>
</style>
