import type {TsConfigJson} from 'type-fest'

import Config from '#src/lib/Config.ts'

const folders = [
  'src',
  'lib',
  'test',
  'scripts',
  'etc',
]
const baseConfig: TsConfigJson = {
  compilerOptions: {
    allowArbitraryExtensions: true,
    allowImportingTsExtensions: true,
    composite: true,
    module: 'esnext',
    moduleDetection: 'force',
    verbatimModuleSyntax: true,
    moduleResolution: 'bundler',
    newLine: 'lf',
    skipLibCheck: true,
    strictNullChecks: true,
    allowJs: true,
    target: 'esnext',
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
    this.setOutDir('out/ts')
    this.addInclude('', false)
    for (const folder of folders) {
      this.addInclude(folder)
    }
    this.addLib('esnext')
  }
}
