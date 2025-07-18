<template>
  <div ref="containerRef" style="position:relative;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;">
    <yandex-map ref="ymapRef" :coords="center" :zoom="mapZoom" class="adaptive-yandex-map" :class="mapFilterClass" @contextmenu.native.prevent="onMapContextMenu" @click="onMapClick">
      <ymap-marker
        v-for="marker in renderedMarkers"
        :key="marker.id"
        :coords="marker.coords"
        :marker-id="marker.id"
        :icon="marker.icon"
        :properties="{
          iconContent: marker.label,
          hintContent: marker.hint,
          balloonContent: markerBalloon.getBalloonContent(marker)
        }"
        :options="{
          hasBalloon: true,
          hideIconOnBalloonOpen: false
        }"
      />
    </yandex-map>
    <div v-if="coordsHint" class="coords-hint" style="position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:10;background:#fff;padding:8px 16px;border-radius:8px;box-shadow:0 2px 8px #0002;">{{ coordsHint }}</div>
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
          <!-- Универсальный файлпикер для создания -->
          <div class="mb-2">
            <label>Вложения:</label>
            <input type="file" multiple @change="e => markerBalloon.handleFileInput(e, popup)" />
            <ul v-if="popup.attachments && popup.attachments.length">
              <li v-for="(att, i) in popup.attachments" :key="i">
                <a :href="att.url" target="_blank">{{ att.name }}</a>
                <v-btn icon size="x-small" @click="markerBalloon.removeAttachment(popup, i)"><v-icon>mdi-close</v-icon></v-btn>
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="outlined" color="secondary" @click="popup.visible = false">Отмена</v-btn>
          <v-btn color="accent" variant="flat" @click="createMarker">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editMarkerDialogOpen" max-width="400">
      <EditMarkerDialog
        v-model="editMarkerDialogOpen"
        :marker="markerToEdit"
        @save="onSaveMarker"
        @change-coords="startChangeCoords"
        @delete-marker="onDeleteMarker"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted, nextTick, computed, watchEffect, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import MdiContextMenu from './MdiContextMenu.vue'
import mdiCategories from '../data/markerTypes.js'
import { useMapStore } from '../store/map.js'
import { useMarkerBalloon } from '../composables/useMarkerBalloon.js'
import EditMarkerDialog from './EditMarkerDialog.vue'

const mapZoom = Number(localStorage.getItem('mapZoom')) || 10
const mapLat = Number(localStorage.getItem('mapLat')) || 54
const mapLon = Number(localStorage.getItem('mapLon')) || 39
const center = ref([mapLat, mapLon])
const mapStore = useMapStore()
const ymapRef = ref(null)
const containerRef = ref(null)
const allMarkers = computed(() => mapStore.allMarkers)

// Используем composable для балуна и редактирования маркеров
const markerBalloon = useMarkerBalloon(mapStore, ymapRef, containerRef)

// Для рендера иконок (асинхронно для всех маркеров)
const renderedMarkers = ref([])

function getAttachmentHtml(att) {
  const ext = att.name ? att.name.split('.').pop().toLowerCase() : ''
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
    return `<div style='margin:4px 0;'><img src='${att.url}' alt='${att.name}' style='max-width:80px;max-height:80px;display:block;border-radius:4px;border:1px solid #ccc;'/><div style='font-size:12px;'>${att.name}</div></div>`
  } else if (ext === 'pdf') {
    return `<div style='margin:4px 0;'><span style='color:#e53935;font-weight:bold;'>[PDF]</span> <a href='${att.url}' target='_blank'>${att.name}</a></div>`
  } else {
    return `<div style='margin:4px 0;'><span style='color:#888;'>[Файл]</span> <a href='${att.url}' target='_blank'>${att.name}</a></div>`
  }
}

function getBalloonContent(marker) {
  let attachmentsHtml = ''
  if (marker.attachments && marker.attachments.length) {
    attachmentsHtml = `<div><b>Вложения:</b><div>${marker.attachments.map(getAttachmentHtml).join('')}</div></div>`
  }
  return `
    <div style='min-width:220px;'>
      <div style='font-weight:bold;font-size:16px;'>${marker.label || ''}</div>
      <div style='margin:8px 0;'><b>Описание:</b> ${marker.hint || ''}</div>
      <div style='margin:8px 0;'><b>Координаты:</b> ${marker.coords ? marker.coords[0].toFixed(6) + ', ' + marker.coords[1].toFixed(6) : ''}</div>
      ${attachmentsHtml}
      <button data-marker-id='${marker.id}' class='edit-marker-btn' style='margin-top:8px;padding:4px 12px;'>Редактировать</button>
    </div>
  `
}

