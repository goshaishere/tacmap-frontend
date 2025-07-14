<template>
  <div class="page-container">
    <v-container fluid class="pa-0 pa-md-4">
      <!-- Заголовок и инструменты -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between gap-4">
              <div class="d-flex flex-column">
                <h1 class="text-h4 text-on-surface mb-2">
              <v-icon class="me-3">mdi-map</v-icon>
              Тактическая карта
            </h1>
                <div class="text-caption text-medium-emphasis">
                  📊 {{ mapStore.markers.length }} маркеров в базе • {{ nativeMarkers.size }} отображено на карте
                </div>
              </div>
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
              <v-btn 
                color="error" 
                variant="outlined" 
                prepend-icon="mdi-delete"
                @click="resetMapData"
                size="small"
                title="Очистить все данные карты"
              >
                Сброс
              </v-btn>
              <v-btn 
                color="success" 
                variant="outlined" 
                prepend-icon="mdi-plus"
                @click="addTestMarker"
                size="small"
                title="Добавить тестовый маркер"
              >
                Тест
              </v-btn>
              <v-btn 
                color="info" 
                variant="outlined" 
                prepend-icon="mdi-refresh"
                @click="reloadAllMarkers"
                size="small"
                title="Перезагрузить маркеры"
              >
                Перезагрузить
              </v-btn>
              <v-btn 
                color="warning" 
                variant="outlined" 
                prepend-icon="mdi-magnify"
                @click="checkAllMarkers"
                size="small"
                title="Проверить маркеры"
              >
                Проверить
              </v-btn>
              <v-btn 
                color="error" 
                variant="outlined" 
                prepend-icon="mdi-refresh-circle"
                @click="forceReloadMap"
                size="small"
                title="Принудительная перезагрузка карты"
              >
                Перезагрузить карту
              </v-btn>
              <v-btn 
                color="secondary" 
                variant="outlined" 
                prepend-icon="mdi-bug"
                @click="diagnoseMapState"
                size="small"
                title="Диагностика состояния карты"
              >
                Диагностика
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
              <!-- Индикатор загрузки -->
              <div v-if="!mapInstance" class="d-flex align-center justify-center" style="height: 600px;">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                <span class="ml-4 text-body-1">Загрузка карты...</span>
              </div>
              
              <!-- Яндекс.Карта -->
              <yandex-map
                v-if="Array.isArray(center) && center.length === 2 && center.every(n => typeof n === 'number') && typeof zoom === 'number'"
                :coords="center"
                :zoom="zoom"
                class="w-100"
                style="height: 600px;"
                ref="ymapRef"
                @map-was-initialized="onMapReady"
                @error="onMapError"
              >
                <template #default>
                  <!-- Маркеры будут добавляться через нативный API -->
                </template>
              </yandex-map>
              
              <!-- Lucide Context Menu -->
              <LucideContextMenu
                :visible="lucideMenu.visible"
                :x="lucideMenu.x"
                :y="lucideMenu.y"
                :categories="lucideIcons"
                :selectedCategory="lucideMenu.selectedCategory"
                @select-category="handleLucideCategorySelect"
                @select-icon="handleLucideIconSelect"
                @back="() => { lucideMenu.selectedCategory = null }"
                @close="() => { lucideMenu.visible = false; lucideMenu.clickCoords = null; lucideMenu.selectedCategory = null }"
              />
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
              Статистика карты
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold text-primary">{{ mapStore.markers.length }}</div>
                    <div class="text-caption text-medium-emphasis">Маркеров в базе</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold text-warning">{{ nativeMarkers.size }}</div>
                    <div class="text-caption text-medium-emphasis">Отображено на карте</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold text-success">{{ nativeMarkers.size === mapStore.markers.length ? '✅' : '⚠️' }}</div>
                    <div class="text-caption text-medium-emphasis">Статус синхронизации</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold text-error">{{ currentZoom }}</div>
                    <div class="text-caption text-medium-emphasis">Масштаб карты</div>
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
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useMapStore } from '../store/map.js'
import LucideContextMenu from '../components/LucideContextMenu.vue'
import lucideIcons from '../data/lucideIcons.js'
import { useDisplay } from 'vuetify'

// Проверка шрифтов больше не нужна - используем CDN Iconify

const ymapSettings = {
  apiKey: '', // Можно указать ключ, если нужен
  lang: 'ru_RU',
  coordorder: 'latlong'
}
const center = ref([55.751574, 37.573856])
const zoom = ref(10)
const mapStore = useMapStore()
const ymapRef = ref(null)
const mapInstance = ref(null)
const nativeMarkers = ref(new Map())
const { snackbar } = useDisplay()

