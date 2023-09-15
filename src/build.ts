import type {ShortcutTarget} from './Config.js'
import type {ArgumentsCamelCase, Argv, CommandBuilder} from 'yargs'

import path from 'node:path'

import Config from './Config.js'
import fs from 'fs-extra'
import yargsMiddlewareInterpolateHandlebars from 'lib/yargsMiddlewareInterpolateHandlebars.js'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

// Don’t fully understand this, taken from here: https://github.com/zwade/hypatia/blob/a4f2f5785c146b4cb4ebff44da609a6500c53887/backend/src/start.ts#L47
export type Args = (typeof builder) extends CommandBuilder<any, infer U> ? ArgumentsCamelCase<U> : never

const handler = async (args: Args) => {
  console.dir(args)
  const prefix = `../..`
  const folders = [
    `src`,
    `test`,
    `x`,
    `etc`,
  ]
  const shortcuts: Record<string, ShortcutTarget> = {
    lib: `src/lib`,
    root: ``,
    src: true,
  }
  const config = new Config({
    compilerOptions: {
      allowArbitraryExtensions: true,
      baseUrl: prefix,
      composite: true,
      module: `nodenext`,
      moduleResolution: `node`,
      newLine: `lf`,
      skipLibCheck: true,
      strictNullChecks: true,
      target: `es2022`,
    },
    typeAcquisition: {
      enable: true,
    },
  })
  config.setOutDir(`out/ts`)
  config.addInclude(``, false)
  for (const folder of folders) {
    config.addInclude(folder)
  }
  for (const [name, target] of Object.entries(shortcuts)) {
    config.addShortcut(name, target)
  }
  config.addLib(`esnext`)
  await fs.outputJson(path.join(args.outputFolder, `tsconfig.json`), config.tsconfig)
}
const builder = (argv: Argv) => {
  return argv.options({
    mode: {
      choices: <const> [
        `react`,
        `node`,
        `generic`,
      ],
      default: `generic`,
    },
    outputFolder: {
      default: `dist/package/{{mode}}`,
      type: `string`,
    },
  })
}
await yargs(hideBin(process.argv))
  .detectLocale(false)
  .scriptName(process.env.npm_package_name!)
  .command({
    builder,
    command: `$0 [mode]`,
    handler,
  })
  .parserConfiguration({
    'strip-aliased': true,
    'strip-dashed': true,
  })
  .middleware(yargsMiddlewareInterpolateHandlebars())
  .parse()
