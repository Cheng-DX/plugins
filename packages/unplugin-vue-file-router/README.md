## File based router
Generate routes from a directory of Vue files.

### Usage
This plugin based on [unplugin](https://github.com/unjs/unplugin) </br>
So you can use it with Vite, Rollup, Webpack, esbuild, nuxt </br>
Like in Vite
```ts
import { defineConfig } from 'vite'
import Router from 'unplugin-vue-file-router/vite'

export default defineConfig({
  plugins: [
    Router({ /* options */ })
  ]
})
```
### Rules
Assuming you have a directory structure like this:
```
src/views/
  index.vue
  about.vue
  users/
    [id].vue
    index.vue
  a/
    index.vue
    a-1.vue
    a-2.vue
```
The following dirs will generate the following routes:
```js
export const routes = [{
  name: '',
  path: '/',
  component: () => import('/src/views/index.vue'),
  children: [
    {
      name: '/about',
      path: '/about',
      component: () => import('/src/views/about.vue')
    },
    {
      name: '/a',
      path: '/a',
      component: () => import('/src/views/a/index.vue'),
      children: [
        {
          name: '/a/a-1',
          path: '/a/a-1',
          component: () => import('/src/views/a/a-1.vue')
        },
        {
          name: '/a/a-2',
          path: '/a/a-2',
          component: () => import('/src/views/a/a-2.vue')
        }
      ]
    },
    {
      name: '/users',
      path: '/users',
      component: () => import('/src/views/users/index.vue'),
      children: [
        {
          name: '/users/:id',
          path: '/users/:id',
          component: () => import('/src/views/users/[id].vue')
        }]
    }]
}]
```
You can import it in any js file like this:
```js
import { routes } from 'virtual:file-router'
```

### Options
```ts
interface Options {
  /**
   * base url
   * @default 'views'
   */
  pageDir?: string
  /**
   * extensions of files to be imported
   * @default /.(vue|[t|j]sx*)$/ for vue, ts, js, tsx, jsx
   */
  extensions?: MaybeArray<RegExp>
  /**
   * match route resolvers
   * @default [{
      rule: (filename: string) => filename.startsWith('[') && filename.endsWith(']'),
      resolver: (filename: string) => `:${filename.slice(1, -1)}`,
    }],
   * default will resolve [id] into :id
   */
  matchRoute?: MaybeArray<MatchRouteHandler>
}

type MaybeArray<T> = T | T[]

interface MatchRouteHandler {
  /**
   * select which file to match this rule
   */
  rule: (filename: string) => boolean
  /**
   * resolve filename and return route path
   */
  resolver: (filename: string) => string
}
```

### TypeScript
To get TypeScript support, you can add this to your env.d.ts or any .d.ts file which has been included in tsconfig.json:
```ts
/// <reference types="unplugin-vue-file-router/module" />
```