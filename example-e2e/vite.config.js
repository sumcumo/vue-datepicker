import vue from '@vitejs/plugin-vue2'
import path from 'path'

export default {
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../src'),
    },
  },
}
