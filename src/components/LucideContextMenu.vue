<template>
  <transition name="radial-fade">
    <div v-if="visible" ref="menuRef" :style="menuStyle" class="lucide-context-menu bg-white position-absolute" @mousedown.stop>
      <span class="radial-arrow" :style="arrowStyle"></span>
      <div class="menu-header">
        <h3 class="menu-title">Выберите иконку</h3>
        <button @click.stop="$emit('close')" class="close-btn">
          <v-icon size="20">mdi-close</v-icon>
        </button>
      </div>
      <!-- Категории -->
      <div v-if="!selectedCategory" class="categories-grid">
        <button v-for="cat in categories" :key="cat.key" @click.stop="$emit('select-category', cat)" class="category-btn" :title="cat.label">
          <component :is="cat.icon" class="category-icon" />
          <span class="category-label">{{ cat.label }}</span>
        </button>
      </div>
      <!-- Иконки выбранной категории -->
      <div v-else class="icons-container">
        <div class="back-header">
          <button @click.stop="$emit('back')" class="back-btn">
            <v-icon size="20">mdi-arrow-left</v-icon>
            <span>Назад</span>
          </button>
          <span class="category-title">{{ selectedCategory.label }}</span>
        </div>
        <div class="icons-grid">
          <button v-for="icon in selectedCategory.icons" :key="icon.name" @click.stop="$emit('select-icon', icon)" class="icon-btn" :title="icon.label">
            <component :is="icon.component" class="lucide-icon" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  visible: Boolean,
  x: Number,
  y: Number,
  categories: Array,
  selectedCategory: Object
})
const emit = defineEmits(['close', 'select-category', 'select-icon', 'back'])
const menuRef = ref(null)
const menuStyle = ref({})
const arrowStyle = ref({})

watch(() => [props.x, props.y, props.visible], () => {
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
    menuStyle.value = { position: 'absolute', left: `${x}px`, top: `${y}px`, zIndex: 1001, opacity: 1, boxShadow: '0 6px 24px 0 rgba(0,0,0,0.18)', borderRadius: '18px', pointerEvents: 'auto', transform: 'scale(1)' }
    arrowStyle.value = { position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '-10px', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '10px solid #fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))' }
  })
})
</script>

<style scoped>
.lucide-context-menu {
  min-width: 280px;
  max-width: 420px;
  background: #fff;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.18);
  border-radius: 18px;
  pointer-events: auto;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
  padding: 12px;
  max-height: 420px;
  overflow: auto;
}
.lucide-context-menu[style*="opacity: 1"] {
  opacity: 1;
  transform: scale(1);
}
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.menu-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: background 0.15s;
}
.close-btn:hover {
  background: #f5f5f5;
}
.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}
.category-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px 8px;
  border-radius: 12px;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 60px;
}
.category-btn:hover {
  background: #f5f5f5;
  transform: scale(1.02);
}
.category-icon {
  width: 24px;
  height: 24px;
  color: #2196F3;
}
.category-label {
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: #333;
}
.icons-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.back-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}
.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 4px;
}
.back-btn:hover {
  background: #f5f5f5;
}
.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.icons-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn:hover {
  background: #e3f2fd;
}
.lucide-icon {
  width: 24px;
  height: 24px;
  color: #333;
}
</style> 