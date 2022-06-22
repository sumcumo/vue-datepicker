const { defineConfig } = require('cypress')
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = defineConfig({
  defaultCommandTimeout: 1000,
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber())

      return {
        ...config,
        fixturesFolder: 'test/e2e/fixtures',
        screenshotsFolder: 'test/e2e/screenshots',
        specPattern: 'test/e2e/specs/**/*.{feature,features}',
        supportFile: 'test/e2e/support/index.js',
        video: false,
        videosFolder: 'test/e2e/videos',
      }
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'test/e2e/specs/**/*.{feature,features}',
    supportFile: 'test/e2e/support/index.js',
  },
})
