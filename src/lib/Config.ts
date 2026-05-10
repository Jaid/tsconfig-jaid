import type {PackageJson, TsConfigJson} from 'type-fest'

import ensureEnd from 'ensure-end'

export default class Config {
  static readonly configDirPlaceholder = '${configDir}'

  tsconfig: TsConfigJson = {}

  constructor(baseConfig: TsConfigJson) {
    this.tsconfig = structuredClone(baseConfig)
  }

  addInclude(file: string) {
    if (!this.tsconfig.include) {
      this.tsconfig.include = []
    }
    this.tsconfig.include.push(this.resolveWithPrefix(file))
  }

  addFolderInclude(folder: string, recursive = true) {
    let suffix = recursive ? '**/*' : '*'
    if (folder.length > 0) {
      suffix = `/${suffix}`
    }
    const resolved = ensureEnd(folder, suffix)
    this.addInclude(resolved)
    this.addInclude(`${resolved}.json`)
  }

  addLib(name: TsConfigJson.CompilerOptions.Lib) {
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    if (!this.tsconfig.compilerOptions.lib) {
      this.tsconfig.compilerOptions.lib = []
    }
    this.tsconfig.compilerOptions.lib.push(name)
  }

  addTypes(...names: Array<string>) {
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    if (!this.tsconfig.compilerOptions.types) {
      this.tsconfig.compilerOptions.types = []
    }
    this.tsconfig.compilerOptions.types.push(...names)
  }

  getPrefix(): string {
    return ensureEnd(Config.configDirPlaceholder, '/')
  }

  resolveWithPrefix(target: string): string {
    const prefix = this.getPrefix()
    if (target === '') {
      return prefix
    }
    if (target.startsWith(prefix)) {
      return target
    }
    return `${prefix}${target}`
  }

  setOutDir(outDir: string) {
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    this.tsconfig.compilerOptions.outDir = this.resolveWithPrefix(outDir)
  }

  toJson() {
    return JSON.stringify(this.tsconfig)
  }

  modifyPackageJson(packageJson: PackageJson) {}
}
