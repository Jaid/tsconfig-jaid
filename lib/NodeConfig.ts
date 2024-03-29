import {GenericConfig} from './GenericConfig.js'

export class NodeConfig extends GenericConfig {
  constructor() {
    super()
    this.tsconfig.compilerOptions!.module = `nodenext`
    this.tsconfig.compilerOptions!.moduleResolution = `nodenext`
  }
}
