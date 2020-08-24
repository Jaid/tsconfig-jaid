import browserslist from "browserslist"
import path from "path"

/**
 * @type { import("../src") }
 */
const browserslistConfig = require(process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src"))

it("Should return a proper version list for given browserslist query", () => {
  const result = browserslist(browserslistConfig)
  expect(Array.isArray(result)).toBeTruthy()
  expect(result.filter(version => version.startsWith("node")).length > 5).toBeTruthy()
})