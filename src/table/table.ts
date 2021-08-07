import type {ID} from '../id/id'
import type {Line} from '../line/line'

export const newlineDefault = '\n' // [to-do]: platform agnostic.
export type Table = Readonly<{
  /** The line delimiter. Usually \n or \r\n. */
  newline: string
  lines: Line[]
}>

export function Table(
  newline: string | undefined = newlineDefault,
  lines: Line[] | undefined = []
): Table {
  return {newline, lines}
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
