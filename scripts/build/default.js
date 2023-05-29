import { fileURLToPath, URL } from 'url'
import vue from '@vitejs/plugin-vue'

const sourcePath = fileURLToPath(new URL('../../src', import.meta.url))

export default {
  resolve: {
    alias: [
      {
        find: '~',
        replacement: sourcePath,
      },
    ],
  },
  plugins: [vue()],
  esbuild: {
    minify: true,
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
    lib: {
      entry: `${sourcePath}/components/Datepicker.vue`,
      name: 'Datepicker',
      formats: ['umd', 'iife'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-datepicker.css'
          return assetInfo.name
        },
      },
    },
  },
}