watchEffect(async () => {
  const newMarkers = allMarkers.value
  const result = await Promise.all(newMarkers.map(async (marker) => {
    let icon = marker.icon
    let color = marker.isOwn === false ? '#E53935' : '#3BA55D'
    if (typeof icon === 'string' && icon.startsWith('mdi-')) {
      icon = await mdiIconToPngDataUrl(icon, color)
    } else if (icon && icon.imageHref) {
      // уже PNG
    }
    return {
      ...marker,
      icon: {
        layout: 'default#imageWithContent',
        imageHref: icon,
        imageSize: [43, 43],
        imageOffset: [-21.5, -21.5],
        contentLayout: marker.label
          ? `<div style=\"position: absolute; left: 21px; top: 40px; transform: translateX(-50%); font-size: 13px; line-height: 1.2; text-align: center; color: #222; white-space: nowrap; pointer-events: none;\">${marker.label}</div>`
          : ''
      },
      balloon: {
        header: marker.label,
        body: getBalloonContent(marker)
      }
    }
  }))
  renderedMarkers.value = result
})

const menu = reactive({ visible: false, x: 0, y: 0, coords: null })
const selectedCategory = ref(null)
const popup = reactive({
  visible: false,
  icon: null,
  label: '',
  hint: '',
  isOwn: true,
  coords: null,
  attachments: []
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

// ПКМ — только ручные маркеры (markers)
async function createMarker() {
  if (!popup.icon || !popup.coords) return
  const markerId = Date.now() + Math.random()
  const marker = {
    id: markerId,
    coords: popup.coords,
    icon: popup.icon.icon || popup.icon, // всегда mdi-строка
    label: popup.label,
    hint: popup.hint,
    isOwn: popup.isOwn !== false,
    attachments: popup.attachments
  }
  mapStore.addMarker(marker)
  popup.visible = false
  popup.icon = null
  popup.coords = null
  popup.attachments = [] // Сбрасываем вложения при создании
}

const theme = useTheme()
const isDark = computed(() => {
  const currentTheme = theme.current.value?.name || localStorage.getItem('selectedTheme') || 'tacticalLight'
  return currentTheme === 'tacticalDark'
})
const mapFilterClass = computed(() => isDark.value ? 'map-dark-filter' : '')

const editMarkerDialogOpen = ref(false)
const markerToEdit = ref(null)
const changeCoordsMode = ref(false)
const coordsHint = ref('')

function openEditMarker(marker) {
  markerToEdit.value = { ...marker }
  editMarkerDialogOpen.value = true
}
function startChangeCoords() {
  changeCoordsMode.value = true
  coordsHint.value = 'Кликните по карте для выбора новой позиции'
  editMarkerDialogOpen.value = false
  if (containerRef.value) containerRef.value.classList.add('select-coords-mode')
}
function onMapClick(e) {
  if (changeCoordsMode.value && markerToEdit.value) {
    const coords = getMapCoordsFromEvent(e)
    markerToEdit.value.coords = coords
    changeCoordsMode.value = false
    coordsHint.value = ''
    editMarkerDialogOpen.value = true
    if (containerRef.value) containerRef.value.classList.remove('select-coords-mode')
  }
}
function onSaveMarker(updatedMarker) {
  mapStore.updateMarker(updatedMarker)
  editMarkerDialogOpen.value = false
}

function onDeleteMarker(marker) {
  mapStore.removeMarker(marker.id)
  editMarkerDialogOpen.value = false
}

onMounted(() => {
  editMarkerDialogOpen.value = false
  markerToEdit.value = null
  document.body.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('edit-marker-btn')) {
      const markerId = e.target.getAttribute('data-marker-id')
      const marker = allMarkers.value.find(m => m.id == markerId)
      if (marker) openEditMarker(marker)
    }
  })
})

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
.coords-hint {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  pointer-events: none;
}
.select-coords-mode, .select-coords-mode * {
  cursor: crosshair !important;
}
</style>
