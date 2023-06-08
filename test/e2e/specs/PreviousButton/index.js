import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Previous Button', () => {
  describe('@id-1: Select by {string}', () => {
    Given('the calendar is open on `Jan 2021`', () => {
      createCalendar({
        openDate: new Date(2021, 0, 1),
      })

      clickThe('input')

      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    When('the user performs a {string} action', (action) => {
      if (action === 'click') {
        clickThe('previous-button')
        return
      }

      the('previous-button').type(`{${action}}`)
    })

    Then('the page is `Dec 2020`', () => {
      the('up-button').should('contain', 'Dec 2020')
    })

    Then('the previous button has focus', () => {
      the('previous-button').should('be.focused')
    })
  })

  describe('@id-2: Arrow down to tabbable cell', () => {
    When('the user presses the `down` arrow', () => {
      focusThe('previous-button').type('{downarrow}')
    })

    Then('the tabbable cell has focus', () => {
      the('tabbable-cell').should('be.focused')
    })
  })

  describe('@id-3: Press {string} arrow (isRtl: {string}, isMaximumView: {string}, isNextDisabled: {string}', () => {
    Given(
      'the calendar is open with isRtl: {string}, isMaximumView: {string}, isNextDisabled: {string}',
      (isRtl, isMaximumView, isNextDisabled) => {
        const language = isRtl === 'true' ? 'ar' : 'en'
        const initialView = isMaximumView === 'true' ? 'year' : 'day'
        const disabledDates = {
          from: isNextDisabled === 'true' ? new Date(2021, 0, 31) : null,
        }

        createCalendar({
          calendarButton: true,
          disabledDates,
          initialView,
          language,
          openDate: new Date(2021, 0, 1),
        })

        clickThe('input')

        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    When('the user presses the {string} arrow', (direction) => {
      focusThe('previous-button').type(`{${direction}Arrow}`)
    })

    Then('the {string} has focus', (element) => {
      the(element).should('be.focused')
    })
  })

  describe('@id-4: Typeable: arrow up to input', () => {
    Given('the typeable calendar is open', () => {
      createCalendar({
        typeable: true,
      })

      clickThe('input')

      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    When('the user presses the `up` arrow', () => {
      focusThe('up-button').type('{uparrow}')
    })

    Then('the input has focus', () => {
      the('input').should('be.focused')
    })
  })
})
