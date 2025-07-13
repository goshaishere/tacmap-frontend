<template>
  <div class="page-container">
    <v-container fluid class="pa-0 pa-md-4">
      <!-- Заголовок и инструменты -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between gap-4">
            <h1 class="text-h4 text-sm-h3 text-on-surface">
              <v-icon class="me-3">mdi-map</v-icon>
              Тактическая карта
            </h1>
            <div class="d-flex flex-nowrap align-center gap-2 overflow-x-auto" style="min-width:0;">
              <v-btn 
                color="accent" 
                variant="outlined" 
                prepend-icon="mdi-layers"
                @click="showLayers = !showLayers"
                size="small"
              >
                Слои
              </v-btn>
              <v-btn 
                color="accent" 
                variant="outlined" 
                prepend-icon="mdi-magnify"
                @click="showSearch = !showSearch"
                size="small"
              >
                Поиск
              </v-btn>
              <v-btn 
                color="accent" 
                variant="outlined" 
                prepend-icon="mdi-ruler"
                @click="showMeasurements = !showMeasurements"
                size="small"
              >
                Измерения
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Панели инструментов -->
      <v-row v-if="showLayers || showSearch || showMeasurements" class="mb-4">
        <v-col cols="12">
          <v-expansion-panels variant="accordion">
            <!-- Панель слоев -->
            <v-expansion-panel v-if="showLayers">
              <v-expansion-panel-title>
                <v-icon class="me-2">mdi-layers</v-icon>
                Управление слоями
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" sm="6" md="3" v-for="layer in mapLayers" :key="layer.id">
                    <v-card variant="outlined" class="layer-card">
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <v-icon class="me-2" :color="layer.color">{{ layer.icon }}</v-icon>
                            <span class="text-subtitle-2">{{ layer.name }}</span>
                          </div>
                          <v-switch
                            v-model="layer.visible"
                            color="accent"
                            density="compact"
                            hide-details
                          ></v-switch>
                        </div>
                        <div class="text-caption text-medium-emphasis mt-1">{{ layer.description }}</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Панель поиска -->
            <v-expansion-panel v-if="showSearch">
              <v-expansion-panel-title>
                <v-icon class="me-2">mdi-magnify</v-icon>
                Поиск объектов
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="searchQuery"
                      label="Поиск по названию или координатам"
                      prepend-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="searchType"
                      :items="searchTypes"
                      label="Тип объекта"
                      variant="outlined"
                      density="compact"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-btn 
                  color="accent" 
                  variant="flat" 
                  @click="performSearch"
                  :disabled="!searchQuery"
                  block
                  class="mt-2"
                >
                  Найти
                </v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Панель измерений -->
            <v-expansion-panel v-if="showMeasurements">
              <v-expansion-panel-title>
                <v-icon class="me-2">mdi-ruler</v-icon>
                Инструменты измерений
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-btn 
                      color="accent" 
                      variant="outlined" 
                      prepend-icon="mdi-ruler"
                      @click="startDistanceMeasurement"
                      block
                    >
                      Измерить расстояние
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn 
                      color="accent" 
                      variant="outlined" 
                      prepend-icon="mdi-vector-square"
                      @click="startAreaMeasurement"
                      block
                    >
                      Измерить площадь
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn 
                      color="error" 
                      variant="outlined" 
                      prepend-icon="mdi-close"
                      @click="clearMeasurements"
                      block
                    >
                      Очистить
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <!-- Основная карта -->
      <v-row>
        <v-col cols="12">
          <v-card class="rounded-lg">
            <v-card-text class="pa-0">
              <!-- Яндекс.Карта -->
              <yandex-map
                :settings="ymapSettings"
                :coords="center"
                :zoom="zoom"
                class="w-100"
                style="height: 600px;"
                @contextmenu="onMapRightClick"
              >
                <!-- Здесь будут маркеры -->
                <yandex-map-marker
                  v-for="marker in markers"
                  :key="marker.id"
                  :coords="marker.coords"
                  :icon="marker.icon"
                  :properties="{ hintContent: marker.label }"
                  @click="onMarkerClick(marker)"
                />
                <!-- Радиальное меню -->
                <div v-if="showRadialMenu" :style="radialMenuStyle" class="d-flex flex-row gap-2 rounded-pill pa-2 elevation-2 bg-white position-absolute">
                  <button v-for="type in markerTypes" :key="type.key" @click="addMarker(type)">
                    <v-icon :color="type.color">{{ type.icon }}</v-icon>
                  </button>
                </div>
              </yandex-map>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Панель информации -->
      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex align-center text-on-surface">
              <v-icon class="me-2">mdi-information</v-icon>
              Информация о карте
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold text-primary">{{ totalObjects }}</div>
                    <div class="text-caption text-medium-emphasis">Объектов на карте</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold text-warning">{{ activeTasks }}</div>
                    <div class="text-caption text-medium-emphasis">Активных задач</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold text-success">{{ friendlyUnits }}</div>
                    <div class="text-caption text-medium-emphasis">Дружественных единиц</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold text-error">{{ threats }}</div>
                    <div class="text-caption text-medium-emphasis">Угроз</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-clock</v-icon>
              Последние обновления
            </v-card-title>
            <v-card-text>
              <v-timeline density="compact" align="start">
                <v-timeline-item
                  v-for="update in recentUpdates"
                  :key="update.id"
                  :dot-color="update.color"
                  size="small"
                >
                  <div class="text-subtitle-2 font-weight-medium">{{ update.title }}</div>
                  <div class="text-caption text-medium-emphasis">{{ update.time }}</div>
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
import { YandexMap } from 'vue-yandex-maps'
import { ref, reactive, computed } from 'vue'
import { useMapStore } from '../store/map.js'

