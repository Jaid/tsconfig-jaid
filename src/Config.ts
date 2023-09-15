import type {OverrideProperties} from 'type-fest'
import type {CompilerOptions, ModuleKind, ModuleResolutionKind, NewLineKind, ScriptTarget, TypeAcquisition} from 'typescript'

import ensureEnd from 'ensure-end'

export type Tsconfig = Partial<{
  compilerOptions: OverrideProperties<CompilerOptions, Partial<{
    module: keyof typeof ModuleKind
    moduleResolution: keyof typeof ModuleResolutionKind
    newLine: keyof typeof NewLineKind
    target: keyof typeof ScriptTarget
  }>>
  include: string[]
  typeAcquisition: TypeAcquisition
}>

export type ShortcutTarget = string | string[] | true

export default class {
  tsconfig: Tsconfig = {}
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
  addShortcut(name: string, target: ShortcutTarget) {
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    if (!this.tsconfig.compilerOptions.paths) {
      this.tsconfig.compilerOptions.paths = {}
    }
    const virtualPath = ensureEnd.default(`~/${name}`, `/*`)
    this.tsconfig.compilerOptions.paths[virtualPath] = this.resolveTarget(name, target)
  }
  getPrefix(): string | undefined {
    if (this.tsconfig.compilerOptions?.baseUrl) {
      return ensureEnd.default(this.tsconfig.compilerOptions.baseUrl, `/`)
    }
  }
  resolveTarget(name: string, target: ShortcutTarget): string[] {
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
