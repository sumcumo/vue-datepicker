import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Show calendar on focus', () => {
  describe('@id-1: Focus input field when closed (default behaviour)', () => {
    Given('the calendar is closed', () => {
      createCalendar()
      the('calendar').should('not.be.visible')
    })

    When('the user focuses the input field', () => {
      // TODO: Remove arbitrary wait
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100)
      focusThe('input')
    })

    Then('the calendar remains closed', () => {
      the('calendar').should('not.be.visible')
    })

    And('the input field has focus', () => {
      the('input').should('have.focus')
    })
  })

  describe('@id-2: Focus input field when closed and `show-calendar-on-focus` is true', () => {
    Given('the calendar is closed and `show-calendar-on-focus` is true', () => {
      createCalendar({
        showCalendarOnFocus: true,
      })
      the('calendar').should('not.be.visible')
    })

    When('the user focuses the input field')

    Then('the calendar opens', () => {
      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    And("today's cell has focus", () => {
      the('today-cell').should('have.focus')
    })
  })

  describe('@id-3: Focus input field when the typeable calendar is {string}', () => {
    Given('the typeable calendar is {string}', (openOrClosed) => {
      const isNot = openOrClosed === 'closed' ? 'not.' : ''

      createCalendar({
        showCalendarOnFocus: true,
        typeable: true,
      })

      if (openOrClosed === 'open') {
        clickThe('input')
      }

      the('calendar').should(`${isNot}be.visible`)
    })

    When('the user clicks the input field', () => {
      clickThe('input')
    })

    Then('the calendar {string}', (opensOrCloses) => {
      const isNot = opensOrCloses === 'closes' ? 'not.' : ''

      the('calendar').should(`${isNot}be.visible`)
    })

    And('the {string} has focus', (element) => {
      the(element).should('have.focus')
    })
  })

  describe('@id-4: Click on the input field when {string}', () => {
    Given('the calendar is {string}', (openOrClosed) => {
      const isNot = openOrClosed === 'closed' ? 'not.' :
        ''

      createCalendar({
        showCalendarOnFocus: true,
      })

      if (openOrClosed === 'open') {
        clickThe('input')
      }

      the('picker-cells').should('have.length', 1)
      the('calendar').should(`${isNot}be.visible`)
    })

    When('the user focuses the input field')

    Then('the calendar {string}')

    And('the {string} has focus')
  })

  describe('@id-5: Click on the input field when the typeable calendar is {string}', () => {
    Given('the typeable calendar is {string}')

    When('the user clicks the input field')

    Then('the calendar {string}')

    And('the {string} has focus')
  })
})
