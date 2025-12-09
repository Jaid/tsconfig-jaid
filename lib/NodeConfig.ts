import {GenericConfig} from './GenericConfig.js'

export class NodeConfig extends GenericConfig {
  constructor() {
    super()
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    this.tsconfig.compilerOptions.module = `nodenext`
    this.tsconfig.compilerOptions.moduleResolution = `nodenext`
    this.tsconfig.compilerOptions.jsx = 'react' // React support for https://github.com/vadimdemedes/ink
  }
}