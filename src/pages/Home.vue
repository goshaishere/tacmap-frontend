<template>
  <div class="page-container home-page">
    <v-container fluid class="pa-0 pa-md-4" style="min-width:0;">
      <!-- Приветствие -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="welcome-card">
            <v-card-text class="text-center">
              <div class="d-flex justify-center mb-4">
                <v-avatar size="80">
                  <template v-if="profileStore.user.avatar">
                    <v-img :src="profileStore.user.avatar" />
                  </template>
                  <template v-else>
                    <v-icon size="40">mdi-account</v-icon>
                  </template>
                </v-avatar>
              </div>
              <h1 class="text-h4 text-sm-h3 text-on-surface mb-2">
                Добро пожаловать, {{ profileStore.user.firstName }}!
              </h1>
              <p class="text-body-1 text-medium-emphasis">
                {{ profileStore.user.rank.title }} {{ profileStore.user.role.title }} 
                в скваде {{ profileStore.user.squad.title }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Быстрые действия -->
      <v-row class="mb-6">
        <v-col cols="12">
          <h2 class="text-h5 text-sm-h4 text-on-surface mb-4">
            <v-icon class="me-2">mdi-lightning-bolt</v-icon>
            Быстрые действия
          </h2>
          <v-row>
            <v-col cols="6" sm="3" v-for="action in quickActions" :key="action.title">
              <v-card 
                class="action-card text-center" 
                @click="navigateTo(action.route)"
                hover
              >
                <v-card-text>
                  <v-icon size="48" color="accent" class="mb-3">{{ action.icon }}</v-icon>
                  <div class="text-subtitle-1 font-weight-medium">{{ action.title }}</div>
                  <div class="text-caption text-medium-emphasis">{{ action.description }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Статистика и информация -->
      <v-row>
        <!-- Активные задачи -->
        <v-col cols="12" lg="8">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center text-on-surface">
              <v-icon class="me-2">mdi-clipboard-list</v-icon>
              Активные задачи
              <v-spacer></v-spacer>
              <v-btn 
                color="accent" 
                variant="text" 
                @click="navigateTo('/tasks')"
                size="small"
              >
                Все задачи
                <v-icon class="ms-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div v-if="activeTasks.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1">mdi-clipboard-check</v-icon>
                <div class="text-h6 text-on-surface mt-4">Нет активных задач</div>
                <div class="text-body-2 text-medium-emphasis">Все задачи выполнены!</div>
              </div>
              <v-list v-else>
                <v-list-item
                  v-for="task in activeTasks.slice(0, 3)"
                  :key="task.id"
                  class="mb-2"
                >
                  <template #prepend>
                    <v-avatar :color="getStatusColor(task.status)" size="32">
                      <v-icon>{{ getActionIcon(task.actionType) }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="d-flex align-center flex-wrap gap-2">
                    <span class="text-truncate">{{ task.title }}</span>
                    <v-chip 
                      :color="getPriorityColor(task.priority)" 
                      size="x-small"
                      class="flex-shrink-0"
                    >
                      {{ task.priority }}
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Информация о профиле -->
        <v-col cols="12" lg="4">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-account-details</v-icon>
              Информация о профиле
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center mb-3" style="min-height:56px;">
                <div class="d-flex align-center justify-center" style="min-width:56px;">
                  <v-avatar size="48">
                    <template v-if="profileStore.user.avatar">
                      <v-img :src="profileStore.user.avatar" />
                    </template>
                    <template v-else>
                      <v-icon size="32">mdi-account</v-icon>
                    </template>
                  </v-avatar>
                </div>
                <div>
                  <div class="text-h6">{{ profileStore.user.firstName }} {{ profileStore.user.lastName }}</div>
                  <div class="text-subtitle-2 text-medium-emphasis">{{ profileStore.user.callsign }}</div>
                </div>
              </div>
              
              <v-divider class="my-3"></v-divider>
              
              <div class="d-flex align-center mb-2">
                <v-avatar size="32" color="surface-variant" class="me-2">
                  <v-icon>{{ profileStore.user.rank.icon }}</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-medium">Звание</div>
                  <div class="text-caption text-medium-emphasis">{{ profileStore.user.rank.title }}</div>
                </div>
              </div>
              
              <div class="d-flex align-center mb-2">
                <v-avatar size="32" color="surface-variant" class="me-2">
                  <v-icon>{{ profileStore.user.role.icon }}</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-medium">Должность</div>
                  <div class="text-caption text-medium-emphasis">{{ profileStore.user.role.title }}</div>
                </div>
              </div>
              
              <div class="d-flex align-center mb-2">
                <v-avatar size="32" color="surface-variant" class="me-2">
                  <v-icon>{{ profileStore.user.squad.icon }}</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-medium">Сквад</div>
                  <div class="text-caption text-medium-emphasis">{{ profileStore.user.squad.title }}</div>
                </div>
              </div>
              <div class="d-flex align-center mb-2">
                <v-avatar size="32" :color="isDark ? profileStore.user.faction?.colorDark : profileStore.user.faction?.colorLight" class="me-2">
                  <v-icon :color="isDark ? profileStore.user.faction?.iconColorDark : profileStore.user.faction?.iconColorLight">
                    {{ profileStore.user.faction?.icon }}
                  </v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-medium">Фракция</div>
                  <div class="text-caption text-medium-emphasis">{{ profileStore.user.faction?.title }}</div>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn 
                color="accent" 
                variant="text" 
                @click="navigateTo('/profile')"
                block
              >
                Редактировать профиль
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Последние действия -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-history</v-icon>
              Последние действия
            </v-card-title>
            <v-card-text>
              <div v-if="recentActions.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1">mdi-clock-outline</v-icon>
                <div class="text-h6 text-on-surface mt-4">Нет последних действий</div>
                <div class="text-body-2 text-medium-emphasis">Начните работу с системой</div>
              </div>
              <v-timeline v-else density="compact" align="start">
                <v-timeline-item
                  v-for="action in recentActions"
                  :key="action.id"
                  :dot-color="action.color"
                  size="small"
                >
                  <template #opposite>
                    <div class="text-caption text-medium-emphasis">
                      {{ formatTime(action.timestamp) }}
                    </div>
                  </template>
                  <v-card variant="outlined">
                    <v-card-text class="pa-3">
                      <div class="d-flex align-center">
                        <v-icon class="me-2" :color="action.color">{{ action.icon }}</v-icon>
                        <div>
                          <div class="text-subtitle-2 font-weight-medium">{{ action.title }}</div>
                          <div class="text-caption text-medium-emphasis">{{ action.description }}</div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../store/profile.js'
import { useTheme } from 'vuetify'

const router = useRouter()
const profileStore = useProfileStore()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value?.dark ?? false)

// Быстрые действия
const quickActions = [
  {
    title: 'Карта',
    description: 'Просмотр тактической карты',
    icon: 'mdi-map',
    route: '/map'
  },
  {
    title: 'Задачи',
    description: 'Управление задачами',
    icon: 'mdi-clipboard-list',
    route: '/tasks'
  },
  {
    title: 'Профиль',
    description: 'Редактирование профиля',
    icon: 'mdi-account-edit',
    route: '/profile'
  },
  {
    title: 'Сообщения',
    description: 'Система сообщений',
    icon: 'mdi-message',
    route: '/messages'
  }
]

// Моковые активные задачи
const activeTasks = [
  {
    id: 1,
    title: 'Эвакуировать раненого',
    description: 'Требуется эвакуация бойца с позиции Alpha-3',
    actionType: 'evac',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Починить рацию',
    description: 'Неисправность связи в секторе Bravo',
    actionType: 'repair',
    priority: 'medium',
    status: 'in-progress'
  }
]

// Моковые последние действия
const recentActions = [
  {
    id: 1,
    title: 'Задача создана',
    description: 'Создана задача "Эвакуировать раненого"',
    icon: 'mdi-plus-circle',
    color: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 минут назад
  },
  {
    id: 2,
    title: 'Профиль обновлен',
    description: 'Изменены данные профиля',
    icon: 'mdi-account-edit',
    color: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 часа назад
  },
  {
    id: 3,
    title: 'Задача завершена',
    description: 'Завершена задача "Разведать подходы"',
    icon: 'mdi-check-circle',
    color: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 часа назад
  }
]

// Методы
function navigateTo(route) {
  router.push(route)
}

function getStatusColor(status) {
  const colors = {
    'pending': 'warning',
    'in-progress': 'info',
    'completed': 'success'
  }
  return colors[status] || 'grey'
}

function getPriorityColor(priority) {
  const colors = {
    'low': 'success',
    'medium': 'info',
    'high': 'warning',
    'critical': 'error'
  }
  return colors[priority] || 'grey'
}

function getActionIcon(actionType) {
  const icons = {
    'heal': 'mdi-medical-bag',
    'evac': 'mdi-helicopter',
    'cover': 'mdi-crosshairs',
    'eliminate': 'mdi-target',
    'breach': 'mdi-door',
    'storm': 'mdi-shield',
    'suppress': 'mdi-robot-industrial',
    'repair': 'mdi-tools',
    'deploy': 'mdi-radar',
    'command': 'mdi-account-group',
    'mark': 'mdi-map-marker',
    'recon': 'mdi-binoculars',
    'blast': 'mdi-bomb',
    'smoke': 'mdi-smoke'
  }
  return icons[actionType] || 'mdi-help'
}

function formatTime(timestamp) {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes} мин назад`
  } else if (hours < 24) {
    return `${hours} ч назад`
  } else {
    return `${days} дн назад`
  }
}
</script> 

<style scoped>
/* .home-page — теперь только для page-container, overflow-x: hidden уже есть в глобальном классе */
</style> 