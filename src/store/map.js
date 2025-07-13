import { defineStore } from 'pinia'

const LS_KEY = 'mapData'

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

export const useMapStore = defineStore('map', {
    state: () => ({
        markers: loadMapDataFromLS().markers,
        layers: loadMapDataFromLS().layers,
        tools: loadMapDataFromLS().tools
    }),
    actions: {
        addMarker(marker) {
            this.markers.push(marker)
            this._save()
        },
        removeMarker(id) {
            this.markers = this.markers.filter(m => m.id !== id)
            this._save()
        },
        setMarkers(markers) {
            this.markers = markers
            this._save()
        },
        clearMarkers() {
            this.markers = []
            this._save()
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