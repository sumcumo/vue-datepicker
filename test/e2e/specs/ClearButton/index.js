import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

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

    Then('the date is cleared', () => {
      the('input').should('have.value', '')
    })

    Then('the input field has focus', () => {
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

    Then('the calendar remains closed', () => {
      the('calendar').should('not.be.visible')
    })
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
  })

  describe('@id-4: Press the space bar', () => {
    When('the user focuses the clear button and presses the space bar', () => {
      focusThe('clear-button').type('{space}')
    })
  })
})
