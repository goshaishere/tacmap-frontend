// Утилита для генерации PNG-иконок маркеров
// Запускать в браузере для создания иконок

const markerIcons = {
    'account-group': '👥',
    'crosshairs': '🎯',
    'robot-industrial': '🤖',
    'bomb': '💣',
    'medical-bag': '🏥',
    'account-star': '⭐',
    'tank': '🛡️',
    'car-estate': '🚐',
    'truck': '🚛',
    'helicopter': '🚁',
    'airplane': '✈️',
    'ferry': '⛴️',
    'pistol': '🔫',
    'rocket-launcher': '🚀',
    'cannon': '🏹',
    'land-mine': '💥',
    'ammunition': '🎯',
    'dynamite': '💣',
    'gate': '🚪',
    'eye': '👁️',
    'sword-cross': '⚔️',
    'shield': '🛡️',
    'sword': '⚔️',
    'arrow-left-bold': '⬅️',
    'hospital': '🏥',
    'package-variant': '📦',
    'gas-station': '⛽',
    'water': '💧',
    'food': '🍖',
    'wrench': '🔧',
    'radio': '📻',
    'antenna': '📡',
    'satellite-variant': '🛰️',
    'signal': '📶',
    'signal-off': '📴',
    'office-building': '🏢',
    'bridge': '🌉',
    'road': '🛣️',
    'lightning-bolt': '⚡',
    'water-tower': '🏗️',
    'factory': '🏭',
    'target': '🎯',
    'crosshairs-gps': '🎯',
    'land-mine-on': '💥',
    'radiation': '☢️',
    'flask': '🧪',
    'virus': '🦠',
    'map-marker-star': '⭐',
    'map-marker-path': '🗺️',
    'flag-checkered': '🏁',
    'flag': '🏳️',
    'account-multiple': '👥',
    'exit-run': '🏃',
    'eye-off': '🙈',
    'magnify': '🔍',
    'bomb-off': '💣',
    'lifebuoy': '🛟',
    'arrow-up-bold': '⬆️',
    'map-marker': '📍'
}

const colors = {
    'red': '#E53935',
    'blue': '#2196F3',
    'green': '#43A047',
    'yellow': '#FFC107',
    'orange': '#FF9800',
    'purple': '#9C27B0',
    'brown': '#795548',
    'grey': '#9E9E9E',
    'black': '#212121',
    'cyan': '#00BCD4',
    'darkgreen': '#2E7D32',
    'darkblue': '#1976D2'
}

function generateMarkerIcon(iconName, colorName = 'blue', size = 32) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    // Очищаем canvas
    ctx.clearRect(0, 0, size, size)

    // Рисуем фон (круг)
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.strokeStyle = colors[colorName] || colors.blue
    ctx.lineWidth = 2
    ctx.stroke()

    // Рисуем иконку (emoji)
    const emoji = markerIcons[iconName] || '📍'
    ctx.font = `${size - 8}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, size / 2, size / 2)

    return canvas.toDataURL('image/png')
}

function downloadMarkerIcon(iconName, colorName = 'blue', size = 32) {
    const dataUrl = generateMarkerIcon(iconName, colorName, size)
    const link = document.createElement('a')
    link.download = `marker-${iconName}-${colorName}.png`
    link.href = dataUrl
    link.click()
}

// Функция для генерации всех иконок
function generateAllMarkers() {
    console.log('Генерация всех иконок маркеров...')

    Object.keys(markerIcons).forEach(iconName => {
        Object.keys(colors).forEach(colorName => {
            setTimeout(() => {
                    downloadMarkerIcon(iconName, colorName, 32)
                }, 100) // Небольшая задержка между загрузками
        })
    })
}

// Экспортируем функции для использования
window.generateMarkerIcon = generateMarkerIcon
window.downloadMarkerIcon = downloadMarkerIcon
window.generateAllMarkers = generateAllMarkers

console.log('Утилита генерации маркеров загружена!')
console.log('Используйте:')
console.log('- generateMarkerIcon("account-group", "blue") - создать иконку')
console.log('- downloadMarkerIcon("account-group", "blue") - скачать иконку')
console.log('- generateAllMarkers() - создать все иконки')