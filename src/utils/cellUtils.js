const cellUtils = {
  configExists(obj) {
    return typeof obj !== 'undefined' && Object.keys(obj).length > 0
  },

  isDefined(obj, prop) {
    return this.configExists(obj) && typeof obj[prop] !== 'undefined'
  },

  hasArray(obj, prop) {
    return this.isDefined(obj, prop) && obj[prop].length > 0
  },

  hasDate(obj, prop) {
    return this.isDefined(obj, prop) && this.utils.isValidDate(obj[prop])
  },

  dayMonthYear(obj, prop) {
    const { utils } = this
    const hasDate = this.hasDate(obj, prop)

    if (!hasDate) {
      return {
        day: undefined,
        month: undefined,
        year: undefined,
      }
    }

    const d = obj[prop]

    return {
      day: utils.getDate(d),
      month: utils.getMonth(d),
      year: utils.getFullYear(d),
    }
  },
}

export default (utils) => ({
  ...cellUtils,
  utils,
})
