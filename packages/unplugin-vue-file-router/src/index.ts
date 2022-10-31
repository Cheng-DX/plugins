import fs from 'fs'
import { resolve } from 'path'
import { resolveArray } from '@chengdx/shared'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'

export default createUnplugin<Options | undefined>((options) => {
  const virtualModuleId = 'virtual:file-router'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  // eslint-disable-next-line prefer-const
  let { pageDir = 'views', extensions = /.(vue|[t|j]sx*)$/ } = options || {}
  if (pageDir.startsWith('/'))
    pageDir = pageDir.slice(1)

  function resolveDir(root: string, path: string): string {
    const resolvedPath = resolve(root, path)
    const pathes = fs.readdirSync(resolvedPath)
    return pathes.map((path) => {
      const resolved = resolve(resolvedPath, path)
      if (fs.statSync(resolved).isDirectory())
        return resolveDir(resolvedPath, path)
      else if (fs.statSync(resolved).isFile())
        return resolveFile(resolvedPath, path)
      else
        return ['']
    }).join('\n')
  }

  function resolveFile(root: string, path: string) {
    let name = path
    resolveArray(extensions).forEach((extension) => {
      name = name.replace(extension, '')
    })
    const rootName = !root.includes(`src/${pageDir}`) ? '' : root.split(`src/${pageDir}/`)[1]
    const routePath = name === 'index' ? rootName : `${rootName}/${name}`
    const r = `{
  name: '${name}',
  path: '${routePath.startsWith('/') ? routePath : `/${routePath}`}',
  component: () => import('${resolve(root, path)}'),
},`
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
        const routeObjects = resolveDir('src', pageDir)
        return `export const routes = [${routeObjects}]`
      }
    },
  }
})
