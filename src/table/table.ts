import type {ID} from '../id/id'
import type {Line} from '../line/line'

/** The line delimiter. The end of a line of text and the start of a new one. */
export type LineBreak = '\n' | '\r\n'

export const newlineDefault: LineBreak = '\n' // [to-do]: platform agnostic.
export type Table = Readonly<{
  lineBreak: LineBreak
  lines: Line[]
}>

export function Table(
  lineBreak: LineBreak | undefined = newlineDefault,
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
