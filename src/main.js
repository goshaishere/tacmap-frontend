import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router'
import { createPinia } from 'pinia'

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
                    background: '#1B2327',
                    surface: '#232B2F',
                    primary: '#3BA55D', // тактический зелёный
                    secondary: '#2C3E50', // глубокий серо-синий
                    accent: '#1976D2', // синий акцент
                    info: '#2196F3',
                    success: '#43A047',
                    warning: '#FFC107',
                    error: '#E53935',
                    'on-primary': '#FFFFFF',
                    'on-surface': '#E0E0E0',
                },
            },
            tacticalDark: {
                dark: true,
                colors: {
                    background: '#12181B',
                    surface: '#181F22',
                    primary: '#3BA55D',
                    secondary: '#22313A',
                    accent: '#90CAF9', // светло-синий акцент
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

createApp(App)
    .use(vuetify)
    .use(pinia)
    .use(router)
    .mount('#app')