// --- Категории иконок ---
const mdiCategories = [
  {
    key: 'units',
    label: 'Пехота',
    icons: [
      {
        name: 'account-group',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/></svg>`
      }
    ]
  },
  {
    key: 'vehicles',
    label: 'Техника',
    icons: [
      {
        name: 'tank',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2,17C2,18.1 2.9,19 4,19C5.1,19 6,18.1 6,17C6,15.9 5.1,15 4,15C2.9,15 2,15.9 2,17M22,16V14H20V12C20,10.9 19.1,10 18,10H8.83L7.41,8.59C7.05,8.22 6.55,8 6,8H2V10H6.17L7.59,11.41C7.95,11.78 8.45,12 9,12H18V14H16V16H22Z"/></svg>`
      }
    ]
  },
  {
    key: 'medical',
    label: 'Медицина',
    icons: [
      {
        name: 'medical-bag',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18,6V4A2,2 0 0,0 16,2H8A2,2 0 0,0 6,4V6H5A2,2 0 0,0 3,8V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V8A2,2 0 0,0 19,6H18M8,4H16V6H8V4M19,20H5V8H19V20M13,10V13H16V15H13V18H11V15H8V13H11V10H13Z"/></svg>`
      }
    ]
  }
]

// --- Состояние Lucide меню ---
const lucideMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  clickCoords: null,
  selectedCategory: null
})

function showLucideMenu(x, y, coords) {
  lucideMenu.x = x
  lucideMenu.y = y
  lucideMenu.clickCoords = coords
  lucideMenu.visible = true
  lucideMenu.selectedCategory = null
}

function handleLucideCategorySelect(category) {
  lucideMenu.selectedCategory = category
}

// Функция для определения цвета маркера по категории
function getCategoryColor(categoryKey) {
  const colorMap = {
    'units': 'blue',
    'vehicles': 'green', 
    'medical': 'red',
    'infrastructure': 'orange',
    'communications': 'purple',
    'navigation': 'yellow'
  }
  return colorMap[categoryKey] || 'blue'
}

// Функция для создания простого маркера (более надежная)
function createSimpleMarker(marker) {
  try {
    if (!window.ymaps || !window.ymaps.Placemark) {
      console.warn('API Яндекс.Карт не готов')
      return null
    }
    
    const [lat, lon] = marker.coords
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      console.warn('Некорректные координаты:', lat, lon)
      return null
    }
    
    console.log(`🎯 Создаем маркер: ${marker.label} на координатах [${lat}, ${lon}]`)
    
    // Используем максимально простой маркер без дополнительных настроек
    const placemark = new window.ymaps.Placemark([lat, lon], {
      hintContent: marker.label || 'Маркер',
      balloonContent: marker.label || 'Маркер'
    }, {
      preset: 'islands#blueDotIcon' // Всегда используем один и тот же пресет для стабильности
    })
    
    // Добавляем обработчик клика только если он не вызывает ошибок
    try {
      placemark.events.add('click', () => {
        onMarkerClick(marker)
      })
    } catch (eventError) {
      console.warn('Ошибка добавления обработчика событий:', eventError)
    }
    
    console.log(`✅ Маркер создан успешно: ${marker.id}`)
    return placemark
  } catch (error) {
    console.error('Ошибка создания простого маркера:', error)
    return null
  }
}

// Альтернативная функция для создания маркеров с минимальными настройками
function createMinimalMarker(marker) {
  try {
    if (!window.ymaps || !window.ymaps.Placemark) {
      console.warn('API Яндекс.Карт не готов')
      return null
    }
    
    const [lat, lon] = marker.coords
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      console.warn('Некорректные координаты:', lat, lon)
      return null
    }
    
    console.log(`🎯 Создаем минимальный маркер: ${marker.label}`)
    
    // Создаем маркер с абсолютным минимумом настроек
    const placemark = new window.ymaps.Placemark([lat, lon])
    
    console.log(`✅ Минимальный маркер создан: ${marker.id}`)
    return placemark
  } catch (error) {
    console.error('Ошибка создания минимального маркера:', error)
    return null
  }
}

