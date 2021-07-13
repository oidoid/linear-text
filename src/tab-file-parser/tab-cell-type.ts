import type {TabCell} from '../tab/tab-record'

import {isNumeric} from '../string-util'

/** String-encoded data type of the cell value. */
export type TabCellType =
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

/** Infer the string-encoded data type of the cell value. */
export function parseCellType(cell: TabCell): TabCellType {
  if (cell === '') return 'empty'
  if (/^\s+$/.test(cell)) return 'blank'
  const trimmed = cell.trim()
  if (/^(true|false)$/i.test(trimmed)) return 'bool'
  if (isNumeric(trimmed)) return 'number'
  return 'text'
}
