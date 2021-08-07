import {isNumeric} from '../utils/string-util'

/** String-encoded data type of the text value. */
export type TextType =
  | 'uri-data'
  | 'uri-http'
  | 'uri-file'
  /** Nonempty string. */
  | 'text'
  /** Finite number. */
  | 'number'
  /** True or false. */
  | 'bool'
  /** Whitespace-only string. */
  | 'blank'
  /** No value. */
  | 'empty'

/** Infer the string-encoded data type of the text value. */
export function parseTextType(text: string): TextType {
  if (text === '') return 'empty'
  if (/^\s+$/.test(text)) return 'blank'
  const trimmed = text.trim()
  if (/^(true|false)$/i.test(trimmed)) return 'bool'
  if (isNumeric(trimmed)) return 'number'
  if (/^file:\/\//.test(text)) return 'uri-file'
  if (/^https?:\/\//.test(text)) return 'uri-http'
  return 'text'
}
