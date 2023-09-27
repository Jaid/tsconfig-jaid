import type {ShortcutTarget} from './Config'
import type {TsConfigJson} from 'type-fest'

import Config from '~/lib/Config.js'

const prefix = `../..`
const folders = [
  `src`,
  `test`,
  `x`,
  `etc`,
]
const shortcuts = new Map<string, ShortcutTarget>([
  [`root`, `*`],
  [`etc`, true],
  [`lib`, true],
  [`src`, true],
])
const baseConfig: TsConfigJson = {
  compilerOptions: {
    allowArbitraryExtensions: true,
    baseUrl: prefix,
    composite: true,
    module: `nodenext`,
    moduleResolution: `nodenext`,
    newLine: `lf`,
    skipLibCheck: true,
    strictNullChecks: true,
    target: `es2022`,
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
