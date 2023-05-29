import { defineConfig } from 'vite'
import defaultConfig from './default'

export default defineConfig({
  ...defaultConfig,
  build: {
    ...defaultConfig.build,
    minify: false,
    lib: {
      ...defaultConfig.build.lib,
      formats: ['cjs', 'es'],
      fileName: (format) => {
        if (format === 'es') return 'vue-datepicker.mjs'
        return 'vue-datepicker.cjs'
      },
    },
  },
})
