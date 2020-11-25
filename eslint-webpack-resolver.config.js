const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    mainFiles: ['index'],
    alias: {
      '~': path.join(__dirname, '/src'),
    },
  },
}
