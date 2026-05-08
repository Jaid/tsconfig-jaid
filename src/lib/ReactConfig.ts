import {GenericConfig} from '#src/lib/GenericConfig.ts'

export class ReactConfig extends GenericConfig {
  constructor() {
    super()
    this.addLib('dom')
    this.addLib('dom.iterable')
    this.addLib('webworker')
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    this.tsconfig.compilerOptions.jsx = 'react-jsx'
  }
}
