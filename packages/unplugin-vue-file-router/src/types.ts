import type { MaybeArray } from '@chengdx/shared'

export interface MatchRouteHandler {
  rule: (filename: string) => boolean
  resolver: (filename: string) => ({
    /**
     * Add into route params
     */
    params: unknown
    /**
     * Parsed path, include realtive path only
     * like filename '[id]' into ':id'
     */
    path: string
  })
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
