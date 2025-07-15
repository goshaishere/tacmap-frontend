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
      <v-row class="adaptive-map-wrapper-row">
        <v-col cols="12" class="adaptive-map-wrapper-col">
            <CustomYandexMap />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMapStore } from '../store/map.js'
import CustomYandexMap from '../components/CustomYandexMap.vue'

const mapStore = useMapStore()
const nativeMarkers = ref(new Map())
</script>

<style scoped>
.adaptive-map-wrapper-row {
  margin-top: 0px !important;
}

.adaptive-map-wrapper-col {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
</style> 