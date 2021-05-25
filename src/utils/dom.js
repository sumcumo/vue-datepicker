/* eslint no-param-reassign: 0 */
/**
 * get the popup position
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
    top = offsetY - targetHeight - 2
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
