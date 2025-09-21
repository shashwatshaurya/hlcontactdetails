import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'

export default async ({ mode }) => {
  const isProd = mode === 'production'
  const inspectPlugin = !isProd ? (await import('vite-plugin-inspect')).default() : undefined

  return {
    plugins: [
      vue(),
      // gzip assets
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        deleteOriginFile: false,
        filter: (file) => /\.(js|mjs|json|css|html|svg)$/.test(file),
      }),
      // brotli assets
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false,
        filter: (file) => /\.(js|mjs|json|css|html|svg)$/.test(file),
      }),
      // dev-only inspector UI at /__inspect/
      ...(inspectPlugin ? [inspectPlugin] : []),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
    },
    build: {
      sourcemap: true,
      minify: 'terser',
      target: 'es2019',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        treeshake: 'recommended',
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'vuex'],
          },
        },
      },
      commonjsOptions: {
        include: [/node_modules/],
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2,
        },
        mangle: {
          toplevel: true,
        },
        format: {
          comments: false,
        },
      },
    },
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    },
  }
}
