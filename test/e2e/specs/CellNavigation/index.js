import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { createCalendar, clickThe, the, theFirst } = cy

describe('Focusable Cell', () => {
  describe('@id-1: Arrow {string} (isRtl: {string})', () => {
    Given(
      'the calendar is open on {string} and isRtl is {string}',
      (openDate, isRtl) => {
        const language = isRtl === 'true' ? 'ar' : 'en'

        createCalendar({
          language,
          openDate,
        })

        clickThe('input')

        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    When('the user presses the {string} arrow', (direction) => {
      the('tabbable-cell').type(`{${direction}arrow}`)
    })

    Then('the {string} has focus', (newDate) => {
      const dayOfMonth = Number(newDate.split('-')[2])

      the('picker-cells')
        .should('have.length', 1)
        .get('button.cell:not(.muted)')
        .contains(dayOfMonth)
        .should('be.focused')
    })
  })

  describe('@id-2: Arrow {string} to {string} page', () => {
    Given('the calendar is open on {string}', (openDate) => {
      createCalendar({
        openDate,
      })

      clickThe('input')

      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    When('the user presses the {string} arrow')

    Then('the picker slides to the {string}', (slideDirection) => {
      theFirst('picker-cells').should(
        'have.class',
        `slide-${slideDirection}-leave-active`,
      )
    })

    And('the {string} has focus')
  })
})