// Функция для безопасного добавления маркера на карту с максимальными проверками
function safeAddMarkerToMap(nativeMarker, markerId) {
  try {
    if (!mapInstance.value || !mapInstance.value.geoObjects) {
      console.warn('Карта не готова для добавления маркера')
      return Promise.resolve(false)
    }
    
    // Проверяем, что маркер еще не добавлен на карту (но может быть в памяти)
    const existingMarker = nativeMarkers.value.get(markerId)
    if (existingMarker && mapInstance.value.geoObjects.indexOf(existingMarker) !== -1) {
      console.warn('Маркер уже добавлен на карту:', markerId)
      return Promise.resolve(false)
    }
    
    // Добавляем маркер на карту с дополнительной проверкой
    if (nativeMarker && typeof nativeMarker.getMap === 'function') {
      // Добавляем максимальную задержку для стабильности API
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            // Проверяем готовность карты еще раз перед добавлением
            if (!mapInstance.value || !mapInstance.value.geoObjects) {
              console.warn('Карта не готова при добавлении маркера:', markerId)
              resolve(false)
              return
            }
            
            // Проверяем, что geoObjects.add существует и является функцией
            if (typeof mapInstance.value.geoObjects.add !== 'function') {
              console.warn('geoObjects.add не является функцией при добавлении маркера:', markerId)
              resolve(false)
              return
            }
            
            // Пробуем добавить маркер
            mapInstance.value.geoObjects.add(nativeMarker)
            console.log('Маркер успешно добавлен на карту:', markerId)
            
            // Дополнительная проверка - убеждаемся, что маркер действительно добавлен
            setTimeout(() => {
              try {
                if (mapInstance.value && mapInstance.value.geoObjects && typeof mapInstance.value.geoObjects.indexOf === 'function') {
                  const isOnMap = mapInstance.value.geoObjects.indexOf(nativeMarker) !== -1
                  console.log(`🔍 Проверка маркера ${markerId}: ${isOnMap ? '✅ на карте' : '❌ не на карте'}`)
                  
                  if (!isOnMap) {
                    console.warn(`⚠️ Маркер ${markerId} не найден на карте после добавления`)
                  }
                }
              } catch (checkError) {
                console.warn('Ошибка проверки маркера:', checkError)
              }
            }, 500)
            
            resolve(true)
          } catch (addError) {
            console.error('Ошибка добавления маркера на карту:', addError)
            resolve(false)
          }
        }, 1000) // Увеличенная задержка для стабильности
      })
    } else {
      console.warn('Некорректный объект маркера:', nativeMarker)
      return Promise.resolve(false)
    }
  } catch (error) {
    console.error('Ошибка добавления маркера на карту:', error)
    return Promise.resolve(false)
  }
}

function handleLucideIconSelect(icon) {
  if (!lucideMenu.clickCoords || !Array.isArray(lucideMenu.clickCoords) || lucideMenu.clickCoords.length !== 2) return
  const coords = lucideMenu.clickCoords
  if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number' || isNaN(coords[0]) || isNaN(coords[1])) return
  
  // Создаем маркер с Lucide иконкой
  const marker = {
    id: Date.now() + Math.floor(Math.random() * 10000),
    coords: coords,
    icon: icon.name,
    label: icon.label,
    color: getCategoryColor(lucideMenu.selectedCategory?.key), // Цвет по категории
    lucideComponent: icon.component
  }
  
  mapStore.addMarker(marker)
  setTimeout(() => {
    try {
      // Проверяем готовность карты и API
      if (!mapInstance.value || !mapInstance.value.geoObjects) {
        console.warn('Карта не готова для добавления маркера')
        return
      }
      
      // Используем упрощенную функцию создания маркера
      const nativeMarker = createNativeMarker(marker)
      
      if (nativeMarker) {
        // Добавляем маркер в память
        nativeMarkers.value.set(marker.id, nativeMarker)
        
        // Безопасно добавляем на карту
        safeAddMarkerToMap(nativeMarker, marker.id).then((success) => {
          if (success) {
            console.log('Маркер успешно добавлен на карту:', marker.id)
            
            // Центрируем карту на маркере для проверки видимости
            setTimeout(() => {
              try {
                if (mapInstance.value && typeof mapInstance.value.setCenter === 'function') {
                  mapInstance.value.setCenter([coords[0], coords[1]], 12)
                  console.log('🗺️ Карта центрирована на маркере для проверки')
                }
              } catch (error) {
                console.warn('Ошибка центрирования карты:', error)
              }
            }, 500)
          } else {
            // Удаляем из памяти если не удалось добавить на карту
            nativeMarkers.value.delete(marker.id)
            console.warn('Маркер не удалось добавить на карту:', marker.id)
          }
        })
      } else {
        console.error('Не удалось создать маркер для:', marker.id)
      }
    } catch (e) { 
      console.error('Ошибка создания нативного маркера:', e) 
    }
  }, 1500) // Увеличенная задержка для стабильности
  
  lucideMenu.visible = false
  lucideMenu.clickCoords = null
  lucideMenu.selectedCategory = null
}

