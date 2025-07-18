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

    const updateMarker = (updatedMarker) => {
        const idx = markers.value.findIndex(m => m.id === updatedMarker.id)
        if (idx !== -1) {
            markers.value[idx] = {...markers.value[idx], ...updatedMarker }
        }
    }

    const removeMarker = (markerId) => {
        markerId = String(markerId)
        console.log('[removeMarker] markerId:', markerId)
        console.log('[removeMarker] markers before:', markers.value.map(m => m.id))
        const idx = markers.value.findIndex(m => String(m.id) === markerId)
        if (idx !== -1) {
            markers.value.splice(idx, 1)
            console.log('[removeMarker] marker removed from markers')
        } else {
            console.log('[removeMarker] marker NOT found in markers')
        }
        // Также удаляем из taskMarkers, если есть
        console.log('[removeMarker] taskMarkers before:', taskMarkers.value.map(m => m.id))
        const tIdx = taskMarkers.value.findIndex(m => String(m.id) === markerId)
        if (tIdx !== -1) {
            taskMarkers.value.splice(tIdx, 1)
            console.log('[removeMarker] marker removed from taskMarkers')
        } else {
            console.log('[removeMarker] marker NOT found in taskMarkers')
        }
        console.log('[removeMarker] markers after:', markers.value.map(m => m.id))
        console.log('[removeMarker] taskMarkers after:', taskMarkers.value.map(m => m.id))
    }

    return {
        markers,
        taskMarkers,
        allMarkers,
        addMarker,
        pushTaskMarkers,
        updateMarker,
        removeMarker
    }
})