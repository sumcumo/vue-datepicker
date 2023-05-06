import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Clear button', () => {
  describe('@id-1: Click on clear button', () => {
    Given('the calendar is {string} and a date is selected', (openOrClosed) => {
      createCalendar({
        clearButton: true,
        modelValue: new Date(2021, 2, 1),
      })

      if (openOrClosed === 'open') {
        clickThe('input')
      }
    })

    When('the user clicks on the clear button', () => {
      clickThe('clear-button', { force: true })
    })

    Then('the calendar closes', () => {
      the('calendar').should(`not.be.visible`)
    })

    And('the date is cleared', () => {
      the('input').should('have.value', '')
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('@id-2: Click on clear button: typeable', () => {
    Given(
      'the typeable calendar is {string} and a date is selected',
      (openOrClosed) => {
        const isNot = openOrClosed === 'closed' ? 'not.' : ''

        createCalendar({
          clearButton: true,
          typeable: true,
          modelValue: new Date(2021, 2, 1),
        })

        if (openOrClosed === 'open') {
          clickThe('input')
        }

        the('calendar').should(`${isNot}be.visible`)
      },
    )

    When('the user clicks on the clear button')

    Then('the calendar remains closed', () => {
      the('calendar').should('not.be.visible')
    })

    And('the date is cleared')

    And('the input field has focus')
  })

  describe('@id-3: Press the enter key', () => {
    Given('the calendar is closed and a date is selected', () => {
      createCalendar({
        clearButton: true,
        modelValue: new Date(2021, 2, 1),
      })

      the('calendar').should('not.be.visible')
    })

    When('the user focuses the clear button and presses the enter key', () => {
      the('clear-button').type('{enter}')
    })

    Then('the calendar remains closed')

    And('the date is cleared')

    And('the input field has focus')
  })

  describe('@id-4: Press the space bar', () => {
    Given('the calendar is closed and a date is selected')

    When('the user focuses the clear button and presses the space bar', () => {
      focusThe('clear-button').type('{space}')
    })

    Then('the calendar remains closed')

    And('the date is cleared')

    And('the input field has focus')
  })
})
