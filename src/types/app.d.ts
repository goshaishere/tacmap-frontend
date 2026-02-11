/**
 * Типы данных приложения — единый источник истины для TypeScript/IDE.
 * Соответствуют схеме в src/data/schema.js и данным в localStorage (в дальнейшем — MongoDB).
 */

export interface StructureNode {
  id: string
  parentId: string | null
  levelKey: string
  name: string
  icon?: string
  order: number
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  positionKey: string | null
  roleKey: string | null
  unitId: string | null
}

export interface MilitarySettings {
  factionKey: string | null
  squadKey: string | null
  roleKey: string | null
  level1NodeId: string | null
  level2NodeId: string | null
}

export interface CorporateSettings {
  departmentKey: string | null
  teamKey: string | null
  positionKey: string | null
  level1NodeId: string | null
  level2NodeId: string | null
}

export interface CompanyData {
  type: 'corporate' | 'military'
  subtype: string
  scopeRootId: string | null
  name: string
  structure: StructureNode[]
  employees: Employee[]
  settings: {
    military: MilitarySettings
    corporate: CorporateSettings
  }
}
