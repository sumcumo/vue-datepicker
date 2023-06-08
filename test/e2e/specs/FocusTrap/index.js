import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { createCalendar, clickThe, focusThe, the } = cy

describe('Focus Trap', () => {
  Given('the calendar is open', () => {
    createCalendar()

    clickThe('input')

    the('picker-cells').should('have.length', 1)
    the('calendar').should('be.visible')
  })

  describe('@id-1: Tab forwards when the previous button is focused', () => {
    When('the user focuses the previous button and tabs forwards', () => {
      focusThe('previous-button').tab()
    })

    Then('the up button has focus', () => {
      the('up-button').should('be.focused')
    })
  })

  describe('@id-2: Tab backwards when the previous button is focused', () => {
    When('the user focuses the previous button and tabs backwards', () => {
      focusThe('previous-button').tab({ shift: true })
    })

    Then('the tabbable cell has focus', () => {
      the('tabbable-cell').should('be.focused')
    })
  })

  describe('@id-3: Tab forwards when the up button is focused', () => {
    When('the user focuses the up button and tabs forwards', () => {
      focusThe('up-button').tab()
    })

    Then('the next button has focus')
  })

  describe('@id-4: Tab backwards when the up button is focused', () => {
    Given('the user focuses the up button and tabs backwards', () => {
      focusThe('up-button').tab({ shift: true })
    })

    Then('the previous button has focus', () => {
      the('previous-button').should('be.focused')
    })
  })

  describe('@id-5: Tab forwards when the next button is focused', () => {
    When('the user focuses the next button and tabs forwards', () => {
      focusThe('next-button').tab()
    })

    Then('the tabbable cell has focus', () => {
      the('.today').should('be.focused')
    })
  })

  describe('@id-6: Tab backwards when the next button is focused', () => {
    Given('the user focuses the next button and tabs backwards', () => {
      focusThe('next-button').tab({ shift: true })
    })

    Then('the up button has focus')
  })

  describe("@id-7: Tab forwards when today's cell is focused", () => {
    When('the user focuses the tabbable cell and tabs forwards', () => {
      focusThe('tabbable-cell').tab()
    })

    Then('the previous button has focus', () => {
      the('previous-button').should('be.focused')
    })
  })

  describe("@id-8: Tab backwards when today's cell is focused", () => {
    When('the user focuses the tabbable cell and tabs backwards', () => {
      focusThe('tabbable-cell').tab({ shift: true })
    })

    Then('the next button has focus', () => {
      the('next-button').should('be.focused')
    })
  })

  describe('@id-9: Inline calendar: Tab forwards when last element is focused', () => {
    When('the user focuses the last element and tabs forwards', () => {
      focusThe('tabbable-cell').tab()
    })

    Then('the next element on the page has focus', () => {
      the('next-element').should('be.focused')
    })
  })

  describe('@id-10: Inline calendar: Tab backwards when first element is focused', () => {
    When('the user focuses the first element and tabs backwards', () => {
      focusThe('previous-button').tab({ shift: true })
    })

    Then('the previous element on the page has focus', () => {
      the('previous-element').should('be.focused')
    })
  })
})
