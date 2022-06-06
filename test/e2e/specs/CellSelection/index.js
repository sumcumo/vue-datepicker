import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Focusable Cell', () => {
  describe('@id-1: Select by {string}: minimum view', () => {
    Given('the calendar is open on the minimum view', () => {
      createCalendar({
        openDate: new Date(2020, 2, 15),
      })

      clickThe('input')
      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    When('the user performs a {string} action', (action) => {
      if (action === 'click') {
        clickThe('tabbable-cell')
        return
      }

      focusThe('tabbable-cell').type(`{${action}}`)
    })

    Then('the date is submitted', () => {
      the('input').should('have.value', '15 Mar 2020')
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('@id-2: Select by {string}: NOT minimum view', () => {
    Given('the calendar is open on a higher than minimum view', () => {
      createCalendar({
        openDate: new Date(2020, 2, 15),
        initialView: 'month',
      })

      clickThe('input')
      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    When('the user performs a {string} action')

    Then('the `day` view is shown', () => {
      the('picker-cells').should('have.length', 1)
      the('up-button').should('contain', 'Mar 2020')
    })

    And('the tabbable cell has focus', () => {
      the('tabbable-cell').should('be.focused')
    })
  })
})
