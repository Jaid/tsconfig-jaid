import {RuntimeConfig} from '#src/lib/base/RuntimeConfig.ts'
import type {PackageJson} from 'type-fest'

export class BunConfig extends RuntimeConfig {
  constructor() {
    super('bun')
    this.tsconfig.compilerOptions!.module = 'preserve'
    this.tsconfig.compilerOptions!.moduleResolution = 'bundler'
  }
  modifyPackageJson(packageJson: PackageJson) {
    super.modifyPackageJson(packageJson)
    if (!packageJson.dependencies) {
      packageJson.dependencies = {}
    }
    packageJson.dependencies['@types/bun'] = '^1'
  }
}
