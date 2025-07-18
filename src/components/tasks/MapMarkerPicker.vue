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
        <div style="flex: 1; min-height: 0; position:relative;">
          <yandex-map
            ref="ymapRef"
            :coords="center"
            :zoom="zoom"
            class="adaptive-yandex-map"
            style="width: 100%; height: 100%; min-height: 0;"
            @contextmenu.native.prevent="onMapContextMenu"
          >
            <ymap-marker
              v-for="marker in renderedMarkers"
              :key="marker.id"
              :coords="marker.coords"
              :marker-id="marker.id"
              :icon="marker.icon"
              :properties="{ iconContent: marker.label, hintContent: marker.hint }"
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
        </div>
        <v-list class="mt-2" style="max-height: 200px; overflow-y: auto;">
          <v-list-item v-for="(marker, idx) in localMarkers" :key="marker.id">
            <template #prepend>
              <v-icon :icon="marker.icon" class="me-2" />
            </template>
            <v-list-item-title>{{ marker.label }}</v-list-item-title>
            <v-list-item-subtitle>{{ marker.hint }} ({{ marker.coords[0] }}, {{ marker.coords[1] }})</v-list-item-subtitle>
            <template #append>
              <v-btn icon size="small" @click="editMarker(idx)"><v-icon>mdi-pencil</v-icon></v-btn>
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
      <v-dialog v-model="popup.visible" max-width="400" persistent>
        <v-card>
          <v-card-title class="text-h6 font-weight-bold pb-0">{{ popup.editIdx === null ? 'Создание' : 'Редактирование' }} метки</v-card-title>
          <v-card-text>
            <v-text-field v-model="popup.label" label="Подпись" variant="outlined" density="comfortable" class="mb-3" clearable />
            <v-text-field v-model="popup.hint" label="Хинт (при наведении)" variant="outlined" density="comfortable" class="mb-3" clearable />
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
            <v-btn color="primary" variant="flat" @click="saveMarker">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, nextTick, watch, defineExpose } from 'vue'
import MdiContextMenu from '../MdiContextMenu.vue'
import mdiCategories from '../../data/markerTypes.js'
import { yandexMap, ymapMarker } from 'vue-yandex-maps'

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

const popup = reactive({
  visible: false,
  label: '',
  hint: '',
  icon: 'mdi-map-marker',
  coords: null,
  editIdx: null,
  isOwn: true, // по умолчанию true
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
  popup.icon = icon.icon // icon.icon — строка mdi-иконки
  popup.coords = menu.coords
  popup.label = ''
  popup.hint = ''
  popup.isOwn = true
  popup.editIdx = null
  popup.visible = true // только после выбора иконки
  menu.visible = false
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
function saveMarker() {
  if (!popup.coords) return
  const marker = {
    id: Date.now() + Math.random(),
    coords: popup.coords,
    icon: popup.icon, // mdi-строка
    label: popup.label,
    hint: popup.hint,
    isOwn: popup.isOwn !== false, // по умолчанию true
  }
  if (popup.editIdx !== null) {
    localMarkers.value[popup.editIdx] = marker
  } else {
    localMarkers.value.push(marker)
  }
  popup.visible = false
  popup.editIdx = null
  updateRenderedMarkers()
}
function editMarker(idx) {
  const m = localMarkers.value[idx]
  popup.label = m.label
  popup.hint = m.hint
  popup.icon = m.icon
  popup.coords = m.coords
  popup.isOwn = m.isOwn
  popup.editIdx = idx
  popup.visible = true
  // updateRenderedMarkers() не нужен здесь
}
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
</script> 