import type {PackageJson, TsConfigJson} from 'type-fest'

import {describe, expect, test} from 'bun:test'
import os from 'node:os'
import * as path from 'forward-slash-path'

import fs from 'fs-extra'

const bunBin = Bun.which('bun') ?? 'bun'
const rootFolder = path.join(import.meta.dir, '..')
const modes = [
  'generic',
  'node',
  'react',
] as const

type Mode = typeof modes[number]

type CommandResult = {
  exitCode: number
  stderr: string
  stdout: string
}

type ModeExpectation = {
  jsx?: TsConfigJson.CompilerOptions.JSX
  lib: Array<TsConfigJson.CompilerOptions.Lib>
  module: TsConfigJson.CompilerOptions.Module
  moduleResolution: TsConfigJson.CompilerOptions.ModuleResolution
  packageName: string
}

const modeExpectations: Record<Mode, ModeExpectation> = {
  generic: {
    packageName: 'tsconfig-jaid',
    module: 'esnext',
    moduleResolution: 'bundler',
    lib: ['esnext'],
  },
  node: {
    packageName: 'tsconfig-jaid-node',
    module: 'nodenext',
    moduleResolution: 'nodenext',
    jsx: 'react',
    lib: ['esnext'],
  },
  react: {
    packageName: 'tsconfig-jaid-react',
    module: 'esnext',
    moduleResolution: 'bundler',
    jsx: 'react-jsx',
    lib: ['esnext', 'dom', 'webworker'],
  },
}

const runBun = async (args: Array<string>, cwd = rootFolder): Promise<CommandResult> => {
  const child = Bun.spawn([bunBin, ...args], {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  return {
    exitCode,
    stdout,
    stderr,
  }
}
const ensureSucceeded = (label: string, result: CommandResult) => {
  if (result.exitCode === 0 && result.stderr === '') {
    return
  }
  throw new Error(`${label} failed.\nExit code: ${result.exitCode}\n\n<stdout>\n${result.stdout.trim()}\n</stdout>\n\n<stderr>\n${result.stderr.trim()}\n</stderr>`)
}
const createModeFixture = async (mode: Mode) => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir().replaceAll('\\', '/'), `tsconfig-jaid-${mode}-`))
  const outputFolder = path.join(tempRoot, 'package', mode)
  const buildResult = await runBun(['scripts/build.ts', mode, '--outputFolder', outputFolder])
  ensureSucceeded(`${mode} build`, buildResult)
  await fs.writeJson(path.join(tempRoot, 'tsconfig.json'), {
    extends: `./package/${mode}/base.json`,
  }, {
    spaces: 2,
  })
  await fs.writeFile(path.join(tempRoot, 'sample.ts'), `type Choice = 'foo' | 'bar'\nconst choice: Choice = 'bar'\n`)
  const [baseConfig, builtPackage] = await Promise.all([
    Bun.file(path.join(outputFolder, 'base.json')).json() as Promise<TsConfigJson>,
    Bun.file(path.join(outputFolder, 'package.json')).json() as Promise<PackageJson>,
  ])
  return {
    tempRoot,
    baseConfig,
    builtPackage,
  }
}

describe('build script', () => {
  for (const mode of modes) {
    test(`${mode} generates a usable config package`, async () => {
      const fixture = await createModeFixture(mode)
      try {
        const expected = modeExpectations[mode]
        const compilerOptions = fixture.baseConfig.compilerOptions ?? {}
        expect(fixture.builtPackage.name).toBe(expected.packageName)
        expect(fixture.builtPackage.exports).toBe('./base.json')
        expect(compilerOptions.baseUrl).toBe('../..')
        expect(compilerOptions.outDir).toBe('../../out/ts')
        expect(compilerOptions.module).toBe(expected.module)
        expect(compilerOptions.moduleResolution).toBe(expected.moduleResolution)
        expect(compilerOptions.jsx).toBe(expected.jsx)
        expect(compilerOptions.lib).toEqual(expected.lib)
        expect(compilerOptions.paths).toMatchObject({
          'lib/*': ['lib/*', 'src/lib/*'],
          'root/*': ['*'],
          'src/*': ['src/*'],
        })
        const showConfigResult = await runBun(['x', 'tsc', '--project', path.join(fixture.tempRoot, 'tsconfig.json'), '--showConfig', '--pretty', 'false'])
        ensureSucceeded(`${mode} showConfig`, showConfigResult)
        const resolvedConfig = JSON.parse(showConfigResult.stdout) as TsConfigJson & {
          files?: Array<string>
        }
        expect(resolvedConfig.compilerOptions?.baseUrl).toBe('./')
        expect(resolvedConfig.compilerOptions?.outDir).toBe('./out/ts')
        expect(resolvedConfig.files).toContain('./sample.ts')
      } finally {
        await fs.remove(fixture.tempRoot)
      }
    }, 30_000)
  }
})
