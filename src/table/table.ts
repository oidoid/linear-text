import type {ID} from '../id/id'
import type {Line} from '../line/line'

import {TableMeta} from './table-meta'

export type Table = {meta: TableMeta; lines: Line[]}

export function Table(
  // Favor an empty header for now. This keeps the file plain text.
  meta: TableMeta | undefined = TableMeta(undefined, {text: 0}),
  lines: Line[] | undefined = []
): Table {
  return {meta, lines}
}

Table.findLine = (table: Readonly<Table>, id: ID): [Line, number] => {
  const index = table.lines.findIndex(line => line.id === id)
  if (index === -1) throw Error(`Line with ID=${id} not found.`)
  return [table.lines[index]!, index]
}

Table.removeLine = (table: Readonly<Table>, id: ID): [Line, number] => {
  const [line, index] = Table.findLine(table, id)
  table.lines.splice(index, 1)
  return [line, index]
}
