import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { clickThe, createCalendar, the } = cy

describe('Cell selection', () => {
  describe('@id-1: Select a cell: minimum view', () => {
    Given(
      'the calendar is open on the minimum view: {string}',
      (minimumView) => {
        createCalendar({
          openDate: new Date(2020, 2, 15),
          minimumView,
        })

        clickThe('input')
        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    When('the user clicks on the tabbable cell', () => {
      clickThe('tabbable-cell')
    })

    Then('the date is submitted with a value of {string}', (date) => {
      the('input').should('have.value', date)
    })

    Then('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('@id-2: Select a cell: higher than minimum view', () => {
    Given('the calendar is open on a {string} view', (initialView) => {
      createCalendar({
        openDate: new Date(2020, 2, 15),
        initialView,
      })

      clickThe('input')
      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    Then('the {string} view is shown', (view) => {
      const pageHeading = view === 'day' ? 'Mar 2020' : '2020'

      the('picker-cells').should('have.length', 1)
      the('up-button').should('contain', pageHeading)
    })

    Then('the tabbable cell has focus', () => {
      the('tabbable-cell').should('be.focused')
    })
  })
})
