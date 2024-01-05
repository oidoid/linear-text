import type { DataURI } from './data-uri.ts'

export function isDataURIStr(str: string): boolean {
  return str.startsWith('data:')
}

export function isDataImageURIStr(str: string): boolean {
  return str.startsWith('data:image/')
}

export function isFileURIStr(str: string): boolean {
  return str.startsWith('file://')
}

export function isHTTPURIStr(str: string): boolean {
  return /^https?:\/\//.test(str)
}

/**
 * Data URIs cannot be opened in a new tab. If `uri` is a data URI, create an
 * object URL. Otherwise, just use the original URI.
 */
export function parseObjectURL(uri: string): string {
  const blob = parseDataURIBlob(uri)
  return blob ? URL.createObjectURL(blob) : uri
}

export function parseDataURIBlob(str: string): Blob | undefined {
  const { data, encoding, mediaType } = parseDataURI(str) ?? {}
  if (data == null) return
  if (encoding !== 'base64') return
  const encoder = new TextEncoder()
  const buffer = encoder.encode(data)
  return new Blob([buffer], mediaType == null ? undefined : { type: mediaType })
}

const dataURIRegex =
  /^(?<scheme>data):(?<mediaType>(?<mimeType>[^,;]+)(?<params>(;[^=,;]+=[^=,;]+)*))?(;(?<encoding>base64))?,(?<data>.*)$/i

export function parseDataURI(str: string): DataURI | undefined {
  const { groups } = dataURIRegex.exec(str) ?? {}
  if (groups == null) return
  if (groups.scheme !== 'data') return
  if (groups.encoding != null && groups.encoding !== 'base64') return
  return {
    scheme: groups.scheme,
    mediaType: groups.mediaType,
    mimeType: groups.mimeType,
    params: Object.fromEntries(
      groups.params
        ?.split(';')
        .slice(1) // Params start with `';'`. Skip the leading empty division.
        .map((param) => param.split('=')) ?? [],
    ),
    encoding: groups.encoding,
    data: groups.data ?? '',
  }
}
