import { defineStore } from 'pinia'

const LS_KEY = 'mapData'

// Функция для валидации географических координат
function isValidGeoCoords(coords) {
    if (!Array.isArray(coords) || coords.length !== 2) {
        return false
    }

    const [lat, lon] = coords
    if (typeof lat !== 'number' || typeof lon !== 'number' ||
        isNaN(lat) || isNaN(lon)) {
        return false
    }

    // Проверяем географические пределы
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return false
    }

    return true
}

function loadMapDataFromLS() {
    try {
        const raw = localStorage.getItem(LS_KEY)
        if (!raw) return { markers: [], layers: [], tools: {} }
        return JSON.parse(raw)
    } catch {
        return { markers: [], layers: [], tools: {} }
    }
}

function saveMapDataToLS(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
}

// Функция для очистки некорректных данных
function cleanMarkersData(markers) {
    if (!Array.isArray(markers)) {
        console.warn('markers не является массивом, очищаем')
        return []
    }

    const validMarkers = markers.filter(marker => {
        if (!marker || typeof marker !== 'object') {
            console.warn('Некорректный маркер:', marker)
            return false
        }

        if (!isValidGeoCoords(marker.coords)) {
            console.warn('Маркер с невалидными координатами удален:', marker)
            return false
        }

        return true
    })

    if (validMarkers.length !== markers.length) {
        console.log(`Очищено ${markers.length - validMarkers.length} некорректных маркеров`)
    }

    return validMarkers
}

export const useMapStore = defineStore('map', {
    state: () => {
        const data = loadMapDataFromLS()
        const cleanMarkers = cleanMarkersData(data.markers || [])

        return {
            markers: cleanMarkers,
            layers: data.layers || [],
            tools: data.tools || {}
        }
    },
    actions: {
        addMarker(marker) {
            // Валидация координат
            if (!marker || typeof marker !== 'object') {
                console.warn('Попытка добавить некорректный маркер:', marker)
                return
            }

            if (!isValidGeoCoords(marker.coords)) {
                console.warn('Попытка добавить маркер с невалидными координатами:', marker)
                return
            }

            // Проверяем, что у маркера есть необходимые поля
            if (!marker.id) {
                console.warn('Маркер не содержит ID:', marker)
                return
            }

            // Устанавливаем значения по умолчанию для отсутствующих полей
            if (!marker.icon) marker.icon = 'map-pin'
            if (!marker.label) marker.label = 'Маркер'
            if (!marker.color) marker.color = 'blue'

            this.markers.push(marker)
            this._save()
            console.log('Маркер добавлен в store:', marker.id)
        },
        removeMarker(id) {
            const initialCount = this.markers.length
            this.markers = this.markers.filter(m => m.id !== id)
            if (this.markers.length !== initialCount) {
                this._save()
                console.log('Маркер удален из store:', id)
            }
        },
        setMarkers(markers) {
            // Фильтрация только валидных маркеров
            const validMarkers = cleanMarkersData(markers || [])
            this.markers = validMarkers
            this._save()
            console.log('Маркеры обновлены в store:', validMarkers.length)
        },
        clearMarkers() {
            this.markers = []
            this._save()
            console.log('Все маркеры очищены из store')
        },
        // Функция для очистки localStorage и перезагрузки данных
        resetStore() {
            localStorage.removeItem(LS_KEY)
            this.markers = []
            this.layers = []
            this.tools = {}
            console.log('Store сброшен')
        },
        setLayers(layers) {
            this.layers = layers
            this._save()
        },
        setTools(tools) {
            this.tools = tools
            this._save()
        },
        _save() {
            saveMapDataToLS({
                markers: this.markers,
                layers: this.layers,
                tools: this.tools
            })
        }
    }
})