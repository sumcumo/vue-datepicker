// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('the', (testSelector, options) =>
  cy.get(`[data-test-${testSelector}]`, options),
)

Cypress.Commands.add('blurThe', (testSelector) => {
  cy.get(`[data-test-${testSelector}]`).blur()
})

Cypress.Commands.add('clickThe', (testSelector, position) => {
  cy.get(`[data-test-${testSelector}]`).click(position)
})

Cypress.Commands.add('clickTheFirst', (testSelector) => {
  cy.get(`[data-test-${testSelector}]`).eq(0).click()
})

Cypress.Commands.add('focusThe', (testSelector) => {
  cy.get(`[data-test-${testSelector}]`).focus()
})

Cypress.Commands.add('theFirst', (testSelector) =>
  cy.get(`[data-test-${testSelector}]`).eq(0),
)

// eslint-disable-next-line max-params
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  // With ref to https://docs.cypress.io/api/commands/type.html#Arguments,
  // add support for a '{space}' special characters sequence
  if (text === '{space}') {
    // eslint-disable-next-line no-param-reassign
    text = ' '
  }

  return originalFn(element, text, options)
})

Cypress.Commands.add('fillOutThe', (testSelector) =>
  cy.get(`[data-test-${testSelector}]`),
)

Cypress.Commands.add('with', { prevSubject: true }, (form, formData) => {
  cy.wrap(Object.keys(formData)).each((key) => {
    cy.get(form).find(`[name=${key}]`).type(formData[key])
  })
  cy.get(form).submit()
})

Cypress.Commands.add('getStore', () => {
  return cy.window().its('__store__')
})

Cypress.Commands.add(
  'dispatch',
  { prevSubject: true },
  (store, methodToDispatch, ...dispatchArguments) => {
    return store.dispatch(methodToDispatch, ...dispatchArguments)
  },
)

Cypress.Commands.add(
  'commit',
  { prevSubject: true },
  (store, methodToCommit, ...commitArguments) => {
    return store.commit(methodToCommit, ...commitArguments)
  },
)

Cypress.Commands.add(
  'setState',
  { prevSubject: true },
  (store, property, value) => {
    // eslint-disable-next-line no-param-reassign
    store.state[property] = value
    return value
  },
)

Cypress.Commands.add('getState', { prevSubject: true }, (store, property) => {
  return store.state[property]
})

Cypress.Commands.add('getApp', () => {
  cy.window()
    .its('app')
    .then((app) => {
      return app.$children[0].$children[0]
    })
})

Cypress.Commands.add('createCalendar', (options) => {
  cy.visit('/')

  if (options) {
    Object.keys(options).forEach((key) => {
      cy.getStore().setState(key, options[key])
    })
  }
})
