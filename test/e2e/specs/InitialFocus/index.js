import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { clickThe, createCalendar, the } = cy

describe('Set the initial focus', () => {
  describe('@id-1: Open date and <pastOrFuture> dates are disabled', () => {
    Given('open date and {string} dates are disabled', (pastOrFuture) => {
      const openDate = new Date(2021, 6, 15)
      const oneDayAfterOpenDate = new Date(2021, 6, 16)
      const oneDayBeforeOpenDate = new Date(2021, 6, 14)
      const disabledDates =
        pastOrFuture === 'past'
          ? {
              to: oneDayAfterOpenDate,
            }
          : {
              from: oneDayBeforeOpenDate,
            }

      createCalendar({
        calendarButton: true,
        disabledDates,
        openDate,
      })
    })

    When('the user clicks on the input field', () => {
      clickThe('input')
    })

    Then('the calendar opens', () => {
      the('calendar').should('be.visible')
    })

    And('the {string} cell has focus', (firstAvailableCell) => {
      const cellId = firstAvailableCell === 'next-day' ? 19 : 4

      cy.get(`[data-id=${cellId}]`).should('have.focus')
    })
  })

  describe('@id-2: Dates this month and in the <pastOrFuture> are disabled', () => {
    Given(
      'dates this month and in the {string} are disabled',
      (pastOrFuture) => {
        const openDate = new Date(2021, 6, 15)
        const nextMonth = new Date(2021, 7, 15)
        const previousMonth = new Date(2021, 5, 15)
        const disabledDates =
          pastOrFuture === 'past'
            ? {
                to: nextMonth,
              }
            : {
                from: previousMonth,
              }

        createCalendar({
          calendarButton: true,
          disabledDates,
          openDate,
        })
      },
    )

    When('the user clicks on the input field', () => {
      clickThe('input')
    })

    Then('the calendar opens', () => {
      the('calendar').should('be.visible')
    })

    And('the {string} has focus', (element) => {
      the(element).should('have.focus')
    })
  })
})
