import fs from 'fs'
import { resolve } from 'path'
import { formatNaming, resolveArray } from '@chengdx/shared'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'

export default createUnplugin<Options | undefined>((options) => {
  const virtualModuleId = 'virtual:file-router'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  // eslint-disable-next-line prefer-const
  let { pageDir = 'views', extensions = /.(vue|[t|j]sx*)$/ } = options || {}
  if (pageDir.startsWith('/'))
    pageDir = pageDir.slice(1)

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
    }).join('\n,')

    return `{
      name: '${formatNaming(stackRoutePath, 'kebab').result}',
      path: '${(stackRoutePath.startsWith('/') ? stackRoutePath : `/${stackRoutePath}`)}',
      component: () => import('${resolve(absPath, 'index.vue')}'),
      children: [${subRoutes}]
    }`
  }

  function resolveFile(absPath: string, stackRoutePath: string) {
    let fileName = absPath.split('/').pop() ?? 'index'
    resolveArray(extensions).forEach((extension) => {
      fileName = fileName.replace(extension, '')
    })
    if (fileName === 'index')
      return ''
    fileName = formatNaming(fileName, 'kebab').result
    const routePath = fileName === 'index'
      ? (stackRoutePath.startsWith('/') ? stackRoutePath : `/${stackRoutePath}`)
      : `${stackRoutePath}/${fileName}`
    const r = `{
  name: '${routePath}',
  path: '${routePath}',
  component: () => import('${absPath}'),
}`
    return r
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
