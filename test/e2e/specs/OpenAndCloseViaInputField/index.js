import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Open and close the calendar via the input field', () => {
  describe('@id-1: Click on input field', () => {
    Given('the calendar is {string}', (openOrClosed) => {
      const isNot = openOrClosed === 'closed' ? 'not.' : ''

      createCalendar({
        calendarButton: true,
      })

      if (openOrClosed === 'open') {
        clickThe('input')
      }

      the('calendar').should(`${isNot}be.visible`)
    })

    When('the user clicks on the input field', () => {
      clickThe('input')
    })

    Then('the calendar {string}', (opensOrCloses) => {
      const isNot = opensOrCloses === 'closes' ? 'not.' : ''

      the('calendar').should(`${isNot}be.visible`)
    })

    Then('the {string} has focus', (element) => {
      the(element).should('have.focus')
    })
  })

  describe('@id-2: Press space bar: closed', () => {
    Given('the calendar is closed', () => {
      createCalendar()
      the('calendar').should('not.be.visible')
    })

    When('the user focuses input field and presses the space bar', () => {
      focusThe('input').type('{space}', { force: true })
    })

    Then('the calendar opens', () => {
      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    Then("today's cell has focus", () => {
      the('today-cell').should('have.focus')
    })
  })
})
