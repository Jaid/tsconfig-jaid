/** @module tsconfig-jaid */

import baseConfig from "./base.json"
import reactConfig from "./react.json"

/**
 * Exports an extendable TypeScript config
 * @param {object} options
 * @return {object}
 */
export default options => {
  if (options?.react) {
    return reactConfig
  }
  return baseConfig
}