const ymapSettings = {
  apiKey: '', // Можно указать ключ, если нужен
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}
const center = ref([55.751574, 37.573856])
const zoom = ref(10)
const mapStore = useMapStore()

const markers = computed({
  get: () => mapStore.markers,
  set: (val) => mapStore.setMarkers(val)
})
const showRadialMenu = ref(false)
const radialMenuStyle = ref({})
const radialMenuCoords = ref([])
const markerTypes = [
  { key: 'helmet', icon: 'mdi-hard-hat', color: 'red', label: 'Красная каска' },
  { key: 'sniper', icon: 'mdi-target', color: 'blue', label: 'Прицел снайпера' },
  { key: 'mine', icon: 'mdi-mine', color: 'grey', label: 'Мина' },
  { key: 'mg', icon: 'mdi-robot-mower', color: 'brown', label: 'Пулемёт' },
  { key: 'move', icon: 'mdi-arrow-up-bold', color: 'green', label: 'Движение' },
  { key: 'attack', icon: 'mdi-sword-cross', color: 'orange', label: 'Атака' },
  { key: 'defend', icon: 'mdi-shield', color: 'blue', label: 'Защита' },
  { key: 'fortify', icon: 'mdi-fort', color: 'purple', label: 'Укрепление' },
]

function onMapRightClick(e) {
  const coords = e.get('coords')
  showRadialMenu.value = true
  radialMenuCoords.value = coords
  // Позиционируем меню по курсору
  const [x, y] = e.get('position')
  radialMenuStyle.value = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    zIndex: 1000
  }
}
function addMarker(type) {
  mapStore.addMarker({
    id: Date.now(),
    coords: radialMenuCoords.value,
    icon: type.icon,
    label: type.label,
    color: type.color
  })
  showRadialMenu.value = false
}
function onMarkerClick(marker) {
  if (confirm('Удалить метку?')) {
    mapStore.removeMarker(marker.id)
  }
}

// Состояние панелей
const showLayers = ref(false)
const showSearch = ref(false)
const showMeasurements = ref(false)

// Поиск
const searchQuery = ref('')
const searchType = ref('all')
const searchTypes = [
  { title: 'Все объекты', value: 'all' },
  { title: 'Сквады', value: 'squads' },
  { title: 'Задачи', value: 'tasks' },
  { title: 'Транспорт', value: 'vehicles' },
  { title: 'Медицинские пункты', value: 'medical' }
]

// Слои карты
const mapLayers = ref([
  {
    id: 1,
    name: 'Сквады',
    description: 'Позиции дружественных подразделений',
    icon: 'mdi-account-group',
    color: 'primary',
    visible: true
  },
  {
    id: 2,
    name: 'Задачи',
    description: 'Активные задачи и миссии',
    icon: 'mdi-clipboard-list',
    color: 'warning',
    visible: true
  },
  {
    id: 3,
    name: 'Транспорт',
    description: 'Транспортные средства',
    icon: 'mdi-car',
    color: 'info',
    visible: true
  },
  {
    id: 4,
    name: 'Медицинские пункты',
    description: 'Пункты оказания медицинской помощи',
    icon: 'mdi-medical-bag',
    color: 'success',
    visible: true
  },
  {
    id: 5,
    name: 'Угрозы',
    description: 'Известные угрозы и противник',
    icon: 'mdi-target',
    color: 'error',
    visible: false
  },
  {
    id: 6,
    name: 'Инфраструктура',
    description: 'Здания и сооружения',
    icon: 'mdi-office-building',
    color: 'grey',
    visible: true
  }
])

// Состояние карты
const currentZoom = ref(1)
const currentCoordinates = ref('55.7558°N, 37.6176°E')

// Моковые данные
const totalObjects = ref(24)
const activeTasks = ref(8)
const friendlyUnits = ref(12)
const threats = ref(4)

const recentUpdates = ref([
  {
    id: 1,
    title: 'Сквад Alpha переместился',
    time: '2 мин назад',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Новая задача создана',
    time: '5 мин назад',
    color: 'warning'
  },
  {
    id: 3,
    title: 'Обнаружена угроза',
    time: '8 мин назад',
    color: 'error'
  },
  {
    id: 4,
    title: 'Медицинский пункт развернут',
    time: '12 мин назад',
    color: 'success'
  }
])

// Методы
function performSearch() {
  if (!searchQuery.value) return
  
  // Имитация поиска
  console.log('Поиск:', searchQuery.value, 'Тип:', searchType.value)
  
  // Здесь должна быть логика поиска по карте
  alert(`Поиск: "${searchQuery.value}" (${searchType.value})`)
}

function startDistanceMeasurement() {
  alert('Режим измерения расстояния активирован. Кликните по точкам на карте.')
}

function startAreaMeasurement() {
  alert('Режим измерения площади активирован. Кликните по углам области.')
}

function clearMeasurements() {
  alert('Все измерения очищены.')
}

function zoomIn() {
  if (currentZoom.value < 5) {
    currentZoom.value += 0.5
  }
}

function zoomOut() {
  if (currentZoom.value > 0.5) {
    currentZoom.value -= 0.5
  }
}

function resetView() {
  currentZoom.value = 1
  currentCoordinates.value = '55.7558°N, 37.6176°E'
}
</script> 