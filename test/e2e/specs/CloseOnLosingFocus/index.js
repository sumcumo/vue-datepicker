import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, the, visit } = cy

describe('Close on losing focus', () => {
  describe('Click outside', () => {
    Given('the calendar is open', () => {
      visit('/')
      clickThe('input')
    })

    When('the body is clicked', () => {
      clickThe('body')
    })

    Then('the calendar closes', () => {
      the('calendar').should('have.css', 'display', 'none')
    })

    // And('no element in the calendar is focused, () => {
    //
    // })
  })
})
