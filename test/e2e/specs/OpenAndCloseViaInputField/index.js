import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { blurThe, clickThe, focusThe, the, visit } = cy

describe('Open and close the calendar via the input field', () => {
  describe('Click on the input field when the calendar is closed', () => {
    Given('the calendar is closed', () => {
      visit('/')
    })

    When('a user clicks on the input field', () => {
      clickThe('input')
    })

    Then('the calendar opens', () => {
      the('calendar').should('not.have.css', 'display', 'none')
    })

    // And("today's cell has focus", () => {
    //
    // })
  })

  describe('Click on the input field when the calendar is open', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    When('a user clicks on the input field', () => {
      clickThe('input')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('Blur the input field when the calendar is closed', () => {
    Given('the calendar is closed', () => {
      visit('/')
    })

    And('the input field is focused', () => {
      focusThe('input')
    })

    When('the input field is blurred', () => {
      blurThe('input')
    })

    Then('the calendar remains closed', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    // And('no element in the calendar is focused, () => {
    //
    // })
  })

  describe('Blur the input field when the calendar is open', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    And('the input field is focused', () => {
      focusThe('input')
    })

    When('the input field is blurred', () => {
      blurThe('input')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    // And('no element in the calendar is focused, () => {
    //
    // })
  })
})
