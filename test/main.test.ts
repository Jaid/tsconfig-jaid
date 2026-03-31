import type {PackageJson, TsConfigJson} from 'type-fest'

import {describe, expect, test} from 'bun:test'
import os from 'node:os'
import * as path from 'forward-slash-path'

import fs from 'fs-extra'

const bunBin = Bun.which('bun') ?? 'bun'
const rootFolder = path.join(import.meta.dir, '..')
const configDirPlaceholder = '${configDir}'
const modes = [
  'generic',
  'node',
  'react',
] as const
const expectedIncludes = [
  '${configDir}/*',
  '${configDir}/src/**/*',
  '${configDir}/lib/**/*',
  '${configDir}/test/**/*',
  '${configDir}/scripts/**/*',
  '${configDir}/etc/**/*',
]

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
  await Promise.all([
    fs.writeJson(path.join(tempRoot, 'package.json'), {
      type: 'module',
    }, {
      spaces: 2,
    }),
    fs.ensureSymlink(path.join(rootFolder, 'node_modules'), path.join(tempRoot, 'node_modules'), 'junction'),
    fs.writeJson(path.join(tempRoot, 'tsconfig.json'), {
      extends: `./package/${mode}/base.json`,
    }, {
      spaces: 2,
    }),
    fs.outputFile(path.join(tempRoot, 'util.ts'), `export const rootValue = 1\n`),
    fs.outputFile(path.join(tempRoot, 'src/feature.ts'), `export const srcValue = 2\n`),
    fs.outputFile(path.join(tempRoot, 'src/lib/helper.ts'), `export const libValue = 3\n`),
    fs.outputFile(path.join(tempRoot, 'etc/info.ts'), `export const etcValue = 4\n`),
    ...(mode === 'react' ? [
      fs.outputFile(path.join(tempRoot, 'src/components/Example/index.tsx'), `export const componentValue = 5\n`),
    ] : []),
  ])
  const sampleImports = [
    `import {rootValue} from 'root/util.ts'`,
    `import {srcValue} from 'src/feature.ts'`,
    `import {libValue} from 'lib/helper.ts'`,
    `import {etcValue} from 'etc/info.ts'`,
  ]
  const totalParts = [
    'rootValue',
    'srcValue',
    'libValue',
    'etcValue',
  ]
  if (mode === 'react') {
    sampleImports.push(`import {componentValue} from 'component/Example'`)
    totalParts.push('componentValue')
  }
  await fs.writeFile(path.join(tempRoot, 'sample.ts'), [
    ...sampleImports,
    '',
    `type Choice = 'foo' | 'bar'`,
    `const total = ${totalParts.join(' + ')}`,
    `export const choice: Choice = total > 0 ? 'bar' : 'foo'`,
    '',
  ].join('\n'))
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
        expect(compilerOptions.baseUrl).toBeUndefined()
        expect(compilerOptions.outDir).toBe(`${configDirPlaceholder}/out/ts`)
        expect(fixture.baseConfig.include).toEqual(expectedIncludes)
        expect(compilerOptions.module).toBe(expected.module)
        expect(compilerOptions.moduleResolution).toBe(expected.moduleResolution)
        expect(compilerOptions.jsx).toBe(expected.jsx)
        expect(compilerOptions.lib).toEqual(expected.lib)
        expect(compilerOptions.paths).toMatchObject({
          'etc/*': [`${configDirPlaceholder}/etc/*`, `${configDirPlaceholder}/src/etc/*`],
          'lib/*': [`${configDirPlaceholder}/lib/*`, `${configDirPlaceholder}/src/lib/*`],
          'root/*': [`${configDirPlaceholder}/*`],
          'src/*': [`${configDirPlaceholder}/src/*`],
        })
        if (mode === 'react') {
          expect(compilerOptions.paths).toMatchObject({
            'component/*': [
              `${configDirPlaceholder}/src/components/*/index.tsx`,
              `${configDirPlaceholder}/src/components/*/index.ts`,
              `${configDirPlaceholder}/src/components/*.tsx`,
              `${configDirPlaceholder}/src/components/*.ts`,
            ],
            '~/component/*': [
              `${configDirPlaceholder}/src/components/*/index.tsx`,
              `${configDirPlaceholder}/src/components/*/index.ts`,
              `${configDirPlaceholder}/src/components/*.tsx`,
              `${configDirPlaceholder}/src/components/*.ts`,
            ],
          })
        }
        const projectFile = path.join(fixture.tempRoot, 'tsconfig.json')
        const compileResult = await runBun(['x', 'tsc', '--project', projectFile, '--pretty', 'false'])
        ensureSucceeded(`${mode} compile`, compileResult)
        const showConfigResult = await runBun(['x', 'tsc', '--project', projectFile, '--showConfig', '--pretty', 'false'])
        ensureSucceeded(`${mode} showConfig`, showConfigResult)
        const resolvedConfig = JSON.parse(showConfigResult.stdout) as TsConfigJson
        expect(resolvedConfig.compilerOptions?.baseUrl).toBeUndefined()
        expect(resolvedConfig.compilerOptions?.outDir).toBe('./out/ts')
        expect(resolvedConfig.compilerOptions?.paths).toMatchObject({
          'etc/*': [path.join(fixture.tempRoot, 'etc/*'), path.join(fixture.tempRoot, 'src/etc/*')],
          'lib/*': [path.join(fixture.tempRoot, 'lib/*'), path.join(fixture.tempRoot, 'src/lib/*')],
          'root/*': [path.join(fixture.tempRoot, '*')],
          'src/*': [path.join(fixture.tempRoot, 'src/*')],
        })
        if (mode === 'react') {
          expect(resolvedConfig.compilerOptions?.paths).toMatchObject({
            'component/*': [
              path.join(fixture.tempRoot, 'src/components/*/index.tsx'),
              path.join(fixture.tempRoot, 'src/components/*/index.ts'),
              path.join(fixture.tempRoot, 'src/components/*.tsx'),
              path.join(fixture.tempRoot, 'src/components/*.ts'),
            ],
            '~/component/*': [
              path.join(fixture.tempRoot, 'src/components/*/index.tsx'),
              path.join(fixture.tempRoot, 'src/components/*/index.ts'),
              path.join(fixture.tempRoot, 'src/components/*.tsx'),
              path.join(fixture.tempRoot, 'src/components/*.ts'),
            ],
          })
        }
        expect(resolvedConfig.include).toEqual([
          path.join(fixture.tempRoot, '*'),
          path.join(fixture.tempRoot, 'src/**/*'),
          path.join(fixture.tempRoot, 'lib/**/*'),
          path.join(fixture.tempRoot, 'test/**/*'),
          path.join(fixture.tempRoot, 'scripts/**/*'),
          path.join(fixture.tempRoot, 'etc/**/*'),
        ])
        expect(resolvedConfig.exclude).toContain(path.join(fixture.tempRoot, 'out/ts'))
      } finally {
        await fs.remove(fixture.tempRoot)
      }
    }, 30_000)
  }
})
