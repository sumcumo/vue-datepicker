import { defineConfig } from 'vite'
import defaultConfig from './default'

export default defineConfig({
  ...defaultConfig,
  esbuild: {
    minify: false,
  },
  build: {
    ...defaultConfig.build,
    minify: false,
    lib: {
      ...defaultConfig.build.lib,
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: (format) => {
        if (format === 'es') {
          return `vue-datepicker.mjs`
        }
        if (format === 'cjs') {
          return `vue-datepicker.cjs`
        }
        return `vue-datepicker.${format}.js`
      },
    },
  },
})
