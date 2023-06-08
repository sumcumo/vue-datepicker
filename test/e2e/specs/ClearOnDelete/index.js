import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { createCalendar, focusThe, the } = cy

describe('Clear date on delete', () => {
  describe('@id-1: Clear date via {string}', () => {
    Given('the calendar has a selected date', () => {
      createCalendar({
        modelValue: new Date(2020, 2, 15),
      })
      the('calendar').should('not.be.visible')
      the('input').should('have.value', '15 Mar 2020')
    })

    When('the user focuses the input field and presses {string}', (key) => {
      // Use force as a non-typeable calendar input is `read-only`
      focusThe('input').type(`{${key}}`, { force: true })
    })

    Then('the date is cleared', () => {
      the('input').should('have.value', '')
    })

    Then('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })
})
