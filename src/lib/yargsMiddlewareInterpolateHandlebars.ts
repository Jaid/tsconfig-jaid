import type {ArgumentsCamelCase, Argv, MiddlewareFunction} from 'yargs'

import Handlebars from 'handlebars'
import mapObject, {mapObjectSkip} from 'map-obj'

type Options = Partial<{
  context: Record<string, unknown>
  keys: string[]
}>

const handlebars = Handlebars.create()
const isHandlebarsTemplate = (value: string) => {
  return value.includes(`{{`)
}

type AdvancedMiddlewareFunction = (args: ArgumentsCamelCase, yargs: Argv) => Record<string, unknown>

export default (options: Options = {}): AdvancedMiddlewareFunction => {
  console.dir(options)
  return (args, yargs) => {
    console.dir(yargs)
    const handlebarsContext = Object.assign({}, args, options.context)
    const argsOverride = mapObject(args, (key: string, value) => {
      if (key === `_` || key === `$0`) {
        return mapObjectSkip
      }
      if (options.keys) {
        if (!options.keys.includes(key)) {
          return mapObjectSkip
        }
      }
      if (typeof value !== `string`) {
        return mapObjectSkip
      }
      if (!isHandlebarsTemplate(value)) {
        return mapObjectSkip
      }
      const runHandlebars = handlebars.compile(value, {
        noEscape: true,
        strict: true,
      })
      const resolvedValue = runHandlebars(handlebarsContext)
      return [key, resolvedValue]
    })
    console.dir(argsOverride)
    return argsOverride
  }
}
