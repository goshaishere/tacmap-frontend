<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="val => $emit('update:modelValue', val)"
    fullscreen
    persistent
  >
    <v-card class="map-marker-picker-card" style="height: 100vh; display: flex; flex-direction: column;">
      <v-card-title class="text-h6 font-weight-bold pb-0">Выбор меток на карте</v-card-title>
      <v-card-text style="flex: 1; display: flex; flex-direction: column; padding: 0;">
        <div style="flex: 1; min-height: 0; position:relative;" ref="containerRef">
          <yandex-map
            ref="ymapRef"
            :coords="center"
            :zoom="zoom"
            class="adaptive-yandex-map"
            style="width: 100%; height: 100%; min-height: 0;"
            @contextmenu.native.prevent="onMapContextMenu"
            @click="onMapClick"
          >
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
              :options="{ hasBalloon: true, hideIconOnBalloonOpen: false }"
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
        </div>
        <v-list class="mt-2" style="max-height: 200px; overflow-y: auto;">
          <v-list-item v-for="(marker, idx) in localMarkers" :key="marker.id">
            <template #prepend>
              <v-icon :icon="marker.icon" class="me-2" />
            </template>
            <v-list-item-title>{{ marker.label }}</v-list-item-title>
            <v-list-item-subtitle>{{ marker.hint }} ({{ marker.coords[0] }}, {{ marker.coords[1] }})</v-list-item-subtitle>
            <template #append>
              <v-btn icon size="small" @click="openEditMarker(marker)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon size="small" color="error" @click="removeMarker(idx)"><v-icon>mdi-delete</v-icon></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('cancel')">Отмена</v-btn>
        <v-btn color="primary" variant="flat" @click="saveMarkers">Готово</v-btn>
      </v-card-actions>
      <!-- Диалог создания/редактирования метки -->
      <v-dialog v-model="editMarkerDialogOpen" max-width="400" persistent>
        <EditMarkerDialog
          v-model="editMarkerDialogOpen"
          :marker="markerToEdit"
          mode="edit"
          @save="onSaveMarker"
          @change-coords="startChangeCoords"
        />
      </v-dialog>
      <EditMarkerDialog
        v-model="draftDialogOpen"
        :marker="draftMarker"
        mode="create"
        @save="onSaveDraftMarker"
      />
      <div v-if="draftCoordsHint" class="coords-hint" style="position:absolute;top:40px;left:50%;transform:translateX(-50%);z-index:10;background:#fff;padding:8px 16px;border-radius:8px;box-shadow:0 2px 8px #0002;">{{ draftCoordsHint }}</div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, nextTick, watch, defineExpose, onMounted, computed } from 'vue'
import MdiContextMenu from '../MdiContextMenu.vue'
import mdiCategories from '../../data/markerTypes.js'
import { yandexMap, ymapMarker } from 'vue-yandex-maps'
import { useMarkerBalloon } from '../../composables/useMarkerBalloon.js'
import EditMarkerDialog from '../EditMarkerDialog.vue'

defineExpose({})

defineOptions({
  components: { yandexMap, ymapMarker, MdiContextMenu }
})

const props = defineProps({
  modelValue: Boolean,
  modelMarkers: Array,
})
const emit = defineEmits(['update:modelValue', 'update:modelMarkers', 'cancel'])

const center = ref([59.9311, 30.3609])
const zoom = ref(11)
const localMarkers = ref(props.modelMarkers ? JSON.parse(JSON.stringify(props.modelMarkers)) : [])

const menu = reactive({ visible: false, x: 0, y: 0, coords: null })
const menuComponentRef = ref(null)
const selectedCategory = ref(null)
const ymapRef = ref(null)
const containerRef = ref(null)

// Используем composable для балуна и редактирования маркеров
const markerBalloon = useMarkerBalloon({ markers: localMarkers.value }, ymapRef, containerRef)

const editMarkerDialogOpen = ref(false)
const markerToEdit = ref(null)
const editCoordsMode = ref(false)
const coordsHint = ref('')

const draftDialogOpen = ref(false)
const draftMarker = ref(null)
const draftChangeCoordsMode = ref(false)
const draftCoordsHint = ref('')

