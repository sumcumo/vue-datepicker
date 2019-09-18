module.exports = {
  rootDir: 'src/',
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
  ],
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+.js$': 'babel-jest',
    '.*.(vue)$': 'vue-jest',
  },
  setupFiles: ['<rootDir>/tests/unit/setup'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/locale/translations/**/*.js',
  ],
  verbose: false,
  testURL: 'http://localhost',
}
