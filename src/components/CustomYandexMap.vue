<template>
  <div ref="containerRef" style="position:relative;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;">
    <yandex-map ref="ymapRef" :coords="center" :zoom="10" class="adaptive-yandex-map" :class="mapFilterClass" @contextmenu.native.prevent="onMapContextMenu">
      <ymap-marker
        v-for="marker in markers"
        :key="marker.id"
        :coords="marker.coords"
        :marker-id="marker.id"
        :icon="marker.icon"
        :properties="marker.properties"
      />
    </yandex-map>
    <MdiContextMenu
      ref="menuComponentRef"
      :visible="menu.visible"
      :x="menu.x"
      :y="menu.y"
      :categories="mdiCategories"
      :selectedCategory="selectedCategory"
      @close="menu.visible = false"
      @select-category="onSelectCategory"
      @select-icon="onMenuIconSelect"
      @back="onBack"
    />
    <!-- Диалог создания метки через Vuetify -->
    <v-dialog v-model="popup.visible" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold pb-0">Создание метки</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="popup.label"
            label="Подпись"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            clearable
          />
          <v-text-field
            v-model="popup.hint"
            label="Хинт (при наведении)"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            clearable
          />
          <v-divider class="my-2" />
          <v-switch
            v-model="popup.isOwn"
            :label="popup.isOwn ? 'Свой (зелёный)' : 'Чужой (красный)'"
            color="accent"
            inset
            class="mb-1"
            :true-value="true"
            :false-value="false"
            hide-details
          >
            <template #thumb>
              <v-icon :color="popup.isOwn ? 'primary' : 'error'">{{ popup.isOwn ? 'mdi-shield-check' : 'mdi-skull' }}</v-icon>
            </template>
            <template #label>
              <span :style="{ color: popup.isOwn ? '#3BA55D' : '#E53935', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }">
                <v-icon size="18" :color="popup.isOwn ? 'primary' : 'error'">{{ popup.isOwn ? 'mdi-shield-check' : 'mdi-skull' }}</v-icon>
                {{ popup.isOwn ? 'Свой (зелёный)' : 'Чужой (красный)' }}
              </span>
            </template>
          </v-switch>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="outlined" color="secondary" @click="popup.visible = false">Отмена</v-btn>
          <v-btn color="accent" variant="flat" @click="createMarker">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted, nextTick, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import MdiContextMenu from './MdiContextMenu.vue'
import mdiCategories from '../data/markerTypes.js'
import { useMapStore } from '../store/map.js'

const center = ref([54, 39])
const mapStore = useMapStore()
const markers = computed(() => mapStore.allMarkers)
const menu = reactive({ visible: false, x: 0, y: 0, coords: null })
const containerRef = ref(null)
const ymapRef = ref(null)
const selectedCategory = ref(null)
const popup = reactive({
  visible: false,
  icon: null,
  label: '',
  hint: '',
  isOwn: true,
  coords: null
})

// --- Слушатель клика вне меню ---
const menuComponentRef = ref(null)

function onGlobalClick(e) {
  // Если меню не открыто или клик внутри меню — ничего не делаем
  if (!menu.visible) return
  const menuEl = menuComponentRef.value?.$refs?.menuRef
  if (menuEl && menuEl.contains(e.target)) return
  menu.visible = false
}

watch(() => menu.visible, (val) => {
  if (val) {
    nextTick(() => {
      document.addEventListener('mousedown', onGlobalClick)
    })
  } else {
    document.removeEventListener('mousedown', onGlobalClick)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onGlobalClick)
})

function getMapCoordsFromEvent(e) {
  return (e && typeof e.get === 'function') ? e.get('coords') : null
}

function getMenuPositionFromEvent(e, container, menuRef = null) {
  let x, y, source, debug = {};
  if (e.get && typeof e.get === 'function' && e.get('pagePixels')) {
    const pagePixels = e.get('pagePixels');
    const rect = container.getBoundingClientRect();
    x = pagePixels[0] - rect.left;
    y = pagePixels[1] - rect.top;
    source = 'e.get("pagePixels")';
  }
  let menuWidth = 380, menuHeight = 781;
  if (x + menuWidth > container.clientWidth) x = x - menuWidth;
  if (y + menuHeight > container.clientHeight) y = y - menuHeight;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  console.log('[MdiContextMenu] source:', source, 'x:', x, 'y:', y, debug);
  return { x, y };
}

