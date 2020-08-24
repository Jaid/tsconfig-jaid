/** @module tsconfig-jaid */

/**
 * Exports an extendable TypeScript config
 * @type {object}
 */
module.exports = {
  compilerOptions: {
    allowJs: true,
    checkJs: true,
    baseUrl: ".",
    outDir: "dist/typescript",
    newLine: "lf",
    declaration: true,
    emitDeclarationOnly: true,
    resolveJsonModule: true,
    esModuleInterop: true,
    paths: {
      "lib/*": ["src/lib/*"],
      "src/*": ["src/*"],
      "root/*": ["./*"],
    },
  },
}