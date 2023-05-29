import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
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
