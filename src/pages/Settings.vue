<template>
  <div class="settings-page">
    <v-container fluid class="pa-0 pa-md-4">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="settings-card">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-cog</v-icon>
              Настройки приложения
            </v-card-title>
            
            <v-card-text>
              <!-- Внешний вид -->
              <div class="mb-6">
                <h3 class="text-h6 mb-4">
                  <v-icon class="me-2">mdi-palette</v-icon>
                  Внешний вид
                </h3>
                
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Тема оформления</div>
                        <div class="text-caption text-medium-emphasis">
                          Выберите светлую или темную тему
                        </div>
                      </div>
                      <v-btn-toggle
                        v-model="selectedTheme"
                        mandatory
                        color="accent"
                        @update:model-value="changeTheme"
                      >
                        <v-btn value="tacticalLight" size="small">
                          <v-icon class="me-1">mdi-white-balance-sunny</v-icon>
                          Светлая
                        </v-btn>
                        <v-btn value="tacticalDark" size="small">
                          <v-icon class="me-1">mdi-weather-night</v-icon>
                          Темная
                        </v-btn>
                      </v-btn-toggle>
                    </div>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Компактный режим</div>
                        <div class="text-caption text-medium-emphasis">
                          Уменьшить размеры элементов интерфейса
                        </div>
                      </div>
                      <v-switch
                        v-model="compactMode"
                        color="accent"
                        @update:model-value="toggleCompactMode"
                      ></v-switch>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
              
              <v-divider class="my-6"></v-divider>
              
              <!-- Уведомления -->
              <div class="mb-6">
                <h3 class="text-h6 mb-4">
                  <v-icon class="me-2">mdi-bell</v-icon>
                  Уведомления
                </h3>
                
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Включить уведомления</div>
                        <div class="text-caption text-medium-emphasis">
                          Получать уведомления о новых задачах
                        </div>
                      </div>
                      <v-switch
                        v-model="notificationsEnabled"
                        color="accent"
                        @update:model-value="toggleNotifications"
                      ></v-switch>
                    </div>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Звуковые уведомления</div>
                        <div class="text-caption text-medium-emphasis">
                          Воспроизводить звук при получении уведомлений
                        </div>
                      </div>
                      <v-switch
                        v-model="soundEnabled"
                        color="accent"
                        :disabled="!notificationsEnabled"
                        @update:model-value="toggleSound"
                      ></v-switch>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
              
              <v-divider class="my-6"></v-divider>
              
              <!-- Безопасность -->
              <div class="mb-6">
                <h3 class="text-h6 mb-4">
                  <v-icon class="me-2">mdi-shield</v-icon>
                  Безопасность
                </h3>
                
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Автоматический выход</div>
                        <div class="text-caption text-medium-emphasis">
                          Выход из системы после периода неактивности
                        </div>
                      </div>
                      <v-switch
                        v-model="autoLogout"
                        color="accent"
                        @update:model-value="toggleAutoLogout"
                      ></v-switch>
                    </div>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Время неактивности</div>
                        <div class="text-caption text-medium-emphasis">
                          Минуты до автоматического выхода
                        </div>
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
              </div>
              
              <v-divider class="my-6"></v-divider>
              
              <!-- Данные -->
              <div class="mb-6">
                <h3 class="text-h6 mb-4">
                  <v-icon class="me-2">mdi-database</v-icon>
                  Данные
                </h3>
                
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Экспорт данных</div>
                        <div class="text-caption text-medium-emphasis">
                          Скачать все данные профиля и задач
                        </div>
                      </div>
                      <v-btn 
                        color="accent" 
                        variant="outlined" 
                        size="small"
                        @click="exportData"
                      >
                        Экспорт
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Очистить данные</div>
                        <div class="text-caption text-medium-emphasis">
                          Удалить все сохраненные данные
                        </div>
                      </div>
                      <v-btn 
                        color="error" 
                        variant="outlined" 
                        size="small"
                        @click="showClearDialog = true"
                      >
                        Очистить
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Сброс настроек</div>
                        <div class="text-caption text-medium-emphasis">
                          Вернуть все настройки к значениям по умолчанию
                        </div>
                      </div>
                      <v-btn 
                        color="warning" 
                        variant="outlined" 
                        size="small"
                        @click="resetSettings"
                      >
                        Сброс
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
              
              <v-divider class="my-6"></v-divider>
              
              <!-- О приложении -->
              <div>
                <h3 class="text-h6 mb-4">
                  <v-icon class="me-2">mdi-information</v-icon>
                  О приложении
                </h3>
                
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="text-center">
                      <v-avatar size="64" color="primary" class="mb-3">
                        <v-icon size="32">mdi-map</v-icon>
                      </v-avatar>
                      <div class="text-h6 font-weight-bold mb-1">TacMap</div>
                      <div class="text-caption text-medium-emphasis mb-3">Версия 1.0.0</div>
                      <div class="text-body-2 text-medium-emphasis mb-4">
                        Система тактического управления для координации действий
                      </div>
                      <div class="d-flex flex-column flex-sm-row justify-center gap-2">
                        <v-btn 
                          color="accent" 
                          variant="outlined" 
                          size="small"
                          href="https://github.com/tacmap"
                          target="_blank"
                        >
                          GitHub
                        </v-btn>
                        <v-btn 
                          color="accent" 
                          variant="outlined" 
                          size="small"
                          href="mailto:support@tacmap.com"
                        >
                          Поддержка
                        </v-btn>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
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
          Подтверждение
        </v-card-title>
        <v-card-text>
          <p>Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.</p>
          <p class="text-caption text-medium-emphasis mt-2">
            Будут удалены: профиль, задачи, настройки и все сохраненные данные.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showClearDialog = false">Отмена</v-btn>
          <v-btn 
            color="error" 
            variant="flat" 
            @click="clearAllData"
          >
            Удалить все
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Уведомления -->
    <v-snackbar v-model="showNotification" :color="notificationColor" timeout="3000">
      {{ notificationMessage }}
      <template #actions>
        <v-btn variant="text" @click="showNotification = false">Закрыть</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useProfileStore } from '../store/profile.js'

