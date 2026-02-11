import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { factions } from '../data/factions.js'
import { defaultSquads } from '../data/squads.js'
import { roles } from '../data/roles.js'
import { defaultDepartments } from '../data/departments.js'
import { defaultTeams } from '../data/teams.js'
import { positions } from '../data/positions.js'
import { getSubtypes, getSubtype, getStructureLevelKeys, CORPORATE_SUBTYPES, MILITARY_SUBTYPES } from '../data/companyTypes.js'

const LS_COMPANY_DATA = 'companyData'
const LS_HIERARCHY_TYPE = 'companyHierarchy'
const LS_COMPANY_SUBTYPE = 'companySubtype'
const LS_COMPANY_SETTINGS = 'companySettings'
const LS_COMPANY_STRUCTURE = 'companyStructure'
const LS_COMPANY_EMPLOYEES = 'companyEmployees'
const LS_COMPANY_NAME = 'companyName'
const LS_SCOPE_ROOT = 'companyScopeRootId'

/** Типовой JSON структуры организации для сохранения/загрузки */
export function buildCompanyData(type, subtype, scopeRootId, name, structure, employees, settings) {
  return {
    type: type || 'corporate',
    subtype: subtype || 'classic',
    scopeRootId: scopeRootId ?? null,
    name: name || '',
    structure: Array.isArray(structure) ? structure : [],
    employees: Array.isArray(employees) ? employees : [],
    settings: settings || { military: {}, corporate: {} },
  }
}

function load(key, def) {
  try {
    const v = localStorage.getItem(key)
    return v != null ? (key === LS_COMPANY_STRUCTURE || key === LS_COMPANY_EMPLOYEES ? JSON.parse(v) : v) : def
  } catch {
    return def
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
  } catch {}
}

function loadCompanySettings() {
  try {
    const raw = localStorage.getItem(LS_COMPANY_SETTINGS)
    const def = getDefaultCompanySettings()
    if (!raw) return def
    const data = JSON.parse(raw)
    return {
      military: { ...def.military, ...(data.military || {}) },
      corporate: { ...def.corporate, ...(data.corporate || {}) },
    }
  } catch {
    return getDefaultCompanySettings()
  }
}

function persistCompanyData(state) {
  const data = buildCompanyData(
    state.hierarchyType,
    state.companySubtype,
    state.scopeRootId,
    state.companyName,
    state.companyStructure,
    state.companyEmployees,
    state.companySettings
  )
  save(LS_COMPANY_DATA, data)
}

function getDefaultCompanySettings() {
  return {
    military: {
      factionKey: factions[0]?.key,
      squadKey: defaultSquads[0]?.key,
      roleKey: roles[0]?.key,
      level1NodeId: null,
      level2NodeId: null,
    },
    corporate: {
      departmentKey: defaultDepartments[0]?.key,
      teamKey: defaultTeams[0]?.key,
      positionKey: positions[0]?.key,
      level1NodeId: null,
      level2NodeId: null,
    },
  }
}

const LS_CUSTOM_FACTIONS = 'customFactions'
const LS_CUSTOM_SQUADS = 'customSquads'
const LS_CUSTOM_DEPARTMENTS = 'customDepartments'
const LS_CUSTOM_TEAMS = 'customTeams'

