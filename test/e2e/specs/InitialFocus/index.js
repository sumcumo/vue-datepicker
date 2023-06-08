import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const { clickThe, createCalendar, the } = cy

describe('Set the initial focus', () => {
  describe('@id-1: initialView is <initialView>', () => {
    Given('the initialView is {string}', (initialView) => {
      const openDate = new Date(2021, 6, 15)

      createCalendar({
        openDate,
        initialView,
      })
    })

    When('the user opens the calendar', () => {
      clickThe('input')
    })

    Then('the calendar opens', () => {
      the('calendar').should('be.visible')
    })

    Then('the focusable-cell cell for {string} has focus', (initialView) => {
      let cellId

      switch (initialView) {
        case 'day':
          cellId = 18
          break
        case 'month':
          cellId = 6
          break
        default:
          cellId = 1
      }

      cy.get(`[data-id=${cellId}]`).should('have.focus')
    })
  })

  describe('@id-2: Day view when <pastOrFuture> dates are disabled', () => {
    Given('a day view where {string} dates are disabled', (pastOrFuture) => {
      const openDate = new Date(2021, 6, 15)
      const oneDayBeforeOpenDate = new Date(2021, 6, 14)
      const oneDayAfterOpenDate = new Date(2021, 6, 16)
      const disabledDates =
        pastOrFuture === 'past'
          ? {
              to: oneDayAfterOpenDate,
            }
          : {
              from: oneDayBeforeOpenDate,
            }

      createCalendar({
        disabledDates,
        openDate,
      })
    })

    Then('the {string} day cell has focus', (firstAvailableCell) => {
      const cellId = firstAvailableCell === 'next-day' ? 19 : 4

      cy.get(`[data-id=${cellId}]`).should('have.focus')
    })
  })

  describe('@id-3: Month view when <pastOrFuture> dates are disabled', () => {
    Given('a month view where {string} dates are disabled', (pastOrFuture) => {
      const openDate = new Date(2021, 6, 15)
      const oneMonthBeforeOpenDate = new Date(2021, 5, 15)
      const oneMonthAfterOpenDate = new Date(2021, 7, 15)
      const disabledDates =
        pastOrFuture === 'past'
          ? {
              to: oneMonthAfterOpenDate,
            }
          : {
              from: oneMonthBeforeOpenDate,
            }

      createCalendar({
        disabledDates,
        initialView: 'month',
        openDate,
      })
    })

    Then('the {string} month cell has focus', (firstAvailableCell) => {
      const cellId = firstAvailableCell === 'next-month' ? 7 : 0

      cy.get(`[data-id=${cellId}]`).should('have.focus')
    })
  })

  describe('@id-4: Year view when <pastOrFuture> dates are disabled', () => {
    Given('a year view where {string} dates are disabled', (pastOrFuture) => {
      const openDate = new Date(2021, 6, 15)
      const oneYearBeforeOpenDate = new Date(2020, 6, 15)
      const oneYearAfterOpenDate = new Date(2022, 6, 15)
      const disabledDates =
        pastOrFuture === 'past'
          ? {
              to: oneYearAfterOpenDate,
            }
          : {
              from: oneYearBeforeOpenDate,
            }

      createCalendar({
        disabledDates,
        initialView: 'year',
        openDate,
      })
    })

    Then('the {string} cell has focus', (firstAvailableCell) => {
      const cellId = firstAvailableCell === 'next-year' ? 2 : 0

      cy.get(`[data-id=${cellId}]`).should('have.focus')
    })
  })

  describe('@id-5: Dates this month and in the <pastOrFuture> are disabled', () => {
    Given(
      'dates this month and in the {string} are disabled',
      (pastOrFuture) => {
        const openDate = new Date(2021, 6, 15)
        const previousMonth = new Date(2021, 5, 15)
        const nextMonth = new Date(2021, 7, 15)
        const disabledDates =
          pastOrFuture === 'past'
            ? {
                to: nextMonth,
              }
            : {
                from: previousMonth,
              }

        createCalendar({
          disabledDates,
          openDate,
        })
      },
    )

    Then('the {string} has focus', (element) => {
      the(element).should('have.focus')
    })
  })

  describe('@id-6: Dates this year and in the <pastOrFuture> are disabled', () => {
    Given(
      'dates this year and in the {string} are disabled',
      (pastOrFuture) => {
        const openDate = new Date(2021, 6, 15)
        const previousYear = new Date(2020, 6, 15)
        const nextYear = new Date(2022, 6, 15)
        const disabledDates =
          pastOrFuture === 'past'
            ? {
                to: nextYear,
              }
            : {
                from: previousYear,
              }

        createCalendar({
          disabledDates,
          initialView: 'month',
          openDate,
        })
      },
    )
  })

  describe('@id-7: Dates this decade and in the <pastOrFuture> are disabled', () => {
    Given(
      'dates this decade and in the {string} are disabled',
      (pastOrFuture) => {
        const openDate = new Date(2021, 6, 15)
        const previousDecade = new Date(2011, 6, 15)
        const nextDecade = new Date(2031, 6, 15)
        const disabledDates =
          pastOrFuture === 'past'
            ? {
                to: nextDecade,
              }
            : {
                from: previousDecade,
              }

        createCalendar({
          disabledDates,
          initialView: 'year',
          openDate,
        })
      },
    )
  })
})
