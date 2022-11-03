import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import Router from 'unplugin-vue-file-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defaultExportResolver } from '@chengdx/default-export-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Inspect(),
    Router(),
    AutoImport({
      dts: true,
      resolvers: [
        defaultExportResolver([
          { name: 'defu', from: 'defu' },
        ]),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
