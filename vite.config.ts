import { rmSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/styles/utils.less";`,
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    VueRouter({
      exclude: ['**/components/*.vue'],
      dts: './types/typed-router.d.ts',
    }),
    vue(),
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: 'mobile-vue',
          resolveIcons: true,
        }),
      ],
      imports: [VueRouterAutoImports, 'vue'],
      dts: './types/auto-imports.d.ts',
    }),
    {
      name: 'remove-mockServiceWorker.js',
      closeBundle() {
        rmSync('dist/mockServiceWorker.js')
        rmSync('dist/mock-imgs', { recursive: true })
      },
    },
    Components({
      resolvers: [
        TDesignResolver({
          library: 'mobile-vue',
          resolveIcons: true,
        }),
      ],
      dts: './types/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/tencent-map': {
        target: 'https://apis.map.qq.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/tencent-map/, ''),
      },
    },
  },
})
