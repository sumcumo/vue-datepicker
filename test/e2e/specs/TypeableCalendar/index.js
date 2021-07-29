import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

const { createCalendar, clickThe, focusThe, the } = cy

describe('@id-1: Press the enter key', () => {
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

      the('calendar').should(`${isNot}be.visible`)
    },
  )

  When('the user presses the enter key', () => {
    focusThe('input').type(`{enter}`)
  })

  Then('the calendar {string}', (opensOrCloses) => {
    const isNot = opensOrCloses === 'closes' ? 'not.' : ''

    the('calendar').should(`${isNot}be.visible`)
  })

  And('the date is {string}', (formattedOrCleared) => {
    const value = formattedOrCleared === 'formatted' ? '01 Mar 2021' : ''

    the('input').should('have.value', value)
  })

  And('the input has focus', () => {
    the('input').should('have.focus')
  })
})

describe('@id-2: Press the down arrow', () => {
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

      the('calendar').should(`${isNot}be.visible`)
    },
  )

  When('the user presses the `down` arrow', () => {
    focusThe('input').type(`{downArrow}`)
  })

  Then('the calendar {string}', (opensOrCloses) => {
    const isNot = opensOrCloses === 'closes' ? 'not.' : ''

    the('calendar').should(`${isNot}be.visible`)
  })

  And('the date is {string}', (formattedOrCleared) => {
    const value = formattedOrCleared === 'formatted' ? '01 Mar 2021' : ''

    the('input').should('have.value', value)
  })

  And('the previous button has focus', () => {
    the('previous-button').should('have.focus')
  })
})

describe('@id-3: Press the down arrow (no header)', () => {
  Given(
    'the typeable calendar with no header is {string} and a {string} date is typed',
    (openOrClosed, validity) => {
      const date = validity === 'valid' ? '1 March 2021' : 'invalid date'
      const isNot = openOrClosed === 'closed' ? 'not.' : ''

      createCalendar({
        showHeader: false,
        typeable: true,
      })

      if (openOrClosed === 'open') {
        clickThe('input')
      }

      focusThe('input').type(date)

      the('calendar').should(`${isNot}be.visible`)
    },
  )

  When('the user presses the `down` arrow')

  Then('the calendar {string}')

  And('the date is {string}')

  And('the tabbable cell has focus', () => {
    the('tabbable-cell').should('have.focus')
  })
})
