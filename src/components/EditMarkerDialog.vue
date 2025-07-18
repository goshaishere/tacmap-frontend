<template>
  <v-dialog v-model="visibleProxy" max-width="400">
    <v-card v-if="localMarker">
      <v-card-title>Редактировать маркер</v-card-title>
      <v-card-text>
        <v-text-field v-model="localMarker.label" label="Заголовок" />
        <v-textarea v-model="localMarker.hint" label="Описание" />
        <v-switch
          v-model="localMarker.isOwn"
          :label="localMarker.isOwn ? 'Свой (зелёный)' : 'Чужой (красный)'"
          color="accent"
          inset
          class="mb-1"
          :true-value="true"
          :false-value="false"
          hide-details
        >
          <template #thumb>
            <v-icon :color="localMarker.isOwn ? 'primary' : 'error'">{{ localMarker.isOwn ? 'mdi-shield-check' : 'mdi-skull' }}</v-icon>
          </template>
          <template #label>
            <span :style="{ color: localMarker.isOwn ? '#3BA55D' : '#E53935', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }">
              <v-icon size="18" :color="localMarker.isOwn ? 'primary' : 'error'">{{ localMarker.isOwn ? 'mdi-shield-check' : 'mdi-skull' }}</v-icon>
              {{ localMarker.isOwn ? 'Свой (зелёный)' : 'Чужой (красный)' }}
            </span>
          </template>
        </v-switch>
        <div class="mb-2">
          <label>Координаты:</label>
          <div>{{ localMarker.coords ? localMarker.coords[0].toFixed(6) + ', ' + localMarker.coords[1].toFixed(6) : '' }}</div>
        </div>
        <div class="mb-2">
          <label>Вложения:</label>
          <input type="file" multiple @change="e => handleFileInput(e)" />
          <ul v-if="localMarker.attachments && localMarker.attachments.length">
            <li v-for="(att, i) in localMarker.attachments" :key="i" style="margin-bottom:8px;">
              <template v-if="['jpg','jpeg','png','gif','bmp','webp'].includes((att.name||'').split('.').pop().toLowerCase())">
                <img :src="att.url" :alt="att.name" style="max-width:80px;max-height:80px;display:block;border-radius:4px;border:1px solid #ccc;" />
                <div style="font-size:12px;">{{ att.name }}</div>
              </template>
              <template v-else-if="(att.name||'').split('.').pop().toLowerCase() === 'pdf'">
                <span style="color:#e53935;font-weight:bold;">[PDF]</span> <a :href="att.url" target="_blank">{{ att.name }}</a>
              </template>
              <template v-else>
                <span style="color:#888;">[Файл]</span> <a :href="att.url" target="_blank">{{ att.name }}</a>
              </template>
              <v-btn icon size="x-small" @click="removeAttachment(i)"><v-icon>mdi-close</v-icon></v-btn>
            </li>
          </ul>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="save">Сохранить</v-btn>
        <v-btn @click="close">Отмена</v-btn>
        <v-btn v-if="props.mode === 'edit'" color="secondary" @click="changeCoords">Изменить координаты</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed, watchEffect } from 'vue'
const props = defineProps({
  modelValue: Boolean,
  marker: Object,
  mode: { type: String, default: 'edit' }
})
const emit = defineEmits(['update:modelValue', 'save', 'change-coords'])

const visibleProxy = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const localMarker = ref(null)

watchEffect(() => {
  console.log('[EditMarkerDialog] watchEffect', { modelValue: props.modelValue, marker: props.marker })
  if (props.modelValue && props.marker) {
    localMarker.value = { ...props.marker, attachments: props.marker.attachments ? [...props.marker.attachments] : [] }
    console.log('[EditMarkerDialog] localMarker set', localMarker.value)
  }
})

function save() {
  emit('save', { ...localMarker.value })
  emit('update:modelValue', false)
}
function close() {
  emit('update:modelValue', false)
}
function handleFileInput(e) {
  const files = Array.from(e.target.files)
  if (!localMarker.value.attachments) localMarker.value.attachments = []
  files.forEach(file => {
    const url = URL.createObjectURL(file)
    localMarker.value.attachments.push({ name: file.name, url, file })
  })
  e.target.value = ''
}
function removeAttachment(idx) {
  localMarker.value.attachments.splice(idx, 1)
}
function changeCoords() {
  emit('change-coords')
  emit('update:modelValue', false)
}
</script> 