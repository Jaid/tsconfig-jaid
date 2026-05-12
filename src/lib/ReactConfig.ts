import {BunConfig} from '#src/lib/BunConfig.ts'

export class ReactConfig extends BunConfig {
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
