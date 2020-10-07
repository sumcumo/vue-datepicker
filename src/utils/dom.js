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
  const documentWidth = document.documentElement.clientWidth
  const documentHeight = document.documentElement.clientHeight
  if (fixed) {
    offsetX = window.pageXOffset + relativeRect.left
    offsetY = window.pageYOffset + relativeRect.top
  }

  const fixedPositionLeft = fixedPosition.indexOf('left') !== -1
  const fixedPositionBottom = fixedPosition.indexOf('bottom') !== -1
  const fixedPositionRight = fixedPosition.indexOf('right') !== -1
  const fixedPositionTop = fixedPosition.indexOf('top') !== -1

  const isLeft = (
    relativeRect.left + relativeRect.width / 2 <= documentWidth / 2
    || fixedPositionLeft
  ) && !fixedPositionRight

  const hasRelativWidth = documentWidth - relativeRect.left < targetWidth
    && relativeRect.right < targetWidth
    && !fixedPositionLeft
    && !fixedPositionRight

  if (hasRelativWidth) {
    left = offsetX - relativeRect.left + 1
  } else if (isLeft) {
    left = offsetX
    // else is right
  } else {
    left = offsetX + relativeRect.width - targetWidth
  }

  const isBottom = (
    relativeRect.top + relativeRect.height / 2 <= documentHeight / 2
      || fixedPositionBottom
  )
    && !fixedPositionTop

  const hasRelativHeight = relativeRect.top <= targetHeight
    && documentHeight - relativeRect.bottom <= targetHeight
    && !fixedPositionBottom
    && !fixedPositionTop

  if (hasRelativHeight) {
    top = offsetY + documentHeight - relativeRect.top - targetHeight
  } else if (isBottom) {
    top = offsetY + relativeRect.height
    // else is top
  } else {
    top = offsetY - targetHeight
  }
  return {
    left: `${left}px`,
    top: `${top}px`,
  }
}
