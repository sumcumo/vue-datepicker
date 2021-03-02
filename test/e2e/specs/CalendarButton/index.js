import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, getStore, the, visit } = cy

describe('Calendar button', () => {
  describe('Click on the calendar button when the calendar is closed', () => {
    Given('the calendar is closed', () => {
      visit('/')
    })

    And('`calendar-button` is true', () => {
      getStore().setState('calendarButton', true)
    })

    When('the calendar button is clicked', () => {
      clickThe('calendar-button')
    })

    Then('the calendar opens', () => {
      the('calendar').should('not.have.css', 'display', 'none')
    })

    And("And today's cell has focus", () => {
      //
    })
  })

  describe('Click on the calendar button when the calendar is open', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    And('`calendar-button` is true', () => {
      getStore().setState('calendarButton', true)
    })

    When('the calendar button is clicked', () => {
      clickThe('calendar-button')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the calendar button has focus', () => {
      the('calendar-button').should('have.focus')
    })
  })

  // describe('Press enter when the calendar button is focused and the calendar is closed', () => {
  //   Given('the calendar is closed', () => {
  //     visit('/')
  //   })
  //
  //   And('`calendar-button` is true', () => {
  //     getStore().setState('calendarButton', true)
  //   })
  //
  //   And('the calendar button is focused', () => {
  //     focusThe('calendar-button')
  //   })
  //
  //   When('the enter key is pressed', () => {
  //     the('calendar-button').type('{enter}')
  //   })
  //
  //   Then('the calendar opens', () => {
  //     the('calendar').should('not.have.css', 'display', 'none')
  //   })
  //
  //   And("And today's cell has focus", () => {
  //     //
  //   })
  // })

  // describe('Press space when the calendar button is focused and the calendar is closed', () => {
  //   Given('the calendar is closed', () => {
  //     visit('/')
  //   })
  //
  //   And('`calendar-button` is true', () => {
  //     getStore().setState('calendarButton', true)
  //   })
  //
  //   And('the calendar button is focused', () => {
  //     focusThe('calendar-button')
  //   })
  //
  //   When('the space bar is pressed', () => {
  //     the('body').type('{space}')
  //   })
  //
  //   Then('the calendar opens', () => {
  //     the('calendar').should('not.have.css', 'display', 'none')
  //   })
  //
  //   And("And today's cell has focus", () => {
  //     //
  //   })
  // })
})
