const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Маппинг иконок и их emoji
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
};

// Цвета маркеров
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
};

function generateMarkerIcon(iconName, colorName, size = 32) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Очищаем canvas
    ctx.clearRect(0, 0, size, size);

    // Рисуем фон (круг)
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = colors[colorName] || colors.blue;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем иконку (emoji)
    const emoji = markerIcons[iconName] || '📍';
    ctx.font = `${size - 8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);

    return canvas.toBuffer('image/png');
}

function generateAllMarkers() {
    const markersDir = path.join(__dirname, '../public/markers');

    // Создаем папку если её нет
    if (!fs.existsSync(markersDir)) {
        fs.mkdirSync(markersDir, { recursive: true });
    }

    console.log('🎯 Генерация всех иконок маркеров...');

    let generatedCount = 0;

    Object.keys(markerIcons).forEach(iconName => {
        Object.keys(colors).forEach(colorName => {
            try {
                const buffer = generateMarkerIcon(iconName, colorName, 32);
                const filename = `marker-${iconName}-${colorName}.png`;
                const filepath = path.join(markersDir, filename);

                fs.writeFileSync(filepath, buffer);
                generatedCount++;

                if (generatedCount % 10 === 0) {
                    console.log(`✅ Создано ${generatedCount} иконок...`);
                }
            } catch (error) {
                console.error(`❌ Ошибка создания ${iconName}-${colorName}:`, error.message);
            }
        });
    });

    console.log(`🎉 Готово! Создано ${generatedCount} иконок маркеров в папке public/markers/`);

    // Показываем список созданных файлов
    const files = fs.readdirSync(markersDir);
    console.log('\n📁 Созданные файлы:');
    files.slice(0, 20).forEach(file => {
        console.log(`  - ${file}`);
    });
    if (files.length > 20) {
        console.log(`  ... и еще ${files.length - 20} файлов`);
    }
}

// Запускаем генерацию
generateAllMarkers();