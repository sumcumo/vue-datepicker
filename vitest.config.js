import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      include: [
        'src/components/*.vue',
        'src/locale/*.js',
        'src/mixins/*.vue',
        'src/utils/*.js',
      ],
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'test/unit/coverage',
    },
    globals: true,
    environment: 'jsdom',
  },
})
