import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Calendar button', () => {
  describe('@id-1: Click on calendar button: {string}', () => {
    Given('the calendar is {string}', (openOrClosed) => {
      createCalendar({
        calendarButton: true,
      })

      if (openOrClosed === 'open') {
        clickThe('calendar-button')
      }
    })

    When('the user clicks the calendar button', () => {
      clickThe('calendar-button')
    })

    Then('the calendar {string}', (opensOrCloses) => {
      const isNot = opensOrCloses === 'closes' ? 'not.' : ''

      the('calendar').should(`${isNot}be.visible`)
    })

    And('the {string} has focus', (element) => {
      the(element).should('have.focus')
    })
  })

  describe('@id-2: Click on calendar button: typeable', () => {
    Given(
      'the typeable calendar is {string} and a {string} date is typed',
      (openOrClosed, validity) => {
        const date = validity === 'valid' ? '1 March 2021' : 'invalid date'
        const isNot = openOrClosed === 'closed' ? 'not.' : ''

        createCalendar({
          calendarButton: true,
          typeable: true,
        })

        if (openOrClosed === 'open') {
          clickThe('calendar-button')
        }

        focusThe('input').type(date)

        the('picker-cells').should('have.length', 1)
        the('calendar').should(`${isNot}be.visible`)
      },
    )

    When('the user clicks the calendar button')

    Then('the calendar {string}')

    And('the date is {string}', (formattedOrCleared) => {
      const value = formattedOrCleared === 'formatted' ? '01 Mar 2021' : ''

      the('input').should('have.value', value)
    })

    And('the {string} has focus')
  })

  describe('@id-3: Press the enter key', () => {
    Given('the calendar is closed', () => {
      createCalendar({
        calendarButton: true,
      })
    })

    When('the user presses the enter key', () => {
      the('calendar-button').type('{enter}')
    })

    Then('the calendar opens', () => {
      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    And("today's cell has focus", () => {
      the('today-cell').should('have.focus')
    })
  })

  describe('@id-4: Press the enter key: typeable', () => {
    Given('the typeable calendar is {string} and a {string} date is typed')

    When('the user presses the enter key')

    Then('the calendar {string}')

    And('the date is {string}')

    And('the input has focus', () => {
      the('input').should('have.focus')
    })
  })

  describe('@id-5: Press the space bar', () => {
    Given('the calendar is {string}')

    When('the user presses the space bar', () => {
      focusThe('calendar-button').type(`{space}`)
    })

    Then('the calendar {string}')

    And("today's cell has focus")
  })

  describe('@id-6: Press the space bar: typeable', () => {
    Given('the typeable calendar is {string} and a {string} date is typed')

    When('the user presses the space bar')

    Then('the calendar {string}')

    And('the date is {string}')

    And('the input has focus')
  })
})
