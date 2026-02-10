import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { factions } from '../data/factions.js'
import { defaultSquads } from '../data/squads.js'
import { roles } from '../data/roles.js'
import { defaultDepartments } from '../data/departments.js'
import { defaultTeams } from '../data/teams.js'
import { positions } from '../data/positions.js'
import { getSubtypes, getSubtype, getStructureLevelKeys, CORPORATE_SUBTYPES, MILITARY_SUBTYPES } from '../data/companyTypes.js'

const LS_HIERARCHY_TYPE = 'companyHierarchy'
const LS_COMPANY_SUBTYPE = 'companySubtype'
const LS_COMPANY_SETTINGS = 'companySettings'
const LS_COMPANY_STRUCTURE = 'companyStructure'
const LS_COMPANY_EMPLOYEES = 'companyEmployees'
const LS_COMPANY_NAME = 'companyName'
const LS_SCOPE_ROOT = 'companyScopeRootId'

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
    if (!raw) return getDefaultCompanySettings()
    const data = JSON.parse(raw)
    return {
      military: data.military || getDefaultCompanySettings().military,
      corporate: data.corporate || getDefaultCompanySettings().corporate,
    }
  } catch {
    return getDefaultCompanySettings()
  }
}

function getDefaultCompanySettings() {
  return {
    military: { factionKey: factions[0]?.key, squadKey: defaultSquads[0]?.key, roleKey: roles[0]?.key },
    corporate: { departmentKey: defaultDepartments[0]?.key, teamKey: defaultTeams[0]?.key, positionKey: positions[0]?.key },
  }
}

function getAllFactions() {
  let custom = []
  try { const raw = localStorage.getItem('customFactions'); if (raw) custom = JSON.parse(raw) } catch {}
  return [...factions, ...custom.filter(f => !factions.some(d => d.key === f.key))]
}
function getAllSquads() {
  let custom = []
  try { const raw = localStorage.getItem('customSquads'); if (raw) custom = JSON.parse(raw) } catch {}
  return [...defaultSquads, ...custom.filter(s => !defaultSquads.some(d => d.key === s.key))]
}
function getAllDepartments() {
  let custom = []
  try { const raw = localStorage.getItem('customDepartments'); if (raw) custom = JSON.parse(raw) } catch {}
  return [...defaultDepartments, ...custom.filter(d => !defaultDepartments.some(x => x.key === d.key))]
}
function getAllTeams() {
  let custom = []
  try { const raw = localStorage.getItem('customTeams'); if (raw) custom = JSON.parse(raw) } catch {}
  return [...defaultTeams, ...custom.filter(t => !defaultTeams.some(x => x.key === t.key))]
}

