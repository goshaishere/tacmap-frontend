export default [{
        key: 'units',
        label: 'Военные единицы',
        icon: 'mdi-account-group-outline',
        items: [
            { key: 'infantry', label: 'Пехота', icon: 'mdi-account-group-outline' },
            { key: 'sniper', label: 'Снайпер', icon: 'mdi-crosshairs' },
            { key: 'machinegun', label: 'Пулемётчик', icon: 'mdi-robot-outline' },
            { key: 'commander', label: 'Командир', icon: 'mdi-account-star-outline' },
            { key: 'medic', label: 'Медик', icon: 'mdi-hospital-box-outline' },
            { key: 'scout', label: 'Разведчик', icon: 'mdi-magnify' },
            { key: 'paratrooper', label: 'Десантник', icon: 'mdi-parachute-outline' },
            { key: 'dog', label: 'Служебная собака', icon: 'mdi-dog' }
        ]
    },
    {
        key: 'vehicles',
        label: 'Техника',
        icon: 'mdi-car-outline',
        items: [
            { key: 'tank', label: 'Танк', icon: 'mdi-tank' },
            { key: 'apc', label: 'БТР', icon: 'mdi-truck-outline' },
            { key: 'jeep', label: 'Джип', icon: 'mdi-car-outline' },
            { key: 'helicopter', label: 'Вертолёт', icon: 'mdi-helicopter' },
            { key: 'aircraft', label: 'Самолёт', icon: 'mdi-airplane' },
            { key: 'boat', label: 'Катер', icon: 'mdi-ferry' },
            { key: 'drone', label: 'Дрон', icon: 'mdi-robot-mower-outline' },
            { key: 'train', label: 'Поезд', icon: 'mdi-train' }
        ]
    },
    {
        key: 'weapons',
        label: 'Оружие',
        icon: 'mdi-pistol',
        items: [
            { key: 'rifle', label: 'Винтовка', icon: 'mdi-pistol' },
            { key: 'rpg', label: 'РПГ', icon: 'mdi-rocket-launch-outline' },
            { key: 'mortar', label: 'Миномёт', icon: 'mdi-bomb' },
            { key: 'sniper-rifle', label: 'Снайперская винтовка', icon: 'mdi-crosshairs' },
            { key: 'machinegun', label: 'Пулемёт', icon: 'mdi-robot-outline' },
            { key: 'knife', label: 'Нож', icon: 'mdi-knife-military' },
            { key: 'grenade', label: 'Граната', icon: 'mdi-battery-outline' }
        ]
    },
    {
        key: 'explosives',
        label: 'Взрывчатка',
        icon: 'mdi-bomb',
        items: [
            { key: 'mine', label: 'Мина', icon: 'mdi-skull-crossbones-outline' },
            { key: 'explosive', label: 'Взрывчатка', icon: 'mdi-bomb' },
            { key: 'ammo', label: 'Боеприпасы', icon: 'mdi-bullet' },
            { key: 'rocket', label: 'Ракета', icon: 'mdi-rocket-launch-outline' },
            { key: 'missile', label: 'Ракетный удар', icon: 'mdi-flash-outline' },
            { key: 'mushroom-cloud', label: 'Ядерный взрыв', icon: 'mdi-mushroom-outline' },
            { key: 'grenade', label: 'Граната', icon: 'mdi-battery-outline' }
        ]
    },
    {
        key: 'tactical',
        label: 'Тактика',
        icon: 'mdi-sword-cross',
        items: [
            { key: 'checkpoint', label: 'КПП', icon: 'mdi-gate' },
            { key: 'observation', label: 'Наблюдение', icon: 'mdi-eye-outline' },
            { key: 'ambush', label: 'Засада', icon: 'mdi-sword-cross' },
            { key: 'defense', label: 'Оборона', icon: 'mdi-shield-outline' },
            { key: 'attack', label: 'Атака', icon: 'mdi-sword-cross' },
            { key: 'retreat', label: 'Отступление', icon: 'mdi-arrow-left-bold' },
            { key: 'flag', label: 'Флаг', icon: 'mdi-flag-outline' },
            { key: 'meeting', label: 'Встреча', icon: 'mdi-account-multiple-outline' }
        ]
    },
    {
        key: 'logistics',
        label: 'Логистика',
        icon: 'mdi-package-variant',
        items: [
            { key: 'medical', label: 'Медпункт', icon: 'mdi-hospital-box-outline' },
            { key: 'supply', label: 'Снабжение', icon: 'mdi-package-variant' },
            { key: 'fuel', label: 'Топливо', icon: 'mdi-gas-station-outline' },
            { key: 'water', label: 'Вода', icon: 'mdi-water-outline' },
            { key: 'food', label: 'Питание', icon: 'mdi-food-outline' },
            { key: 'repair', label: 'Ремонт', icon: 'mdi-wrench-outline' },
            { key: 'tent', label: 'Палатка', icon: 'mdi-tent' }
        ]
    },
    {
        key: 'communications',
        label: 'Связь',
        icon: 'mdi-radio',
        items: [
            { key: 'radio', label: 'Рация', icon: 'mdi-radio' },
            { key: 'antenna', label: 'Антенна', icon: 'mdi-signal' },
            { key: 'satellite', label: 'Спутник', icon: 'mdi-satellite-variant' },
            { key: 'signal', label: 'Сигнал', icon: 'mdi-signal' },
            { key: 'jammer', label: 'Глушилка', icon: 'mdi-signal-off' },
            { key: 'phone', label: 'Телефон', icon: 'mdi-phone-outline' },
            { key: 'walkie-talkie', label: 'Рация (портативная)', icon: 'mdi-radio-handheld' }
        ]
    },
    {
        key: 'infrastructure',
        label: 'Инфраструктура',
        icon: 'mdi-domain',
        items: [
            { key: 'office', label: 'Офис', icon: 'mdi-domain' },
            { key: 'hospital', label: 'Больница', icon: 'mdi-hospital-box-outline' },
            { key: 'factory', label: 'Завод', icon: 'mdi-factory' },
            { key: 'warehouse', label: 'Склад', icon: 'mdi-warehouse' },
            { key: 'home', label: 'Дом', icon: 'mdi-home-outline' },
            { key: 'church', label: 'Церковь', icon: 'mdi-church-outline' },
            { key: 'school', label: 'Школа', icon: 'mdi-school-outline' },
            { key: 'bank', label: 'Банк', icon: 'mdi-bank-outline' },
            { key: 'bridge', label: 'Мост', icon: 'mdi-bridge' },
            { key: 'road', label: 'Дорога', icon: 'mdi-road-variant' },
            { key: 'water-tower', label: 'Водонапорная башня', icon: 'mdi-water-pump' },
            { key: 'power', label: 'Электростанция', icon: 'mdi-flash-outline' }
        ]
    },
    {
        key: 'threats',
        label: 'Угрозы',
        icon: 'mdi-target-variant',
        items: [
            { key: 'enemy', label: 'Противник', icon: 'mdi-target-variant' },
            { key: 'sniper-enemy', label: 'Снайпер противника', icon: 'mdi-crosshairs-gps' },
            { key: 'minefield', label: 'Минное поле', icon: 'mdi-skull-crossbones-outline' },
            { key: 'radiation', label: 'Радиация', icon: 'mdi-radioactive' },
            { key: 'chemical', label: 'Химическая угроза', icon: 'mdi-flask-outline' },
            { key: 'biological', label: 'Биологическая угроза', icon: 'mdi-alert-outline' },
            { key: 'skull', label: 'Череп', icon: 'mdi-skull-outline' },
            { key: 'biohazard', label: 'Биологическая опасность', icon: 'mdi-biohazard' }
        ]
    },
    {
        key: 'navigation',
        label: 'Навигация',
        icon: 'mdi-map-marker-outline',
        items: [
            { key: 'landmark', label: 'Ориентир', icon: 'mdi-map-marker-outline' },
            { key: 'waypoint', label: 'Точка маршрута', icon: 'mdi-map-marker-outline' },
            { key: 'start', label: 'Старт', icon: 'mdi-flag-checkered' },
            { key: 'finish', label: 'Финиш', icon: 'mdi-flag-outline' },
            { key: 'meeting', label: 'Место встречи', icon: 'mdi-account-multiple-outline' },
            { key: 'evacuation', label: 'Эвакуация', icon: 'mdi-exit-run' },
            { key: 'compass', label: 'Компас', icon: 'mdi-compass-outline' }
        ]
    },
    {
        key: 'special',
        label: 'Спецоперации',
        icon: 'mdi-eye-off',
        accent: true,
        items: [
            { key: 'stealth', label: 'Скрытность', icon: 'mdi-eye-outline' },
            { key: 'recon', label: 'Разведка', icon: 'mdi-magnify' },
            { key: 'sabotage', label: 'Саботаж', icon: 'mdi-bomb', accent: true },
            { key: 'rescue', label: 'Спасение', icon: 'mdi-lifebuoy' },
            { key: 'extraction', label: 'Экстракция', icon: 'mdi-airplane', accent: true },
            { key: 'infiltration', label: 'Проникновение', icon: 'mdi-arrow-up-bold' },
            { key: 'parachute', label: 'Парашют', icon: 'mdi-parachute-outline' }
        ]
    },
    {
        key: 'awards',
        label: 'Награды и ранги',
        icon: 'mdi-medal-outline',
        items: [
            { key: 'medal', label: 'Медаль', icon: 'mdi-medal-outline' },
            { key: 'star', label: 'Звезда', icon: 'mdi-star-outline' },
            { key: 'trophy', label: 'Трофей', icon: 'mdi-trophy-outline' },
            { key: 'chevron', label: 'Погон', icon: 'mdi-chevron-double-up' },
            { key: 'shield', label: 'Щит', icon: 'mdi-shield-outline' },
            { key: 'crown', label: 'Корона', icon: 'mdi-crown-outline' }
        ]
    },
    {
        key: 'misc',
        label: 'Прочее',
        icon: 'mdi-dots-horizontal',
        items: [
            { key: 'binoculars', label: 'Бинокль', icon: 'mdi-binoculars' },
            { key: 'dog-tag', label: 'Жетон', icon: 'mdi-dog', accent: true },
            { key: 'flashlight', label: 'Фонарь', icon: 'mdi-flashlight', accent: true },
            { key: 'camera', label: 'Камера', icon: 'mdi-camera-outline' },
            { key: 'map', label: 'Карта', icon: 'mdi-map-outline' },
            { key: 'timer', label: 'Таймер', icon: 'mdi-timer-outline' },
            { key: 'alert', label: 'Тревога', icon: 'mdi-alert-outline' }
        ]
    }
]