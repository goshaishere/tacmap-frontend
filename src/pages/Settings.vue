<template>
  <div class="page-container">
    <v-container fluid class="pa-0 pa-md-4">
      <v-row>
        <v-col cols="12">
          <div class="text-h4 text-on-surface d-flex align-center mb-0">
            <v-icon class="me-3" color="accent">mdi-cog</v-icon>
            {{ t('settings.title') }}
          </div>
        </v-col>
      </v-row>
      <v-row class="g-4">
        <!-- Внешний вид -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">
              <v-icon class="me-2">mdi-palette</v-icon> {{ t('settings.appearance') }}
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center justify-space-between flex-wrap gap-4">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">{{ t('settings.themeLabel') }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t('settings.themeHint') }}</div>
                </div>
                <v-btn-toggle
                  v-model="selectedTheme"
                  mandatory
                  color="accent"
                  @update:model-value="onThemeChange"
                >
                  <v-btn value="tacticalLight" size="small">
                    <v-icon class="me-1">mdi-white-balance-sunny</v-icon>
                    {{ t('common.themeLight') }}
                  </v-btn>
                  <v-btn value="tacticalDark" size="small">
                    <v-icon class="me-1">mdi-weather-night</v-icon>
                    {{ t('common.themeDark') }}
                  </v-btn>
                </v-btn-toggle>
              </div>
              <div class="mt-3">
                <v-btn color="accent" variant="outlined" size="small" :to="{ name: 'ThemeSettings' }" prepend-icon="mdi-palette">
                  {{ t('settings.themeSettings') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Язык -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">
              <v-icon class="me-2">mdi-translate</v-icon> {{ t('settings.localeLabel') }}
            </v-card-title>
            <v-card-text>
              <v-select
                :model-value="locale"
                @update:model-value="onLocaleChange"
                :items="localeOptions"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Тип иерархии -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">
              <v-icon class="me-2">mdi-sitemap</v-icon> {{ t('hierarchy.type') }}
            </v-card-title>
            <v-card-text>
              <p class="text-caption text-medium-emphasis mb-3">{{ t('hierarchy.switchHint') }}</p>
              <v-btn-toggle
                v-model="hierarchyType"
                mandatory
                color="accent"
                @update:model-value="onHierarchyTypeChange()"
              >
                <v-btn value="military" size="small">
                  <v-icon class="me-1">mdi-shield</v-icon>
                  {{ t('hierarchy.military') }}
                </v-btn>
                <v-btn value="corporate" size="small">
                  <v-icon class="me-1">mdi-domain</v-icon>
                  {{ t('hierarchy.corporate') }}
                </v-btn>
              </v-btn-toggle>
              <div class="mt-3">
                <div class="text-subtitle-2 font-weight-medium mb-2">{{ t('hierarchy.subtype') }}</div>
                <v-select
                  :model-value="companyStore.companySubtype"
                  @update:model-value="companyStore.setCompanySubtype"
                  :items="subtypeOptions"
                  :item-title="(item) => t('company.subtypes.' + companyStore.hierarchyType + '_' + item.key)"
                  item-value="key"
                  variant="outlined"
                  density="compact"
                  hide-details
                >
                  <template #selection="{ item }">
                    <v-icon size="small" class="me-2">{{ item.raw?.icon }}</v-icon>
                    {{ t('company.subtypes.' + companyStore.hierarchyType + '_' + item.raw?.key) }}
                  </template>
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon size="small">{{ item.raw?.icon }}</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
              <div class="mt-3 d-flex gap-2">
                <v-btn color="accent" variant="outlined" size="small" :to="{ name: 'CompanySettings' }">
                  {{ t('settings.companySettings') }}
                </v-btn>
                <v-btn color="accent" variant="outlined" size="small" :to="{ name: 'Profile' }">
                  {{ t('settings.profileSettings') }}
                </v-btn>
              </div>
              <!-- Уровень структуры (точка входа в иерархию) -->
              <div class="mt-4 pt-4" style="border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));">
                <div class="text-subtitle-2 font-weight-medium text-on-surface mb-2">{{ t('company.scopeLevel') }}</div>
                <p class="text-caption text-medium-emphasis mb-2">{{ t('company.scopeLevelHint') }}</p>
                <v-radio-group
                  :model-value="scopeRadioValue"
                  @update:model-value="onScopeModeChange"
                  hide-details
                  density="compact"
                  class="mb-2"
                >
                  <v-radio value="whole" :label="t('company.scopeWhole')" />
                  <v-radio value="unit" :label="t('company.scopeUnit')" />
                </v-radio-group>
                <v-select
                  v-if="scopeRadioValue === 'unit'"
                  :model-value="companyStore.scopeRootId"
                  @update:model-value="(id) => { companyStore.setScopeRoot(id); if (id == null) scopeModeUnit.value = false }"
                  :items="scopeSelectItems"
                  item-title="title"
                  item-value="id"
                  :label="t('company.scopeSelect')"
                  variant="outlined"
                  density="compact"
                  clearable
                  hide-details
                  :placeholder="t('company.scopeWhole')"
                >
                  <template #selection="{ item }">
                    <span>{{ item.raw?.title }}</span>
                  </template>
                  <template #item="{ item, props: p }">
                    <v-list-item v-bind="p">
                      <template #prepend>
                        <span v-if="item.raw?.depth != null" :style="{ width: (item.raw.depth * 16) + 'px', display: 'inline-block' }" />
                      </template>
                      <v-list-item-title>{{ item.raw?.title }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Карта -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">
              <v-icon class="me-2">mdi-map</v-icon> {{ t('settings.map') }}
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-column gap-4">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">{{ t('settings.mapZoom') }}</div>
                  <v-slider
                    v-model="mapZoom"
                    :min="2"
                    :max="19"
                    step="1"
                    thumb-label
                    color="accent"
                    class="mt-2"
                  />
                  <div class="text-caption text-medium-emphasis">{{ mapZoom }}</div>
                </div>
                <div>
                  <div class="text-subtitle-1 font-weight-medium">{{ t('settings.mapPosition') }}</div>
                  <div class="d-flex gap-2">
                    <v-text-field
                      v-model="mapLat"
                      :label="t('settings.latitude')"
                      type="number"
                      variant="outlined"
                      density="compact"
                      style="max-width: 140px"
                    />
                    <v-text-field
                      v-model="mapLon"
                      :label="t('settings.longitude')"
                      type="number"
                      variant="outlined"
                      density="compact"
                      style="max-width: 140px"
                    />
                  </div>
                </div>
                <v-btn color="accent" variant="outlined" size="small" @click="saveMapSettings">{{ t('settings.saveMap') }}</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Уведомления -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">
              <v-icon class="me-2">mdi-bell</v-icon> {{ t('settings.notifications') }}
            </v-card-title>
                  <v-card-text>
              <div class="d-flex align-center justify-space-between mb-4">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">{{ t('settings.notificationsEnable') }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t('settings.notificationsHint') }}</div>
                        </div>
                <div>
                        <v-switch
                          v-model="notificationsEnabled"
                          color="accent"
                        ></v-switch>
                        <v-btn color="accent" variant="outlined" size="small" @click="showTestNotification" class="ms-2">{{ t('settings.testNotification') }}</v-btn>
                      </div>
                    </div>
              <div class="d-flex align-center justify-space-between mb-4">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">{{ t('settings.soundEnable') }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t('settings.soundHint') }}</div>
                      </div>
                      <v-switch
                        v-model="soundEnabled"
                        color="accent"
                        :disabled="!notificationsEnabled"
                      ></v-switch>
                    </div>
                  </v-card-text>
                </v-card>
        </v-col>
              <!-- Безопасность -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">
              <v-icon class="me-2">mdi-shield</v-icon> {{ t('settings.security') }}
            </v-card-title>
                  <v-card-text>
              <div class="d-flex align-center justify-space-between mb-4">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">{{ t('settings.securityAutoLogout') }}</div>
                  <div class="text-caption text-medium-emphasis">{{ t('settings.securityHint') }}</div>
                      </div>
                      <v-switch
                        v-model="autoLogout"
                        color="accent"
                      ></v-switch>
                    </div>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">{{ t('settings.inactivityTime') }}</div>
                      </div>
                      <v-select
                        v-model="inactivityTimeout"
                        :items="timeoutOptions"
                        variant="outlined"
                        density="compact"
                        style="width: 120px"
                        :disabled="!autoLogout"
                      ></v-select>
                    </div>
                  </v-card-text>
                </v-card>
        </v-col>
        <!-- Данные (экспорт/импорт) -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">
              <v-icon class="me-2">mdi-database-export</v-icon> {{ t('settings.data') }}
            </v-card-title>
                  <v-card-text>
              <div class="mb-3">
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataProfile') }}</div>
                <v-btn color="accent" variant="outlined" size="small" @click="exportProfile" class="me-2">{{ t('settings.dataExport') }}</v-btn>
                        <v-btn color="accent" variant="text" size="small" @click="importProfile">{{ t('settings.dataImport') }}</v-btn>
                        <input :ref="el => refs.profileInput.value = el" type="file" accept="application/json" style="display:none" @change="importProfileFile" />
                      </div>
              <div class="mb-3">
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataTasks') }}</div>
                <v-btn color="accent" variant="outlined" size="small" @click="exportTasks" class="me-2">{{ t('settings.dataExport') }}</v-btn>
                        <v-btn color="accent" variant="text" size="small" @click="importTasks">{{ t('settings.dataImport') }}</v-btn>
                        <input :ref="el => refs.tasksInput.value = el" type="file" accept="application/json" style="display:none" @change="importTasksFile" />
                      </div>
              <div class="mb-3">
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataSquads') }}</div>
                <v-btn color="accent" variant="outlined" size="small" @click="exportSquads" class="me-2">{{ t('settings.dataExport') }}</v-btn>
                        <v-btn color="accent" variant="text" size="small" @click="importSquads">{{ t('settings.dataImport') }}</v-btn>
                        <input :ref="el => refs.squadsInput.value = el" type="file" accept="application/json" style="display:none" @change="importSquadsFile" />
                      </div>
              <div class="mb-3">
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataFactions') }}</div>
                <v-btn color="accent" variant="outlined" size="small" @click="exportFactions" class="me-2">{{ t('settings.dataExport') }}</v-btn>
                        <v-btn color="accent" variant="text" size="small" @click="importFactions">{{ t('settings.dataImport') }}</v-btn>
                        <input :ref="el => refs.factionsInput.value = el" type="file" accept="application/json" style="display:none" @change="importFactionsFile" />
                      </div>
              <div class="mb-3">
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataSettings') }}</div>
                <v-btn color="accent" variant="outlined" size="small" @click="exportSettings" class="me-2">{{ t('settings.dataExport') }}</v-btn>
                        <v-btn color="accent" variant="text" size="small" @click="importSettings">{{ t('settings.dataImport') }}</v-btn>
                        <input :ref="el => refs.settingsInput.value = el" type="file" accept="application/json" style="display:none" @change="importSettingsFile" />
                      </div>
              <div class="mb-3">
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataMap') }}</div>
                <v-btn color="accent" variant="outlined" size="small" @click="exportMap" class="me-2">{{ t('settings.dataExport') }}</v-btn>
                        <v-btn color="accent" variant="text" size="small" @click="importMap">{{ t('settings.dataImport') }}</v-btn>
                        <input :ref="el => refs.mapInput.value = el" type="file" accept="application/json" style="display:none" @change="importMapFile" />
                      </div>
              <div class="mb-3">
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataAuth') }}</div>
                <v-btn color="accent" variant="outlined" size="small" @click="exportAuth" class="me-2">{{ t('settings.dataExport') }}</v-btn>
                        <v-btn color="accent" variant="text" size="small" @click="importAuth">{{ t('settings.dataImport') }}</v-btn>
                        <input :ref="el => refs.authInput.value = el" type="file" accept="application/json" style="display:none" @change="importAuthFile" />
                      </div>
              <div class="mb-3">
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataClear') }}</div>
                <v-btn color="error" variant="outlined" size="small" @click="showClearDialog = true">{{ t('common.delete') }}</v-btn>
                    </div>
                      <div>
                <div class="text-subtitle-1 font-weight-medium mb-1">{{ t('settings.dataReset') }}</div>
                <v-btn color="warning" variant="outlined" size="small" @click="resetSettings">{{ t('settings.dataReset') }}</v-btn>
                    </div>
                  </v-card-text>
                </v-card>
        </v-col>
              <!-- О приложении -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">
              <v-icon class="me-2">mdi-information</v-icon> {{ t('settings.about') }}
            </v-card-title>
                  <v-card-text>
                    <div class="text-center">
                      <v-avatar size="64" color="primary" class="mb-3">
                        <v-icon size="32">mdi-map</v-icon>
                      </v-avatar>
                      <div class="text-h6 font-weight-bold mb-1">TacMap</div>
                      <div class="text-caption text-medium-emphasis mb-3">{{ t('settings.aboutVersion') }} 1.0.0</div>
                      <div class="d-flex flex-column flex-sm-row justify-center gap-2">
                        <v-btn color="accent" variant="outlined" size="small" href="https://github.com/tacmap" target="_blank">GitHub</v-btn>
                        <v-btn color="accent" variant="outlined" size="small" href="mailto:support@tacmap.com">{{ t('settings.close') }}</v-btn>
                      </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Диалог очистки данных -->
    <v-dialog v-model="showClearDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-error">
          <v-icon class="me-2">mdi-alert</v-icon>
          {{ t('common.confirm') }}
        </v-card-title>
        <v-card-text>
          <p>{{ t('settings.clearConfirm') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showClearDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" @click="clearAllData">{{ t('common.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Уведомления -->
    <v-snackbar v-model="showNotification" :color="notificationColor" timeout="3000">
      {{ notificationMessage }}
      <template #actions>
        <v-btn variant="text" @click="showNotification = false">{{ t('settings.close') }}</v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="showImportDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title>{{ t('settings.importDialogTitle') }}</v-card-title>
        <v-card-text>
          <input type="file" accept="application/json" @change="importDataFromFile" />
          <div class="text-caption mt-2">.json</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showImportDialog = false">{{ t('common.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n.js'
import { useProfileStore } from '../store/profile.js'
import { useCompanyStore } from '../store/company.js'
import styles from '../styles/SettingsPage.module.scss'

const { t, locale } = useI18n()
const selectedTheme = ref('tacticalLight')
const theme = useTheme()
const profileStore = useProfileStore()
const companyStore = useCompanyStore()

const localeOptions = [
  { title: 'Русский', value: 'ru' },
  { title: 'English', value: 'en' },
]

function onLocaleChange(value) {
  setLocale(value)
  showNotification.value = true
  notificationMessage.value = t('settings.localeLabel') + ': ' + (value === 'ru' ? 'Русский' : 'English')
  notificationColor.value = 'success'
}

const subtypeOptions = computed(() => companyStore.subtypeOptions)

const hierarchyType = computed({
  get: () => companyStore.hierarchyType,
  set: (v) => companyStore.setHierarchyType(v)
})

const scopeModeUnit = ref(!!companyStore.scopeRootId)
const scopeRadioValue = computed(() =>
  (companyStore.scopeRootId !== null || scopeModeUnit.value) ? 'unit' : 'whole'
)
function onScopeModeChange(val) {
  if (val === 'whole') {
    scopeModeUnit.value = false
    companyStore.setScopeRoot(null)
  } else {
    scopeModeUnit.value = true
  }
}
const scopeSelectItems = computed(() => [
  { id: null, title: t('company.scopeWhole'), depth: 0 },
  ...companyStore.scopePickerOptions.map(o => ({
    id: o.id,
    title: '\u2003'.repeat(o.depth) + (o.name || t('company.structureLevels.' + o.levelKey)),
    depth: o.depth
  }))
])

function onHierarchyTypeChange() {
  showNotification.value = true
  notificationMessage.value = t('hierarchy.type') + ' → ' + (companyStore.hierarchyType === 'corporate' ? t('hierarchy.corporate') : t('hierarchy.military'))
  notificationColor.value = 'success'
}

// refs для input файлов импорта
const refs = {
  profileInput: ref(null),
  tasksInput: ref(null),
  squadsInput: ref(null),
  factionsInput: ref(null),
  settingsInput: ref(null),
  mapInput: ref(null),
  authInput: ref(null)
}

function applyTheme(newTheme) {
          theme.change(newTheme)
  localStorage.setItem('selectedTheme', newTheme)
}

function onThemeChange(val) {
  if (val === 'tacticalDark' || val === 'tacticalLight') {
    applyTheme(val)
    showNotification.value = true
    notificationMessage.value = 'Тема изменена'
    notificationColor.value = 'success'
  }
}

const isThemeInitialized = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('selectedTheme')
  if (savedTheme === 'tacticalDark' || savedTheme === 'tacticalLight') {
    selectedTheme.value = savedTheme
            theme.change(savedTheme)
  } else {
    selectedTheme.value = 'tacticalLight'
            theme.change('tacticalLight')
  }
  isThemeInitialized.value = true
  companyStore.clearScopeRootIfInvalid()
})

// Синхронизация selectedTheme с глобальной темой Vuetify
    watch(() => theme.current.value?.name, (newTheme) => {
  if (newTheme === 'tacticalDark' || newTheme === 'tacticalLight') {
    selectedTheme.value = newTheme
  }
})

// Состояние
const notificationsEnabled = ref(true)
const soundEnabled = ref(true)
const autoLogout = ref(false)
const inactivityTimeout = ref(30)
const showClearDialog = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('success')

// Опции для таймаута
const timeoutOptions = [
  { title: '15 минут', value: 15 },
  { title: '30 минут', value: 30 },
  { title: '1 час', value: 60 },
  { title: '2 часа', value: 120 },
  { title: '4 часа', value: 240 }
]

// Загружаем настройки из localStorage
function loadSettings() {
  const savedTheme = localStorage.getItem('selectedTheme')
  if (savedTheme) {
    selectedTheme.value = savedTheme
  }
  
  const savedNotifications = localStorage.getItem('notificationsEnabled')
  if (savedNotifications !== null) {
    notificationsEnabled.value = JSON.parse(savedNotifications)
  }
  
  const savedSound = localStorage.getItem('soundEnabled')
  if (savedSound !== null) {
    soundEnabled.value = JSON.parse(savedSound)
  }
  
  const savedAutoLogout = localStorage.getItem('autoLogout')
  if (savedAutoLogout !== null) {
    autoLogout.value = JSON.parse(savedAutoLogout)
  }
  
  const savedTimeout = localStorage.getItem('inactivityTimeout')
  if (savedTimeout) {
    inactivityTimeout.value = parseInt(savedTimeout)
  }
}

// Сохраняем настройки в localStorage
function saveSetting(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Методы
function toggleNotifications(enabled) {
  saveSetting('notificationsEnabled', enabled)
  if (!enabled) {
    soundEnabled.value = false
    saveSetting('soundEnabled', false)
  }
  showNotification.value = true
  notificationMessage.value = enabled ? 'Уведомления включены' : 'Уведомления отключены'
  notificationColor.value = 'info'
}

function toggleSound(enabled) {
  saveSetting('soundEnabled', enabled)
  showNotification.value = true
  notificationMessage.value = enabled ? 'Звуковые уведомления включены' : 'Звуковые уведомления отключены'
  notificationColor.value = 'info'
}

function toggleAutoLogout(enabled) {
  saveSetting('autoLogout', enabled)
  showNotification.value = true
  notificationMessage.value = enabled ? 'Автоматический выход включен' : 'Автоматический выход отключен'
  notificationColor.value = 'info'
}

function exportData() {
  const data = {
    profile: profileStore.user,
    settings: {
      theme: selectedTheme.value,
      notificationsEnabled: notificationsEnabled.value,
      soundEnabled: soundEnabled.value,
      autoLogout: autoLogout.value,
      inactivityTimeout: inactivityTimeout.value
    },
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tacmap-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showNotification.value = true
  notificationMessage.value = 'Данные экспортированы'
  notificationColor.value = 'success'
}

function resetSettings() {
  selectedTheme.value = 'tacticalLight'
  notificationsEnabled.value = true
  soundEnabled.value = true
  autoLogout.value = false
  inactivityTimeout.value = 30
  
  // Сохраняем сброшенные настройки
  saveSetting('selectedTheme', selectedTheme.value)
  saveSetting('notificationsEnabled', notificationsEnabled.value)
  saveSetting('soundEnabled', soundEnabled.value)
  saveSetting('autoLogout', autoLogout.value)
  saveSetting('inactivityTimeout', inactivityTimeout.value)
  
  showClearDialog.value = false
  showNotification.value = true
  notificationMessage.value = 'Настройки сброшены'
  notificationColor.value = 'warning'
}

// 1. Notification API — тестовое уведомление
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
}
function showTestNotification() {
  playNotificationSound()
  showNotification.value = true
  notificationMessage.value = 'Тестовое звуковое уведомление'
  notificationColor.value = 'info'
}

// 3. Звуковые уведомления
let audio = null
function playNotificationSound() {
  if (!soundEnabled.value) return
  if (!audio) {
    audio = new Audio('/notification.mp3')
  }
  audio.currentTime = 0
  audio.play()
}

// 4. Автовыход по неактивности
let inactivityTimer = null
function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer)
  if (autoLogout.value) {
    inactivityTimer = setTimeout(() => {
      clearAllData(true)
    }, inactivityTimeout.value * 60 * 1000)
  }
}
function setupInactivityListeners() {
  ['mousemove','keydown','mousedown','touchstart'].forEach(evt => {
    window.addEventListener(evt, resetInactivityTimer)
  })
}
watch([autoLogout, inactivityTimeout], () => {
  resetInactivityTimer()
})
onMounted(() => {
  setupInactivityListeners()
  resetInactivityTimer()
})

// 5. Импорт данных
const showImportDialog = ref(false)
function importDataFromFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      // Профиль
      if (data.profile) localStorage.setItem('profileData', JSON.stringify(data.profile))
      // Настройки
      if (data.settings) {
        Object.entries(data.settings).forEach(([k,v]) => saveSetting(k, v))
      }
      // Задачи
      if (data.tasks) localStorage.setItem('tasks', JSON.stringify(data.tasks))
      // Кастомные сквады/фракции
      if (data.customSquads) localStorage.setItem('customSquads', JSON.stringify(data.customSquads))
      if (data.customFactions) localStorage.setItem('customFactions', JSON.stringify(data.customFactions))
      showNotification.value = true
      notificationMessage.value = 'Данные импортированы. Перезагрузите страницу.'
      notificationColor.value = 'success'
    } catch {
      showNotification.value = true
      notificationMessage.value = 'Ошибка импорта файла'
      notificationColor.value = 'error'
    }
  }
  reader.readAsText(file)
}

