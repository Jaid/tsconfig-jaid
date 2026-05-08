import {GenericConfig} from '#src/lib/GenericConfig.ts'

export class RuntimeConfig extends GenericConfig {
  constructor(...types: Array<string>) {
    super()
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    this.tsconfig.compilerOptions.module = 'nodenext'
    this.tsconfig.compilerOptions.moduleResolution = 'nodenext'
    this.tsconfig.compilerOptions.jsx = 'react-jsx' // React support for https://github.com/vadimdemedes/ink
    this.addTypes(...types)
  }
}
