import type {PackageJson} from 'type-fest'
import type {ArgumentsCamelCase, Argv, CommandBuilder} from 'yargs'

import path from 'node:path'

import fs from 'fs-extra'
import * as lodash from 'lodash-es'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

import {GenericConfig} from '~/lib/GenericConfig.js'
import interpolateHandlebarsMiddleware from '~/lib/interpolateHandlebarsMiddleware.js'
import {NodeConfig} from '~/lib/NodeConfig.js'
import {ReactConfig} from '~/lib/ReactConfig.js'

// Don’t fully understand this, taken from here: https://github.com/zwade/hypatia/blob/a4f2f5785c146b4cb4ebff44da609a6500c53887/backend/src/start.ts#L47
export type Args = (typeof builder) extends CommandBuilder<any, infer U> ? ArgumentsCamelCase<U> : never

const handler = async (args: Args) => {
  console.dir(args)
  const configMapper = {
    generic: GenericConfig,
    node: NodeConfig,
    react: ReactConfig,
  }
  const config = new configMapper[<keyof typeof configMapper> args.mode]
  console.dir(config.tsconfig, {depth: 3})
  const parentPkg = <PackageJson> await fs.readJson(`package.json`)
  const pkg = <PackageJson> {
    name: args.mode === `generic` ? parentPkg.name : `${parentPkg.name}-${args.mode}`,
    exports: `./base.json`,
    keywords: parentPkg.keywords,
    ...lodash.pick(parentPkg, `version`, `dependencies`, `repository`, `funding`, `author`, `homepage`),
  }
  await fs.outputJson(path.join(args.outputFolder, `base.json`), config.tsconfig)
  await fs.outputJson(path.join(args.outputFolder, `package.json`), pkg)
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
      default: `out/package/{{mode}}`,
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
