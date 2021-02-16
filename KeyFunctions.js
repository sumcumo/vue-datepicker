export const dateSelector = '.picker-view > div > button:not(.muted)'

const getElement = ({ current, changePage, selector, minSteps = 0, type }) => {
  // eslint-disable-next-line no-param-reassign
  minSteps -= 1
  const isNext = type === 'next'
  let element = isNext
    ? current.nextElementSibling
    : current.previousElementSibling
  if (element) {
    const isMuted = element.classList.value.split(' ').includes('muted')
    const isDisabled = element.disabled

    if (isMuted || isDisabled) {
      return getElement({
        current: element,
        changePage,
        minSteps,
        type,
      })
    }
  } else {
    const count = isNext ? 1 : -1
    // TODO skip disabled next page
    changePage(count)
    const elements = document.querySelectorAll(dateSelector)
    const elementIndex = isNext ? 1 : elements.length - 1
    element = elements[elementIndex]
    return getElement({
      current: element,
      changePage,
      minSteps,
      type,
    })
  }
  if (minSteps > 0) {
    return getElement({
      current: element,
      changePage,
      minSteps,
      type,
    })
  }
  return element
}

export const setFocusToAvailableCell = ({ changePage, minSteps, type }) => {
  const active = document.activeElement
  const element = getElement({
    minSteps,
    current: active,
    type,
    changePage,
  })
  element.focus()
  return element
}
