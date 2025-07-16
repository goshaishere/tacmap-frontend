<template>
  <transition name="radial-fade">
    <div v-if="visible" ref="menuRef" :style="menuStyle" style="position:absolute;z-index:1001;">
      <span class="radial-arrow" :style="arrowStyle"></span>
      <v-card elevation="8" rounded="xl" :color="'surface'" style="min-width:240px;max-width:380px;width:auto;">
        <v-card-title class="d-flex align-center justify-space-between py-2 px-4">
          <span class="text-h6 font-weight-bold">Выберите иконку</span>
          <v-btn icon variant="text" @click.stop="$emit('close')">
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider class="my-0" />
        <v-card-text class="py-3 px-4">
          <!-- Категории -->
          <template v-if="!selectedCategory">
            <v-row dense>
              <v-col v-for="cat in categories" :key="cat.key" cols="6" class="d-flex justify-center">
                <div class="d-flex flex-column align-center justify-center py-4" @click.stop="$emit('select-category', cat)" :title="cat.label">
                  <v-icon :size="32" color="accent">{{ cat.icon }}</v-icon>
                  <span class="text-caption text-center w-100 mt-2">{{ cat.label }}</span>
                </div>
              </v-col>
            </v-row>
          </template>
          <!-- Иконки выбранной категории -->
          <template v-else>
            <div class="d-flex align-center mb-2">
              <v-btn icon variant="text" @click.stop="$emit('back')">
                <v-icon size="20" color="accent">mdi-arrow-left</v-icon>
              </v-btn>
              <span class="ms-2 text-subtitle-1 font-weight-bold">{{ selectedCategory.label }}</span>
            </div>
            <v-row dense>
              <v-col v-for="icon in selectedCategory.items" :key="icon.key" cols="2" class="d-flex justify-center">
                <v-btn variant="text" rounded class="icon-btn d-flex align-center justify-center" style="width:40px;height:40px;" @click.stop="$emit('select-icon', icon)" :title="icon.label">
                  <v-icon :size="28" color="accent">{{ icon.icon }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>
    </div>
  </transition>
</template>

<script setup>
import { ref, watchEffect, nextTick } from 'vue'
import { onMounted } from 'vue'

const props = defineProps({
  visible: Boolean,
  x: Number,
  y: Number,
  categories: Array, // [{ key, label, icons }]
  selectedCategory: Object
})
const emit = defineEmits(['close', 'select-category', 'select-icon', 'back'])

const menuRef = ref(null)
const menuStyle = ref({})
const arrowStyle = ref({})

// Следим за позицией и видимостью меню, корректируем стили
watchEffect(() => {
  if (!props.visible) return
  let x = props.x || 0
  let y = props.y || 0
  x += 8
  y += 8
  nextTick(() => {
    const menu = menuRef.value
    if (menu && menu.parentElement) {
      const w = menu.offsetWidth
      const h = menu.offsetHeight
      const parentRect = menu.parentElement.getBoundingClientRect()
      const pw = parentRect.width
      const ph = parentRect.height
      if (x + w > pw) x = Math.max(0, pw - w - 8)
      if (y + h > ph) y = Math.max(0, ph - h - 8)
      if (x < 0) x = 0
      if (y < 0) y = 0
    }
    menuStyle.value = {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      zIndex: 1001,
      opacity: 1,
      boxShadow: '0 6px 24px 0 rgba(0,0,0,0.18)',
      borderRadius: '18px',
      pointerEvents: 'auto',
      transform: 'scale(1)'
    }
    arrowStyle.value = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: '-10px',
      width: 0,
      height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '10px solid #fff',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))'
    }
  })
})
</script>