export const useCompanyStore = defineStore('company', () => {
  const hierarchyType = ref(load(LS_HIERARCHY_TYPE, 'military'))
  let loadedSubtype = load(LS_COMPANY_SUBTYPE, 'army')
  const kind = hierarchyType.value
  const subsForKind = getSubtypes(kind)
  if (!subsForKind.some(s => s.key === loadedSubtype)) loadedSubtype = subsForKind[0]?.key || 'army'
  const companySubtype = ref(loadedSubtype)
  const companySettings = ref(loadCompanySettings())
  const companyStructure = ref(load(LS_COMPANY_STRUCTURE, []))
  const companyEmployees = ref(load(LS_COMPANY_EMPLOYEES, []))
  const companyName = ref(load(LS_COMPANY_NAME, ''))
  const scopeRootId = ref(load(LS_SCOPE_ROOT, null))

  const isCorporate = computed(() => hierarchyType.value === 'corporate')
  const isMilitary = computed(() => hierarchyType.value === 'military')

  const subtypeOptions = computed(() => getSubtypes(hierarchyType.value))

  const currentSubtypeConfig = computed(() =>
    getSubtype(hierarchyType.value, companySubtype.value))

  const structureLevelKeys = computed(() =>
    currentSubtypeConfig.value ? currentSubtypeConfig.value.structureLevels : [])

  const level1Options = computed(() => {
    if (hierarchyType.value === 'corporate') return getAllDepartments()
    return getAllFactions()
  })
  const level2Options = computed(() => {
    if (hierarchyType.value === 'corporate') return getAllTeams()
    return getAllSquads()
  })
  const roleOrPositionOptions = computed(() => {
    if (hierarchyType.value === 'corporate') return positions
    return roles
  })

  const currentLevel1 = computed(() => {
    const key = hierarchyType.value === 'corporate' ? companySettings.value.corporate.departmentKey : companySettings.value.military.factionKey
    return level1Options.value.find(o => o.key === key) || level1Options.value[0]
  })
  const currentLevel2 = computed(() => {
    const key = hierarchyType.value === 'corporate' ? companySettings.value.corporate.teamKey : companySettings.value.military.squadKey
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
  }

  function setCompanySubtype(key) {
    const subs = getSubtypes(hierarchyType.value)
    if (!subs.some(s => s.key === key)) return
    companySubtype.value = key
    save(LS_COMPANY_SUBTYPE, key)
  }

  function setCompanyName(name) {
    companyName.value = name || ''
    save(LS_COMPANY_NAME, companyName.value)
  }

  function setScopeRoot(nodeId) {
    scopeRootId.value = nodeId || null
    save(LS_SCOPE_ROOT, scopeRootId.value)
  }

  function clearScopeRootIfInvalid() {
    const id = scopeRootId.value
    if (!id) return
    const exists = companyStructure.value.some(n => n.id === id)
    if (!exists) {
      scopeRootId.value = null
      save(LS_SCOPE_ROOT, null)
    }
  }

  function setMilitarySettings(payload) {
    const s = { ...companySettings.value }
    const updates = Object.fromEntries(Object.entries(payload || {}).filter(([, v]) => v != null))
    s.military = { ...s.military, ...updates }
    companySettings.value = s
    save(LS_COMPANY_SETTINGS, JSON.stringify(s))
  }

  function setCorporateSettings(payload) {
    const s = { ...companySettings.value }
    const updates = Object.fromEntries(Object.entries(payload || {}).filter(([, v]) => v != null))
    s.corporate = { ...s.corporate, ...updates }
    companySettings.value = s
    save(LS_COMPANY_SETTINGS, JSON.stringify(s))
  }

  function setLevel1(key) {
    if (hierarchyType.value === 'corporate') setCorporateSettings({ departmentKey: key })
    else setMilitarySettings({ factionKey: key })
  }
  function setLevel2(key) {
    if (hierarchyType.value === 'corporate') setCorporateSettings({ teamKey: key })
    else setMilitarySettings({ squadKey: key })
  }
  function setRoleOrPosition(key) {
    if (hierarchyType.value === 'corporate') setCorporateSettings({ positionKey: key })
    else setMilitarySettings({ roleKey: key })
  }

  function addStructureNode(parentId, levelKey, name) {
    const id = 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2)
    const maxOrder = companyStructure.value.filter(n => n.parentId === parentId).reduce((m, n) => Math.max(m, n.order ?? 0), -1)
    const node = { id, parentId: parentId ?? null, levelKey, name: name || '', order: maxOrder + 1 }
    companyStructure.value = [...companyStructure.value, node]
    save(LS_COMPANY_STRUCTURE, companyStructure.value)
    return node
  }

  function updateStructureNode(id, patch) {
    const idx = companyStructure.value.findIndex(n => n.id === id)
    if (idx === -1) return
    companyStructure.value = companyStructure.value.map((n, i) => i === idx ? { ...n, ...patch } : n)
    save(LS_COMPANY_STRUCTURE, companyStructure.value)
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
  }

  function addEmployee(emp) {
    const id = 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2)
    const employee = { id, firstName: emp.firstName || '', lastName: emp.lastName || '', email: emp.email || '', positionKey: emp.positionKey || null, roleKey: emp.roleKey || null, unitId: emp.unitId || null }
    companyEmployees.value = [...companyEmployees.value, employee]
    save(LS_COMPANY_EMPLOYEES, companyEmployees.value)
    return employee
  }

  function updateEmployee(id, patch) {
    const idx = companyEmployees.value.findIndex(e => e.id === id)
    if (idx === -1) return
    companyEmployees.value = companyEmployees.value.map((e, i) => i === idx ? { ...e, ...patch } : e)
    save(LS_COMPANY_EMPLOYEES, companyEmployees.value)
  }

  function removeEmployee(id) {
    companyEmployees.value = companyEmployees.value.filter(e => e.id !== id)
    save(LS_COMPANY_EMPLOYEES, companyEmployees.value)
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
