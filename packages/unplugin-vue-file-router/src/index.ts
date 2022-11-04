import fs from 'fs'
import { resolve } from 'path'
import { formatNaming, resolveArray } from '@chengdx/shared'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'

export default createUnplugin<Options | undefined>((options) => {
  const virtualModuleId = 'virtual:file-router'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  const {
    pageDir = 'views', extensions = /.(vue|[t|j]sx*)$/, matchRoute = {
      rule: (filename: string) => filename.startsWith('[') && filename.endsWith(']'),
      resolver: (filename: string) => {
        const content = filename.slice(1, -1)
        return {
          path: `:${content}`,
        }
      },
    },
  } = options || {}

  function resolveDir(absPath: string, stackRoutePath: string): string {
    const subItems = fs.readdirSync(absPath)
    const subRoutes = subItems.map((item) => {
      const absSubPath = resolve(absPath, item)
      const stat = fs.statSync(absSubPath)
      if (stat.isDirectory())
        return resolveDir(absSubPath, `${stackRoutePath}/${item}`)
      else if (stat.isFile())
        return resolveFile(absSubPath, stackRoutePath)
      else
        return ''
    }).filter(s => s).join('\n,')

    return `{name: '${formatNaming(stackRoutePath, 'kebab').result}',path: '${(stackRoutePath.startsWith('/') ? stackRoutePath : `/${stackRoutePath}`)}',component: () => import('${resolve(absPath, 'index.vue')}'),children: [${subRoutes}]}`
  }

  function resolveFile(absPath: string, stackRoutePath: string) {
    let filename = absPath.split('/').pop() ?? 'index'
    resolveArray(extensions).forEach((extension) => {
      filename = filename.replace(extension, '')
    })
    if (filename === 'index')
      return ''
    filename = formatNaming(filename, 'kebab').result

    // match route
    for (const { rule, resolver } of resolveArray(matchRoute)) {
      if (rule(filename)) {
        const { path } = resolver(filename)
        const routePath = `${stackRoutePath}/${path}`
        return `{name: '${routePath}', path: '${routePath}', component: () => import('${absPath}')}`
      }
    }
    // normal
    const routePath = `${stackRoutePath}/${filename}`
    return `{name: '${routePath}', path: '${routePath}', component: () => import('${absPath}')}`
  }

  return {
    name: 'virtual:file-router',
    resolveId(id) {
      if (id === virtualModuleId)
        return resolvedVirtualModuleId
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const routeObjects = resolveDir(resolve('src', pageDir), '')
        return `export const routes = [${routeObjects}]`
      }
    },
  }
})
