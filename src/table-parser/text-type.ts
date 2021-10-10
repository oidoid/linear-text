import {isNumeric} from '../utils/string-util'

/** String-encoded data type of the text value. */
export type TextType =
  /** URL or URI. Not a known image. */
  | 'uri-data'
  | 'uri-http'
  | 'uri-file'
  /** An image URI or filename. Takes precedence over other URI line types. */
  | 'image'
  /** Nonempty string. */
  | 'text'
  /** Finite number. */
  | 'number'
  /** True or false. */
  | 'boolean'
  /** Whitespace-only string. */
  | 'blank'
  /** No value. */
  | 'empty'

/** Infer the string-encoded data type of the text value. */
export function parseTextType(text: string): TextType {
  if (text === '') return 'empty'
  if (/^\s+$/.test(text)) return 'blank'
  const trimmed = text.trim()
  if (/^(true|false)$/i.test(trimmed)) return 'boolean'
  if (isNumeric(trimmed)) return 'number'
  if (endsWithImageExtension(trimmed) || startsWithDataImageMIME(trimmed))
    return 'image'
  if (/^file:\/\//.test(trimmed)) return 'uri-file'
  if (/^https?:\/\//.test(trimmed)) return 'uri-http'
  if (/^data:/.test(trimmed)) return 'uri-data'
  return 'text'
}

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const imageExtensions: readonly string[] = Object.freeze([
  'apng',
  'avif',
  'gif',
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  'png',
  'svg',
  'webp',
  'bmp',
  'ico',
  'cur',
  'tif',
  'tiff'
])

function endsWithImageExtension(text: string): boolean {
  return imageExtensions.some(extension =>
    new RegExp(`.\\.${extension}$`).test(text)
  )
}

function startsWithDataImageMIME(text: string): boolean {
  return text.startsWith('data:image/')
}
