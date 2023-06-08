import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

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

    Then('the {string} has focus', (element) => {
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

    Then('the date is {string}', (formattedOrCleared) => {
      const value = formattedOrCleared === 'formatted' ? '01 Mar 2021' : ''

      the('input').should('have.value', value)
    })
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

    Then("today's cell has focus", () => {
      the('today-cell').should('have.focus')
    })
  })

  describe('@id-4: Press the enter key: typeable', () => {
    Then('the input has focus', () => {
      the('input').should('have.focus')
    })
  })

  describe('@id-5: Press the space bar', () => {
    When('the user presses the space bar', () => {
      focusThe('calendar-button').type(`{space}`)
    })
  })
})