function openEditMarker(marker) {
  markerToEdit.value = { ...marker }
  editMarkerDialogOpen.value = true
}
function startChangeCoords() {
  editCoordsMode.value = true
  coordsHint.value = 'Кликните по карте для выбора новой позиции'
  editMarkerDialogOpen.value = false
  if (containerRef.value) containerRef.value.classList.add('select-coords-mode')
}
function startDraftChangeCoords() {
  draftChangeCoordsMode.value = true
  draftCoordsHint.value = 'Кликните по карте для выбора новой позиции'
  draftDialogOpen.value = false
  if (containerRef.value) containerRef.value.classList.add('select-coords-mode')
}
function onMapClick(e) {
  if (draftChangeCoordsMode.value && draftMarker.value) {
    const coords = getMapCoordsFromEvent(e)
    draftMarker.value.coords = coords
    draftChangeCoordsMode.value = false
    draftCoordsHint.value = ''
    draftDialogOpen.value = true
    if (containerRef.value) containerRef.value.classList.remove('select-coords-mode')
    return
  }
  if (editCoordsMode.value && markerToEdit.value) {
    const coords = getMapCoordsFromEvent(e)
    markerToEdit.value.coords = coords
    editCoordsMode.value = false
    coordsHint.value = ''
    editMarkerDialogOpen.value = true
    if (containerRef.value) containerRef.value.classList.remove('select-coords-mode')
    return
  }
}
function onSaveMarker(updatedMarker) {
  const idx = localMarkers.value.findIndex(m => m.id === updatedMarker.id)
  if (idx !== -1) {
    localMarkers.value[idx] = { ...updatedMarker }
  }
  editMarkerDialogOpen.value = false
  updateRenderedMarkers()
}

// --- Подключаем обработку клика по кнопке "Редактировать" в балуне ---
onMounted(() => {
  editMarkerDialogOpen.value = false
  markerToEdit.value = null
  console.log('[MapMarkerPicker] onMounted: isEditMarkerOpen', markerBalloon.isEditMarkerOpen, 'editingMarker', markerBalloon.editingMarker)
  document.body.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('edit-marker-btn')) {
      const markerId = e.target.getAttribute('data-marker-id')
      const marker = localMarkers.value.find(m => m.id == markerId)
      if (marker) openEditMarker(marker)
    }
  })
})

function onMapContextMenu(e) {
  const coords = e.get && typeof e.get === 'function' ? e.get('coords') : null
  if (!coords) return
  menu.coords = coords
  menu.x = e.get('pagePixels')[0]
  menu.y = e.get('pagePixels')[1]
  menu.visible = true
  selectedCategory.value = null
  // popup.visible = false // не открываем форму сразу
}
function onSelectCategory(cat) {
  selectedCategory.value = cat
}
function onBack() {
  selectedCategory.value = null
}
function onMenuIconSelect(icon) {
  if (!menu.coords) return
  draftMarker.value = {
    id: Date.now() + Math.random(),
    coords: menu.coords,
    icon: icon.icon,
    label: '',
    hint: '',
    isOwn: true,
    attachments: []
  }
  draftDialogOpen.value = true
  menu.visible = false
}
function onSaveDraftMarker(marker) {
  localMarkers.value.push({ ...marker })
  updateRenderedMarkers()
  draftDialogOpen.value = false
}
function chooseIcon() {
  // Отключаем ручной выбор иконки — только через ПКМ
}

const renderedMarkers = ref([])

async function updateRenderedMarkers() {
  const result = []
  for (const marker of localMarkers.value) {
    let icon = marker.icon
    let color = marker.isOwn === false ? '#E53935' : '#3BA55D'
    if (typeof icon === 'string' && icon.startsWith('mdi-')) {
      icon = await mdiIconToPngDataUrl(icon, color)
    } else if (icon && icon.imageHref) {
      // уже PNG
    }
    result.push({ ...marker, icon: {
      layout: 'default#imageWithContent',
      imageHref: icon,
      imageSize: [43, 43],
      imageOffset: [-21.5, -21.5],
      contentLayout: marker.label
        ? `<div style=\"position: absolute; left: 21px; top: 40px; transform: translateX(-50%); font-size: 13px; line-height: 1.2; text-align: center; color: #222; white-space: nowrap; pointer-events: none;\">${marker.label}</div>`
        : ''
    } })
  }
  renderedMarkers.value = result
}

watch(localMarkers, () => {
  updateRenderedMarkers()
}, { immediate: true })

// После любого изменения localMarkers вызываем updateRenderedMarkers
function removeMarker(idx) {
  localMarkers.value.splice(idx, 1)
  updateRenderedMarkers()
}
function saveMarkers() {
  emit('update:modelMarkers', JSON.parse(JSON.stringify(localMarkers.value)))
  emit('update:modelValue', false)
}
watch(() => props.modelValue, (val) => {
  if (val) {
    localMarkers.value = props.modelMarkers ? JSON.parse(JSON.stringify(props.modelMarkers)) : []
  }
})

async function mdiIconToPngDataUrl(mdiIconName, color = '#1976D2', size = 43) {
  const svgPath = `/node_modules/@mdi/svg/svg/${mdiIconName.replace('mdi-','')}.svg`;
  let svgText = await fetch(svgPath).then(r => r.text());
  svgText = svgText
    .replace(/fill="[^"]*"/gi, `fill=\"${color}\"`)
    .replace(/stroke="[^"]*"/gi, `stroke=\"${color}\"`);
  svgText = svgText.replace(/<path /gi, `<path fill=\"${color}\" `);
  const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svgText);
  return svgDataUrl;
}

function getMapCoordsFromEvent(e) {
  return (e && typeof e.get === 'function') ? e.get('coords') : null
}
</script> 

<style scoped>
.select-coords-mode, .select-coords-mode * {
  cursor: crosshair !important;
}
</style> 