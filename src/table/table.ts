import type {ID} from '../id/id'
import type {Line} from '../line/line'

import {TableMeta} from './table-meta'

export type Table = {meta: TableMeta; lines: Line[]}

export function Table(lines: Line[] = []): Table {
  return {meta: TableMeta(['text'], {text: 0}), lines}
}

Table.findLine = (table: Readonly<Table>, id: ID): Line => {
  const index = Table.findLineIndex(table, id)
  return table.lines[index]!
}

Table.findLineIndex = (table: Readonly<Table>, id: ID): number => {
  const index = table.lines.findIndex(line => line.id === id)
  if (index === -1) throw Error(`Line with ID=${id} not found.`)
  return index
}

Table.removeLine = (table: Readonly<Table>, id: ID): number => {
  const index = Table.findLineIndex(table, id)
  table.lines.splice(index, 1)
  return index
}
