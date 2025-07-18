// DEMO: локальные маркеры для задач и карты
const demoMarkers = [
    { id: 1, coords: [59.94, 30.3], label: 'Точка сбора', icon: 'mdi-map-marker', hint: 'Точка сбора', isOwn: true },
    { id: 2, coords: [59.941, 30.301], label: 'Вражеская позиция', icon: 'mdi-target-variant', hint: 'Вражеская позиция', isOwn: false },
    { id: 3, coords: [59.942, 30.299], label: 'Медпункт', icon: 'mdi-hospital-box-outline', hint: 'Медпункт', isOwn: true },
    { id: 4, coords: [59.939, 30.302], label: 'Техника', icon: 'mdi-tank', hint: 'Техника', isOwn: true }
];

export default demoMarkers;