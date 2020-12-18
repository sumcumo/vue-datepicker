export const configExists = (config) => {
  return typeof config !== 'undefined' && Object.keys(config).length > 0
}

export const isDefined = (config, prop) => {
  return configExists(config) && typeof config[prop] !== 'undefined'
}

export const isDefinedAsDate = (config, prop) => {
  return configExists(config) && config[prop] instanceof Date
}
