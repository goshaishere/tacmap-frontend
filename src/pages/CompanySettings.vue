<template>
  <div class="page-container">
    <v-container fluid class="pa-0 pa-md-4">
      <v-row>
        <v-col cols="12">
          <div class="text-h4 text-on-surface d-flex align-center mb-4">
            <v-icon class="me-3" color="accent">mdi-sitemap</v-icon>
            {{ t('company.title') }}
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="companyStore.companyName"
            @update:model-value="companyStore.setCompanyName"
            :label="t('company.name')"
            variant="outlined"
            hide-details
            class="mb-4"
          />
        </v-col>
      </v-row>

      <v-tabs v-model="activeTab" color="accent" class="mb-4">
        <v-tab value="structure">{{ t('company.structure') }}</v-tab>
        <v-tab value="employees">{{ t('company.employees') }}</v-tab>
        <v-tab value="assignments">{{ t('company.assignments') }}</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Структура -->
        <v-window-item value="structure">
          <v-card class="pa-4">
            <div class="d-flex align-center justify-space-between mb-4">
              <span class="text-h6">{{ t('company.structure') }}</span>
              <v-btn
                color="accent"
                variant="flat"
                size="small"
                :disabled="!canAddRoot"
                @click="openAddUnitDialog(companyStore.effectiveRootParentForAdd)"
              >
                {{ t('company.addUnit') }}
              </v-btn>
            </div>
            <div v-if="companyStore.effectiveStructureRoots.length === 0" class="text-body-2 text-medium-emphasis py-8 text-center">
              {{ t('company.noStructure') }}
              <v-btn color="accent" variant="outlined" size="small" class="mt-2" @click="openAddUnitDialog(companyStore.effectiveRootParentForAdd)">
                {{ t('company.addUnit') }}
              </v-btn>
            </div>
            <div v-else class="structure-tree">
              <StructureNode
                v-for="node in companyStore.effectiveStructureRoots"
                :key="node.id"
                :node="node"
                :level-keys="companyStore.structureLevelKeys"
                @add-child="openAddUnitDialog"
                @edit="openEditUnitDialog"
                @remove="confirmRemoveUnit"
              />
            </div>
          </v-card>
        </v-window-item>

        <!-- Сотрудники -->
        <v-window-item value="employees">
          <v-card class="pa-4">
            <div class="d-flex align-center justify-space-between mb-4">
              <span class="text-h6">{{ t('company.employees') }}</span>
              <v-btn color="accent" variant="flat" size="small" @click="openAddEmployeeDialog">
                {{ t('company.addEmployee') }}
              </v-btn>
            </div>
            <div v-if="companyStore.companyEmployees.length === 0" class="text-body-2 text-medium-emphasis py-8 text-center">
              {{ t('company.noEmployees') }}
            </div>
            <v-list v-else>
              <v-list-item
                v-for="emp in companyStore.companyEmployees"
                :key="emp.id"
                class="px-0"
              >
                <template #prepend>
                  <v-avatar size="36" color="surface-variant">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ emp.firstName }} {{ emp.lastName }}</v-list-item-title>
                <v-list-item-subtitle>{{ emp.email || (getRoleOrPositionLabel(emp)) }}</v-list-item-subtitle>
                <template #append>
                  <v-btn icon variant="text" size="small" @click="openEditEmployeeDialog(emp)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" size="small" color="error" @click="confirmRemoveEmployee(emp)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-window-item>

        <!-- Назначения -->
        <v-window-item value="assignments">
          <v-card class="pa-4">
            <div class="text-h6 mb-4">{{ t('company.assignments') }}</div>
            <p class="text-body-2 text-medium-emphasis mb-4">{{ t('company.assignToUnit') }}</p>
            <v-list>
              <v-list-item
                v-for="emp in companyStore.companyEmployees"
                :key="emp.id"
                class="px-0"
              >
                <v-list-item-title>{{ emp.firstName }} {{ emp.lastName }}</v-list-item-title>
                <v-select
                  :model-value="emp.unitId"
                  @update:model-value="(v) => companyStore.assignEmployeeToUnit(emp.id, v)"
                  :items="unitOptions"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  hide-details
                  :label="t('company.selectUnit')"
                  class="mt-2"
                />
              </v-list-item>
            </v-list>
          </v-card>
        </v-window-item>
      </v-window>

      <!-- Диалог добавления/редактирования подразделения -->
      <v-dialog v-model="unitDialog" max-width="440" persistent>
        <v-card>
          <v-card-title>{{ editingUnit ? t('company.editUnit') : t('company.addUnit') }}</v-card-title>
          <v-card-text>
            <v-select
              v-model="newUnitLevelKey"
              :items="levelKeyOptions"
              :item-title="(item) => t('company.structureLevels.' + item.value)"
              item-value="value"
              :label="t('company.unitType')"
              variant="outlined"
              class="mb-3"
              :disabled="!!editingUnit"
            />
            <v-select
              v-model="newUnitIcon"
              :items="structureIconOptions"
              item-title="title"
              item-value="icon"
              :label="t('company.unitIcon')"
              variant="outlined"
              class="mb-3"
              :item-props="item => ({ prependIcon: item.raw?.icon })"
            >
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-icon class="me-2">{{ item?.raw?.icon || item?.icon }}</v-icon>
                  </template>
                  {{ item?.raw?.title ?? item?.title }}
                </v-list-item>
              </template>
              <template #selection="{ item }">
                <v-icon class="me-2" size="small">{{ item?.raw?.icon || item?.icon }}</v-icon>
                {{ item?.raw?.title ?? item?.title }}
              </template>
            </v-select>
            <div class="d-flex align-center gap-2 mb-3">
              <v-text-field
                v-model="newUnitName"
                :label="t('company.unitName')"
                variant="outlined"
                hide-details
                class="flex-grow-1"
              />
              <v-btn
                variant="outlined"
                size="small"
                :disabled="!newUnitLevelKey"
                @click="generateUnitNameFromType"
              >
                {{ t('company.generateFromType') }}
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="unitDialog = false">{{ t('common.cancel') }}</v-btn>
            <v-btn color="accent" variant="flat" @click="saveUnit">{{ t('common.save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог добавления/редактирования сотрудника -->
      <v-dialog v-model="employeeDialog" max-width="500" persistent>
        <v-card>
          <v-card-title>{{ editingEmployee ? t('company.editUnit') : t('company.addEmployee') }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="newEmployee.firstName" :label="t('company.firstName')" variant="outlined" class="mb-2" />
            <v-text-field v-model="newEmployee.lastName" :label="t('company.lastName')" variant="outlined" class="mb-2" />
            <v-text-field v-model="newEmployee.email" :label="t('company.email')" variant="outlined" class="mb-2" />
            <v-select
              v-if="companyStore.isCorporate"
              v-model="newEmployee.positionKey"
              :items="companyStore.roleOrPositionOptions"
              item-title="title"
              item-value="key"
              :label="t('company.position')"
              variant="outlined"
              class="mb-2"
            />
            <v-select
              v-else
              v-model="newEmployee.roleKey"
              :items="companyStore.roleOrPositionOptions"
              item-title="title"
              item-value="key"
              :label="t('company.role')"
              variant="outlined"
              class="mb-2"
            />
            <v-select
              v-model="newEmployee.unitId"
              :items="unitOptions"
              item-title="name"
              item-value="id"
              :label="t('company.selectUnit')"
              variant="outlined"
              clearable
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="employeeDialog = false">{{ t('common.cancel') }}</v-btn>
            <v-btn color="accent" variant="flat" @click="saveEmployee">{{ t('common.save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="confirmRemoveDialog" max-width="400" persistent>
        <v-card>
          <v-card-title>{{ t('common.confirm') }}</v-card-title>
          <v-card-text>{{ removeConfirmText }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="confirmRemoveDialog = false">{{ t('common.cancel') }}</v-btn>
            <v-btn color="error" variant="flat" @click="doRemove">{{ t('common.delete') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompanyStore } from '../store/company.js'
import { STRUCTURE_ICON_OPTIONS } from '../data/structureIcons.js'
import StructureNode from '../components/company/StructureNode.vue'

const { t } = useI18n()
const companyStore = useCompanyStore()

const activeTab = ref('structure')
const unitDialog = ref(false)
const employeeDialog = ref(false)
const confirmRemoveDialog = ref(false)
const parentIdForAdd = ref(null)
const editingUnit = ref(null)
const editingEmployee = ref(null)
const newUnitName = ref('')
const newUnitLevelKey = ref('')
const newUnitIcon = ref('mdi-folder-outline')
const structureIconOptions = STRUCTURE_ICON_OPTIONS
const newEmployee = ref({ firstName: '', lastName: '', email: '', positionKey: null, roleKey: null, unitId: null })
const removeConfirmText = ref('')
const removeTarget = ref(null)
const removeType = ref('') // 'unit' | 'employee'

const canAddRoot = computed(() => companyStore.structureLevelKeys.length > 0)

const levelKeyOptions = computed(() =>
  companyStore.structureLevelKeys.map(k => ({ value: k, title: t('company.structureLevels.' + k) }))
)

function flatUnits(nodes, level = 0) {
  let out = []
  for (const n of nodes) {
    out.push({ id: n.id, name: '—'.repeat(level) + ' ' + (n.name || t('company.structureLevels.' + n.levelKey)) })
    const children = companyStore.getChildren(n.id)
    if (children.length) out = out.concat(flatUnits(children, level + 1))
  }
  return out
}

const unitOptions = computed(() => {
  const roots = companyStore.effectiveStructureRoots
  return [{ id: null, name: '—' }, ...flatUnits(roots)]
})

function openAddUnitDialog(parentId) {
  parentIdForAdd.value = parentId
  editingUnit.value = null
  newUnitName.value = ''
  newUnitLevelKey.value = companyStore.structureLevelKeys[0] || ''
  newUnitIcon.value = 'mdi-folder-outline'
  unitDialog.value = true
}

function openEditUnitDialog(node) {
  editingUnit.value = node
  parentIdForAdd.value = null
  newUnitName.value = node.name || ''
  newUnitLevelKey.value = node.levelKey
  newUnitIcon.value = node.icon || 'mdi-folder-outline'
  unitDialog.value = true
}

function generateUnitNameFromType() {
  if (newUnitLevelKey.value) newUnitName.value = t('company.structureLevels.' + newUnitLevelKey.value)
}

function saveUnit() {
  if (editingUnit.value) {
    companyStore.updateStructureNode(editingUnit.value.id, { name: newUnitName.value, icon: newUnitIcon.value })
  } else {
    companyStore.addStructureNode(parentIdForAdd.value, newUnitLevelKey.value, newUnitName.value, newUnitIcon.value)
  }
  unitDialog.value = false
}

function confirmRemoveUnit(node) {
  removeTarget.value = node
  removeType.value = 'unit'
  removeConfirmText.value = t('company.removeUnit') + ': ' + (node.name || '') + '?'
  confirmRemoveDialog.value = true
}

function openAddEmployeeDialog() {
  editingEmployee.value = null
  newEmployee.value = { firstName: '', lastName: '', email: '', positionKey: companyStore.roleOrPositionOptions[0]?.key, roleKey: companyStore.roleOrPositionOptions[0]?.key, unitId: null }
  employeeDialog.value = true
}

function openEditEmployeeDialog(emp) {
  editingEmployee.value = emp
  newEmployee.value = { ...emp }
  employeeDialog.value = true
}

function saveEmployee() {
  if (editingEmployee.value) {
    companyStore.updateEmployee(editingEmployee.value.id, newEmployee.value)
  } else {
    companyStore.addEmployee(newEmployee.value)
  }
  employeeDialog.value = false
}

function confirmRemoveEmployee(emp) {
  removeTarget.value = emp
  removeType.value = 'employee'
  removeConfirmText.value = (emp.firstName + ' ' + emp.lastName).trim() + '?'
  confirmRemoveDialog.value = true
}

function getRoleOrPositionLabel(emp) {
  const key = companyStore.isCorporate ? emp.positionKey : emp.roleKey
  const opt = companyStore.roleOrPositionOptions.find(o => o.key === key)
  return (companyStore.isCorporate ? t('profile.position') : t('profile.role')) + ': ' + (opt?.title || key || '—')
}

function doRemove() {
  if (removeType.value === 'unit' && removeTarget.value) {
    companyStore.removeStructureNode(removeTarget.value.id)
  } else if (removeType.value === 'employee' && removeTarget.value) {
    companyStore.removeEmployee(removeTarget.value.id)
  }
  confirmRemoveDialog.value = false
  removeTarget.value = null
}

watch(() => companyStore.structureLevelKeys, (keys) => {
  if (keys.length && !newUnitLevelKey.value) newUnitLevelKey.value = keys[0]
}, { immediate: true })
</script>
