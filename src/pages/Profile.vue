<template>
  <div class="profile-page">
    <v-container fluid class="pa-0 pa-md-4">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card v-if="localProfile" class="profile-card">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-account-edit</v-icon>
              Редактирование профиля
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="isFormValid">
                <v-row>
                  <!-- Аватар -->
                  <v-col cols="12" class="d-flex justify-center">
                    <v-avatar size="96" class="mb-4">
                      <v-img v-if="localProfile.avatar && localProfile.avatar.startsWith('data:')" :src="localProfile.avatar" />
                      <v-img v-else-if="localProfile.avatar && localProfile.avatar.startsWith('http')" :src="localProfile.avatar" />
                      <v-icon v-else size="48">mdi-account</v-icon>
                    </v-avatar>
                  </v-col>
                  
                  <!-- Имя и Фамилия -->
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
                  
                  <!-- Позывной и Аватарка -->
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
                  
                  <!-- Звание, Должность, Сквад -->
                  <v-col cols="12" sm="4">
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
                  <v-col cols="12" sm="4">
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
                  <v-col cols="12" sm="4">
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
                  
                  <!-- Предварительный просмотр -->
                  <v-col cols="12">
                    <v-divider class="my-4"></v-divider>
                    <div class="d-flex align-center mb-2">
                      <v-icon class="me-2">mdi-information</v-icon>
                      <span class="text-subtitle-2">Предварительный просмотр</span>
                    </div>
                    <v-card variant="outlined" class="pa-3">
                      <div class="d-flex align-center">
                        <v-avatar size="40" class="me-3">
                          <v-img v-if="localProfile.avatar && localProfile.avatar.startsWith('data:')" :src="localProfile.avatar" />
                          <v-img v-else-if="localProfile.avatar && localProfile.avatar.startsWith('http')" :src="localProfile.avatar" />
                          <v-icon v-else>mdi-account</v-icon>
                        </v-avatar>
                        <div class="flex-grow-1">
                          <div class="text-h6 text-truncate">{{ localProfile.firstName }} {{ localProfile.lastName }}</div>
                          <div class="text-subtitle-2 text-medium-emphasis text-truncate">{{ localProfile.callsign }}</div>
                        </div>
                        <div class="d-flex align-center">
                          <v-avatar size="24" color="surface-variant" class="me-1">
                            <v-icon size="16">{{ localProfile.squad?.icon }}</v-icon>
                          </v-avatar>
                          <v-avatar size="24" color="surface-variant" class="me-1">
                            <v-icon size="16">{{ localProfile.rank?.icon }}</v-icon>
                          </v-avatar>
                          <v-avatar size="24" color="surface-variant">
                            <v-icon size="16">{{ localProfile.role?.icon }}</v-icon>
                          </v-avatar>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            
            <!-- Кнопки действий -->
            <v-card-actions class="pa-4">
              <div class="d-flex flex-column flex-sm-row gap-4 w-100">
                <v-btn 
                  color="error" 
                  variant="outlined" 
                  @click="resetProfile"
                  :disabled="!hasChanges"
                  class="flex-1"
                >
                  Отменить
                </v-btn>
                <v-btn 
                  color="accent" 
                  variant="flat" 
                  @click="saveProfile"
                  :disabled="!isFormValid || !hasChanges"
                  :loading="isSaving"
                  class="flex-1"
                >
                  <v-icon class="me-2">mdi-content-save</v-icon>
                  Сохранить
                </v-btn>
                <v-btn 
                  color="accent" 
                  variant="flat" 
                  prepend-icon="mdi-plus" 
                  @click="dialog = true"
                  class="flex-1"
                >
                  Создать сквад
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Диалог создания сквада -->
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card>
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

const squads = ref([...defaultSquads])
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
  localProfile.value.squad = squad
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
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
}

.profile-card {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 1.5px 6px 0 rgba(0,0,0,0.10);
  border-radius: 18px;
}

.role-actions {
  margin-top: 32px;
}

.action-btn-wrapper {
  position: relative;
}

.gap-2 {
  gap: 8px;
}

.flex-1 {
  flex: 1 1 0;
  min-width: 0;
}

/* Мобильные стили */
@media (max-width: 599px) {
  .profile-card {
    border-radius: 12px;
    margin: 8px;
  }
  
  .v-card-actions {
    padding: 16px;
  }
}

/* Планшетные стили */
@media (min-width: 600px) and (max-width: 959px) {
  .profile-card {
    margin: 16px;
  }
}
</style> 