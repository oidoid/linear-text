import type {Line} from '../line/line'

import {TableMeta} from './table-meta'

export type Table = {meta: TableMeta; lines: Line[]}

export function Table(lines: Line[] = []): Table {
  return {meta: TableMeta(['text'], {text: 0}), lines}
}
