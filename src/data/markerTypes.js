export default [{
        key: 'units',
        label: 'Военные единицы',
        icon: 'mdi-account-group',
        color: 'blue',
        items: [
            { key: 'infantry', label: 'Пехота', icon: 'mdi-account-group', color: 'blue' },
            { key: 'sniper', label: 'Снайпер', icon: 'mdi-crosshairs', color: 'purple' },
            { key: 'machinegun', label: 'Пулемёт', icon: 'mdi-robot-industrial', color: 'brown' },
            { key: 'grenadier', label: 'Гранатомётчик', icon: 'mdi-bomb', color: 'orange' },
            { key: 'medic', label: 'Медик', icon: 'mdi-medical-bag', color: 'green' },
            { key: 'commander', label: 'Командир', icon: 'mdi-account-star', color: 'red' }
        ]
    },
    {
        key: 'vehicles',
        label: 'Техника',
        icon: 'mdi-car',
        color: 'green',
        items: [
            { key: 'tank', label: 'Танк', icon: 'mdi-tank', color: 'green' },
            { key: 'apc', label: 'БТР', icon: 'mdi-car-estate', color: 'blue' },
            { key: 'truck', label: 'Грузовик', icon: 'mdi-truck', color: 'grey' },
            { key: 'helicopter', label: 'Вертолёт', icon: 'mdi-helicopter', color: 'darkgreen' },
            { key: 'aircraft', label: 'Самолёт', icon: 'mdi-airplane', color: 'darkblue' },
            { key: 'boat', label: 'Катер', icon: 'mdi-ferry', color: 'blue' }
        ]
    },
    {
        key: 'weapons',
        label: 'Оружие',
        icon: 'mdi-pistol',
        color: 'red',
        items: [
            { key: 'rifle', label: 'Винтовка', icon: 'mdi-pistol', color: 'black' },
            { key: 'rpg', label: 'РПГ', icon: 'mdi-rocket-launcher', color: 'orange' },
            { key: 'mortar', label: 'Миномёт', icon: 'mdi-cannon', color: 'brown' },
            { key: 'mine', label: 'Мина', icon: 'mdi-land-mine', color: 'red' },
            { key: 'ammo', label: 'Боеприпасы', icon: 'mdi-ammunition', color: 'yellow' },
            { key: 'explosive', label: 'Взрывчатка', icon: 'mdi-dynamite', color: 'orange' }
        ]
    },
    {
        key: 'tactical',
        label: 'Тактика',
        icon: 'mdi-sword-cross',
        color: 'purple',
        items: [
            { key: 'checkpoint', label: 'КПП', icon: 'mdi-gate', color: 'blue' },
            { key: 'observation', label: 'Наблюдение', icon: 'mdi-eye', color: 'purple' },
            { key: 'ambush', label: 'Засада', icon: 'mdi-sword-cross', color: 'red' },
            { key: 'defense', label: 'Оборона', icon: 'mdi-shield', color: 'green' },
            { key: 'attack', label: 'Атака', icon: 'mdi-sword', color: 'red' },
            { key: 'retreat', label: 'Отступление', icon: 'mdi-arrow-left-bold', color: 'orange' }
        ]
    },
    {
        key: 'logistics',
        label: 'Логистика',
        icon: 'mdi-package-variant',
        color: 'orange',
        items: [
            { key: 'medical', label: 'Медпункт', icon: 'mdi-hospital', color: 'green' },
            { key: 'supply', label: 'Снабжение', icon: 'mdi-package-variant', color: 'blue' },
            { key: 'fuel', label: 'Топливо', icon: 'mdi-gas-station', color: 'yellow' },
            { key: 'water', label: 'Вода', icon: 'mdi-water', color: 'blue' },
            { key: 'food', label: 'Питание', icon: 'mdi-food', color: 'orange' },
            { key: 'repair', label: 'Ремонт', icon: 'mdi-wrench', color: 'grey' }
        ]
    },
    {
        key: 'communications',
        label: 'Связь',
        icon: 'mdi-radio',
        color: 'cyan',
        items: [
            { key: 'radio', label: 'Рация', icon: 'mdi-radio', color: 'blue' },
            { key: 'antenna', label: 'Антенна', icon: 'mdi-antenna', color: 'grey' },
            { key: 'satellite', label: 'Спутник', icon: 'mdi-satellite-variant', color: 'purple' },
            { key: 'signal', label: 'Сигнал', icon: 'mdi-signal', color: 'green' },
            { key: 'jammer', label: 'Глушилка', icon: 'mdi-signal-off', color: 'red' }
        ]
    },
    {
        key: 'infrastructure',
        label: 'Инфраструктура',
        icon: 'mdi-office-building',
        color: 'grey',
        items: [
            { key: 'building', label: 'Здание', icon: 'mdi-office-building', color: 'grey' },
            { key: 'bridge', label: 'Мост', icon: 'mdi-bridge', color: 'brown' },
            { key: 'road', label: 'Дорога', icon: 'mdi-road', color: 'grey' },
            { key: 'power', label: 'Электростанция', icon: 'mdi-lightning-bolt', color: 'yellow' },
            { key: 'water-tower', label: 'Водонапорная башня', icon: 'mdi-water-tower', color: 'blue' },
            { key: 'factory', label: 'Завод', icon: 'mdi-factory', color: 'grey' }
        ]
    },
    {
        key: 'threats',
        label: 'Угрозы',
        icon: 'mdi-target',
        color: 'red',
        items: [
            { key: 'enemy', label: 'Противник', icon: 'mdi-target', color: 'red' },
            { key: 'sniper-enemy', label: 'Снайпер противника', icon: 'mdi-crosshairs-gps', color: 'red' },
            { key: 'minefield', label: 'Минное поле', icon: 'mdi-land-mine-on', color: 'red' },
            { key: 'radiation', label: 'Радиация', icon: 'mdi-radiation', color: 'yellow' },
            { key: 'chemical', label: 'Химическая угроза', icon: 'mdi-flask', color: 'green' },
            { key: 'biological', label: 'Биологическая угроза', icon: 'mdi-virus', color: 'green' }
        ]
    },
    {
        key: 'navigation',
        label: 'Навигация',
        icon: 'mdi-map-marker-star',
        color: 'yellow',
        items: [
            { key: 'landmark', label: 'Ориентир', icon: 'mdi-map-marker-star', color: 'yellow' },
            { key: 'waypoint', label: 'Точка маршрута', icon: 'mdi-map-marker-path', color: 'blue' },
            { key: 'start', label: 'Старт', icon: 'mdi-flag-checkered', color: 'green' },
            { key: 'finish', label: 'Финиш', icon: 'mdi-flag', color: 'red' },
            { key: 'meeting', label: 'Место встречи', icon: 'mdi-account-multiple', color: 'blue' },
            { key: 'evacuation', label: 'Эвакуация', icon: 'mdi-exit-run', color: 'orange' }
        ]
    },
    {
        key: 'special',
        label: 'Спецоперации',
        icon: 'mdi-eye-off',
        color: 'purple',
        items: [
            { key: 'stealth', label: 'Скрытность', icon: 'mdi-eye-off', color: 'purple' },
            { key: 'recon', label: 'Разведка', icon: 'mdi-magnify', color: 'blue' },
            { key: 'sabotage', label: 'Саботаж', icon: 'mdi-bomb-off', color: 'red' },
            { key: 'rescue', label: 'Спасение', icon: 'mdi-lifebuoy', color: 'green' },
            { key: 'extraction', label: 'Экстракция', icon: 'mdi-helicopter', color: 'blue' },
            { key: 'infiltration', label: 'Проникновение', icon: 'mdi-arrow-up-bold', color: 'purple' }
        ]
    }
]