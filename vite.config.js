import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vuetify(),
        // Копируем SVG иконки @mdi/svg в сборку, чтобы метки на карте отображались на деплое
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(resolve(__dirname, 'node_modules/@mdi/svg/svg/*.svg')),
                    dest: 'mdi-icons'
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
})