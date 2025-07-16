import { createApp } from 'vue'
import './styles/_globals.scss'
import App from './App.vue'

import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router'
import { createPinia } from 'pinia'
import { yandexMap } from 'vue-yandex-maps'
import ymapSettings from './config/yandex-maps.js'
import YmapPlugin from 'vue-yandex-maps'


const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },
    theme: {
        defaultTheme: 'tacticalLight',
        themes: {
            tacticalLight: {
                dark: false,
                colors: {
                    background: '#F5F6FA', // светлый фон
                    surface: '#FFFFFF', // белый surface
                    primary: '#3BA55D', // тактический зелёный
                    secondary: '#2C3E50', // глубокий серо-синий
                    accent: '#6B8E23', // олива
                    info: '#2196F3',
                    success: '#43A047',
                    warning: '#FFC107',
                    error: '#E53935',
                    'on-primary': '#FFFFFF',
                    'on-surface': '#232B2F', // тёмный текст на светлом
                },
            },
            tacticalDark: {
                dark: true,
                colors: {
                    background: '#12181B',
                    surface: '#181F22',
                    primary: '#3BA55D',
                    secondary: '#22313A',
                    accent: '#ddb77b', // койот
                    info: '#64B5F6',
                    success: '#66BB6A',
                    warning: '#FFD54F',
                    error: '#EF5350',
                    'on-primary': '#FFFFFF',
                    'on-surface': '#B0BEC5',
                },
            },
        },
    },
})

const pinia = createPinia()

const app = createApp(App)
app.use(vuetify)
app.use(pinia)
app.use(router)
app.use(yandexMap, ymapSettings)

const settings = {
    apiKey: '', // Можно добавить свой ключ
    lang: 'ru_RU',
    coordorder: 'latlong',
    version: '2.1'
}

app.use(YmapPlugin, settings)
app.mount('#app')