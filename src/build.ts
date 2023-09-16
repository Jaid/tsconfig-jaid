import type {ShortcutTarget} from './lib/Config.js'
import type Config from './lib/Config.js'
import type {ArgumentsCamelCase, Argv, CommandBuilder} from 'yargs'

import path from 'node:path'

import fs from 'fs-extra'
import {GenericConfig} from 'lib/GenericConfig.js'
import interpolateHandlebarsMiddleware from 'lib/interpolateHandlebarsMiddleware.js'
import {NodeConfig} from 'lib/NodeConfig.js'
import {ReactConfig} from 'lib/ReactConfig.js'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

// Don’t fully understand this, taken from here: https://github.com/zwade/hypatia/blob/a4f2f5785c146b4cb4ebff44da609a6500c53887/backend/src/start.ts#L47
export type Args = (typeof builder) extends CommandBuilder<any, infer U> ? ArgumentsCamelCase<U> : never

const handler = async (args: Args) => {
  console.dir(args)
  const configMapper = {
    generic: GenericConfig,
    node: NodeConfig,
    react: ReactConfig,
  }
  const ModeConfig = configMapper[<keyof typeof configMapper> args.mode]
  const config = new ModeConfig
  console.dir(config.tsconfig, {depth: 3})
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
  .middleware(interpolateHandlebarsMiddleware)
  .parse()
