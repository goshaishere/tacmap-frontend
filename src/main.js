import { createApp } from 'vue'
import './styles/_globals.scss'
import App from './App.vue'
import { i18n } from './i18n.js'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router'
import { createPinia } from 'pinia'
import YmapPlugin from 'vue-yandex-maps'
import { defaultLight, defaultDark } from './config/themeDefaults.js'

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
                dark: defaultLight.dark,
                colors: { ...defaultLight.colors },
            },
            tacticalDark: {
                dark: defaultDark.dark,
                colors: { ...defaultDark.colors },
            },
        },
    },
})

const pinia = createPinia()

const app = createApp(App)
app.use(i18n)
app.use(vuetify)
app.use(pinia)
app.use(router)

const settings = {
    apiKey: '',
    lang: 'ru_RU',
    coordorder: 'latlong',
    version: '2.1'
}

app.use(YmapPlugin, settings)
app.mount('#app')