// --- Максимально упрощенная createNativeMarker с дополнительными проверками ---
function createNativeMarker(marker) {
  // Проверяем готовность API
  if (!window.ymaps || !window.ymaps.Placemark) {
    console.warn('API Яндекс.Карт не готов')
    return null
  }
  
  // Проверяем карту
  if (!mapInstance.value) {
    console.warn('Карта не инициализирована')
    return null
  }
  
  // Проверяем готовность geoObjects
  if (!mapInstance.value.geoObjects) {
    console.warn('geoObjects не готовы')
    return null
  }
  
  // Проверяем маркер
  if (!marker || typeof marker !== 'object') {
    console.warn('Некорректный объект маркера')
    return null
  }
  
  // Проверяем координаты
  if (!Array.isArray(marker.coords) || marker.coords.length !== 2) {
    console.warn('Некорректные координаты маркера:', marker.coords)
    return null
  }
  
  const [lat, lon] = marker.coords
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    console.warn('Координаты не являются числами:', lat, lon)
    return null
  }
  
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    console.warn('Координаты вне допустимых пределов:', lat, lon)
    return null
  }
  
  // Дополнительная проверка - убеждаемся, что координаты конечные числа
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    console.warn('Координаты не являются конечными числами:', lat, lon)
    return null
  }
  
  // Проверяем, что координаты не слишком близко к нулю (может вызывать проблемы)
  if (Math.abs(lat) < 0.000001 && Math.abs(lon) < 0.000001) {
    console.warn('Координаты слишком близки к нулю, это может вызвать проблемы:', lat, lon)
    return null
  }
  
  try {
    // Создаем максимально простой маркер с минимальными настройками
    const placemark = new window.ymaps.Placemark([lat, lon], {
      hintContent: marker.label || 'Маркер',
      balloonContent: marker.label || 'Маркер'
    }, {
      preset: 'islands#blueDotIcon'
    })
    
    // Добавляем обработчик клика только если это безопасно
    try {
      placemark.events.add('click', () => {
        onMarkerClick(marker)
      })
    } catch (eventError) {
      console.warn('Не удалось добавить обработчик клика:', eventError)
    }
    
    return placemark
    
  } catch (error) {
    console.error('Ошибка создания маркера:', error)
    
    // Последняя попытка - создать маркер без обработчиков событий
    try {
      console.log('Пробуем создать маркер без обработчиков событий')
      return new window.ymaps.Placemark([lat, lon], {
        hintContent: marker.label || 'Маркер'
      }, {
        preset: 'islands#blueDotIcon'
      })
    } catch (finalError) {
      console.error('Не удалось создать даже простой маркер:', finalError)
      return null
    }
  }
}

// --- Заменяю обработчик правого клика ---
function onMapReady(map) {
  console.log('=== КАРТА ИНИЦИАЛИЗИРОВАНА ===')
  console.log('Объект карты:', map)
  console.log('Тип объекта:', typeof map)
  console.log('Методы карты:', Object.keys(map))
  
  mapInstance.value = map
  console.log('mapInstance сохранен:', !!mapInstance.value)
  
  // Инициализируем текущий масштаб
  currentZoom.value = map.getZoom()
  console.log('Текущий масштаб карты:', currentZoom.value)

  // Ждем полной инициализации API
  waitForAPIReady().then(() => {
    // Временно очищаем все данные для стабильной работы
    if (mapStore.markers.length > 0) {
      console.warn('Очищаем все существующие маркеры для стабильной работы')
      mapStore.clearMarkers()
      if (typeof window !== 'undefined' && window.alert) {
        alert('Все существующие маркеры были очищены для обеспечения стабильной работы карты.')
      }
    }
    
    // Загружаем существующие маркеры (теперь их 0)
    loadExistingMarkers()

    // Вешаем обработчик правого клика через API Яндекс.Карт
    if (map && map.events && typeof map.events.add === 'function') {
      map.events.add('contextmenu', function (e) {
        const coords = e.get('coords')
        console.log('Правый клик по карте, coords:', coords)
        
        // Получаем координаты курсора относительно контейнера карты
        const rect = ymapRef.value?.$el?.getBoundingClientRect?.()
        let x = e.get('clientX') || 0
        let y = e.get('clientY') || 0
        
        if (rect) {
          x = (e.get('clientX') || 0) - rect.left
          y = (e.get('clientY') || 0) - rect.top
        }
        
        // Показываем контекстное меню
        showLucideMenu(x, y, coords)
      })
      console.log('Обработчик contextmenu добавлен через API карты')
      
      // Добавляем обработчик изменения масштаба
      map.events.add('actionend', function (e) {
        const newZoom = map.getZoom()
        if (newZoom !== currentZoom.value) {
          currentZoom.value = newZoom
          console.log('Масштаб карты изменен:', newZoom)
        }
      })
      console.log('Обработчик изменения масштаба добавлен')
    } else {
      console.error('Не удалось добавить обработчики событий карты')
    }
  }).catch(error => {
    console.error('Ошибка ожидания готовности API:', error)
  })
}

function onMapError(error) {
  console.error('Ошибка инициализации карты:', error)
}

// Функция для ожидания готовности API Яндекс.Карт
function waitForAPIReady() {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const maxAttempts = 50 // 5 секунд максимум
    
    const checkAPI = () => {
      attempts++
      
      if (window.ymaps && window.ymaps.Placemark && window.ymaps.GeoObject) {
        console.log('API Яндекс.Карт готов')
        resolve()
        return
      }
      
      if (attempts >= maxAttempts) {
        console.warn('API Яндекс.Карт не готов после', maxAttempts, 'попыток')
        reject(new Error('API не готов'))
        return
      }
      
      setTimeout(checkAPI, 100)
    }
    
    checkAPI()
  })
}

