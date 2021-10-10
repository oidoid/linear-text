/** See https://wikipedia.org/wiki/Data_URI_scheme. */
export type DataURI = {
  readonly scheme: 'data'
  /**
   * E.g., `'image/gif;abc=def'`. If undefined, assumed to be
   * `'text/plain;charset=US-ASCII'`.
   */
  mediaType: string | undefined
  /** Media mime type. E.g., `'image/gif'`. */
  mimeType: string | undefined
  /** Media type parameters. E.g., `{abc: 'def'}`. */
  params: Record<string, string>
  encoding: 'base64' | undefined
  /** Data string, possibly empty. E.g., in `'abc'` in `'data:,abc'`. */
  data: string
}
