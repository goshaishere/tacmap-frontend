export const defaultSquads = [
  { key: 'alpha', title: 'Alpha', icon: 'mdi-alpha-a-circle', description: 'Подразделение основного состава.' },
  { key: 'bravo', title: 'Bravo', icon: 'mdi-alpha-b-circle', description: 'Второе подразделение.' },
  { key: 'charlie', title: 'Charlie', icon: 'mdi-alpha-c-circle', description: 'Третье подразделение.' },
  { key: 'foxtrot', title: 'Foxtrot', icon: 'mdi-alpha-f-circle', description: 'Подразделение поддержки.' },
  { key: 'echo', title: 'Echo', icon: 'mdi-alpha-e-circle', description: 'Подразделение связи и разведки.' },
]

// Пример структуры для новых сквадов
export function createSquad({ key, title, icon, description }) {
    return { key, title, icon, description };
}