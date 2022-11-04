import type { MaybeArray } from '@chengdx/shared'

export interface MatchRouteHandler {
  rule: (filename: string) => boolean
  resolver: (filename: string) => string
}

export interface Options {
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
  matchRoute?: MaybeArray<MatchRouteHandler>
}
