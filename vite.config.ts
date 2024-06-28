import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { version as pkgVersion } from './package.json'
import legacy from '@vitejs/plugin-legacy'
import cdn from 'vite-plugin-cdn-import'
import { viteExternalsPlugin } from 'vite-plugin-externals'

process.env.VITE_APP_VERSION = pkgVersion
if (process.env.NODE_ENV === 'production') {
  process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString()
}

export default defineConfig({
  build: {
    minify: 'terser',
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@/store': ['useStore'],
        },
        unheadVueComposablesImports,
      ],
      dts: 'auto-imports.d.ts',
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
    cdn({
      modules: [
        'vue',
        {
          name: 'date-fns',
          var: 'dateFns',
          path: 'cdn.min.js',
        },
      ],
      enableInDevMode: true,
    }),
    viteExternalsPlugin({
      vue: 'Vue',
      'date-fns': 'dateFns',
    }),
    Components({
      dts: 'components.d.ts',
    }),
    legacy({
      targets: ['defaults', '>0.2%'],
    }),
    // analyzer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
