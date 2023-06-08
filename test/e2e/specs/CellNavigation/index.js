import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { createCalendar, clickThe, the, theFirst } = cy

function localTimeZone(dateStr) {
  const parts = dateStr.split('-')

  return new Date(parts[0], parts[1] - 1, parts[2])
}

describe('Cell Navigation', () => {
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

    Then('the picker slides to the {string}', (slideDirection) => {
      theFirst('picker-cells').should(
        'have.class',
        `slide-${slideDirection}-leave-active`,
      )
    })
  })

  describe('@id-3: Arrow {string} to {string} page when destination and all cells beyond are disabled', () => {
    Given(
      'the calendar is open on {string} with view {string} and disabled dates {string} {string}',
      // eslint-disable-next-line max-params
      (openDate, view, toOrFrom, disabled) => {
        createCalendar({
          openDate: localTimeZone(openDate),
          disabledDates: {
            [toOrFrom]: localTimeZone(disabled),
          },
          initialView: view,
        })

        clickThe('input')

        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    Then('the focused cell is {string}', (focusedCell) => {
      the('picker-cells')
        .should('have.length', 1)
        .get('button.cell:not(.muted)')
        .contains(focusedCell)
        .should('be.focused')
    })
  })
})
