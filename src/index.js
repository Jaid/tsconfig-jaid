/** @module tsconfig-jaid */

import baseConfig from './base.json'
import reactConfig from './react.json'

// TODO Enable again when switching to TypeScript
// type Options = {
//   react?: boolean
// }

// export default (options?: Options) => {
//   if (options?.react) {
//     return reactConfig
//   }
//   return baseConfig
// }

export default options => {
  if (options?.react) {
    return reactConfig
  }
  return baseConfig
}
