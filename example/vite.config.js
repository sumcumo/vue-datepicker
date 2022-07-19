import { createVuePlugin } from 'vite-plugin-vue2'
import path from 'path'

export default {
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../src'),
    },
  },
}
