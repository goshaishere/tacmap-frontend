<template>
  <div class="page-container">
    <v-container fluid class="pa-0 pa-md-4">
      <v-row>
        <v-col cols="12">
          <h1 :class="[styles['profile-title']]">
              <v-icon :class="styles['profile-title-icon']">mdi-account-edit</v-icon>
              Редактирование профиля
          </h1>
        </v-col>
      </v-row>
      <v-row class="g-4">
        <!-- Основная информация -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">Основная информация</v-card-title>
            <v-card-text>
              <v-form ref="form" :class="styles['profile-form']">
                <v-row>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-avatar size="96" :class="styles['profile-avatar']">
                      <v-img v-if="localProfile.avatar && localProfile.avatar.startsWith('data:')" :src="localProfile.avatar" />
                      <v-img v-else-if="localProfile.avatar && localProfile.avatar.startsWith('http')" :src="localProfile.avatar" />
                      <v-icon v-else size="48">mdi-account</v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field 
                      v-model="localProfile.firstName" 
                      label="Имя" 
                      :rules="[rules.required, rules.minLength, rules.maxLength]"
                      prepend-icon="mdi-account"
                      variant="outlined"
                      required
                      counter="50"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field 
                      v-model="localProfile.lastName" 
                      label="Фамилия" 
                      :rules="[rules.required, rules.minLength, rules.maxLength]"
                      prepend-icon="mdi-account"
                      variant="outlined"
                      required
                      counter="50"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field 
                      v-model="localProfile.callsign" 
                      label="Позывной" 
                      :rules="[rules.required, rules.minLength, rules.maxLength, rules.callsign]"
                      prepend-icon="mdi-radio"
                      variant="outlined"
                      required
                      counter="50"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-file-input 
                      v-model="avatarFile" 
                      label="Аватарка" 
                      accept="image/*"
                      prepend-icon="mdi-camera"
                      variant="outlined"
                      :show-size="true"
                      :rules="[rules.imageType, rules.imageSize]"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Звание, должность, сквад, сторона -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">Военная информация</v-card-title>
            <v-card-text>
              <v-form ref="form" :class="styles['profile-form']">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="localProfile.rank"
                      :items="ranks"
                      item-title="title"
                      label="Звание"
                      return-object
                      :item-props="item => ({ prependIcon: item.icon })"
                      variant="outlined"
                      prepend-icon="mdi-star"
                      :rules="[rules.required]"
                      required
                    >
                      <template #selection="{ item }">
                        <v-icon v-if="item && item.raw && item.raw.icon" class="me-2">{{ item.raw.icon }}</v-icon>{{ item.raw?.title || '' }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="localProfile.role"
                      :items="roles"
                      item-title="title"
                      label="Должность"
                      return-object
                      :item-props="item => ({ prependIcon: item.icon })"
                      variant="outlined"
                      prepend-icon="mdi-badge-account"
                      :rules="[rules.required]"
                      required
                    >
                      <template #selection="{ item }">
                        <v-icon v-if="item && item.raw && item.raw.icon" class="me-2">{{ item.raw.icon }}</v-icon>{{ item.raw?.title || '' }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="localProfile.squad"
                      :items="squads"
                      item-title="title"
                      label="Сквад"
                      return-object
                      :item-props="item => ({ prependIcon: item.icon })"
                      variant="outlined"
                      prepend-icon="mdi-account-group"
                      :rules="[rules.required]"
                      required
                    >
                      <template #selection="{ item }">
                        <v-icon v-if="item && item.raw && item.raw.icon" class="me-2">{{ item.raw.icon }}</v-icon>{{ item.raw?.title || '' }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="localProfile.faction"
                      :items="factionsList"
                      item-title="title"
                      label="Фракция"
                      return-object
                      :item-props="item => ({ prependIcon: item.icon })"
                      variant="outlined"
                      prepend-icon="mdi-flag"
                      :rules="[rules.required]"
                      required
                    >
                      <template #selection="{ item }">
                        <v-icon v-if="item && item.raw && item.raw.icon" class="me-2">{{ item.raw.icon }}</v-icon>{{ item.raw?.title || '' }}
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
                  <!-- Предварительный просмотр -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">Предварительный просмотр</v-card-title>
            <v-card-text>
                    <v-card variant="outlined" class="pa-3">
                <div :class="styles['profile-preview']">
                  <v-avatar size="40" class="me-3 mb-2 mb-md-0">
                          <v-img v-if="localProfile.avatar && localProfile.avatar.startsWith('data:')" :src="localProfile.avatar" />
                          <v-img v-else-if="localProfile.avatar && localProfile.avatar.startsWith('http')" :src="localProfile.avatar" />
                          <v-icon v-else>mdi-account</v-icon>
                        </v-avatar>
                  <div class="flex-grow-1 mb-2 mb-md-0">
                          <div class="text-h6 text-truncate">{{ localProfile.firstName }} {{ localProfile.lastName }}</div>
                          <div class="text-subtitle-2 text-medium-emphasis text-truncate">{{ localProfile.callsign }}</div>
                        </div>
                  <div :class="styles['profile-preview-actions']">
                    <v-avatar size="24" :color="localProfile.faction?.color || 'surface-variant'" class="me-2">
                            <v-icon size="16">{{ localProfile.faction?.icon }}</v-icon>
                          </v-avatar>
                    <v-avatar size="24" color="surface-variant" class="me-2">
                            <v-icon size="16">{{ localProfile.squad?.icon }}</v-icon>
                          </v-avatar>
                    <v-avatar size="24" color="surface-variant" class="me-2">
                            <v-icon size="16">{{ localProfile.rank?.icon }}</v-icon>
                          </v-avatar>
                          <v-avatar size="24" color="surface-variant">
                            <v-icon size="16">{{ localProfile.role?.icon }}</v-icon>
                          </v-avatar>
                        </div>
                      </div>
                    </v-card>
            </v-card-text>
          </v-card>
        </v-col>
            <!-- Кнопки действий -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4">
            <v-card-title class="text-h6 text-on-surface mb-2">Действия</v-card-title>
            <v-card-text>
              <v-row class="w-100" dense>
                <v-col cols="12" sm="6" :class="styles['profile-actions']">
                  <v-btn block color="accent" variant="flat" prepend-icon="mdi-plus" @click="dialog = true">
                    Создать сквад
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" :class="styles['profile-actions']">
                  <v-btn block color="accent" variant="flat" prepend-icon="mdi-plus" @click="dialogFaction = true">
                    Добавить фракцию
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex gap-2">
                  <v-btn block color="error" variant="outlined" @click="resetProfile" :disabled="!hasChanges">
                    Отменить
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex gap-2">
                  <v-btn block color="accent" variant="flat" @click="saveProfile" :disabled="!isFormValid || !hasChanges" :loading="isSaving">
                    <v-icon class="me-2">mdi-content-save</v-icon>
                    Сохранить
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Диалог создания сквада -->
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card :class="styles['profile-dialog']">
        <v-card-title>Создать сквад</v-card-title>
        <v-card-text>
          <v-text-field v-model="newSquad.title" label="Название сквада" required></v-text-field>
          <v-select
            v-model="newSquad.icon"
            :items="iconOptions"
            item-title="title"
            item-value="icon"
            label="Иконка"
            :item-props="item => ({ prependIcon: item.icon })"
          >
            <template #selection="{ item }">
              <v-icon class="me-2">{{ item.raw.icon }}</v-icon>{{ item.raw.title }}
            </template>
          </v-select>
          <v-text-field v-model="newSquad.description" label="Описание"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" variant="outlined" @click="createSquad">Создать</v-btn>
          <v-btn color="accent" variant="text" @click="dialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Диалог создания фракции -->
    <v-dialog v-model="dialogFaction" max-width="400" persistent>
      <v-card :class="styles['profile-dialog']">
        <v-card-title>Создать фракцию</v-card-title>
        <v-card-text>
          <v-text-field v-model="newFaction.title" label="Название фракции" required></v-text-field>
          <v-select
            v-model="newFaction.icon"
            :items="iconOptions"
            item-title="title"
            item-value="icon"
            label="Иконка"
            :item-props="item => ({ prependIcon: item.icon })"
          >
            <template #selection="{ item }">
              <v-icon class="me-2">{{ item.raw.icon }}</v-icon>{{ item.raw.title }}
            </template>
          </v-select>
          <v-checkbox v-model="useDefaultFactionColors" label="Использовать стандартные цвета темы" class="mt-2 mb-2" />
          <div v-if="!useDefaultFactionColors" class="d-flex flex-wrap gap-4 mt-2">
            <div>
              <div class="mb-1 text-caption">Кружок (светлая тема)</div>
              <v-color-picker v-model="newFaction.colorLight" hide-canvas flat></v-color-picker>
            </div>
            <div>
              <div class="mb-1 text-caption">Кружок (тёмная тема)</div>
              <v-color-picker v-model="newFaction.colorDark" hide-canvas flat></v-color-picker>
            </div>
            <div>
              <div class="mb-1 text-caption">Иконка (светлая тема)</div>
              <v-color-picker v-model="newFaction.iconColorLight" hide-canvas flat></v-color-picker>
            </div>
            <div>
              <div class="mb-1 text-caption">Иконка (тёмная тема)</div>
              <v-color-picker v-model="newFaction.iconColorDark" hide-canvas flat></v-color-picker>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" variant="outlined" @click="createFaction">Создать</v-btn>
          <v-btn color="accent" variant="text" @click="dialogFaction = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Уведомление о сохранении -->
    <v-snackbar v-model="showNotification" :color="notificationColor" timeout="3000">
      {{ notificationMessage }}
      <template #actions>
        <v-btn variant="text" @click="showNotification = false">Закрыть</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, watch } from 'vue'
import { ranks } from '../data/ranks.js'
import { roles } from '../data/roles.js'
import { defaultSquads, createSquad as createSquadFn } from '../data/squads.js'
import { useProfileStore } from '../store/profile.js'
import { factions } from '../data/factions.js'
import { useTheme } from 'vuetify'
import styles from '../styles/ProfilePage.module.scss'

const FACTIONS_LS_KEY = 'customFactions'
const SQUADS_LS_KEY = 'customSquads'

function loadFactionsFromLS() {
  let custom = []
  try {
    const raw = localStorage.getItem(FACTIONS_LS_KEY)
    custom = raw ? JSON.parse(raw) : []
  } catch { custom = [] }
  // Объединяем дефолтные и кастомные, избегая дубликатов по key
  return [
    ...factions,
    ...custom.filter(f => !factions.some(df => df.key === f.key))
  ]
}
function saveFactionsToLS(list) {
  localStorage.setItem(FACTIONS_LS_KEY, JSON.stringify(list))
}

function loadSquadsFromLS() {
  try {
    const raw = localStorage.getItem(SQUADS_LS_KEY)
    if (!raw) return [...defaultSquads]
    return JSON.parse(raw)
  } catch {
    return [...defaultSquads]
  }
}
function saveSquadsToLS(list) {
  localStorage.setItem(SQUADS_LS_KEY, JSON.stringify(list))
}

const factionsList = ref(loadFactionsFromLS())
const squads = ref(loadSquadsFromLS())
const profileStore = useProfileStore()
const form = ref(null)
const isFormValid = ref(true)
const isSaving = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('success')

// Правила валидации
const rules = {
  required: v => !!v || 'Это поле обязательно',
  minLength: v => v && v.length >= 2 || 'Минимум 2 символа',
  maxLength: v => v && v.length <= 50 || 'Максимум 50 символов',
  callsign: v => v && /^[a-zA-Zа-яА-Я0-9_-]+$/.test(v) || 'Только буквы, цифры, дефис и подчеркивание',
  imageSize: v => !v || v.size < 5000000 || 'Размер файла должен быть меньше 5MB',
  imageType: v => !v || /^image\//.test(v.type) || 'Выберите изображение'
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Инициализируем localProfile с данными из store
const localProfile = ref(deepClone(profileStore.user))
const originalProfile = ref(deepClone(profileStore.user))

// Синхронизируем с store при изменениях
watchEffect(() => {
  if (profileStore.user) {
    localProfile.value = deepClone(profileStore.user)
    originalProfile.value = deepClone(profileStore.user)
  }
})

// Проверяем, есть ли изменения
const hasChanges = computed(() => {
  return JSON.stringify(localProfile.value) !== JSON.stringify(originalProfile.value)
})

const dialog = ref(false)
const newSquad = ref({
  title: '',
  icon: '',
  description: ''
})
const avatarFile = ref(null)

watch(avatarFile, async (file) => {
  if (!file) {
    localProfile.value.avatar = ''
    return
  }
  if (file instanceof File) {
    const reader = new FileReader()
    reader.onload = e => {
      localProfile.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
})

const iconOptions = [
  { icon: 'mdi-alpha-a-circle', title: 'A' },
  { icon: 'mdi-alpha-b-circle', title: 'B' },
  { icon: 'mdi-alpha-c-circle', title: 'C' },
  { icon: 'mdi-alpha-d-circle', title: 'D' },
  { icon: 'mdi-alpha-e-circle', title: 'E' },
  { icon: 'mdi-alpha-f-circle', title: 'F' },
  { icon: 'mdi-account-group', title: 'Группа' },
  { icon: 'mdi-shield', title: 'Щит' },
  { icon: 'mdi-star', title: 'Звезда' },
  { icon: 'mdi-car', title: 'Машина' },
  { icon: 'mdi-truck', title: 'Грузовик' },
  { icon: 'mdi-tank', title: 'Танк' },
  { icon: 'mdi-airplane', title: 'Самолёт' },
  { icon: 'mdi-helicopter', title: 'Вертолёт' },
  { icon: 'mdi-drone', title: 'Дрон' },
  { icon: 'mdi-robot', title: 'Робот' },
  { icon: 'mdi-radar', title: 'Радар' },
  { icon: 'mdi-crosshairs-gps', title: 'Наведение' },
  { icon: 'mdi-bomb', title: 'Бомба' },
  { icon: 'mdi-circle', title: 'Круг' },
  { icon: 'mdi-checkbox-blank-circle-outline', title: 'Пустой круг' },
  { icon: 'mdi-checkbox-blank-circle', title: 'Заполненный круг' },
  { icon: 'mdi-star-outline', title: 'Пустая звезда' },
  { icon: 'mdi-star', title: 'Заполненная звезда' },
  { icon: 'mdi-flag', title: 'Флаг' },
  { icon: 'mdi-sword-cross', title: 'Мечи' },
  { icon: 'mdi-target', title: 'Мишень' },
  { icon: 'mdi-compass', title: 'Компас' },
  { icon: 'mdi-map-marker', title: 'Метка' },
  { icon: 'mdi-rocket', title: 'Ракета' },
  { icon: 'mdi-ship-wheel', title: 'Штурвал' },
  { icon: 'mdi-anchor', title: 'Якорь' },
  { icon: 'mdi-skull', title: 'Череп' },
  { icon: 'mdi-shield-account', title: 'Щит с человеком' },
  { icon: 'mdi-emoticon-cool', title: 'Крутой' },
  { icon: 'mdi-emoticon-angry', title: 'Злой' },
  { icon: 'mdi-emoticon-happy', title: 'Счастливый' },
  { icon: 'mdi-emoticon-sad', title: 'Грустный' },
  { icon: 'mdi-fire', title: 'Огонь' },
  { icon: 'mdi-water', title: 'Вода' },
  { icon: 'mdi-earth', title: 'Земля' },
  { icon: 'mdi-leaf', title: 'Лист' },
  { icon: 'mdi-paw', title: 'Лапа' },
  { icon: 'mdi-crown', title: 'Корона' },
  { icon: 'mdi-diamond', title: 'Бриллиант' },
  { icon: 'mdi-heart', title: 'Сердце' },
  { icon: 'mdi-lightning-bolt', title: 'Молния' },
  { icon: 'mdi-moon-waning-crescent', title: 'Луна' },
  { icon: 'mdi-sun-wireless', title: 'Солнце' },
  { icon: 'mdi-tree', title: 'Дерево' },
  { icon: 'mdi-mushroom', title: 'Гриб' },
  { icon: 'mdi-castle', title: 'Замок' },
  { icon: 'mdi-cannon', title: 'Пушка' },
  { icon: 'mdi-bug', title: 'Жук' },
  { icon: 'mdi-bat', title: 'Летучая мышь' },
  { icon: 'mdi-spider', title: 'Паук' },
  { icon: 'mdi-snowflake', title: 'Снежинка' },
  { icon: 'mdi-flash', title: 'Вспышка' },
  { icon: 'mdi-eye', title: 'Глаз' },
  { icon: 'mdi-hand', title: 'Рука' },
  { icon: 'mdi-foot-print', title: 'След' },
  { icon: 'mdi-bullhorn', title: 'Мегафон' },
  { icon: 'mdi-radioactive', title: 'Радиация' },
  { icon: 'mdi-biohazard', title: 'Биологическая опасность' },
  { icon: 'mdi-crosshairs', title: 'Прицел' },
  { icon: 'mdi-medical-bag', title: 'Медпункт' },
  { icon: 'mdi-account-multiple', title: 'Группа людей' },
  { icon: 'mdi-account-tie', title: 'Офицер' },
  { icon: 'mdi-account-cowboy-hat', title: 'Ковбой' },
  { icon: 'mdi-account-ninja', title: 'Ниндзя' },
  { icon: 'mdi-account-voice', title: 'Оратор' },
  { icon: 'mdi-account-star', title: 'Звёздный' },
  { icon: 'mdi-account-heart', title: 'Сердечный' },
  { icon: 'mdi-account-cash', title: 'Богатый' },
  { icon: 'mdi-account-music', title: 'Музыкант' },
  { icon: 'mdi-account-school', title: 'Ученик' },
  { icon: 'mdi-account-search', title: 'Разведчик' },
  { icon: 'mdi-account-settings', title: 'Настроечный' },
  { icon: 'mdi-account-supervisor', title: 'Супервайзер' },
  { icon: 'mdi-account-tie-woman', title: 'Офицер-женщина' },
]

// Типовые действия для ролей
const actionsByRole = {
  medic: [
    { key: 'heal', title: 'Оказать помощь', icon: 'mdi-medical-bag' },
    { key: 'evac', title: 'Эвакуировать', icon: 'mdi-helicopter' },
  ],
  sniper: [
    { key: 'cover', title: 'Прикрыть', icon: 'mdi-crosshairs' },
    { key: 'eliminate', title: 'Устранить цель', icon: 'mdi-target' },
  ],
  assault: [
    { key: 'breach', title: 'Взломать', icon: 'mdi-door' },
    { key: 'storm', title: 'Штурмовать', icon: 'mdi-shield' },
    { key: 'suppress', title: 'Подавить', icon: 'mdi-robot-industrial' },
  ],
  tech: [
    { key: 'repair', title: 'Починить', icon: 'mdi-tools' },
    { key: 'deploy', title: 'Развернуть оборудование', icon: 'mdi-radar' },
  ],
  squad_leader: [
    { key: 'command', title: 'Отдать приказ', icon: 'mdi-account-group' },
    { key: 'mark', title: 'Отметить цель', icon: 'mdi-map-marker' },
  ],
  machine_gunner: [
    { key: 'suppress', title: 'Подавить', icon: 'mdi-robot-industrial' },
    { key: 'cover', title: 'Прикрыть', icon: 'mdi-shield' },
  ],
  scout: [
    { key: 'recon', title: 'Разведать', icon: 'mdi-binoculars' },
    { key: 'mark', title: 'Отметить цель', icon: 'mdi-map-marker' },
  ],
  grenadier: [
    { key: 'blast', title: 'Взорвать', icon: 'mdi-bomb' },
    { key: 'smoke', title: 'Дымовая завеса', icon: 'mdi-smoke' },
  ],
}

const roleActions = computed(() => {
  const role = localProfile.value?.role?.key
  return actionsByRole[role] || []
})

// Пример структуры задач (taskCounts): ключ — тип действия, значение — количество задач
const taskCounts = ref({
  heal: 0,
  evac: 0,
  cover: 0,
  eliminate: 0,
  breach: 0,
  storm: 0,
  suppress: 0,
  repair: 0,
  deploy: 0,
  command: 0,
  mark: 0,
  recon: 0,
  blast: 0,
  smoke: 0,
})

function createSquad() {
  if (!newSquad.value.title || !newSquad.value.icon) return
  const key = newSquad.value.title.toLowerCase().replace(/\s+/g, '-')
  const squad = createSquadFn({
    key,
    title: newSquad.value.title,
    icon: newSquad.value.icon,
    description: newSquad.value.description
  })
  squads.value.push(squad)
  saveSquadsToLS(squads.value)
  dialog.value = false
  newSquad.value = { title: '', icon: '', description: '' }
}

function resetProfile() {
  localProfile.value = deepClone(originalProfile.value)
  avatarFile.value = null
  showNotification.value = true
  notificationMessage.value = 'Изменения отменены'
  notificationColor.value = 'info'
}

async function saveProfile() {
  // Проверяем валидацию формы
  const { valid } = await form.value.validate()
  if (!valid) {
    showNotification.value = true
    notificationMessage.value = 'Пожалуйста, исправьте ошибки в форме'
    notificationColor.value = 'error'
    return
  }
  
  isSaving.value = true
  
  try {
    // Имитируем задержку сохранения
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    profileStore.updateProfile(localProfile.value)
    profileStore.setFaction(localProfile.value.faction)
    originalProfile.value = deepClone(localProfile.value)
    
    showNotification.value = true
    notificationMessage.value = 'Профиль успешно сохранён!'
    notificationColor.value = 'success'
  } catch (error) {
    showNotification.value = true
    notificationMessage.value = 'Ошибка при сохранении профиля'
    notificationColor.value = 'error'
  } finally {
    isSaving.value = false
  }
}

const dialogFaction = ref(false)
const newFaction = ref({
  title: '',
  icon: '',
  colorLight: '#1976D2',
  colorDark: '#90CAF9',
  iconColorLight: '#fff',
  iconColorDark: '#222',
})
const useDefaultFactionColors = ref(true)
const theme = useTheme()
const isDark = computed(() => theme.current.value?.name === 'tacticalDark' || theme.current.value?.dark)

function createFaction() {
  if (!newFaction.value.title || !newFaction.value.icon) return
  let colorLight = newFaction.value.colorLight
  let colorDark = newFaction.value.colorDark
  let iconColorLight = newFaction.value.iconColorLight
  let iconColorDark = newFaction.value.iconColorDark
  if (useDefaultFactionColors.value) {
    colorLight = theme.current.value.colors.surface
    colorDark = theme.current.value.colors.surfaceVariant
    iconColorLight = theme.current.value.colors['on-surface']
    iconColorDark = theme.current.value.colors['on-surface-variant']
  }
  factionsList.value.push({
    key: newFaction.value.title.toLowerCase().replace(/\s+/g, '_'),
    title: newFaction.value.title,
    icon: newFaction.value.icon,
    colorLight,
    colorDark,
    iconColorLight,
    iconColorDark,
  })
  saveFactionsToLS(factionsList.value)
  dialogFaction.value = false
  newFaction.value = { title: '', icon: '', colorLight: '#1976D2', colorDark: '#90CAF9', iconColorLight: '#fff', iconColorDark: '#222' }
  useDefaultFactionColors.value = true
}
</script> 