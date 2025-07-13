<template>
  <transition name="emoji-fade">
    <div v-if="visible" ref="pickerRef" :style="pickerStyle" class="emoji-picker bg-white position-absolute" @mousedown.stop>
      <span class="picker-arrow" :style="arrowStyle"></span>
      <div class="picker-header">
        <h3 class="picker-title">Выберите эмодзи</h3>
        <button @click.stop="$emit('close')" class="close-btn">
          <v-icon size="20">mdi-close</v-icon>
        </button>
      </div>
      <div class="search-container">
        <v-text-field v-model="searchQuery" placeholder="Поиск эмодзи..." prepend-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="search-input" />
      </div>
      <div class="categories-tabs">
        <button v-for="category in emojiCategories" :key="category.key" @click="selectedCategory = category.key" :class="['category-tab', { active: selectedCategory === category.key }]" :title="category.name">
          <span class="category-emoji">{{ category.icon }}</span>
        </button>
      </div>
      <div class="emoji-grid">
        <button
          v-for="(emoji, idx) in filteredEmojis"
          :key="emoji + '-' + idx"
          @click.stop="selectEmoji(emoji)"
          class="emoji-btn"
          :title="emoji"
        >
          <span class="emoji">{{ emoji }}</span>
        </button>
      </div>
      <div class="color-picker">
        <span class="color-label">Цвет фона:</span>
        <div class="color-options">
          <button v-for="color in colors" :key="color.name" @click="selectedColor = color.name" :class="['color-btn', { active: selectedColor === color.name }]" :style="{ backgroundColor: color.value }" :title="color.name"></button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  visible: Boolean,
  x: Number,
  y: Number
})
const emit = defineEmits(['close', 'select'])
const pickerRef = ref(null)
const pickerStyle = ref({})
const arrowStyle = ref({})
const searchQuery = ref('')
const selectedCategory = ref('smileys')
const selectedColor = ref('blue')

const emojiCategories = [
  { key: 'smileys', name: 'Смайлики', icon: '😀' },
  { key: 'animals', name: 'Животные', icon: '🐶' },
  { key: 'food', name: 'Еда', icon: '🍎' },
  { key: 'activities', name: 'Активности', icon: '⚽' },
  { key: 'travel', name: 'Путешествия', icon: '🚗' },
  { key: 'objects', name: 'Объекты', icon: '💡' },
  { key: 'symbols', name: 'Символы', icon: '❤️' },
  { key: 'flags', name: 'Флаги', icon: '🏁' }
]
const emojiData = {
  smileys: ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😍','😘','😗','😙','😚','😋','😜','😝','😛','🤑','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳','🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤑','🤠','😇','🥳','🥺','🤡','🤥','🤫','🤭','🧐','🤓','😈','👿','👹','👺','💀','👻','👽','🤖'],
  animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🐣','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦋','🐛','🐌','🐞','🐜','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦙','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🐈','🐓','🦃','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦦','🦥','🐁','🐀','🐿️','🦔'],
  food: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍪','🌰','🥜','🍯','🥛','🍼','🫖','☕','🍵','🧃','🥤','🧋','🍶','🍺','🍻','🍷','🥂','🥃','🍸','🍹','🧉','🍾','🥄','🍴','🍽️','🥣','🥡','🥢'],
  activities: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','⛳','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️‍♀️','🏋️','🏋️‍♂️','🤼‍♂️','🤼‍♀️','🤸‍♂️','🤸‍♀️','⛹️‍♂️','⛹️‍♀️','🤺','🤾‍♂️','🤾‍♀️','🏌️‍♂️','🏌️‍♀️','🏄‍♂️','🏄‍♀️','🏊‍♂️','🏊‍♀️','🤽‍♂️','🤽‍♀️','🚣‍♂️','🚣‍♀️','🚴‍♂️','🚴‍♀️','🚵‍♂️','🚵‍♀️','🤹‍♂️','🤹‍♀️','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🎸','🎻','🎲','♟️','🎯','🎳','🎮','🎰','🧩'],
  travel: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🦽','🦼','🛺','🚲','🛴','🛹','🛼','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩️','💺','🛰️','🚀','🛸','🚁','🛶','⛵','🚤','🛥️','🛳️','⛴️','🚢','⚓','🪝','⛽','🚧','🚦','🚥','🛑','🚏','🗺️','🗿','🗽','🗼','🏰','🏯','🏟️','🎡','🎢','🎠','⛲','⛱️','🏖️','🏝️','🏜️','🌋','⛰️','🏔️','🗻','🏕️','⛺','🏠','🏡','🏘️','🏚️','🏗️','🏭','🏢','🏬','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏩','💒','🏛️','⛪','🕌','🛕','🕍','🕋','⛩️','🛤️','🛣️','🗾','🎑','🏞️','🌅','🌄','🌠','🎇','🎆','🌇','🌆','🏙️','🌃','🌌','🌉','🌁'],
  objects: ['💡','🔦','🏮','🪔','📔','📕','📖','📗','📘','📙','📚','📓','📒','📃','📜','📄','📰','🗞️','📑','🔖','🏷️','💰','🪙','💴','💵','💶','💷','💸','💳','🧾','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒️','🛠️','⛏️','🪚','🔩','⚙️','🧱','⛓️','🧲','🪝','🧰','🧲','🧯','🛢️','🛒','🚬','⚰️','⚱️','🏺','🧪','🧫','🧬','🔬','🔭','📡','💉','🩸','💊','🩹','🩺','🩻','🩼','🩽','🩾','🩿','🪞','🪟'],
  symbols: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❓','❕','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','#️⃣','*️⃣','⏏️','▶️','⏸️','⏯️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','⏸️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','⏸️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬'],
  flags: ['🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️','🇷🇺','🇺🇦','🇧🇾','🇰🇿','🇬🇪','🇦🇲','🇦🇿','🇺🇸','🇨🇳','🇬🇧','🇫🇷','🇩🇪','🇮🇹','🇪🇸','🇵🇹','🇵🇱','🇯🇵','🇰🇷','🇮🇳','🇧🇷','🇦🇺','🇨🇦','🇸🇦','🇹🇷','🇮🇱','🇿🇦']
}
const colors = [
  { name: 'blue', value: '#2196F3' },
  { name: 'red', value: '#E53935' },
  { name: 'green', value: '#43A047' },
  { name: 'yellow', value: '#FFC107' },
  { name: 'orange', value: '#FF9800' },
  { name: 'purple', value: '#9C27B0' },
  { name: 'grey', value: '#9E9E9E' },
  { name: 'black', value: '#212121' }
]

