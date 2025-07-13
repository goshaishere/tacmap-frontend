import {
    Users,
    Car,
    Truck,
    Plane,
    Ship,
    Crosshair,
    Shield,
    Target,
    Heart,
    Building,
    MapPin,
    Flag,
    Navigation,
    Compass,
    Radio,
    Wifi,
    Zap,
    AlertTriangle,
    Home,
    Factory,
    Hospital,
    Phone,
    Satellite,
    Bomb,
    Sword,
    Plus,
    Minus,
    X
} from 'lucide-vue-next'

export default [{
        key: 'units',
        label: 'Пехота',
        icon: Users,
        icons: [
            { name: 'users', label: 'Группа', component: Users },
            { name: 'crosshair', label: 'Снайпер', component: Crosshair },
            { name: 'shield', label: 'Защита', component: Shield },
            { name: 'sword', label: 'Атака', component: Sword }
        ]
    },
    {
        key: 'vehicles',
        label: 'Техника',
        icon: Car,
        icons: [
            { name: 'car', label: 'Автомобиль', component: Car },
            { name: 'truck', label: 'Грузовик', component: Truck },
            { name: 'plane', label: 'Самолёт', component: Plane },
            { name: 'ship', label: 'Корабль', component: Ship }
        ]
    },
    {
        key: 'medical',
        label: 'Медицина',
        icon: Heart,
        icons: [
            { name: 'heart', label: 'Медицинский пункт', component: Heart },
            { name: 'plus', label: 'Добавить', component: Plus },
            { name: 'minus', label: 'Убрать', component: Minus },
            { name: 'x', label: 'Отмена', component: X }
        ]
    },
    {
        key: 'infrastructure',
        label: 'Инфраструктура',
        icon: Building,
        icons: [
            { name: 'building', label: 'Здание', component: Building },
            { name: 'home', label: 'Дом', component: Home },
            { name: 'factory', label: 'Завод', component: Factory },
            { name: 'hospital', label: 'Больница', component: Hospital }
        ]
    },
    {
        key: 'communications',
        label: 'Связь',
        icon: Radio,
        icons: [
            { name: 'radio', label: 'Рация', component: Radio },
            { name: 'phone', label: 'Телефон', component: Phone },
            { name: 'satellite', label: 'Спутник', component: Satellite },
            { name: 'wifi', label: 'WiFi', component: Wifi }
        ]
    },
    {
        key: 'navigation',
        label: 'Навигация',
        icon: MapPin,
        icons: [
            { name: 'map-pin', label: 'Точка', component: MapPin },
            { name: 'flag', label: 'Флаг', component: Flag },
            { name: 'navigation', label: 'Навигация', component: Navigation },
            { name: 'compass', label: 'Компас', component: Compass },
            { name: 'target', label: 'Цель', component: Target },
            { name: 'bomb', label: 'Бомба', component: Bomb },
            { name: 'zap', label: 'Молния', component: Zap },
            { name: 'alert-triangle', label: 'Опасность', component: AlertTriangle }
        ]
    }
]