const theme = useTheme()
const profileStore = useProfileStore()

// Состояние
const selectedTheme = ref('tacticalLight')
const compactMode = ref(false)
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
    theme.global.name.value = savedTheme
  }
  
  const savedCompactMode = localStorage.getItem('compactMode')
  if (savedCompactMode !== null) {
    compactMode.value = JSON.parse(savedCompactMode)
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
function changeTheme(newTheme) {
  theme.global.name.value = newTheme
  saveSetting('selectedTheme', newTheme)
  showNotification.value = true
  notificationMessage.value = 'Тема изменена'
  notificationColor.value = 'success'
}

function toggleCompactMode(enabled) {
  saveSetting('compactMode', enabled)
  showNotification.value = true
  notificationMessage.value = enabled ? 'Компактный режим включен' : 'Компактный режим отключен'
  notificationColor.value = 'info'
}

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
      compactMode: compactMode.value,
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
  compactMode.value = false
  notificationsEnabled.value = true
  soundEnabled.value = true
  autoLogout.value = false
  inactivityTimeout.value = 30
  
  // Сохраняем сброшенные настройки
  saveSetting('selectedTheme', selectedTheme.value)
  saveSetting('compactMode', compactMode.value)
  saveSetting('notificationsEnabled', notificationsEnabled.value)
  saveSetting('soundEnabled', soundEnabled.value)
  saveSetting('autoLogout', autoLogout.value)
  saveSetting('inactivityTimeout', inactivityTimeout.value)
  
  // Применяем тему
  theme.global.name.value = selectedTheme.value
  
  showClearDialog.value = false
  showNotification.value = true
  notificationMessage.value = 'Настройки сброшены'
  notificationColor.value = 'warning'
}

function clearAllData() {
  // Очищаем все данные
  localStorage.clear()
  
  // Сбрасываем профиль
  profileStore.resetProfile()
  
  showClearDialog.value = false
  showNotification.value = true
  notificationMessage.value = 'Все данные удалены'
  notificationColor.value = 'error'
  
  // Перезагружаем страницу
  setTimeout(() => {
    window.location.reload()
  }, 2000)
}

// Инициализация
onMounted(() => {
  loadSettings()
})

// Следим за изменением таймаута
watch(inactivityTimeout, (newValue) => {
  saveSetting('inactivityTimeout', newValue)
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
}

.settings-card {
  border-radius: 16px;
}

.gap-2 {
  gap: 8px;
}

/* Мобильные стили */
@media (max-width: 599px) {
  .settings-card {
    border-radius: 12px;
    margin: 8px;
  }
  
  .v-card-title {
    padding: 16px;
  }
  
  .v-card-text {
    padding: 16px;
  }
}

/* Планшетные стили */
@media (min-width: 600px) and (max-width: 959px) {
  .settings-card {
    margin: 16px;
  }
}
</style> 