const filteredEmojis = computed(() => {
  let list = emojiData[selectedCategory.value] || []
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(e => e.toLowerCase().includes(q))
  }
  return list.slice(0, 120)
})

function selectEmoji(emoji) {
  // Генерируем PNG через canvas
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, size, size)
  // Круглый фон
  ctx.beginPath()
  ctx.arc(size/2, size/2, size/2-2, 0, 2*Math.PI)
  ctx.fillStyle = colors.find(c => c.name === selectedColor.value)?.value || '#2196F3'
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.stroke()
  // Эмодзи
  ctx.font = `${size-8}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, size/2, size/2)
  // Получаем dataURL
  const pngDataUrl = canvas.toDataURL('image/png')
  emit('select', { emoji, color: selectedColor.value, png: pngDataUrl })
}

// Позиционирование
watch(() => [props.x, props.y, props.visible], () => {
  if (!props.visible) return
  let x = props.x || 0
  let y = props.y || 0
  x += 8
  y += 8
  nextTick(() => {
    const picker = pickerRef.value
    if (picker && picker.parentElement) {
      const w = picker.offsetWidth
      const h = picker.offsetHeight
      const parentRect = picker.parentElement.getBoundingClientRect()
      const pw = parentRect.width
      const ph = parentRect.height
      if (x + w > pw) x = Math.max(0, pw - w - 8)
      if (y + h > ph) y = Math.max(0, ph - h - 8)
      if (x < 0) x = 0
      if (y < 0) y = 0
    }
    pickerStyle.value = { position: 'absolute', left: `${x}px`, top: `${y}px`, zIndex: 1001, opacity: 1, boxShadow: '0 6px 24px 0 rgba(0,0,0,0.18)', borderRadius: '18px', pointerEvents: 'auto', transform: 'scale(1)' }
    arrowStyle.value = { position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '-10px', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '10px solid #fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))' }
  })
})
</script>

<style scoped>
.emoji-picker {
  min-width: 260px;
  max-width: 400px;
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
.emoji-picker[style*="opacity: 1"] {
  opacity: 1;
  transform: scale(1);
}
.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.picker-title {
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
.search-container {
  margin-bottom: 8px;
}
.categories-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}
.category-tab {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 18px;
  transition: background 0.15s;
}
.category-tab.active, .category-tab:hover {
  background: #f5f5f5;
}
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}
.emoji-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  border-radius: 8px;
  transition: background 0.15s;
}
.emoji-btn:hover {
  background: #e3f2fd;
}
.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.color-label {
  font-size: 13px;
  color: #333;
}
.color-options {
  display: flex;
  gap: 4px;
}
.color-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
  outline: none;
  transition: box-shadow 0.15s;
}
.color-btn.active, .color-btn:hover {
  box-shadow: 0 0 0 2px #2196F3;
}
</style> 