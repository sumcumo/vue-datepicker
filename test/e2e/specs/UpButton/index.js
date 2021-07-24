import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Up Button', () => {
  describe('@id-1: Select up button by {string}', () => {
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
        clickThe('up-button')
        return
      }

      focusThe('up-button').type(`{${action}}`)
    })

    Then('the page is `2021`', () => {
      the('picker-cells').should('have.length', 1)
      the('up-button').should('contain', '2021')
    })

    And('the up button has focus', () => {
      the('up-button').should('be.focused')
    })
  })

  describe('@id-2: Arrow down to tabbable cell', () => {
    Given('the calendar is open on `Jan 2021`')

    When('the user presses the `down` arrow', () => {
      focusThe('up-button').type('{downarrow}')
    })

    Then('the tabbable cell has focus', () => {
      the('tabbable-cell').should('be.focused')
    })
  })

  describe('@id-3: Arrow {string} (isRtl: {string}, isPrevDisabled: {string}, isNextDisabled: {string}', () => {
    Given(
      'the calendar is open with isRtl: {string}, isPrevDisabled: {string}, isNextDisabled: {string}',
      (isRtl, isPrevDisabled, isNextDisabled) => {
        const language = isRtl === 'true' ? 'ar' : 'en'
        const disabledDates = {
          from: isNextDisabled === 'true' ? new Date(2021, 0, 31) : null,
          to: isPrevDisabled === 'true' ? new Date(2021, 0, 1) : null,
        }

        createCalendar({
          disabledDates,
          language,
          openDate: new Date(2021, 0, 1),
        })

        clickThe('input')

        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    When('the user presses the {string} arrow', (direction) => {
      focusThe('up-button').type(`{${direction}Arrow}`)
    })

    Then('the {string} has focus', (element) => {
      the(element).should('be.focused')
    })
  })

  describe('@id-4: Typeable: Arrow {string} (isRtl: {string}, isPrevDisabled: {string}, isNextDisabled: {string}', () => {
    Given(
      'the typeable calendar is open with isRtl: {string}, isPrevDisabled: {string}, isNextDisabled: {string}',
      (isRtl, isPrevDisabled, isNextDisabled) => {
        const language = isRtl === 'true' ? 'ar' : 'en'
        const disabledDates = {
          from: isNextDisabled === 'true' ? new Date(2021, 0, 31) : null,
          to: isPrevDisabled === 'true' ? new Date(2021, 0, 1) : null,
        }

        createCalendar({
          disabledDates,
          language,
          openDate: new Date(2021, 0, 1),
          typeable: true,
        })

        clickThe('input')

        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    When('the user presses the {string} arrow')

    Then('the {string} has focus')
  })
})
