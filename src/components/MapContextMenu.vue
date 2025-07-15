<template>
  <transition name="radial-fade">
    <div
      v-if="visible"
      ref="menuRef"
      :style="menuStyle"
      class="map-context-menu bg-white position-absolute"
      @mousedown.stop
    >
      <span class="radial-arrow" :style="arrowStyle"></span>
      
      <!-- Первый уровень: выбор категории -->
      <div v-if="!selectedCategory" class="categories-grid">
        <button 
          v-for="category in categories" 
          :key="category.key" 
          @click.stop="selectCategory(category)" 
          class="category-btn"
          :title="category.label"
        >
          <span class="category-emoji" v-if="category.icon && category.icon.match(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u)">{{ category.icon }}</span>
          <v-icon v-else :color="category.color" size="24">{{ category.icon }}</v-icon>
          <span class="category-label">{{ category.label }}</span>
        </button>
      </div>
      
      <!-- Второй уровень: выбор иконки -->
      <div v-else class="icons-container">
        <!-- Кнопка "Назад" -->
        <div class="back-header">
          <button @click.stop="goBack" class="back-btn">
            <v-icon size="20">mdi-arrow-left</v-icon>
            <span>Назад</span>
          </button>
          <span class="category-title">{{ selectedCategory.label }}</span>
        </div>
        
        <!-- Сетка иконок -->
        <div class="icons-grid">
          <button 
            v-for="item in selectedCategory.items" 
            :key="item.key" 
            @click.stop="$emit('select', item)" 
            class="icon-btn"
            :title="item.label"
          >
            <span class="emoji" v-if="item.emoji">{{ item.emoji }}</span>
            <v-icon v-else :color="item.color" size="20">{{ item.icon }}</v-icon>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  visible: Boolean,
  x: Number,
  y: Number,
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select'])
const menuRef = ref(null)
const menuStyle = ref({})
const arrowStyle = ref({})
const selectedCategory = ref(null)

// Функции для навигации
function selectCategory(category) {
  selectedCategory.value = category
  // Перепозиционируем меню после изменения содержимого
  nextTick(() => {
    updatePosition()
  })
}

function goBack() {
  selectedCategory.value = null
  // Перепозиционируем меню после изменения содержимого
  nextTick(() => {
    updatePosition()
  })
}

// Сброс выбранной категории при закрытии меню
watch(() => props.visible, (newVisible) => {
  if (!newVisible) {
    selectedCategory.value = null
  }
})

function updatePosition() {
  let x = props.x || 0
  let y = props.y || 0
  
  // Смещение меню относительно курсора
  x += 8
  y += 8
  
  nextTick(() => {
    const menu = menuRef.value
    if (menu && menu.parentElement) {
      const menuWidth = menu.offsetWidth
      const menuHeight = menu.offsetHeight
      // Получаем размеры контейнера карты (родителя)
      const parentRect = menu.parentElement.getBoundingClientRect()
      const parentWidth = parentRect.width
      const parentHeight = parentRect.height
      
      // Если меню выходит за правый край карты
      if (x + menuWidth > parentWidth) {
        x = Math.max(0, parentWidth - menuWidth - 8)
      }
      // Если меню выходит за нижний край карты
      if (y + menuHeight > parentHeight) {
        y = Math.max(0, parentHeight - menuHeight - 8)
      }
      // Если меню выходит за левый край карты
      if (x < 0) x = 0
      // Если меню выходит за верхний край карты
      if (y < 0) y = 0
    }
    
    menuStyle.value = {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      zIndex: 1000,
      opacity: 1,
      transition: 'opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1)',
      boxShadow: '0 6px 24px 0 rgba(0,0,0,0.18)',
      borderRadius: '18px',
      pointerEvents: 'auto',
      transform: 'scale(1)'
    }
    
    // Стрелочка всегда указывает на курсор
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
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))',
    }
  })
}

watch(() => [props.x, props.y, props.visible], () => {
  if (props.visible) updatePosition()
})

function handleGlobalClick(e) {
  if (props.visible) {
    const menu = menuRef.value
    if (menu && !menu.contains(e.target)) {
      emit('close')
    }
  }
}
function handleEsc(e) {
  if (props.visible && (e.key === 'Escape' || e.key === 'Esc')) {
    emit('close')
  }
}
onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
  document.addEventListener('keydown', handleEsc)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick)
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.map-context-menu {
  min-width: 200px;
  max-width: 400px;
  background: #fff;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.18);
  border-radius: 18px;
  pointer-events: auto;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
  padding: 12px;
  max-height: 400px;
  overflow: hidden;
}
.map-context-menu[style*="opacity: 1"] {
  opacity: 1;
  transform: scale(1);
}

/* Сетка категорий */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.category-btn {
  background: none;
  border: none;
  outline: none;
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
.category-label {
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  color: #333;
}

/* Контейнер иконок */
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
  outline: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}
.back-btn:hover {
  background: #f5f5f5;
}

.category-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

/* Сетка иконок */
.icons-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  overflow-y: auto;
  max-height: 280px;
  padding-right: 4px;
}

.icon-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
}
.icon-btn:hover {
  background: #f5f5f5;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.icon-btn:active {
  transform: scale(0.95);
}

.radial-arrow {
  display: block;
  position: absolute;
  z-index: 1;
}
.radial-fade-enter-active, .radial-fade-leave-active {
  transition: opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
}
.radial-fade-enter-from, .radial-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.category-emoji {
  font-size: 24px;
  line-height: 1;
  display: block;
}
.emoji {
  font-size: 24px;
  line-height: 1;
  display: block;
}
</style> 