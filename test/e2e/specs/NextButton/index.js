import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Next Button', () => {
  describe('@id-1: Select by {string}', () => {
    Given('the calendar is open on `Dec 2020`', () => {
      createCalendar({
        openDate: new Date(2020, 11, 1),
      })

      clickThe('input')

      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

    When('the user performs a {string} action', (action) => {
      if (action === 'click') {
        clickThe('next-button')
        return
      }

      the('next-button').type(`{${action}}`)
    })

    Then('the page is `Jan 2021`', () => {
      the('up-button').should('contain', 'Jan 2021')
    })

    Then('the next button has focus', () => {
      the('next-button').should('be.focused')
    })
  })

  describe('@id-2: Arrow down to tabbable cell', () => {
    When('the user presses the `down` arrow', () => {
      focusThe('next-button').type('{downarrow}')
    })

    Then('the tabbable cell has focus', () => {
      the('tabbable-cell').should('be.focused')
    })
  })

  describe('@id-3: Press {string} arrow (isRtl: {string}, isMaximumView: {string}, isPrevDisabled: {string}', () => {
    Given(
      'the calendar is open with isRtl: {string}, isMaximumView: {string}, isPrevDisabled: {string}',
      (isRtl, isMaximumView, isPrevDisabled) => {
        const language = isRtl === 'true' ? 'ar' : 'en'
        const initialView = isMaximumView === 'true' ? 'year' : 'day'
        const disabledDates = {
          to: isPrevDisabled === 'true' ? new Date(2020, 11, 1) : null,
        }

        createCalendar({
          calendarButton: true,
          disabledDates,
          initialView,
          language,
          openDate: new Date(2020, 11, 1),
        })

        clickThe('input')

        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    When('the user presses the {string} arrow', (direction) => {
      focusThe('next-button').type(`{${direction}Arrow}`)
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
