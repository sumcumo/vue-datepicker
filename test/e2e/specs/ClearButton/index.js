import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, getStore, the, visit } = cy

describe('Clear button', () => {
  Given('the calendar is closed', () => {
    visit('/')
  })

  And('`calendar-button` is true', () => {
    getStore().setState('calendarButton', true)
  })

  And('`clear-button` is true', () => {
    getStore().setState('clearButton', true)
  })

  And('a date is selected', () => {
    getStore().setState('value', '01 Mar 2021')
  })

  describe('Click on the clear button when the calendar is closed', () => {
    When('the clear button is clicked', () => {
      clickThe('clear-button')
    })

    Then('the date is cleared', () => {
      getStore().getState('value', null)
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  // describe('Press enter when the clear button is focused and the calendar is closed', () => {
  //   Given('the clear button is focused', () => {
  //     focusThe('clear-button')
  //   })
  //
  //   When('the enter key is pressed', () => {
  //     the('clear-button').type('{enter}')
  //   })
  //
  //   Then('the date is cleared', () => {
  //     getStore().getState('value', null)
  //   })
  //
  //   And('the input field has focus', () => {
  //     the('input').should('be.focused')
  //   })
  // })
})
