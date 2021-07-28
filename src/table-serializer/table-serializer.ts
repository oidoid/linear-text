import type {Row} from '../table/row'
import type {Table} from '../table/table'

import Papa from 'papaparse'

/** Serialize a table to a tab-delimited value. */
export function serializeTable(table: Readonly<Table>): string {
  const lines: Row[] = []
  if (table.meta.header != null) lines.push(table.meta.header)
  lines.push(
    ...table.lines.filter(line => line.state !== 'draft').map(line => line.row)
  )
  return Papa.unparse(lines, {
    delimiter: table.meta.delimiter,
    newline: table.meta.newline
  })
}
