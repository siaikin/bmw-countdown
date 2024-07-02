import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { version as pkgVersion } from './package.json'
import legacy from '@vitejs/plugin-legacy'
import cdn from 'vite-plugin-cdn-import'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { VitePWA } from 'vite-plugin-pwa'

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
      prodUrl: '//unpkg.com/{name}@{version}/{path}',
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
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*'],
      },
    }),
    // basicSsl(),
    // analyzer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/umami-api/': {
        target: 'https://api.umami.is/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/umami-api/, ''),
        headers: {
          Accept: 'application/json',
          'x-umami-api-key': 'k5z1qwy1alCl0t3ggniPrclbbeDOnv1v',
        },
      },
    },
  },
})
