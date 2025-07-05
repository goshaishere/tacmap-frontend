export const defaultSquads = [
    { key: 'alpha', title: 'Alpha', icon: 'mdi-alpha-a-circle', description: 'Основной боевой сквад.' },
    { key: 'bravo', title: 'Bravo', icon: 'mdi-alpha-b-circle', description: 'Второй боевой сквад.' },
    { key: 'charlie', title: 'Charlie', icon: 'mdi-alpha-c-circle', description: 'Третий боевой сквад.' },
    { key: 'foxtrot', title: 'Foxtrot', icon: 'mdi-alpha-f-circle', description: 'Сквад поддержки.' },
    { key: 'echo', title: 'Echo', icon: 'mdi-alpha-e-circle', description: 'Сквад связи и разведки.' },
];

// Пример структуры для новых сквадов
export function createSquad({ key, title, icon, description }) {
    return { key, title, icon, description };
}