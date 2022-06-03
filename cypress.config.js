const { defineConfig } = require('cypress')
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = defineConfig({
  chromeWebSecurity: true,
  defaultCommandTimeout: 1000,
  fixturesFolder: 'test/e2e/fixtures',
  screenshotsFolder: 'test/e2e/screenshots',
  videosFolder: 'test/e2e/videos',
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber())

      return {
        ...config,
        fixturesFolder: 'test/e2e/fixtures',
        specPattern: 'test/e2e/specs/**/*.{feature,features}',
        screenshotsFolder: 'test/e2e/screenshots',
        videosFolder: 'test/e2e/videos',
        supportFile: 'test/e2e/support/index.js',
      }
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'test/e2e/specs/**/*.{feature,features}',
    supportFile: 'test/e2e/support/index.js',
  },
})
