import type {TsConfigJson} from 'type-fest'

import ensureEnd from 'ensure-end'

export type ShortcutTarget = Array<string> | string | true

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

  addShortcut(name: string, target: ShortcutTarget, highPriority = true) {
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    if (!this.tsconfig.compilerOptions.paths) {
      this.tsconfig.compilerOptions.paths = {}
    }
    const virtualPath = ensureEnd(name, '/*') as string
    const resolvedTarget = this.resolveTarget(name, target)
    if (highPriority) {
      this.tsconfig.compilerOptions.paths = {
        [virtualPath]: resolvedTarget,
        ...this.tsconfig.compilerOptions.paths,
      }
      return
    }
    this.tsconfig.compilerOptions.paths[virtualPath] = resolvedTarget
  }

  getPrefix(): string {
    return ensureEnd(Config.configDirPlaceholder, '/')
  }

  resolveTarget(name: string, target: ShortcutTarget): Array<string> {
    if (Array.isArray(target)) {
      return target.map(value => this.resolveWithPrefix(value))
    }
    if (target === true) {
      return [this.resolveWithPrefix(`${name}/*`)]
    }
    return [this.resolveWithPrefix(target)]
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
