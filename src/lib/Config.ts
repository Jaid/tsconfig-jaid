import type {TsConfigJson} from 'type-fest'

import ensureEnd from 'ensure-end'

export default class Config {
  static readonly configDirPlaceholder = '${configDir}'

  tsconfig: TsConfigJson = {}

  constructor(baseConfig: TsConfigJson) {
    this.tsconfig = structuredClone(baseConfig)
  }

  addInclude(include: string, recursive = true) {
    if (!this.tsconfig.include) {
      this.tsconfig.include = []
    }
    let suffix = recursive ? '**/*' : '*'
    if (include.length > 0) {
      suffix = `/${suffix}`
    }
    this.tsconfig.include.push(ensureEnd(this.resolveWithPrefix(include), suffix))
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
}
