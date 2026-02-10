/**
 * Типы и подтипы организаций.
 * structureLevels — ключи для i18n (company.structure.xxx), порядок от верхнего к нижнему.
 */

export const COMPANY_KIND = {
  corporate: 'corporate',
  military: 'military',
}

// Корпоративные подтипы
export const CORPORATE_SUBTYPES = [
  {
    key: 'classic',
    icon: 'mdi-domain',
    structureLevels: ['directorate', 'department', 'team'],
    positionSource: 'positions',
  },
  {
    key: 'holding',
    icon: 'mdi-office-building',
    structureLevels: ['holding_company', 'division', 'department', 'team'],
    positionSource: 'positions',
  },
  {
    key: 'startup',
    icon: 'mdi-rocket-launch',
    structureLevels: ['department', 'team'],
    positionSource: 'positions',
  },
  {
    key: 'government',
    icon: 'mdi-government',
    structureLevels: ['ministry', 'agency', 'department', 'unit'],
    positionSource: 'positions',
  },
  {
    key: 'ngo',
    icon: 'mdi-hand-heart',
    structureLevels: ['direction', 'department', 'team'],
    positionSource: 'positions',
  },
]

// Военные подтипы
export const MILITARY_SUBTYPES = [
  {
    key: 'army',
    icon: 'mdi-shield',
    structureLevels: ['division', 'regiment', 'battalion', 'company', 'platoon', 'squad'],
    positionSource: 'ranks_roles',
  },
  {
    key: 'brigade',
    icon: 'mdi-shield-sword',
    structureLevels: ['brigade', 'battalion', 'company', 'platoon', 'squad'],
    positionSource: 'ranks_roles',
  },
  {
    key: 'pmc',
    icon: 'mdi-shield-account',
    structureLevels: ['division', 'branch', 'team', 'squad'],
    positionSource: 'ranks_roles',
  },
  {
    key: 'national_guard',
    icon: 'mdi-police-badge',
    structureLevels: ['region', 'battalion', 'company', 'platoon', 'squad'],
    positionSource: 'ranks_roles',
  },
  {
    key: 'special_forces',
    icon: 'mdi-crosshairs',
    structureLevels: ['group', 'detachment', 'squad'],
    positionSource: 'ranks_roles',
  },
]

export function getSubtypes(kind) {
  return kind === COMPANY_KIND.corporate ? CORPORATE_SUBTYPES : MILITARY_SUBTYPES
}

export function getSubtype(kind, subtypeKey) {
  const list = getSubtypes(kind)
  return list.find(s => s.key === subtypeKey) || list[0]
}

export function getStructureLevelKeys(kind, subtypeKey) {
  const sub = getSubtype(kind, subtypeKey)
  return sub ? sub.structureLevels : []
}
