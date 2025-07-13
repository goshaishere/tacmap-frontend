<template>
  <div class="role-actions">
    <div v-for="action in roleActions" :key="action.key" class="action-btn-wrapper">
      <v-badge
        v-if="taskCounts[action.key] > 0"
        :content="taskCounts[action.key]"
        color="red"
        overlap
        offset-x="8"
        offset-y="8"
      >
        <v-btn color="accent" variant="tonal" :prepend-icon="action.icon" class="v-btn">
          {{ action.title }}
        </v-btn>
      </v-badge>
      <v-btn
        v-else
        color="accent"
        variant="tonal"
        :prepend-icon="action.icon"
        class="v-btn"
      >
        {{ action.title }}
      </v-btn>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useProfileStore } from '../store/profile.js'

const profileStore = useProfileStore()

const actionsByRole = {
  medic: [
    { key: 'heal', title: 'Оказать помощь', icon: 'mdi-medical-bag' },
    { key: 'evac', title: 'Эвакуировать', icon: 'mdi-helicopter' },
  ],
  sniper: [
    { key: 'cover', title: 'Прикрыть', icon: 'mdi-crosshairs' },
    { key: 'eliminate', title: 'Устранить цель', icon: 'mdi-target' },
  ],
  assault: [
    { key: 'breach', title: 'Взломать', icon: 'mdi-door' },
    { key: 'storm', title: 'Штурмовать', icon: 'mdi-shield' },
    { key: 'suppress', title: 'Подавить', icon: 'mdi-robot-industrial' },
  ],
  tech: [
    { key: 'repair', title: 'Починить', icon: 'mdi-tools' },
    { key: 'deploy', title: 'Развернуть оборудование', icon: 'mdi-radar' },
  ],
  squad_leader: [
    { key: 'command', title: 'Отдать приказ', icon: 'mdi-account-group' },
    { key: 'mark', title: 'Отметить цель', icon: 'mdi-map-marker' },
  ],
  machine_gunner: [
    { key: 'suppress', title: 'Подавить', icon: 'mdi-robot-industrial' },
    { key: 'cover', title: 'Прикрыть', icon: 'mdi-shield' },
  ],
  scout: [
    { key: 'recon', title: 'Разведать', icon: 'mdi-binoculars' },
    { key: 'mark', title: 'Отметить цель', icon: 'mdi-map-marker' },
  ],
  grenadier: [
    { key: 'blast', title: 'Взорвать', icon: 'mdi-bomb' },
    { key: 'smoke', title: 'Дымовая завеса', icon: 'mdi-smoke' },
  ],
}

const roleActions = computed(() => {
  const role = profileStore.user.role?.key
  return actionsByRole[role] || []
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
<style scoped>
.role-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.action-btn-wrapper {
  flex: 0 0 auto;
  margin: 0;
}
@media (max-width: 600px) {
  .role-actions {
    gap: 4px;
    padding: 0 4px;
  }
  .v-btn {
    font-size: 10px !important;
    min-width: 0 !important;
    padding: 6px 8px !important;
    height: 26px !important;
    white-space: nowrap;
  }
  .v-btn .v-icon {
    font-size: 16px !important;
  }
}
</style>
