const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const preprocessor = require('@badeball/cypress-cucumber-preprocessor')
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild')

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await preprocessor.addCucumberPreprocessorPlugin(on, config)

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    }),
  )

  // Make sure to return the config object as it might have been modified by the plugin.
  return config
}

module.exports = defineConfig({
  defaultCommandTimeout: 1000,
  e2e: {
    baseUrl: 'http://localhost:8080',
    experimentalRunAllSpecs: true,
    fixturesFolder: false,
    screenshotsFolder: 'test/e2e/screenshots',
    setupNodeEvents,
    specPattern: 'test/e2e/specs/**/*.{feature,features}',
    supportFile: 'test/e2e/support/index.js',
    video: false,
    viewportWidth: 400,
  },
})
