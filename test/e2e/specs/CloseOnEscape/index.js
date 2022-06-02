import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Close on escape', () => {
  describe('@id-1: Close by pressing escape on the {string}', () => {
    Given('the calendar is open', () => {
      createCalendar({
        openDate: new Date(2020, 2, 15),
      })

      clickThe('input')

      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    When('the user focuses the {string} and presses escape', (element) => {
      focusThe(element).type('{esc}')
    })

    Then('the calendar {string}', (opensOrCloses) => {
      const isNot = opensOrCloses === 'closes' ? 'not.' : ''

      the('calendar').should(`${isNot}be.visible`)
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('@id-2: Revert to open date when the focused cell is on the same page', () => {
    Given('the calendar is open on a {string} view', (minimumView) => {
      createCalendar({
        openDate: new Date(2020, 2, 15),
        minimumView,
      })

      clickThe('input')
      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    When(
      'the user focuses another cell on the same {string} view and presses the escape key',
      (view) => {
        let cellText = ''

        switch (view) {
          case 'day':
            cellText = '20'
            break
          case 'month':
            cellText = 'December'
            break
          default:
            cellText = '2029'
        }

        the('picker-cells').contains(cellText).focus().type('{esc}')
      },
    )

    Then('the open date has focus', () => {
      the('open-date').should('be.focused')
    })
  })

  describe('@id-3: Revert to open date when the focused cell is on a different page', () => {
    Given('the calendar is open on a {string} view')

    And('the user visits another page', () => {
      clickThe('next-button')
    })

    When('the user focuses a cell and presses the escape key', () => {
      the('tabbable-cell').should('have.length', 1).focus().type('{esc}')
    })

    Then('the open date has focus')
  })

  describe('@id-4: Revert to open date when the focused cell is on a different view', () => {
    Given(
      'the calendar is open with a {string} initial view',
      (initialView) => {
        createCalendar({
          openDate: new Date(2020, 2, 15),
          initialView,
        })

        clickThe('input')
        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    When('the user focuses a cell and presses the escape key')

    Then('the open date on the minimum view has focus', () => {
      the('up-button').contains('Mar 2020')
      the('open-date').should('be.focused')
    })
  })
})
