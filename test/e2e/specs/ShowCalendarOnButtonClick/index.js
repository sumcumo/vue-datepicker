import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, getStore, the, visit } = cy

describe('Show calendar on button click', () => {
  describe('Click on the calendar button when the calendar is closed', () => {
    Given('the calendar is closed', () => {
      visit('/')
    })

    And('`calendar-button` is true', () => {
      getStore().setState('calendarButton', true)
    })

    And('`show-calendar-on-button-click` is true', () => {
      getStore().setState('showCalendarOnButtonClick', true)
    })

    When('the calendar button is clicked', () => {
      clickThe('calendar-button')
    })

    Then('the calendar opens', () => {
      the('calendar').should('not.have.css', 'display', 'none')
    })

    // And("today's cell has focus", () => {
    //
    // })
  })

  describe('Click on the calendar button when the calendar is open', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    And('`calendar-button` is true', () => {
      getStore().setState('calendarButton', true)
    })

    And('`show-calendar-on-button-click` is true', () => {
      getStore().setState('showCalendarOnButtonClick', true)
    })

    When('the calendar button is clicked', () => {
      clickThe('calendar-button')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    // And("the calendar button has focus", () => {
    //
    // })
  })

  describe('Click on the input field when the calendar is closed', () => {
    Given('the calendar is closed', () => {
      visit('/')
    })

    And('`show-calendar-on-button-click` is true', () => {
      getStore().setState('showCalendarOnButtonClick', true)
    })

    When('a user clicks on the input field', () => {
      clickThe('input')
    })

    Then('the calendar remains closed', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the input field has focus', () => {
      the('input').should('have.focus')
    })
  })

  describe('Click on the input field when the calendar is open', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    And('`show-calendar-on-button-click` is true', () => {
      getStore().setState('showCalendarOnButtonClick', true)
    })

    When('a user clicks on the input field', () => {
      clickThe('input')
    })

    Then('the calendar remains open', () => {
      the('calendar').should('not.have.css', 'display', 'none')
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('Focus the input field when the calendar is closed', () => {
    Given('the calendar is closed', () => {
      visit('/')
    })

    And('`show-calendar-on-button-click` is true', () => {
      getStore().setState('showCalendarOnButtonClick', true)
    })

    When('the input field is focused', () => {
      clickThe('input')
    })

    Then('the calendar remains closed', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  // describe('Focus the input field when the calendar is closed and `show-calendar-on-focus` is true', () => {
  //   Given('the calendar is closed', () => {
  //     visit('/')
  //   })
  //
  //   And('`show-calendar-on-button-click` is true', () => {
  //     getStore().setState('showCalendarOnButtonClick', true)
  //   })
  //
  //   And('`show-calendar-on-focus` is true', () => {
  //     getStore().setState('showCalendarOnFocus', true)
  //   })
  //
  //   When('the input field is focused', () => {
  //     focusThe('input')
  //   })
  //
  //   Then('the calendar remains closed', () => {
  //     the('calendar').should('have.css', 'display', 'none')
  //   })
  //
  //   And('the input field has focus', () => {
  //     the('input').should('be.focused')
  //   })
  // })
})
