import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, focusThe, getStore, the, visit } = cy

describe('Show calendar on focus', () => {
  describe('Focus the input field when the calendar is closed (default behaviour)', () => {
    Given('the calendar is closed', () => {
      visit('/')
    })

    When('the input field is focused', () => {
      focusThe('input')
    })

    Then('the calendar remains closed', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the input field has focus', () => {
      the('input').should('have.focus')
    })
  })

  describe('Focus the input field when the calendar is closed and `show-calendar-on-focus` is true', () => {
    Given('the calendar is closed', () => {
      visit('/')
    })

    And('`show-calendar-on-focus` is true', () => {
      getStore().setState('showCalendarOnFocus', true)
    })

    When('the input field is focused', () => {
      focusThe('input')
    })

    Then('the calendar opens', () => {
      the('calendar').should('not.have.css', 'display', 'none')
    })

    // And("today's cell has focus", () => {
    //
    // })
  })

  describe('Focus the input field when the calendar is open (default behaviour)', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    When('the input field is focused', () => {
      focusThe('input')
    })

    Then('the calendar remains open', () => {
      the('calendar').should('not.have.css', 'display', 'none')
    })

    And('the input field has focus', () => {
      the('input').should('have.focus')
    })
  })

  describe('Focus the input field when the calendar is open and `show-calendar-on-focus` is true', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    And('`show-calendar-on-focus` is true', () => {
      getStore().setState('showCalendarOnFocus', true)
    })

    When('the input field is focused', () => {
      focusThe('input')
    })

    Then('the calendar remains open', () => {
      the('calendar').should('not.have.css', 'display', 'none')
    })

    And('the input field has focus', () => {
      the('input').should('have.focus')
    })
  })
})
