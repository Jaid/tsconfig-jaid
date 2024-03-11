import type {TsConfigJson} from 'type-fest'

import ensureEnd from 'ensure-end'

export type ShortcutTarget = Array<string> | string | true

export default class {
  tsconfig: TsConfigJson = {}
  constructor(baseConfig) {
    Object.assign(this.tsconfig, baseConfig)
  }
  addInclude(include: string, recursive = true) {
    if (!this.tsconfig.include) {
      this.tsconfig.include = []
    }
    let suffix
    if (recursive) {
      suffix = `**/*`
    } else {
      suffix = `*`
    }
    if (include.length > 0) {
      suffix = `/${suffix}`
    }
    this.tsconfig.include.push(ensureEnd.default(this.resolveWithPrefix(include), suffix))
  }
  addLib(name: string) {
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
    const virtualPath = ensureEnd.default(name, `/*`) as string
    const resolvedTarget = this.resolveTarget(name, target)
    if (highPriority) {
      this.tsconfig.compilerOptions.paths = {
        [virtualPath]: resolvedTarget,
        ...this.tsconfig.compilerOptions.paths,
      }
    } else {
      this.tsconfig.compilerOptions.paths[virtualPath] = resolvedTarget
    }
  }
  getPrefix(): string | undefined {
    if (this.tsconfig.compilerOptions?.baseUrl) {
      return ensureEnd.default(this.tsconfig.compilerOptions.baseUrl, `/`)
    }
  }
  resolveTarget(name: string, target: ShortcutTarget): Array<string> {
    if (Array.isArray(target)) {
      return target
    }
    if (target === true) {
      return [`${name}/*`]
    }
    return [target]
  }
  resolveWithPrefix(target: string) {
    const prefix = this.getPrefix()
    if (prefix) {
      return `${prefix}${target}`
    }
    return target
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
