/* eslint no-param-reassign: 0 */
/**
 * get the hidden element width, height
 * @param {HTMLElement} element dom
 */
export function getPopupElementSize(element) {
  const originalDisplay = element.style.display
  const originalVisibility = element.style.visibility
  element.style.display = 'block'
  element.style.visibility = 'hidden'
  const styles = window.getComputedStyle(element)
  const width = element.offsetWidth + parseInt(styles.marginLeft, 10) + parseInt(
    styles.marginRight,
    10,
  )
  const height = element.offsetHeight + parseInt(
    styles.marginTop,
    10,
  ) + parseInt(styles.marginBottom, 10)
  element.style.display = originalDisplay
  element.style.visibility = originalVisibility

  return {
    width,
    height,
  }
}

/**
 * get the popup position
 * @param {Element} el relative element
 * @param {Number} targetWidth target element's width
 * @param {Number} targetHeight target element's height
 * @param {Boolean} fixed
 * @param {String} fixedPosition
 */
export function getRelativePosition({
  el,
  targetWidth,
  targetHeight,
  fixed,
  // eslint-disable-next-line no-unused-vars
  fixedPosition,
}) {
  let left = 0
  let top = 0
  let offsetX = 0
  let offsetY = 0
  const relativeRect = el.getBoundingClientRect()
  const dw = document.documentElement.clientWidth
  const dh = document.documentElement.clientHeight
  if (fixed) {
    offsetX = window.pageXOffset + relativeRect.left
    offsetY = window.pageYOffset + relativeRect.top
  }
  if (dw - relativeRect.left < targetWidth && relativeRect.right < targetWidth) {
    left = offsetX - relativeRect.left + 1
  } else if (relativeRect.left + relativeRect.width / 2 <= dw / 2) {
    left = offsetX
  } else {
    left = offsetX + relativeRect.width - targetWidth
  }
  if (relativeRect.top <= targetHeight && dh - relativeRect.bottom <= targetHeight) {
    top = offsetY + dh - relativeRect.top - targetHeight
  } else if (relativeRect.top + relativeRect.height / 2 <= dh / 2) {
    top = offsetY + relativeRect.height
  } else {
    top = offsetY - targetHeight
  }
  return {
    left: `${left}px`,
    top: `${top}px`,
  }
}

export const setPickerPosition = ({
  element,
  relativeElement,
  fixedPosition,
}) => {
  const calendarBounding = element.getBoundingClientRect()
  const outOfBoundsRight = calendarBounding.right > window.innerWidth
  const outOfBoundsBottom = calendarBounding.bottom > window.innerHeight
  const relativeElementHeight = `${relativeElement.getBoundingClientRect().height}px`

  if (fixedPosition === '') {
    if (outOfBoundsRight) {
      element.style.right = 0
    } else {
      element.style.right = 'unset'
    }

    if (outOfBoundsBottom) {
      element.style.bottom = relativeElementHeight
    } else {
      element.style.bottom = 'unset'
    }
  } else {
    if (fixedPosition.indexOf('right') !== -1) {
      element.style.right = 0
    } else {
      element.style.right = 'unset'
    }
    if (fixedPosition.indexOf('top') !== -1) {
      element.style.bottom = relativeElementHeight
    } else {
      element.style.bottom = 'unset'
    }
  }
}