// Функция для диагностики состояния карты и API
function diagnoseMapState() {
  console.log('🔍 === ДИАГНОСТИКА СОСТОЯНИЯ КАРТЫ ===')
  
  // Проверяем API
  console.log('API Яндекс.Карт:', {
    ymaps: !!window.ymaps,
    Placemark: !!(window.ymaps && window.ymaps.Placemark),
    GeoObject: !!(window.ymaps && window.ymaps.GeoObject)
  })
  
  // Проверяем карту
  console.log('Состояние карты:', {
    mapInstance: !!mapInstance.value,
    geoObjects: !!(mapInstance.value && mapInstance.value.geoObjects),
    geoObjectsAdd: !!(mapInstance.value && mapInstance.value.geoObjects && typeof mapInstance.value.geoObjects.add === 'function'),
    geoObjectsIndexOf: !!(mapInstance.value && mapInstance.value.geoObjects && typeof mapInstance.value.geoObjects.indexOf === 'function')
  })
  
  // Проверяем маркеры
  console.log('Состояние маркеров:', {
    storeMarkers: mapStore.markers.length,
    nativeMarkers: nativeMarkers.value.size,
    onMapMarkers: mapInstance.value && mapInstance.value.geoObjects ? 
      Array.from(nativeMarkers.value.values()).filter(marker => 
        mapInstance.value.geoObjects.indexOf(marker) !== -1
      ).length : 0
  })
  
  // Проверяем методы карты
  if (mapInstance.value) {
    console.log('Доступные методы карты:', Object.keys(mapInstance.value).filter(key => 
      typeof mapInstance.value[key] === 'function'
    ))
  }
  
  console.log('🔍 === КОНЕЦ ДИАГНОСТИКИ ===')
}

// Функция для загрузки существующих маркеров
function loadExistingMarkers() {
  console.log('Загружаем существующие маркеры:', mapStore.markers.length)
  
  if (!mapInstance.value) {
    console.warn('Карта не инициализирована')
    return
  }
  
  if (!window.ymaps || !window.ymaps.Placemark) {
    console.warn('API Яндекс.Карт не готов для загрузки маркеров')
    return
  }
  
  // Проверяем, есть ли некорректные маркеры
  const invalidMarkers = mapStore.markers.filter(marker => {
    if (!Array.isArray(marker.coords) || marker.coords.length !== 2) {
      return true
    }
    const [lat, lon] = marker.coords
    return typeof lat !== 'number' || typeof lon !== 'number' || 
           isNaN(lat) || isNaN(lon) ||
           lat < -90 || lat > 90 || lon < -180 || lon > 180
  })
  
  if (invalidMarkers.length > 0) {
    console.warn(`Обнаружено ${invalidMarkers.length} некорректных маркеров, очищаем store`)
    mapStore.clearMarkers()
    return
  }
  
  let successCount = 0
  let errorCount = 0
  
  // Добавляем небольшую задержку для стабилизации API
  setTimeout(() => {
    // Проверяем готовность geoObjects
    if (!mapInstance.value.geoObjects) {
      console.warn('geoObjects не готовы')
      return
    }
    
    mapStore.markers.forEach(marker => {
      try {
        const nativeMarker = createNativeMarker(marker)
        if (nativeMarker) {
          // Добавляем маркер в память
          nativeMarkers.value.set(marker.id, nativeMarker)
          
                  // Безопасно добавляем на карту
        safeAddMarkerToMap(nativeMarker, marker.id).then((success) => {
          if (success) {
            successCount++
            console.log('Маркер добавлен на карту:', marker.id)
          } else {
            errorCount++
            console.warn('Не удалось добавить маркер на карту:', marker.id)
            // Удаляем из памяти если не удалось добавить на карту
            nativeMarkers.value.delete(marker.id)
          }
        })
        } else {
          errorCount++
          console.warn('Не удалось создать нативный маркер для:', marker.id)
        }
      } catch (error) {
        errorCount++
        console.error('Ошибка обработки маркера:', marker.id, error)
      }
    })
    
    console.log(`Загружено маркеров: ${successCount} успешно, ${errorCount} с ошибками`)
    console.log('Всего нативных маркеров в памяти:', nativeMarkers.value.size)
    
    // Если все маркеры не загрузились, предлагаем очистить данные
    if (successCount === 0 && errorCount > 0) {
      console.warn('Все маркеры не загрузились, возможно есть проблемы с данными')
    }
  }, 500) // Задержка 500мс
}

const markers = computed({
  get: () => mapStore.markers,
  set: (val) => mapStore.setMarkers(val)
})

