import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { clickThe, createCalendar, focusThe, the } = cy

describe('Up Button', () => {
  describe('@id-1: Click up button when initialView is <initialView> and maximumView is <maximumView>', () => {
    Given(
      'the open date is 1st Jan 2021 and the calendar is on the {string} view with a `maximumView` of {string}',
      (initialView, maximumView) => {
        createCalendar({
          openDate: new Date(2021, 0, 1),
          initialView,
          maximumView,
        })

        clickThe('input', { force: true })

        the('picker-cells').should('have.length', 1)
        the('calendar').should('be.visible')
      },
    )

    When('the user clicks on the up button', () => {
      clickThe('up-button')
    })

    Then('the page is {string}', (page) => {
      the('picker-cells').should('have.length', 1)
      the('up-button').should('contain', page)
    })

    Then('the {string} button has focus', (element) => {
      the(element).should('be.focused')
    })
  })

  describe('@id-2: Arrow down to tabbable cell', () => {
    Given('the calendar is open on `Jan 2021`', () => {
      createCalendar({
        openDate: new Date(2021, 0, 1),
      })

      clickThe('input', { force: true })

      the('picker-cells').should('have.length', 1)
      the('calendar').should('be.visible')
    })

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
  })
})
