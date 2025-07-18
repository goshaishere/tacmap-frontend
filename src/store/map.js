import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import demoMarkers from '../data/demoMarkers.js'

export const useMapStore = defineStore('map', () => {
    const markers = ref([])
    const taskMarkers = ref([])

    const allMarkers = computed(() => [
        ...markers.value,
        ...taskMarkers.value
    ])

    const addMarker = (marker) => {
        markers.value.push(marker)
    }

    // Добавляем демо-маркеры через addMarker
    demoMarkers.forEach(m => addMarker(m))

    // Добавляю метод для пуша маркеров задач
    const pushTaskMarkers = (markersArray) => {
        if (Array.isArray(markersArray)) {
            taskMarkers.value.push(...markersArray)
        } else if (markersArray) {
            taskMarkers.value.push(markersArray)
        }
    }

    return {
        markers,
        taskMarkers,
        allMarkers,
        addMarker,
        pushTaskMarkers
    }
})