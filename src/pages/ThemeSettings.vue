<template>
  <div class="page-container">
    <v-container fluid class="pa-0 pa-md-4">
      <v-row>
        <v-col cols="12">
          <div class="text-h4 text-on-surface d-flex align-center mb-4">
            <v-icon class="me-3" color="accent">mdi-palette</v-icon>
            {{ t('themeSettings.title') }}
          </div>
        </v-col>
      </v-row>

      <!-- Переключатели: светлая/тёмная, стандартная/пользовательская -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4 mb-4" color="surface">
            <div class="d-flex flex-wrap align-center gap-4 mb-4">
              <div class="d-flex align-center gap-2">
                <span class="text-subtitle-2 text-on-surface">{{ t('settings.themeLabel') }}</span>
                <v-btn-toggle
                  v-model="isDark"
                  mandatory
                  color="accent"
                  density="compact"
                  @update:model-value="onLightDarkChange"
                >
                  <v-btn :value="false" size="small">
                    <v-icon size="18" class="me-1">mdi-white-balance-sunny</v-icon>
                    {{ t('themeSettings.light') }}
                  </v-btn>
                  <v-btn :value="true" size="small">
                    <v-icon size="18" class="me-1">mdi-weather-night</v-icon>
                    {{ t('themeSettings.dark') }}
                  </v-btn>
                </v-btn-toggle>
              </div>
              <v-divider vertical class="d-none d-sm-flex" />
              <div class="d-flex align-center gap-2">
                <span class="text-subtitle-2 text-on-surface">{{ t('themeSettings.standard') }} / {{ t('themeSettings.custom') }}</span>
                <v-btn-toggle
                  v-model="useCustom"
                  mandatory
                  color="accent"
                  density="compact"
                  @update:model-value="onStandardCustomChange"
                >
                  <v-btn :value="false" size="small">{{ t('themeSettings.standard') }}</v-btn>
                  <v-btn :value="true" size="small">{{ t('themeSettings.custom') }}</v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Список цветов (только для пользовательской темы) -->
      <v-row v-if="useCustom">
        <v-col cols="12">
          <v-card class="pa-4" color="surface">
            <v-card-title class="text-subtitle-1 text-on-surface mb-3">
              {{ t('themeSettings.pickColor') }}
            </v-card-title>
            <v-list class="theme-color-list">
              <v-list-item
                v-for="key in themeColorKeys"
                :key="key"
                class="theme-color-item"
                @click="openPicker(key)"
              >
                <template #prepend>
                  <div
                    class="color-swatch"
                    :style="{ background: editingColors[key] || '#888' }"
                  />
                </template>
                <v-list-item-title class="text-body-2">
                  {{ t('themeSettings.colors.' + key) }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ editingColors[key] || '—' }}
                </v-list-item-subtitle>
                <template #append>
                  <v-icon size="20">mdi-chevron-right</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <!-- Кнопки внизу -->
      <v-row class="mt-4">
        <v-col cols="12" class="d-flex flex-wrap gap-2">
          <v-btn color="accent" variant="flat" @click="save" :disabled="!useCustom">
            {{ t('themeSettings.save') }}
          </v-btn>
          <v-btn variant="outlined" @click="cancel" v-if="useCustom">
            {{ t('themeSettings.cancel') }}
          </v-btn>
          <v-btn variant="outlined" color="error" @click="confirmReset" v-if="useCustom || hasStoredCustom">
            {{ t('themeSettings.resetToStandard') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Диалог выбора цвета -->
    <v-dialog v-model="pickerOpen" max-width="320" persistent>
      <v-card>
        <v-card-title class="text-subtitle-1">
          {{ pickerKey ? t('themeSettings.colors.' + pickerKey) : '' }}
        </v-card-title>
        <v-card-text>
          <v-color-picker
            v-if="pickerKey"
            v-model="pickerValue"
            hide-inputs
            mode="hex"
            :swatches="swatches"
            show-swatches
            class="theme-color-picker"
          />
          <v-text-field
            v-if="pickerKey"
            v-model="pickerValue"
            label="HEX"
            variant="outlined"
            density="compact"
            class="mt-3"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="pickerOpen = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="accent" variant="flat" @click="applyPicker">{{ t('common.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Подтверждение сброса -->
    <v-dialog v-model="resetDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>{{ t('themeSettings.resetToStandard') }}</v-card-title>
        <v-card-text>{{ t('themeSettings.resetConfirm') }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="resetDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" @click="doReset">{{ t('themeSettings.reset') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { defaultLight, defaultDark, themeColorKeys } from '../config/themeDefaults.js'
import {
  getUseCustomTheme,
  getStoredCustomTheme,
  setStoredCustomTheme,
  setUseCustomTheme,
  clearStoredCustomThemes,
  applyCustomColors,
  clearCustomThemeOverlay,
} from '../utils/themeOverlay.js'

const { t } = useI18n()
const theme = useTheme()

const isDark = ref(false)
const useCustom = ref(false)
const editingColors = ref({})
const pickerOpen = ref(false)
const pickerKey = ref(null)
const pickerValue = ref('#000000')
const resetDialog = ref(false)

const hasStoredCustom = computed(() => {
  return getUseCustomTheme() || getStoredCustomTheme(false) || getStoredCustomTheme(true)
})

const defaultColors = computed(() => (isDark.value ? defaultDark.colors : defaultLight.colors))

const swatches = [
  ['#F5F6FA', '#FFFFFF', '#232B2F', '#6B8E23', '#3BA55D'],
  ['#12181B', '#181F22', '#B0BEC5', '#ddb77b', '#66BB6A'],
  ['#2196F3', '#43A047', '#FFC107', '#E53935', '#9C27B0'],
]

function loadEditingFromCurrent() {
  const stored = getStoredCustomTheme(isDark.value)
  const base = stored || { ...defaultColors.value }
  const result = {}
  for (const key of themeColorKeys) {
    result[key] = base[key] ?? defaultColors.value[key] ?? '#888888'
  }
  editingColors.value = result
}

function onLightDarkChange() {
  theme.change(isDark.value ? 'tacticalDark' : 'tacticalLight')
  localStorage.setItem('selectedTheme', isDark.value ? 'tacticalDark' : 'tacticalLight')
  loadEditingFromCurrent()
  window.dispatchEvent(new CustomEvent('themeChanged'))
}

function onStandardCustomChange() {
  if (useCustom.value) {
    loadEditingFromCurrent()
  } else {
    setUseCustomTheme(false)
    clearCustomThemeOverlay()
    window.dispatchEvent(new CustomEvent('customThemeUpdated'))
  }
}

function openPicker(key) {
  pickerKey.value = key
  pickerValue.value = editingColors.value[key] || '#888888'
  pickerOpen.value = true
}

function applyPicker() {
  if (pickerKey.value && pickerValue.value) {
    editingColors.value = { ...editingColors.value, [pickerKey.value]: pickerValue.value }
  }
  pickerOpen.value = false
}

function save() {
  if (useCustom.value) {
    setStoredCustomTheme(isDark.value, { ...editingColors.value })
    setUseCustomTheme(true)
    applyCustomColors(editingColors.value)
  }
  window.dispatchEvent(new CustomEvent('customThemeUpdated'))
}

function cancel() {
  loadEditingFromCurrent()
}

function confirmReset() {
  resetDialog.value = true
}

function doReset() {
  clearStoredCustomThemes()
  clearCustomThemeOverlay()
  useCustom.value = false
  theme.change(isDark.value ? 'tacticalDark' : 'tacticalLight')
  localStorage.setItem('selectedTheme', isDark.value ? 'tacticalDark' : 'tacticalLight')
  loadEditingFromCurrent()
  resetDialog.value = false
  window.dispatchEvent(new CustomEvent('customThemeUpdated'))
  window.dispatchEvent(new CustomEvent('themeChanged'))
}

watch([isDark, useCustom], () => {
  if (useCustom.value) loadEditingFromCurrent()
})

onMounted(() => {
  const name = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
  isDark.value = name === 'tacticalDark'
  useCustom.value = getUseCustomTheme()
  loadEditingFromCurrent()
})
</script>

<style scoped>
.theme-color-list {
  background: transparent;
}

.theme-color-item {
  cursor: pointer;
  border-radius: 8px;
}

.theme-color-item:hover {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.theme-color-picker {
  width: 100%;
  min-height: 200px;
}
</style>
