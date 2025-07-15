<template>
  <div ref="containerRef" style="position: relative; width: 100%; height: 100%;">
    <yandex-map ref="ymapRef" :coords="center" :zoom="10" class="adaptive-yandex-map" @contextmenu.native.prevent="onMapContextMenu">
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
          <v-btn variant="text" color="secondary" @click="popup.visible = false">Отмена</v-btn>
          <v-btn color="accent" variant="flat" @click="createMarker">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import MdiContextMenu from './MdiContextMenu.vue'
import mdiCategories from '../data/markerTypes.js'

function getMdiSvg(icon, color = '#1976D2') {
  // Используем встроенный mdiSvg (Vuetify) или CDN
  // Здесь пример для Vuetify 3: <span class="mdi" style="color: ...">mdi-...</span>
  // Но для contentLayout нужен raw SVG, поэтому используем CDN
  return `<span style='display:inline-block;width:32px;height:32px;'><svg width='32' height='32' viewBox='0 0 24 24' fill='${color}'><use href='https://cdn.jsdelivr.net/npm/@mdi/svg/svg/${icon.replace('mdi-','')}.svg#${icon}' /></svg></span>`;
}

export default {
  name: 'CustomYandexMap',
  components: { MdiContextMenu },
  setup() {
    const center = ref([54, 39])
    const markers = ref([])
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

    function getMapCoordsFromEvent(e) {
      // Всегда используем только e.get('coords') — широта/долгота клика по карте
      return (e && typeof e.get === 'function') ? e.get('coords') : null
    }

    // Универсальное получение позиции меню относительно контейнера
    function getMenuPositionFromEvent(e, container) {
      // 1. Пробуем pagePixels (Яндекс.Карты)
      let x, y, source;
      if (e.get && typeof e.get === 'function' && e.get('pagePixels')) {
        const pagePixels = e.get('pagePixels');
        const rect = container.getBoundingClientRect();
        x = pagePixels[0] - rect.left;
        y = pagePixels[1] - rect.top;
        source = 'e.get("pagePixels")';
      } else if (e.domEvent && e.domEvent.originalEvent) {
        // 2. Пробуем clientX/clientY из вложенного MouseEvent
        const clientX = e.domEvent.originalEvent.clientX;
        const clientY = e.domEvent.originalEvent.clientY;
        const rect = container.getBoundingClientRect();
        x = clientX - rect.left;
        y = clientY - rect.top;
        source = 'e.domEvent.originalEvent';
      } else if (e.originalEvent) {
        // 3. Пробуем clientX/clientY из originalEvent
        const clientX = e.originalEvent.clientX;
        const clientY = e.originalEvent.clientY;
        const rect = container.getBoundingClientRect();
        x = clientX - rect.left;
        y = clientY - rect.top;
        source = 'e.originalEvent';
      } else {
        // 4. Обычный MouseEvent
        const clientX = e.clientX;
        const clientY = e.clientY;
        const rect = container.getBoundingClientRect();
        x = clientX - rect.left;
        y = clientY - rect.top;
        source = 'e (MouseEvent)';
      }
      // Учёт границ контейнера
      const menuWidth = 260, menuHeight = 240;
      if (x + menuWidth > container.clientWidth) x = container.clientWidth - menuWidth - 8;
      if (y + menuHeight > container.clientHeight) y = container.clientHeight - menuHeight - 8;
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      return { x, y };
    }

    function onMapContextMenu(e) {
      // 1. Географические координаты для маркера (широта/долгота)
      const markerCoords = getMapCoordsFromEvent(e)
      if (!markerCoords) return
      // 2. Пиксельные координаты для меню (по курсору, строго относительно containerRef)
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
      // 1. Получаем путь к SVG-файлу
      const svgPath = `/node_modules/@mdi/svg/svg/${mdiIconName.replace('mdi-','')}.svg`;
      // 2. Загружаем SVG как текст
      const svgText = await fetch(svgPath).then(r => r.text());
      // 3. Меняем цвет (если нужно)
      const coloredSvg = svgText.replace(/fill="[^"]*"/g, `fill=\"${color}\"`);
      // 4. Создаём dataURL для <img>
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(coloredSvg);
      // 5. Рисуем на canvas
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

    // Новый обработчик выбора иконки
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

    // Создание маркера после заполнения попапа
    async function createMarker() {
      if (!popup.icon || !popup.coords) return
      const size = 43
      const color = popup.isOwn ? '#3BA55D' : '#E53935' // fill передаём явно
      console.log('color', color);
      const pngDataUrl = await mdiIconToPngDataUrl(popup.icon.icon, color, size)
      markers.value.push({
        id: Date.now() + Math.random(),
        coords: popup.coords,
        icon: {
          layout: 'default#imageWithContent',
          imageHref: pngDataUrl,
          imageSize: [size, size],
          imageOffset: [-size/2, -size/2],
          contentLayout: popup.label
            ? `<div style='font-size:12px;line-height:1;text-align:center;color:#222;'>${popup.label}</div>`
            : ''
        },
        properties: {
          ...(popup.label ? { iconContent: popup.label } : {}),
          ...(popup.hint ? { hintContent: popup.hint } : {})
        }
      })
      popup.visible = false
      popup.icon = null
      popup.coords = null
    }

    return { center, markers, menu, mdiCategories, onMapContextMenu, onMenuIconSelect, createMarker, containerRef, ymapRef, selectedCategory, onSelectCategory, onBack, popup }
  }
}
</script>

<style scoped>
.adaptive-yandex-map {
  width: 100% !important;
  height: 716px !important;
  min-height: 300px;
  max-height: 100vh;
  display: flex;
}
@media (max-width: 960px) {
  .adaptive-yandex-map {
    height: calc(100vh - 56px - 56px) !important;
  }
}
</style> 