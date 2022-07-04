module.exports = {
  rootDir: './',
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+.js$': 'babel-jest',
    '^.+.vue': '@vue/vue2-jest',
  },
  setupFiles: ['<rootDir>/test/unit/setup.js'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    './src/**/*.{js,vue}',
    '!./src/locale/translations/**/*.js',
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  verbose: false,
}
