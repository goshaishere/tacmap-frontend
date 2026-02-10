<template>
  <div class="structure-node mb-2">
    <div class="d-flex align-center py-2 px-3 rounded" style="background: rgba(0,0,0,0.03);">
      <v-icon size="small" class="me-2">mdi-folder-outline</v-icon>
      <span class="flex-grow-1">{{ node.name || t('company.structureLevels.' + node.levelKey) }}</span>
      <v-btn icon variant="text" size="x-small" @click="$emit('add-child', node.id)">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon variant="text" size="x-small" @click="$emit('edit', node)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon variant="text" size="x-small" color="error" @click="$emit('remove', node)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
    <div v-if="children.length" class="ms-4 mt-1">
      <StructureNode
        v-for="child in children"
        :key="child.id"
        :node="child"
        :level-keys="levelKeys"
        @add-child="$emit('add-child', $event)"
        @edit="$emit('edit', $event)"
        @remove="$emit('remove', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompanyStore } from '../../store/company.js'

const props = defineProps({
  node: { type: Object, required: true },
  levelKeys: { type: Array, default: () => [] },
})

defineEmits(['add-child', 'edit', 'remove'])

const { t } = useI18n()
const companyStore = useCompanyStore()

const children = computed(() => companyStore.getChildren(props.node.id))
</script>