// --- Функция для генерации PNG иконок (fallback) ---
function generateMarkerPNG(iconName, color = 'blue', size = 32) {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    
    // Очищаем canvas
    ctx.clearRect(0, 0, size, size)
    
    // Цвета
    const colorMap = {
      'red': '#E53935',
      'blue': '#2196F3', 
      'green': '#43A047',
      'yellow': '#FFC107',
      'orange': '#FF9800',
      'purple': '#9C27B0',
      'brown': '#795548',
      'grey': '#9E9E9E',
      'black': '#212121',
      'cyan': '#00BCD4',
      'darkgreen': '#2E7D32',
      'darkblue': '#1976D2'
    }
    
    // Рисуем фон (круг)
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.strokeStyle = colorMap[color] || colorMap.blue
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Рисуем простую иконку (точка)
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 6, 0, 2 * Math.PI)
    ctx.fillStyle = colorMap[color] || colorMap.blue
    ctx.fill()
    
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.warn('Ошибка генерации PNG:', error)
    return null
  }
}

// --- Новый способ: состояние EmojiPicker ---
const emojiPicker = reactive({
  visible: false,
  x: 0,
  y: 0,
  clickCoords: null
})

// --- Новый обработчик правого клика ---
function showEmojiPicker(x, y, coords) {
  emojiPicker.x = x
  emojiPicker.y = y
  emojiPicker.clickCoords = coords
  emojiPicker.visible = true
}

function handleEmojiSelect({ emoji, color, png }) {
  if (!emojiPicker.clickCoords || !Array.isArray(emojiPicker.clickCoords) || emojiPicker.clickCoords.length !== 2) return
  const coords = emojiPicker.clickCoords
  if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number' || isNaN(coords[0]) || isNaN(coords[1])) return
  
  // Добавляем маркер с PNG-иконкой
  const marker = {
    id: Date.now() + Math.floor(Math.random() * 10000),
    coords: coords,
    icon: 'emoji', // для совместимости
    label: emoji,
    color: color,
    png: png // сохраняем PNG dataURL
  }
  
  // Добавляем в store
  mapStore.addMarker(marker)
  
  // Добавляем на карту с защитой от ошибок
  setTimeout(() => {
    try {
      if (!mapInstance.value || !mapInstance.value.geoObjects) {
        console.warn('Карта не готова для добавления маркера')
        return
      }
      
      const nativeMarker = createNativeMarker(marker)
      if (nativeMarker) {
        // Проверяем, что маркер еще не добавлен
        if (!nativeMarkers.value.has(marker.id)) {
          nativeMarkers.value.set(marker.id, nativeMarker)
          mapInstance.value.geoObjects.add(nativeMarker)
          console.log('Маркер успешно добавлен на карту:', marker.id)
        }
      } else {
        console.warn('Не удалось создать маркер для:', marker.id)
      }
    } catch (error) {
      console.error('Ошибка добавления маркера на карту:', error)
    }
  }, 300)
  
  emojiPicker.visible = false
  emojiPicker.clickCoords = null
}



// Старые функции SVG больше не используются - теперь используем новую утилиту

// Функции для работы с контекстным меню
// (удалить импорт MapContextMenu и markerTypes, удалить contextMenu и showContextMenu, handleMenuSelect, handleMenuClose)

// Функция для перезагрузки всех маркеров
function reloadAllMarkers() {
  console.log('🔄 Перезагрузка всех маркеров...')
  
  if (!mapInstance.value || !mapInstance.value.geoObjects) {
    console.warn('Карта не готова для перезагрузки маркеров')
    return
  }
  
  try {
    // Очищаем все нативные маркеры с карты
    nativeMarkers.value.forEach((marker, id) => {
      try {
        if (mapInstance.value.geoObjects.indexOf(marker) !== -1) {
          mapInstance.value.geoObjects.remove(marker)
          console.log('Маркер удален с карты при перезагрузке:', id)
        }
      } catch (error) {
        console.error('Ошибка удаления маркера при перезагрузке:', error)
      }
    })
    
    // Очищаем память
    nativeMarkers.value.clear()
    
    // Перезагружаем маркеры из store с безопасным добавлением
    let successCount = 0
    mapStore.markers.forEach(marker => {
      const nativeMarker = createNativeMarker(marker)
      if (nativeMarker) {
        nativeMarkers.value.set(marker.id, nativeMarker)
        if (safeAddMarkerToMap(nativeMarker, marker.id)) {
          successCount++
        } else {
          // Удаляем из памяти если не удалось добавить на карту
          nativeMarkers.value.delete(marker.id)
        }
      }
    })
    
    console.log('✅ Маркеры успешно перезагружены')
    console.log(`📊 Статистика: ${successCount} маркеров отображено из ${mapStore.markers.length} в базе`)
  } catch (error) {
    console.error('❌ Ошибка перезагрузки маркеров:', error)
  }
}

