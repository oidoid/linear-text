import type {ID} from '../id/id'
import type {Line} from '../line/line'

import {LineBreak, lineBreakDefault} from './line-break'

export type Table = Readonly<{
  lineBreak: LineBreak
  lines: Line[]
}>

export function Table(
  lineBreak: LineBreak | undefined = lineBreakDefault,
  lines: Line[] | undefined = []
): Table {
  return {lineBreak, lines}
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
