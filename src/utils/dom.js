/**
 * Get the element width
 * @param {HTMLElement} element
 * @param {Object}      styles
 */
function getWidth(element, styles) {
  return (
    element.offsetWidth +
    parseInt(styles.marginLeft, 10) +
    parseInt(styles.marginRight, 10)
  )
}

/**
 * Get the element height
 * @param {HTMLElement} element
 * @param {Object}      styles
 */
function getHeight(element, styles) {
  return (
    element.offsetHeight +
    parseInt(styles.marginTop, 10) +
    parseInt(styles.marginBottom, 10)
  )
}

/**
 * Get the hidden element width, height
 * @param {HTMLElement} popup      The popup element
 * @param {HTMLElement} pickerView The pickerView element
 */
/* eslint no-param-reassign: 0 */
// eslint-disable-next-line max-statements
export function getPopupElementSize(popup, pickerView) {
  const originalDisplay = popup.style.display
  const originalVisibility = popup.style.visibility

  popup.style.display = 'block'
  popup.style.visibility = 'hidden'
  pickerView.style.position = 'relative'

  const styles = window.getComputedStyle(popup)
  const width = getWidth(popup, styles)
  const height = getHeight(popup, styles)

  popup.style.display = originalDisplay
  popup.style.visibility = originalVisibility
  pickerView.style.position = 'absolute'

  return {
    width,
    height,
  }
}

/**
 * Get the popup position
 * @param {Element} el element
 * @param {Element} elRelative relative element
 * @param {Number} targetWidth target element's width
 * @param {Number} targetHeight target element's height
 * @param {Boolean} appendToBody
 * @param {String} fixedPosition
 * @param {Boolean} rtl
 */
// eslint-disable-next-line complexity,max-statements
export function getRelativePosition({
  el,
  elRelative,
  targetWidth,
  targetHeight,
  appendToBody,
  fixedPosition,
  rtl,
}) {
  let left = 0
  let top = 0
  let offsetX = 0
  let offsetY = 0
  const relativeRect = elRelative.getBoundingClientRect()
  const documentWidth = document.documentElement.clientWidth
  const documentHeight = document.documentElement.clientHeight
  if (appendToBody) {
    offsetX = window.pageXOffset + relativeRect.left
    offsetY = window.pageYOffset + relativeRect.top
  }

  const calendarBounding = el.getBoundingClientRect()
  const outOfBoundsRight = calendarBounding.right > window.innerWidth
  const outOfBoundsBottom = calendarBounding.bottom > window.innerHeight

  const fixedPositionRight =
    fixedPosition && fixedPosition.indexOf('right') !== -1
  const fixedPositionTop = fixedPosition && fixedPosition.indexOf('top') !== -1

  const setLeft = () => {
    left = offsetX
  }
  const setRight = () => {
    left = offsetX + relativeRect.width - targetWidth
  }
  const setBottom = () => {
    top = offsetY + relativeRect.height
  }
  const setTop = () => {
    top = offsetY - targetHeight
  }

  if (fixedPosition === '') {
    if (outOfBoundsRight || rtl) {
      setRight()
    } else {
      setLeft()
    }

    if (outOfBoundsBottom) {
      setTop()
    } else {
      setBottom()
    }

    const hasRelativeWidth =
      documentWidth - relativeRect.left < targetWidth &&
      relativeRect.right < targetWidth

    const hasRelativeHeight =
      relativeRect.top <= targetHeight &&
      documentHeight - relativeRect.bottom <= targetHeight

    if (hasRelativeWidth) {
      left = offsetX - relativeRect.left + 1
    }

    if (hasRelativeHeight) {
      top = offsetY + documentHeight - relativeRect.top - targetHeight
    }
  } else {
    if (fixedPositionRight) {
      setRight()
    } else {
      setLeft()
    }

    if (fixedPositionTop) {
      setTop()
    } else {
      setBottom()
    }
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
}