function loadCustomFactions() {
  try { const raw = localStorage.getItem(LS_CUSTOM_FACTIONS); return raw ? JSON.parse(raw) : [] } catch { return [] }
}
function loadCustomSquads() {
  try { const raw = localStorage.getItem(LS_CUSTOM_SQUADS); return raw ? JSON.parse(raw) : [] } catch { return [] }
}
function loadCustomDepartments() {
  try { const raw = localStorage.getItem(LS_CUSTOM_DEPARTMENTS); return raw ? JSON.parse(raw) : [] } catch { return [] }
}
function loadCustomTeams() {
  try { const raw = localStorage.getItem(LS_CUSTOM_TEAMS); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

function loadFromCompanyData() {
  try {
    const raw = localStorage.getItem(LS_COMPANY_DATA)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    return data
  } catch {
    return null
  }
}

export const useCompanyStore = defineStore('company', () => {
  const fromData = loadFromCompanyData()
  const defaults = getDefaultCompanySettings()

  const hierarchyType = ref(fromData ? fromData.type : load(LS_HIERARCHY_TYPE, 'military'))
  let loadedSubtype = fromData ? fromData.subtype : load(LS_COMPANY_SUBTYPE, 'army')
  const kind = hierarchyType.value
  const subsForKind = getSubtypes(kind)
  if (!subsForKind.some(s => s.key === loadedSubtype)) loadedSubtype = subsForKind[0]?.key || (kind === 'military' ? 'army' : 'classic')
  const companySubtype = ref(loadedSubtype)
  const companySettings = ref(fromData?.settings ? { military: { ...defaults.military, ...fromData.settings.military }, corporate: { ...defaults.corporate, ...fromData.settings.corporate } } : loadCompanySettings())
  const companyStructure = ref(Array.isArray(fromData?.structure) ? fromData.structure : load(LS_COMPANY_STRUCTURE, []))
  const companyEmployees = ref(Array.isArray(fromData?.employees) ? fromData.employees : load(LS_COMPANY_EMPLOYEES, []))
  const companyName = ref(fromData?.name ?? load(LS_COMPANY_NAME, ''))
  const scopeRootId = ref(fromData?.scopeRootId !== undefined ? fromData.scopeRootId : load(LS_SCOPE_ROOT, null))

  const customFactions = ref(loadCustomFactions())
  const customSquads = ref(loadCustomSquads())
  const customDepartments = ref(loadCustomDepartments())
  const customTeams = ref(loadCustomTeams())

  function refreshCustomLists() {
    customFactions.value = loadCustomFactions()
    customSquads.value = loadCustomSquads()
    customDepartments.value = loadCustomDepartments()
    customTeams.value = loadCustomTeams()
  }

  function persist() {
    persistCompanyData({
      hierarchyType: hierarchyType.value,
      companySubtype: companySubtype.value,
      companySettings: companySettings.value,
      companyStructure: companyStructure.value,
      companyEmployees: companyEmployees.value,
      companyName: companyName.value,
      scopeRootId: scopeRootId.value,
    })
  }

  const isCorporate = computed(() => hierarchyType.value === 'corporate')
  const isMilitary = computed(() => hierarchyType.value === 'military')

  const subtypeOptions = computed(() => getSubtypes(hierarchyType.value))

  const currentSubtypeConfig = computed(() =>
    getSubtype(hierarchyType.value, companySubtype.value))

  const structureLevelKeys = computed(() =>
    currentSubtypeConfig.value ? currentSubtypeConfig.value.structureLevels : [])

  // Узлы структуры на уровне levelIndex (0 = первый уровень иерархии, 1 = второй)
  function structureNodesAtLevel(levelIndex) {
    const keys = structureLevelKeys.value
    const levelKey = keys[levelIndex]
    if (!levelKey) return []
    return companyStructure.value
      .filter(n => n.levelKey === levelKey)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  const level1Options = computed(() => {
    const nodes = structureNodesAtLevel(0)
    if (nodes.length > 0) {
      return nodes.map(n => ({
        key: n.id,
        title: n.name || n.levelKey,
        icon: n.icon || 'mdi-folder-outline',
      }))
    }
    if (hierarchyType.value === 'corporate') {
      return [...defaultDepartments, ...customDepartments.value.filter(d => !defaultDepartments.some(x => x.key === d.key))]
    }
    return [...factions, ...customFactions.value.filter(f => !factions.some(d => d.key === f.key))]
  })
  const level2Options = computed(() => {
    const level1Id = hierarchyType.value === 'corporate'
      ? companySettings.value.corporate.level1NodeId
      : companySettings.value.military.level1NodeId
    const nodes = structureNodesAtLevel(1)
    let list = nodes
    if (level1Id && nodes.length > 0) {
      const asChild = nodes.filter(n => n.parentId === level1Id)
      if (asChild.length > 0) list = asChild
    }
    if (list.length > 0) {
      return list.map(n => ({
        key: n.id,
        title: n.name || n.levelKey,
        icon: n.icon || 'mdi-folder-outline',
      }))
    }
    if (hierarchyType.value === 'corporate') {
      return [...defaultTeams, ...customTeams.value.filter(t => !defaultTeams.some(x => x.key === t.key))]
    }
    return [...defaultSquads, ...customSquads.value.filter(s => !defaultSquads.some(d => d.key === s.key))]
  })
  const roleOrPositionOptions = computed(() => {
    if (hierarchyType.value === 'corporate') return positions
    return roles
  })

  const currentLevel1 = computed(() => {
    const st = hierarchyType.value === 'corporate' ? companySettings.value.corporate : companySettings.value.military
    const nodeId = st.level1NodeId
    if (nodeId) {
      const node = companyStructure.value.find(n => n.id === nodeId)
      if (node) return { key: node.id, title: node.name || node.levelKey, icon: node.icon || 'mdi-folder-outline' }
    }
    const key = hierarchyType.value === 'corporate' ? st.departmentKey : st.factionKey
    return level1Options.value.find(o => o.key === key) || level1Options.value[0]
  })
  const currentLevel2 = computed(() => {
    const st = hierarchyType.value === 'corporate' ? companySettings.value.corporate : companySettings.value.military
    const nodeId = st.level2NodeId
    if (nodeId) {
      const node = companyStructure.value.find(n => n.id === nodeId)
      if (node) return { key: node.id, title: node.name || node.levelKey, icon: node.icon || 'mdi-folder-outline' }
    }
    const key = hierarchyType.value === 'corporate' ? st.teamKey : st.squadKey
    return level2Options.value.find(o => o.key === key) || level2Options.value[0]
  })
  const currentRoleOrPosition = computed(() => {
    const key = hierarchyType.value === 'corporate' ? companySettings.value.corporate.positionKey : companySettings.value.military.roleKey
    return roleOrPositionOptions.value.find(o => o.key === key) || roleOrPositionOptions.value[0]
  })

  const structureTree = computed(() => {
    const list = companyStructure.value
    const byParent = {}
    list.forEach(node => {
      const pid = node.parentId ?? null
      if (!byParent[pid]) byParent[pid] = []
      byParent[pid].push({ ...node })
    })
    Object.values(byParent).forEach(arr => arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    return byParent
  })

  const structureRoots = computed(() => (companyStructure.value.filter(n => n.parentId == null).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))))

  // Точка входа в иерархию: null = вся организация, иначе — подразделение, с которого начинается «наш» контур
  const effectiveStructureRoots = computed(() => {
    const id = scopeRootId.value
    if (!id) return structureRoots.value
    const node = companyStructure.value.find(n => n.id === id)
    return node ? [node] : structureRoots.value
  })

  // Родитель для добавления узла «на верхнем уровне» текущего контура
  const effectiveRootParentForAdd = computed(() => scopeRootId.value ?? null)

  // Плоский список всех узлов для выбора точки входа (id, name, levelKey, depth)
  function buildFlatNodesForScopePicker(parentId = null, depth = 0) {
    const children = companyStructure.value.filter(n => n.parentId === parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    let out = []
    children.forEach(n => {
      out.push({ id: n.id, name: n.name || '', levelKey: n.levelKey, depth, node: n })
      out = out.concat(buildFlatNodesForScopePicker(n.id, depth + 1))
    })
    return out
  }

  const scopePickerOptions = computed(() => buildFlatNodesForScopePicker())

  function setHierarchyType(type) {
    if (type !== 'military' && type !== 'corporate') return
    hierarchyType.value = type
    save(LS_HIERARCHY_TYPE, type)
    const subs = getSubtypes(type)
    const firstKey = subs[0]?.key
    if (firstKey) {
      companySubtype.value = firstKey
      save(LS_COMPANY_SUBTYPE, firstKey)
    }
    persist()
  }

  function setCompanySubtype(key) {
    const subs = getSubtypes(hierarchyType.value)
    if (!subs.some(s => s.key === key)) return
    companySubtype.value = key
    save(LS_COMPANY_SUBTYPE, key)
    persist()
  }

  function setCompanyName(name) {
    companyName.value = name || ''
    save(LS_COMPANY_NAME, companyName.value)
    persist()
  }

  function setScopeRoot(nodeId) {
    scopeRootId.value = nodeId || null
    save(LS_SCOPE_ROOT, scopeRootId.value)
    persist()
  }

  function clearScopeRootIfInvalid() {
    const id = scopeRootId.value
    if (!id) return
    const exists = companyStructure.value.some(n => n.id === id)
    if (!exists) {
      scopeRootId.value = null
      save(LS_SCOPE_ROOT, null)
      persist()
    }
  }

  function setMilitarySettings(payload) {
    const s = { ...companySettings.value }
    const updates = Object.fromEntries(Object.entries(payload || {}).filter(([, v]) => v !== undefined))
    s.military = { ...s.military, ...updates }
    companySettings.value = s
    save(LS_COMPANY_SETTINGS, JSON.stringify(s))
    persist()
  }

  function setCorporateSettings(payload) {
    const s = { ...companySettings.value }
    const updates = Object.fromEntries(Object.entries(payload || {}).filter(([, v]) => v !== undefined))
    s.corporate = { ...s.corporate, ...updates }
    companySettings.value = s
    save(LS_COMPANY_SETTINGS, JSON.stringify(s))
    persist()
  }

  function setLevel1(key) {
    const isNode = companyStructure.value.some(n => n.id === key)
    if (hierarchyType.value === 'corporate') {
      setCorporateSettings(isNode ? { level1NodeId: key, departmentKey: null } : { level1NodeId: null, departmentKey: key })
    } else {
      setMilitarySettings(isNode ? { level1NodeId: key, factionKey: null } : { level1NodeId: null, factionKey: key })
    }
  }
  function setLevel2(key) {
    const isNode = companyStructure.value.some(n => n.id === key)
    if (hierarchyType.value === 'corporate') {
      setCorporateSettings(isNode ? { level2NodeId: key, teamKey: null } : { level2NodeId: null, teamKey: key })
    } else {
      setMilitarySettings(isNode ? { level2NodeId: key, squadKey: null } : { level2NodeId: null, squadKey: key })
    }
  }
  function setRoleOrPosition(key) {
    if (hierarchyType.value === 'corporate') setCorporateSettings({ positionKey: key })
    else setMilitarySettings({ roleKey: key })
  }

  function addStructureNode(parentId, levelKey, name, icon = '') {
    const id = 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2)
    const maxOrder = companyStructure.value.filter(n => n.parentId === parentId).reduce((m, n) => Math.max(m, n.order ?? 0), -1)
    const node = { id, parentId: parentId ?? null, levelKey, name: name || '', icon: icon || '', order: maxOrder + 1 }
    companyStructure.value = [...companyStructure.value, node]
    save(LS_COMPANY_STRUCTURE, companyStructure.value)
    persist()
    return node
  }

  function updateStructureNode(id, patch) {
    const idx = companyStructure.value.findIndex(n => n.id === id)
    if (idx === -1) return
    companyStructure.value = companyStructure.value.map((n, i) => i === idx ? { ...n, ...patch } : n)
    save(LS_COMPANY_STRUCTURE, companyStructure.value)
    persist()
  }

  function removeStructureNode(id) {
    const toRemove = new Set([id])
    const collectDescendants = (pid) => {
      companyStructure.value.filter(n => n.parentId === pid).forEach(n => {
        toRemove.add(n.id)
        collectDescendants(n.id)
      })
    }
    collectDescendants(id)
    if (toRemove.has(scopeRootId.value)) {
      scopeRootId.value = null
      save(LS_SCOPE_ROOT, null)
    }
    companyStructure.value = companyStructure.value.filter(n => !toRemove.has(n.id))
    companyEmployees.value = companyEmployees.value.map(e => toRemove.has(e.unitId) ? { ...e, unitId: null } : e)
    save(LS_COMPANY_STRUCTURE, companyStructure.value)
    save(LS_COMPANY_EMPLOYEES, companyEmployees.value)
    persist()
  }

  function addEmployee(emp) {
    const id = 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2)
    const employee = { id, firstName: emp.firstName || '', lastName: emp.lastName || '', email: emp.email || '', positionKey: emp.positionKey || null, roleKey: emp.roleKey || null, unitId: emp.unitId || null }
    companyEmployees.value = [...companyEmployees.value, employee]
    save(LS_COMPANY_EMPLOYEES, companyEmployees.value)
    persist()
    return employee
  }

  function updateEmployee(id, patch) {
    const idx = companyEmployees.value.findIndex(e => e.id === id)
    if (idx === -1) return
    companyEmployees.value = companyEmployees.value.map((e, i) => i === idx ? { ...e, ...patch } : e)
    save(LS_COMPANY_EMPLOYEES, companyEmployees.value)
    persist()
  }

  function removeEmployee(id) {
    companyEmployees.value = companyEmployees.value.filter(e => e.id !== id)
    save(LS_COMPANY_EMPLOYEES, companyEmployees.value)
    persist()
  }

  function assignEmployeeToUnit(employeeId, unitId) {
    updateEmployee(employeeId, { unitId })
  }

  function getEmployeesByUnit(unitId) {
    return companyEmployees.value.filter(e => e.unitId === unitId)
  }

  function getNodeById(nodeId) {
    return companyStructure.value.find(n => n.id === nodeId)
  }

  function getChildren(nodeId) {
    return companyStructure.value.filter(n => n.parentId === nodeId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  return {
    hierarchyType,
    companySubtype,
    companySettings,
    companyStructure,
    companyEmployees,
    companyName,
    scopeRootId,
    isCorporate,
    isMilitary,
    subtypeOptions,
    currentSubtypeConfig,
    structureLevelKeys,
    structureTree,
    structureRoots,
    effectiveStructureRoots,
    effectiveRootParentForAdd,
    scopePickerOptions,
    level1Options,
    level2Options,
    roleOrPositionOptions,
    currentLevel1,
    currentLevel2,
    currentRoleOrPosition,
    refreshCustomLists,
    setHierarchyType,
    setCompanySubtype,
    setCompanyName,
    setScopeRoot,
    clearScopeRootIfInvalid,
    setMilitarySettings,
    setCorporateSettings,
    setLevel1,
    setLevel2,
    setRoleOrPosition,
    addStructureNode,
    updateStructureNode,
    removeStructureNode,
    addEmployee,
    updateEmployee,
    removeEmployee,
    assignEmployeeToUnit,
    getEmployeesByUnit,
    getNodeById,
    getChildren,
  }
})
