import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMapStore = defineStore('map', () => {
    // Состояние
    const markers = ref([])

    // Геттеры
    const allMarkers = computed(() => markers.value)

    // Действия
    const addMarker = (marker) => {
        markers.value.push(marker)
    }

    // Можно добавить экшены для удаления/обновления меток при необходимости

    return {
        markers,
        allMarkers,
        addMarker
    }
})