import type {ShortcutTarget} from './Config.js'
import type {TsConfigJson} from 'type-fest'

import Config from 'lib/Config.js'

const prefix = `../..`
const folders = [
  `src`,
  `lib`,
  `test`,
  `x`,
  `etc`,
  `private`,
]
const shortcuts = new Map<string, ShortcutTarget>([
  [`root`, `*`],
  [`src`, `src/*`],
  [`etc`, [`etc/*`, `src/etc/*`]],
  [`lib`, [`lib/*`, `src/lib/*`]],
  [`media`, `media/*`],
])
const baseConfig: TsConfigJson = {
  compilerOptions: {
    allowArbitraryExtensions: true,
    allowImportingTsExtensions: true,
    baseUrl: prefix,
    composite: true,
    module: `esnext`,
    moduleDetection: `force`,
    verbatimModuleSyntax: true,
    moduleResolution: `bundler`,
    newLine: `lf`,
    skipLibCheck: true,
    strictNullChecks: true,
    allowJs: true,
    target: `esnext`,
    experimentalDecorators: true,
    noEmit: true,
    inlineSourceMap: true,
    // inlineSources: true,
  },
  typeAcquisition: {
    enable: true,
  },
}

export class GenericConfig extends Config {
  constructor() {
    super(baseConfig)
    this.setOutDir(`out/ts`)
    this.addInclude(``, false)
    for (const folder of folders) {
      this.addInclude(folder)
    }
    for (const [name, target] of shortcuts) {
      this.addShortcut(name, target)
    }
    this.addLib(`esnext`)
  }
}
