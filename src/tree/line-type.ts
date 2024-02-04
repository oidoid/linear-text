import {
  isDataImageURIStr,
  isDataURIStr,
  isFileURIStr,
  isHTTPURIStr,
} from '../uri-parser/uri-parser.js'
import { isNumeric } from '../utils/string-util.js'

/** String-encoded data type of the text value. */
export type LineType =
  /** Data URI but not a known image media type. */
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
export function parseLineType(text: string): LineType {
  if (text === '') return 'empty'
  if (/^\s+$/.test(text)) return 'blank'
  const trimmed = text.trim()
  if (/^(true|false)$/i.test(trimmed)) return 'boolean'
  if (isNumeric(trimmed)) return 'number'
  if (isDataImageURIStr(trimmed) || endsWithImageExtension(trimmed)) {
    return 'image'
  }
  if (isFileURIStr(trimmed)) return 'uri-file'
  if (isHTTPURIStr(trimmed)) return 'uri-http'
  if (isDataURIStr(trimmed)) return 'uri-data'
  return 'text'
}

/**
 * Extensions of image formats likely to be supported by the image element. See
 * https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types.
 */
const imageExtensions = Object.freeze([
  '.apng',
  '.avif',
  '.gif',
  '.jpg',
  '.jpeg',
  '.jfif',
  '.pjpeg',
  '.pjp',
  '.png',
  '.svg',
  '.webp',
  '.bmp',
  '.ico',
  '.cur',
  '.tif',
  '.tiff',
])

function endsWithImageExtension(text: string): boolean {
  const extIndex = imageExtensions.find((ext) => text.endsWith(ext))
  if (extIndex == null) return false
  // Require not just an extension but a filename stem too.
  return text.length > extIndex.length
}
