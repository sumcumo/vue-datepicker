import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Close on escape', () => {
  describe('@id-1: Clear date when a typeable calendar is {string}', () => {
    Given(
      'the typeable calendar is {string} and a {string} date is typed',
      (openOrClosed, validity) => {
        const date = validity === 'valid' ? '1 March 2021' : 'invalid date'
        const isNot = openOrClosed === 'closed' ? 'not.' : ''

        createCalendar({
          typeable: true,
        })

        if (openOrClosed === 'open') {
          clickThe('input')
        }

        focusThe('input').type(date)

        the('picker-cells').should('have.length', 1)
        the('calendar').should(`${isNot}be.visible`)
      },
    )

    When('the user focuses the input field and presses escape', () => {
      focusThe('input').type('{esc}')
    })

    Then('the calendar {string}', (opensOrCloses) => {
      const isNot = opensOrCloses === 'closes' ? 'not.' : ''

      the('calendar').should(`${isNot}be.visible`)
    })

    And('the input field has focus', () => {
      the('input').should('be.focused')
    })
  })

  describe('@id-2: Close by pressing escape on the {string}', () => {
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

    Then('the calendar closes', () => {
      the('calendar').should('not.be.visible')
    })

    And('the input field has focus')
  })

  describe('@id-3: Revert to open date when the focused cell is on the same page', () => {
    Given('the calendar is open')

    When('the user focuses another cell and presses the escape key', () => {
      the('picker-cells').contains(20).focus().type('{esc}')
    })

    Then('the open date has focus', () => {
      the('open-date').should('be.focused')
    })
  })

  describe('@id-4: Revert to open date when the focused cell is on a different page', () => {
    Given('the calendar is open')

    And('the user visits another page', () => {
      clickThe('next-button')
    })

    When('the user focuses a cell and presses the escape key', () => {
      the('tabbable-cell').should('have.length', 1).focus().type('{esc}')
    })

    Then('the open date has focus')
  })

  describe('@id-5: Revert to open date when the focused cell is on a different view', () => {
    Given('the calendar is open')

    And('the user visits the next view up', () => {
      clickThe('up-button')
    })

    When('the user focuses a cell and presses the escape key')

    Then('the open date has focus')
  })
})
