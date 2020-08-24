/** @module tsconfig-jaid */

const baseConfig = require("./base.json")
const reactConfig = require("./react.json")

/**
 * Exports an extendable TypeScript config
 * @param {object} options
 * @return {object}
 */
module.exports = options => {
  if (options?.react) {
    return reactConfig
  }
  return baseConfig
}