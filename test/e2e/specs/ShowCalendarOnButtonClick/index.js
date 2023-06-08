import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { clickThe, createCalendar, focusThe, getStore, the } = cy

describe('Show calendar on button click', () => {
  describe('@id-1: Click on the calendar button when {string}}', () => {
    Given('the calendar is {string}', (openOrClosed) => {
      const isNot = openOrClosed === 'closed' ? 'not.' : ''

      createCalendar({
        calendarButton: true,
        showCalendarOnButtonClick: true,
      })

      the('calendar-button').should('be.visible')

      if (openOrClosed === 'open') {
        clickThe('calendar-button')
      }

      the('calendar').should(`${isNot}be.visible`)
    })

    When('the user clicks the calendar button', () => {
      clickThe('calendar-button')
    })

    Then('the calendar {string}', (opensOrCloses) => {
      const isNot = opensOrCloses === 'closes' ? 'not.' : ''

      the('calendar').should(`${isNot}be.visible`)
    })

    Then('the {string} has focus', (element) => {
      the(element).should('have.focus')
    })
  })

  describe('@id-2: Click on the input field when closed', () => {
    When('the user clicks on the input field', () => {
      clickThe('input')
    })

    Then('the calendar remains {string}', (openOrClosed) => {
      const isNot = openOrClosed === 'closed' ? 'not.' : ''

      the('calendar').should(`${isNot}be.visible`)
    })

    Then('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('@id-3: Focus input field when {string} and `show-calendar-on-focus` is true', () => {
    Given('`show-calendar-on-focus` is true', () => {
      getStore().setState('showCalendarOnFocus', true)
    })

    When('the user focuses the input field', () => {
      focusThe('input')
    })
  })

  describe('@id-4: Focus the typeable input field when {string} and `show-calendar-on-focus` is true', () => {
    Given('the typeable calendar is {string}', (openOrClosed) => {
      const isNot = openOrClosed === 'closed' ? 'not.' : ''

      createCalendar({
        calendarButton: true,
        showCalendarOnButtonClick: true,
        typeable: true,
      })

      if (openOrClosed === 'open') {
        clickThe('calendar-button')
      }

      the('calendar').should(`${isNot}be.visible`)
    })
  })
})
