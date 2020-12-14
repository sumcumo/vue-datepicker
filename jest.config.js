module.exports = {
  rootDir: './',
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+.js$': 'babel-jest',
    '^.+.vue': 'vue-jest',
  },
  setupFiles: ['<rootDir>/test/unit/setup.js'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    './src/**/*.{js,vue}',
    '!./src/locale/translations/**/*.js',
  ],
  verbose: false,
  testURL: 'http://localhost',
}
