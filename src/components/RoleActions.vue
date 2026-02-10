<template>
  <div class="role-actions-bar">
    <div v-for="action in roleActions" :key="action.key" class="flex-shrink-0">
      <v-badge
        v-if="taskCounts[action.key] > 0"
        :content="taskCounts[action.key]"
        color="red"
        overlap
        offset-x="8"
        offset-y="8"
      >
        <v-btn color="accent" variant="tonal" :prepend-icon="action.icon" size="small">
          {{ action.title }}
        </v-btn>
      </v-badge>
      <v-btn
        v-else
        color="accent"
        variant="tonal"
        :prepend-icon="action.icon"
        size="small"
      >
        {{ action.title }}
      </v-btn>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProfileStore } from '../store/profile.js'
import { useCompanyStore } from '../store/company.js'
import { positionActions } from '../data/positions.js'
import '../styles/RoleActions.module.scss'

const { t } = useI18n()
const profileStore = useProfileStore()
const companyStore = useCompanyStore()

const actionsByRole = {
  medic: [
    { key: 'heal', titleKey: 'tasks.actions.heal', icon: 'mdi-medical-bag' },
    { key: 'evac', titleKey: 'tasks.actions.evac', icon: 'mdi-helicopter' },
  ],
  sniper: [
    { key: 'cover', titleKey: 'tasks.actions.cover', icon: 'mdi-crosshairs' },
    { key: 'eliminate', titleKey: 'tasks.actions.eliminate', icon: 'mdi-target' },
  ],
  assault: [
    { key: 'breach', titleKey: 'tasks.actions.breach', icon: 'mdi-door' },
    { key: 'storm', titleKey: 'tasks.actions.storm', icon: 'mdi-shield' },
    { key: 'suppress', titleKey: 'tasks.actions.suppress', icon: 'mdi-robot-industrial' },
  ],
  tech: [
    { key: 'repair', titleKey: 'tasks.actions.repair', icon: 'mdi-tools' },
    { key: 'deploy', titleKey: 'tasks.actions.deploy', icon: 'mdi-radar' },
  ],
  squad_leader: [
    { key: 'command', titleKey: 'tasks.actions.command', icon: 'mdi-account-group' },
    { key: 'mark', titleKey: 'tasks.actions.mark', icon: 'mdi-map-marker' },
  ],
  machine_gunner: [
    { key: 'suppress', titleKey: 'tasks.actions.suppress', icon: 'mdi-robot-industrial' },
    { key: 'cover', titleKey: 'tasks.actions.cover', icon: 'mdi-shield' },
  ],
  scout: [
    { key: 'recon', titleKey: 'tasks.actions.recon', icon: 'mdi-binoculars' },
    { key: 'mark', titleKey: 'tasks.actions.mark', icon: 'mdi-map-marker' },
  ],
  grenadier: [
    { key: 'blast', titleKey: 'tasks.actions.blast', icon: 'mdi-bomb' },
    { key: 'smoke', titleKey: 'tasks.actions.smoke', icon: 'mdi-smoke' },
  ],
}

const roleActions = computed(() => {
  if (companyStore.isCorporate) {
    const pos = companyStore.currentRoleOrPosition
    if (!pos || !pos.actions || !pos.actions.length) return []
    return pos.actions.map(key => ({
      key,
      title: t('tasks.actions.' + key) || key,
      icon: positionActions[key]?.icon || 'mdi-circle-small',
    }))
  }
  const role = companyStore.currentRoleOrPosition?.key || profileStore.user.role?.key
  const list = actionsByRole[role] || []
  return list.map(a => ({ ...a, title: t(a.titleKey) || a.key }))
})

// Пример структуры задач (taskCounts): ключ — тип действия, значение — количество задач
const taskCounts = ref({
  heal: 0,
  evac: 0,
  cover: 0,
  eliminate: 0,
  breach: 0,
  storm: 0,
  suppress: 0,
  repair: 0,
  deploy: 0,
  command: 0,
  mark: 0,
  recon: 0,
  blast: 0,
  smoke: 0,
})
</script>
