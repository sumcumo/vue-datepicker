import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { blurThe, focusThe, getStore, the, visit } = cy

describe('Typeable calendar', () => {
  describe('Enter a valid date and blur the input field', () => {
    Given('the calendar is typeable', () => {
      visit('/')
      getStore().setState('typeable', true)
    })

    And('the input field is focused', () => {
      focusThe('input')
    })

    And('the date is valid', () => {
      the('input').type('1 March 2021')
    })

    When('the input field is blurred', () => {
      blurThe('input')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the date is submitted', () => {
      the('input').should('have.value', '01 Mar 2021')
    })
  })

  describe('Enter an invalid date and blur the input field', () => {
    Given('the calendar is typeable', () => {
      visit('/')
      getStore().setState('typeable', true)
    })

    And('the input field is focused', () => {
      focusThe('input')
    })

    And('the date is invalid', () => {
      the('input').type('nonsense')
    })

    When('the input field is blurred', () => {
      blurThe('input')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the date is cleared', () => {
      the('input').should('have.value', '')
    })
  })

  describe('Enter a valid date and press the enter key', () => {
    Given('the calendar is typeable', () => {
      visit('/')
      getStore().setState('typeable', true)
    })

    And('the input field is focused', () => {
      focusThe('input')
    })

    And('the date is valid', () => {
      the('input').type('1 March 2021')
    })

    When('the enter key is pressed', () => {
      the('input').type('{enter}')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the date is submitted', () => {
      the('input').should('have.value', '01 Mar 2021')
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('Enter an invalid date and press the enter key', () => {
    Given('the calendar is typeable', () => {
      visit('/')
      getStore().setState('typeable', true)
    })

    And('the input field is focused', () => {
      focusThe('input')
    })

    And('the date is invalid', () => {
      the('input').type('nonsense')
    })

    When('the enter key is pressed', () => {
      the('input').type('{enter}')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the date is cleared', () => {
      the('input').should('have.value', '')
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })
})
