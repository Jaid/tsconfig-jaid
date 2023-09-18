import type {ShortcutTarget} from '~/lib/Config.js'

import Config from '~/lib/Config.js'

const prefix = `../..`
const folders = [
  `src`,
  `test`,
  `x`,
  `etc`,
]
// const shortcuts = new Map<string, ShortcutTarget>({
//   etc: true,
//   lib: `src/lib/*`,
//   root: `*`,
//   src: true,
// })
const shortcuts = new Map<string, ShortcutTarget>([
  [`root`, `*`],
  [`etc`, true],
  [`src`, true],
  [`lib`, `src/lib/*`],
])
const baseConfig = {
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
