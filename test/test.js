import path from "node:path"

/**
 * @type { import("../src") }
 */
const tsconfigJaid = require(process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src"))

it("Should return a proper TypeScript configuration", () => {
  expect(tsconfigJaid().compilerOptions.newLine).toStrictEqual("lf")
})