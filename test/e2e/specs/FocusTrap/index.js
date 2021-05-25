import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const { createCalendar, clickThe, focusThe, the } = cy

describe('Focus Trap', () => {
  Given('the calendar is open', () => {
    createCalendar()

    clickThe('input')

    the('picker-cells').should('have.length', 1)
    the('calendar').should('be.visible')
  })

  describe('@id-1: Press tab when the previous button is focused', () => {
    When('the user focuses the previous button and presses tab', () => {
      focusThe('previous-button').tab()
    })

    Then('the up button has focus', () => {
      the('up-button').should('be.focused')
    })
  })

  describe('@id-2: Press shift + tab when the previous button is focused', () => {
    When('the user focuses the previous button and presses shift + tab', () => {
      focusThe('previous-button').tab({ shift: true })
    })

    Then('the tabbable cell has focus', () => {
      the('tabbable-cell').should('be.focused')
    })
  })

  describe('@id-3: Press tab when the up button is focused', () => {
    When('the user focuses the up button and presses tab', () => {
      focusThe('up-button').tab()
    })

    Then('the next button has focus')
  })

  describe('@id-4: Press shift + tab when the up button is focused', () => {
    Given('the user focuses the up button and presses shift + tab', () => {
      focusThe('up-button').tab({ shift: true })
    })

    Then('the previous button has focus', () => {
      the('previous-button').should('be.focused')
    })
  })

  describe('@id-5: Press tab when the next button is focused', () => {
    When('the user focuses the next button and presses tab', () => {
      focusThe('next-button').tab()
    })

    Then('the tabbable cell has focus', () => {
      the('.today').should('be.focused')
    })
  })

  describe('@id-6: Press shift + tab when the next button is focused', () => {
    Given('the user focuses the next button and presses shift + tab', () => {
      focusThe('next-button').tab({ shift: true })
    })

    Then('the up button has focus')
  })

  describe("@id-7: Press tab when today's cell is focused", () => {
    When('the user focuses the tabbable cell and presses tab', () => {
      focusThe('tabbable-cell').tab()
    })

    Then('the previous button has focus', () => {
      the('previous-button').should('be.focused')
    })
  })

  describe("@id-8: Press shift + tab when today's cell is focused", () => {
    When('the user focuses the tabbable cell and presses shift + tab', () => {
      focusThe('tabbable-cell').tab({ shift: true })
    })

    Then('the next button has focus', () => {
      the('next-button').should('be.focused')
    })
  })
})
