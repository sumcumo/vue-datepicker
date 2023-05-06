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
      formats: ['esm', 'cjs', 'umd', 'iife'],
    },
  },
})
