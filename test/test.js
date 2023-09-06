import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const dirName = path.dirname(fileURLToPath(import.meta.url))
const indexPath = process.env.MAIN ?? path.join(dirName, `..`, `src`, `index.js`)
/**
 * @type { import("../src") }
 */
const {default: tsconfigJaid} = await import(pathToFileURL(indexPath))
it(`Should return a proper TypeScript configuration`, () => {
  expect(tsconfigJaid().compilerOptions.newLine).toStrictEqual(`lf`)
})
