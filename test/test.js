import path from "path"

/**
 * @type { import("../src") }
 */
const typescriptConfig = require(process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src"))

it("Should return a proper TypeScript configuration", () => {
  expect(typescriptConfig.compilerOptions.newLine).toStrictEqual("lf")
})