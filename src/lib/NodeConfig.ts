import {RuntimeConfig} from '#src/lib/base/RuntimeConfig.ts'
import type {PackageJson} from 'type-fest'

export class NodeConfig extends RuntimeConfig {
  constructor() {
    super('node')
  }
  modifyPackageJson(packageJson: PackageJson) {
    super.modifyPackageJson(packageJson)
    if (!packageJson.dependencies) {
      packageJson.dependencies = {}
    }
    packageJson.dependencies['@types/node'] = '*'
  }
}