function onMapContextMenu(e) {
  const markerCoords = getMapCoordsFromEvent(e)
  if (!markerCoords) return
  const container = containerRef.value
  if (!container) return
  const pos = getMenuPositionFromEvent(e, container)
  menu.x = pos.x
  menu.y = pos.y
  menu.coords = markerCoords
  menu.visible = true
  selectedCategory.value = null
}

function onSelectCategory(cat) {
  selectedCategory.value = cat
}
function onBack() {
  selectedCategory.value = null
}

async function mdiIconToPngDataUrl(mdiIconName, color = '#1976D2', size = 43) {
  const svgPath = `/node_modules/@mdi/svg/svg/${mdiIconName.replace('mdi-','')}.svg`;
  let svgText = await fetch(svgPath).then(r => r.text());
  svgText = svgText
    .replace(/fill="[^"]*"/gi, `fill=\"${color}\"`)
    .replace(/stroke="[^"]*"/gi, `stroke=\"${color}\"`);
  svgText = svgText.replace(/<path /gi, `<path fill=\"${color}\" `);
  const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svgText);
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = svgDataUrl;
  });
}

async function onMenuIconSelect(icon) {
  if (!menu.coords) return
  popup.icon = icon
  popup.label = ''
  popup.hint = ''
  popup.isOwn = true
  popup.coords = menu.coords
  popup.visible = true
  menu.visible = false
}

async function createMarker() {
  if (!popup.icon || !popup.coords) return
  const size = 43
  const color = popup.isOwn ? '#3BA55D' : '#E53935'
  const pngDataUrl = await mdiIconToPngDataUrl(popup.icon.icon, color, size)
  const markerId = Date.now() + Math.random()
  const marker = {
    id: markerId,
    coords: popup.coords,
    icon: {
      layout: 'default#imageWithContent',
      imageHref: pngDataUrl,
      imageSize: [size, size],
      imageOffset: [-size/2, -size/2],
      contentLayout: popup.label
        ? `<div style="
            position: absolute;
            left: 21px;
            top: 40px;
            transform: translateX(-50%);
            font-size: 13px;
            line-height: 1.2;
            text-align: center;
            color: #222;
            white-space: nowrap;
            pointer-events: none;
          ">${popup.label}</div>`
        : ''
    },
    properties: {
      ...(popup.label ? { iconContent: popup.label } : {}),
      ...(popup.hint ? { hintContent: popup.hint } : {})
    }
  }
  mapStore.addMarker(marker)
  popup.visible = false
  popup.icon = null
  popup.coords = null
  setTimeout(() => {
    const map = ymapRef.value && ymapRef.value.getMap && ymapRef.value.getMap()
    if (!map) return
    const geoObjects = map.geoObjects || (map.getGeoObjects && map.getGeoObjects())
    if (!geoObjects) return
    let geoObject = null
    if (typeof geoObjects.each === 'function') {
      geoObjects.each(obj => {
        if (obj && obj.properties && (obj.properties.get('marker-id') == markerId || obj.properties.get('id') == markerId)) {
          geoObject = obj
        }
      })
    }
    if (!geoObject) return
    geoObject.events.add('mouseenter', function () {
      geoObject.hint.open(map, marker.coords)
    })
    geoObject.events.add('mouseleave', function () {
      geoObject.hint.close()
    })
  }, 500)
}

const theme = useTheme()
const isDark = computed(() => {
  const currentTheme = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
  return currentTheme === 'tacticalDark'
})
const mapFilterClass = computed(() => isDark.value ? 'map-dark-filter' : '')

</script>

<style scoped>
.adaptive-yandex-map {
  width: 100% !important;
  height: 100% !important;
  display: flex;
}
.map-dark-filter {
  filter: grayscale(0.25) brightness(0.55) contrast(1.15) sepia(0.12) hue-rotate(-5deg) saturate(1.1) !important;
}
</style>
