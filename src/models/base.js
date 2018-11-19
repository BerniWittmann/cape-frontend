export function toSnakeCase(str) {
  if (!str || typeof str !== 'string') return ''
  // Handle Special substrings
  str = str.replace(/ID/g, 'Id')
  str = str.replace(/URL/g, 'Url')
  // Ensure that first char is lowercase
  str = str.replace(/^[A-Z]/, (c) => c.toLowerCase())
  return str.replace(/(.*?)([A-Z])/g, '$1_$2').toLowerCase()
}

export function convertObjectToSnakeCaseKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const result = {}
  for (let key of Object.keys(obj)) {
    let value = obj[key]
    if (Array.isArray(value)) {
      value = value.map(v => convertObjectToSnakeCaseKeys(v))
    } else if (typeof value === 'object') {
      value = convertObjectToSnakeCaseKeys(value)
    }
    result[toSnakeCase(key)] = value
  }
  return result
}
/**
 * Base class for all models
 *
 * Objects can be created in two different ways
 *
 * - Either direct constructor (new Process({ .. })). In this case parameter names must be snake_case
 * - Or by using static method create (Process.create({ .. })). In this case parameter names must be camelCase
 *
 * This allows to create Model objects directly from the API Responses, as well from user generated objects
 */
export default class Base {
  static create(data) {
    // Call constructor, but with snake_case converted parameters
    return new this(convertObjectToSnakeCaseKeys(data))
  }
}
