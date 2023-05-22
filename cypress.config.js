import { defineConfig } from 'cypress'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import preprocessor from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild'

export async function setupNodeEvents(on, config) {
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

export default defineConfig({
  defaultCommandTimeout: 2000,
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
