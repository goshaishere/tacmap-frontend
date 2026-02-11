/**
 * Схема данных приложения — единый источник истины для формата JSON.
 * Используется для localStorage; при переходе на MongoDB те же формы можно использовать в коллекциях.
 */

/** Узел структуры организации */
export const STRUCTURE_NODE = {
  id: '',           // string, уникальный (например n_123_abc)
  parentId: null,   // string | null, id родителя или null для корня
  levelKey: '',     // ключ уровня из companyTypes (division, department, team, ...)
  name: '',         // название (можно сгенерировать из levelKey или ввести вручную)
  icon: '',         // опционально, иконка MDI (mdi-folder-outline, mdi-shield, ...)
  order: 0,         // число для сортировки среди соседей
}

/** Сотрудник */
export const EMPLOYEE = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  positionKey: null,  // для corporate
  roleKey: null,      // для military
  unitId: null,       // id узла структуры (подразделения)
}

/** Настройки военного режима */
export const MILITARY_SETTINGS = {
  factionKey: null,      // ключ из списка частей (fallback, если нет структуры)
  squadKey: null,        // ключ из списка подразделений (fallback)
  roleKey: null,
  level1NodeId: null,     // id узла структуры — уровень выше по иерархии
  level2NodeId: null,     // id узла структуры — уровень ниже (моё подразделение)
}

/** Настройки корпоративного режима */
export const CORPORATE_SETTINGS = {
  departmentKey: null,
  teamKey: null,
  positionKey: null,
  level1NodeId: null,
  level2NodeId: null,
}

/** Полный снимок данных организации (companyData) — то, что сохраняется в localStorage / БД */
export function getDefaultCompanyDataShape() {
  return {
    type: 'corporate',
    subtype: 'classic',
    scopeRootId: null,
    name: '',
    structure: [],
    employees: [],
    settings: {
      military: { factionKey: null, squadKey: null, roleKey: null, level1NodeId: null, level2NodeId: null },
      corporate: { departmentKey: null, teamKey: null, positionKey: null, level1NodeId: null, level2NodeId: null },
    },
  }
}

/** Проверка, что id похож на id узла структуры */
export function isStructureNodeId(id) {
  return typeof id === 'string' && (id.startsWith('n_') || id.length > 10)
}