// 6. Сброс/очистка — удаляют всё
function clearAllData(isAutoLogout = false) {
  localStorage.clear()
  profileStore.resetProfile && profileStore.resetProfile()
  showClearDialog.value = false
  showNotification.value = true
  notificationMessage.value = isAutoLogout ? 'Вы вышли из системы по неактивности' : 'Все данные удалены'
  notificationColor.value = 'error'
  setTimeout(() => {
    window.location.reload()
  }, 2000)
}

// 7. Улучшение UX уведомлений — тестовые кнопки
function downloadUserData(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
function exportProfile() {
  const data = JSON.parse(localStorage.getItem('profileData') || '{}')
  downloadUserData('user_data/profile.json', data)
}
function exportTasks() {
  const data = JSON.parse(localStorage.getItem('tasks') || '[]')
  downloadUserData('user_data/tasks.json', data)
}
function exportSquads() {
  const data = JSON.parse(localStorage.getItem('customSquads') || '[]')
  downloadUserData('user_data/custom_squads.json', data)
}
function exportFactions() {
  const data = JSON.parse(localStorage.getItem('customFactions') || '[]')
  downloadUserData('user_data/custom_factions.json', data)
}
function exportSettings() {
  const keys = ['selectedTheme','notificationsEnabled','soundEnabled','autoLogout','inactivityTimeout']
  const data = {}
  keys.forEach(k => { data[k] = JSON.parse(localStorage.getItem(k)) })
  downloadUserData('user_data/settings.json', data)
}
function exportMap() {
  const data = JSON.parse(localStorage.getItem('mapData') || '{}')
  downloadUserData('user_data/map.json', data)
}
function exportAuth() {
  const data = localStorage.getItem('auth')
  downloadUserData('user_data/auth.json', { auth: data })
}
// Импорт
function importProfile() { refs.profileInput.value && refs.profileInput.value.click() }
function importProfileFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      localStorage.setItem('profileData', ev.target.result)
      showNotification.value = true
      notificationMessage.value = 'Профиль импортирован. Перезагрузите страницу.'
      notificationColor.value = 'success'
    } catch { showNotification.value = true; notificationMessage.value = 'Ошибка импорта профиля'; notificationColor.value = 'error' }
  }
  reader.readAsText(file)
}
function importTasks() { refs.tasksInput.value && refs.tasksInput.value.click() }
function importTasksFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      localStorage.setItem('tasks', ev.target.result)
      showNotification.value = true
      notificationMessage.value = 'Задачи импортированы. Перезагрузите страницу.'
      notificationColor.value = 'success'
    } catch { showNotification.value = true; notificationMessage.value = 'Ошибка импорта задач'; notificationColor.value = 'error' }
  }
  reader.readAsText(file)
}
function importSquads() { refs.squadsInput.value && refs.squadsInput.value.click() }
function importSquadsFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      localStorage.setItem('customSquads', ev.target.result)
      showNotification.value = true
      notificationMessage.value = 'Сквады импортированы. Перезагрузите страницу.'
      notificationColor.value = 'success'
    } catch { showNotification.value = true; notificationMessage.value = 'Ошибка импорта сквадов'; notificationColor.value = 'error' }
  }
  reader.readAsText(file)
}
function importFactions() { refs.factionsInput.value && refs.factionsInput.value.click() }
function importFactionsFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      localStorage.setItem('customFactions', ev.target.result)
      showNotification.value = true
      notificationMessage.value = 'Фракции импортированы. Перезагрузите страницу.'
      notificationColor.value = 'success'
    } catch { showNotification.value = true; notificationMessage.value = 'Ошибка импорта фракций'; notificationColor.value = 'error' }
  }
  reader.readAsText(file)
}
function importSettings() { refs.settingsInput.value && refs.settingsInput.value.click() }
function importSettingsFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result)
      Object.entries(data).forEach(([k,v]) => localStorage.setItem(k, JSON.stringify(v)))
      showNotification.value = true
      notificationMessage.value = 'Настройки импортированы. Перезагрузите страницу.'
      notificationColor.value = 'success'
    } catch { showNotification.value = true; notificationMessage.value = 'Ошибка импорта настроек'; notificationColor.value = 'error' }
  }
  reader.readAsText(file)
}
function importMap() { refs.mapInput.value && refs.mapInput.value.click() }
function importMapFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      localStorage.setItem('mapData', ev.target.result)
      showNotification.value = true
      notificationMessage.value = 'Данные карты импортированы. Перезагрузите страницу.'
      notificationColor.value = 'success'
    } catch { showNotification.value = true; notificationMessage.value = 'Ошибка импорта карты'; notificationColor.value = 'error' }
  }
  reader.readAsText(file)
}
function importAuth() { refs.authInput.value && refs.authInput.value.click() }
function importAuthFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result)
      localStorage.setItem('auth', data.auth)
      showNotification.value = true
      notificationMessage.value = 'Данные авторизации импортированы. Перезагрузите страницу.'
      notificationColor.value = 'success'
    } catch { showNotification.value = true; notificationMessage.value = 'Ошибка импорта авторизации'; notificationColor.value = 'error' }
  }
  reader.readAsText(file)
}

const mapZoom = ref(Number(localStorage.getItem('mapZoom')) || 10)
const mapLat = ref(Number(localStorage.getItem('mapLat')) || 54)
const mapLon = ref(Number(localStorage.getItem('mapLon')) || 39)

function saveMapSettings() {
  localStorage.setItem('mapZoom', mapZoom.value)
  localStorage.setItem('mapLat', mapLat.value)
  localStorage.setItem('mapLon', mapLon.value)
  showNotification.value = true
  notificationMessage.value = 'Настройки карты сохранены'
  notificationColor.value = 'success'
}
</script> 