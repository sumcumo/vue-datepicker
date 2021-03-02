import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, the, visit } = cy

describe('Close on escape', () => {
  describe('Press the escape key', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    When('the escape key is pressed', () => {
      the('body').type('{esc}')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    And('the input field is focused', () => {
      the('input').should('be.focused')
    })
  })
})
