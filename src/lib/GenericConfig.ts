import type {PackageJson, TsConfigJson} from 'type-fest'

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
    resolveJsonModule: true,
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
    this.addFolderInclude('', false)
    for (const folder of folders) {
      this.addFolderInclude(folder)
    }
    this.addLib('esnext')
  }
  modifyPackageJson(packageJson: PackageJson) {
    super.modifyPackageJson(packageJson)
    if (!packageJson.peerDependencies) {
      packageJson.peerDependencies = {}
    }
    packageJson.peerDependencies.typescript = '^6'
  }
}
