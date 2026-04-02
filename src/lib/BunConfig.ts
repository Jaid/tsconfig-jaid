import {RuntimeConfig} from '#src/lib/base/RuntimeConfig.ts'
import type {PackageJson} from 'type-fest'

export class BunConfig extends RuntimeConfig {
  constructor() {
    super('bun-types')
  }
  modifyPackageJson(packageJson: PackageJson) {
    super.modifyPackageJson(packageJson)
    if (!packageJson.dependencies) {
      packageJson.dependencies = {}
    }
    packageJson.dependencies['bun-types'] = '*'
  }
}
