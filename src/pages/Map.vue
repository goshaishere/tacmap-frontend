<template>
  <div class="map-page">
    <v-container fluid class="pa-0 pa-md-4">
      <!-- Заголовок и инструменты -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between gap-4">
            <h1 class="text-h4 text-sm-h3">
              <v-icon class="me-3">mdi-map</v-icon>
              Тактическая карта
            </h1>
            <div class="d-flex flex-wrap gap-2">
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
          <v-card class="map-container">
            <v-card-text class="pa-0">
              <!-- Заглушка карты -->
              <div class="map-placeholder">
                <div class="map-content">
                  <v-icon size="120" color="grey-lighten-1" class="mb-4">mdi-map</v-icon>
                  <h2 class="text-h5 mb-2">Интерактивная карта</h2>
                  <p class="text-body-1 text-medium-emphasis mb-4">
                    Здесь будет отображаться тактическая карта с возможностью навигации и управления объектами
                  </p>
                  
                  <!-- Моковые элементы карты -->
                  <div class="map-elements">
                    <div class="map-element" style="top: 20%; left: 30%;">
                      <v-avatar size="32" color="primary">
                        <v-icon>mdi-account-group</v-icon>
                      </v-avatar>
                      <div class="element-label">Сквад Alpha</div>
                    </div>
                    
                    <div class="map-element" style="top: 40%; left: 60%;">
                      <v-avatar size="32" color="warning">
                        <v-icon>mdi-target</v-icon>
                      </v-avatar>
                      <div class="element-label">Цель</div>
                    </div>
                    
                    <div class="map-element" style="top: 60%; left: 20%;">
                      <v-avatar size="32" color="success">
                        <v-icon>mdi-medical-bag</v-icon>
                      </v-avatar>
                      <div class="element-label">Медпункт</div>
                    </div>
                    
                    <div class="map-element" style="top: 80%; left: 70%;">
                      <v-avatar size="32" color="info">
                        <v-icon>mdi-car</v-icon>
                      </v-avatar>
                      <div class="element-label">Транспорт</div>
                    </div>
                  </div>
                  
                  <!-- Контролы карты -->
                  <div class="map-controls">
                    <v-btn-group variant="outlined" class="mb-4">
                      <v-btn size="small" @click="zoomIn">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn size="small" @click="zoomOut">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      <v-btn size="small" @click="resetView">
                        <v-icon>mdi-home</v-icon>
                      </v-btn>
                    </v-btn-group>
                    
                    <div class="text-caption text-medium-emphasis">
                      Масштаб: {{ currentZoom }}x | Координаты: {{ currentCoordinates }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Панель информации -->
      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex align-center">
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
import { ref, computed } from 'vue'

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

<style scoped>
.map-page {
  min-height: 100vh;
}

.map-container {
  border-radius: 12px;
  overflow: hidden;
}

.map-placeholder {
  position: relative;
  width: 100%;
  height: 60vh;
  min-height: 400px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.map-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.map-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-element {
  position: absolute;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.map-element:hover {
  transform: scale(1.1);
}

.element-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.map-element:hover .element-label {
  opacity: 1;
}

.map-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 3;
}

.layer-card {
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.layer-card:hover {
  transform: translateY(-1px);
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

/* Мобильные стили */
@media (max-width: 599px) {
  .map-placeholder {
    height: 50vh;
    min-height: 300px;
  }
  
  .map-controls {
    bottom: 10px;
    right: 10px;
  }
  
  .v-card {
    margin: 8px;
    border-radius: 12px;
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
  .map-placeholder {
    height: 55vh;
  }
  
  .v-card {
    margin: 16px;
  }
}

/* Десктопные стили */
@media (min-width: 960px) {
  .map-placeholder {
    height: 60vh;
  }
  
  .v-card {
    margin: 0;
  }
}
</style> 