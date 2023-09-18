import type {TsConfigJson} from 'type-fest'

import assert from 'node:assert'
import path from 'node:path'
import {it} from 'node:test'

import {execa} from 'execa'
import fs from 'fs-extra'

class TempFile implements AsyncDisposable {
  #file: string
  constructor(file: string) {
    this.#file = file
  }
  async [Symbol.asyncDispose]() {
    await fs.remove(this.#file)
  }
  async write(text: string) {
    await fs.outputFile(this.#file, text)
  }
}
const rootFolder = process.env.npm_config_local_prefix
if (rootFolder === undefined) {
  throw new Error(`Must be called from an npm run script`)
}
const modes = [`generic`, `node`, `react`]
for (const mode of modes) {
  it(`mode ${mode}`, async () => {
    const runTsc = async (args: string[]) => {
      const mergedArgs = [
        ...Array.isArray(args) ? args : [args],
        `--project`,
        path.join(`package`, mode, `base.json`),
      ]
      const execaResult = await execa(`tsc`, mergedArgs, {
        cwd: path.join(rootFolder, `out`),
      })
      return execaResult
    }
    const file = path.join(rootFolder, `out`, `test-${mode}.ts`)
    await using tempFile = new TempFile(file)
    await tempFile.write(`type Choice = 'foo' | 'bar'; const choice: Choice = 'bar'`)
    const showConfigResult = await runTsc([`--showConfig`])
    assert.strictEqual(showConfigResult.exitCode, 0)
    const finalConfig = <TsConfigJson> JSON.parse(showConfigResult.stdout)
    assert.strictEqual(finalConfig.compilerOptions?.baseUrl, `../..`)
  })
}
