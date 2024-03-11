import {GenericConfig} from './GenericConfig.js'

export class ReactConfig extends GenericConfig {
  constructor() {
    super()
    this.addLib(`dom`)
    this.addLib(`webworker`)
    if (!this.tsconfig.compilerOptions) {
      this.tsconfig.compilerOptions = {}
    }
    this.tsconfig.compilerOptions.jsx = `react-jsx`
    const componentResolves = [`~/component`, `component`]
    for (const resolve of componentResolves) {
      this.addShortcut(resolve, [
        `src/components/*/index.tsx`,
        `src/components/*/index.ts`,
        `src/components/*.tsx`,
        `src/components/*.ts`,
      ])
    }
  }
}