// Функция для получения правильного цвета маркера
function getMarkerColor(colorName) {
  const colorMap = {
    'red': '#E53935',
    'blue': '#2196F3',
    'green': '#43A047',
    'yellow': '#FFC107',
    'orange': '#FF9800',
    'purple': '#9C27B0',
    'brown': '#795548',
    'grey': '#9E9E9E',
    'black': '#212121',
    'cyan': '#00BCD4',
    'darkgreen': '#2E7D32',
    'darkblue': '#1976D2'
  }
  return colorMap[colorName] || colorName
}

function onMarkerClick(marker) {
  if (confirm('Удалить метку?')) {
    // Удаляем нативный маркер с карты
    const nativeMarker = nativeMarkers.value.get(marker.id)
    if (nativeMarker && mapInstance.value && mapInstance.value.geoObjects) {
      try {
        mapInstance.value.geoObjects.remove(nativeMarker)
        nativeMarkers.value.delete(marker.id)
        console.log('Нативный маркер удален с карты:', marker.id)
      } catch (error) {
        console.error('Ошибка удаления маркера с карты:', error)
      }
    } else {
      console.warn('Не удалось найти нативный маркер для удаления:', marker.id)
    }
    
    // Удаляем из store
    mapStore.removeMarker(marker.id)
    console.log('Маркер удален из store:', marker.id)
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

function resetMapData() {
  if (confirm('Вы уверены, что хотите очистить все данные карты? Это действие нельзя отменить.')) {
    // Очищаем нативные маркеры с карты
    if (mapInstance.value && mapInstance.value.geoObjects) {
      nativeMarkers.value.forEach((marker, id) => {
        try {
          mapInstance.value.geoObjects.remove(marker)
          console.log('Маркер удален при сбросе:', id)
        } catch (error) {
          console.error('Ошибка удаления маркера при сбросе:', error)
        }
      })
      nativeMarkers.value.clear()
    }
    
    // Сбрасываем store
    mapStore.resetStore()
    
    console.log('Все данные карты сброшены')
    
    // Показываем уведомление
    if (typeof window !== 'undefined' && window.alert) {
      alert('Все данные карты успешно очищены.')
    }
  }
}

function addTestMarker() {
  // Добавляем тестовый маркер в центр карты
  const testCoords = [55.751574, 37.573856] // Москва
  
  const marker = {
    id: Date.now() + Math.floor(Math.random() * 10000),
    coords: testCoords,
    icon: 'test-marker',
    label: 'Тестовый маркер',
    color: 'red'
  }
  
  console.log('Добавляем тестовый маркер')
  mapStore.addMarker(marker)
  
  setTimeout(() => {
    try {
      if (!mapInstance.value || !mapInstance.value.geoObjects) {
        console.warn('Карта не готова для добавления тестового маркера')
        return
      }
      
      const nativeMarker = createSimpleMarker(marker)
      if (nativeMarker) {
        if (!nativeMarkers.value.has(marker.id)) {
          nativeMarkers.value.set(marker.id, nativeMarker)
          safeAddMarkerToMap(nativeMarker, marker.id).then((success) => {
            if (success) {
              console.log('Тестовый маркер успешно добавлен на карту:', marker.id)
            } else {
              console.warn('Тестовый маркер не удалось добавить на карту:', marker.id)
              nativeMarkers.value.delete(marker.id)
            }
          })
        }
      } else {
        console.warn('Не удалось создать тестовый маркер')
      }
    } catch (error) {
      console.error('Ошибка добавления тестового маркера:', error)
    }
  }, 500)
}

// Функция для проверки синхронизации маркеров
function checkSyncStatus() {
  const storeCount = mapStore.markers.length
  const nativeCount = nativeMarkers.value.size
  const isSynced = storeCount === nativeCount
  
  console.log(`📊 Статус синхронизации: ${storeCount} в store, ${nativeCount} на карте`)
  console.log(`🔄 Синхронизировано: ${isSynced ? '✅' : '❌'}`)
  
  if (!isSynced) {
    console.warn('⚠️ Обнаружена рассинхронизация маркеров')
  }
  
  return isSynced
}

// Функция для проверки всех маркеров на карте
function checkAllMarkers() {
  console.log('🔍 Проверка всех маркеров на карте...')
  
  if (!mapInstance.value || !mapInstance.value.geoObjects) {
    console.warn('Карта не готова для проверки')
    return
  }
  
  const storeMarkers = mapStore.markers
  const nativeMarkersList = Array.from(nativeMarkers.value.entries())
  
  console.log(`📊 Всего маркеров в store: ${storeMarkers.length}`)
  console.log(`📊 Всего маркеров в памяти: ${nativeMarkersList.length}`)
  
  // Проверяем каждый маркер
  nativeMarkersList.forEach(([id, marker]) => {
    const isOnMap = mapInstance.value.geoObjects.indexOf(marker) !== -1
    const storeMarker = storeMarkers.find(m => m.id === id)
    
    console.log(`🔍 Маркер ${id}:`)
    console.log(`   📍 На карте: ${isOnMap ? '✅' : '❌'}`)
    console.log(`   💾 В store: ${storeMarker ? '✅' : '❌'}`)
    console.log(`   🏷️ Метка: ${storeMarker?.label || 'Неизвестно'}`)
    console.log(`   📍 Координаты: ${storeMarker?.coords?.join(', ') || 'Неизвестно'}`)
    
    if (!isOnMap && storeMarker) {
      console.warn(`⚠️ Маркер ${id} есть в store, но не на карте!`)
    }
  })
  
  // Проверяем маркеры в store, которых нет в памяти
  storeMarkers.forEach(marker => {
    if (!nativeMarkers.value.has(marker.id)) {
      console.warn(`⚠️ Маркер ${marker.id} есть в store, но не в памяти!`)
    }
  })
  
  console.log('✅ Проверка завершена')
}

// Функция для принудительной перезагрузки карты
function forceReloadMap() {
  console.log('🔄 Принудительная перезагрузка карты...')
  
  if (confirm('Вы уверены, что хотите перезагрузить карту? Это может исправить проблемы с отображением маркеров.')) {
    try {
      // Очищаем все маркеры с карты
      if (mapInstance.value && mapInstance.value.geoObjects) {
        nativeMarkers.value.forEach((marker, id) => {
          try {
            if (mapInstance.value.geoObjects.indexOf(marker) !== -1) {
              mapInstance.value.geoObjects.remove(marker)
              console.log('Маркер удален при перезагрузке:', id)
            }
          } catch (error) {
            console.error('Ошибка удаления маркера при перезагрузке:', error)
          }
        })
      }
      
      // Очищаем память
      nativeMarkers.value.clear()
      
      // Перезагружаем маркеры с задержкой
      setTimeout(() => {
        console.log('🔄 Перезагружаем маркеры после очистки...')
        let successCount = 0
        
        mapStore.markers.forEach((marker, index) => {
          setTimeout(() => {
            const nativeMarker = createSimpleMarker(marker)
            if (nativeMarker) {
              nativeMarkers.value.set(marker.id, nativeMarker)
              safeAddMarkerToMap(nativeMarker, marker.id).then((success) => {
                if (success) {
                  successCount++
                  console.log(`✅ Маркер ${marker.id} перезагружен успешно`)
                } else {
                  console.warn(`❌ Не удалось перезагрузить маркер ${marker.id}`)
                  nativeMarkers.value.delete(marker.id)
                }
                
                // Финальная статистика
                if (index === mapStore.markers.length - 1) {
                  setTimeout(() => {
                    console.log(`📊 Перезагрузка завершена: ${successCount} из ${mapStore.markers.length} маркеров отображено`)
                  }, 500)
                }
              })
            }
          }, index * 200) // Задержка между маркерами
        })
      }, 1000)
      
    } catch (error) {
      console.error('❌ Ошибка принудительной перезагрузки:', error)
    }
  }
}

onMounted(() => {
  // Инициализация завершена - используем CDN Iconify
  console.log('✅ Компонент карты инициализирован с CDN Iconify')
})

onBeforeUnmount(() => {
  // Очищаем нативные маркеры
  if (mapInstance.value && mapInstance.value.geoObjects) {
    console.log('Очистка нативных маркеров при размонтировании...')
    nativeMarkers.value.forEach((marker, id) => {
      try {
        mapInstance.value.geoObjects.remove(marker)
        console.log('Маркер удален при очистке:', id)
      } catch (error) {
        console.error('Ошибка при очистке маркера:', error)
      }
    })
    nativeMarkers.value.clear()
    console.log('Все нативные маркеры очищены')
  }
})
</script> 

<style scoped>
.radial-menu {
  min-width: 44px;
  min-height: 44px;
  background: #fff;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.18);
  border-radius: 18px;
  pointer-events: auto;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
}
.radial-menu[style*="opacity: 1"] {
  opacity: 1;
  transform: scale(1);
}
.radial-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 50%;
  transition: background 0.15s;
}
.radial-btn:hover {
  background: #f5f5f5;
}
.radial-arrow {
  display: block;
  position: absolute;
  z-index: 1;
}
.radial-fade-enter-active, .radial-fade-leave-active {
  transition: opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
}
.radial-fade-enter-from, .radial-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Стили для кастомных маркеров */
.custom-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.custom-marker:hover {
  transform: scale(1.1);
}

.marker-icon {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.marker-label {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  margin-top: 2px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.custom-marker:hover .marker-label {
  opacity: 1;
}
</style> 