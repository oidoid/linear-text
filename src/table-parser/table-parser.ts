import type {ColumnMap} from '../table/column-map'
import type {IDFactory} from '../id/id-factory'
import type {Row} from '../table/row'
import type {Table} from '../table/table'

import {Line} from '../line/line'
import Papa from 'papaparse'
import {TableHeader, tableMetaDefaults} from '../table/table-meta'
import {TableStats} from './table-stats'

/** Parse a table from tab-delimited values. */
export function parseTable(
  factory: IDFactory,
  input: File | string
): Promise<Table> {
  return new Promise((resolve, reject) =>
    Papa.parse<Row>(input, {
      complete({errors, meta, data}) {
        if (errors.length > 0) return reject(errors)
        return resolve(parse(factory, meta, data))
      },
      delimiter: tableMetaDefaults.delimiter
    })
  )
}

function parse(
  factory: IDFactory,
  parseMeta: Papa.ParseMeta,
  data: Row[]
): Table {
  const {header, rows} = parseTableHeaderAndRows(data)
  let columnMap: ColumnMap = {}
  if (header == null) {
    // No header. Use a heuristic to guess the best mapping from the model
    // columns to the actual row columns.
    const stats = TableStats()
    TableStats.sample(stats, ...rows)
    columnMap = TableStats.inferMap(stats)
  } else {
    // Use the header to map from the model columns to the actual row columns.
    columnMap = {text: findHeaderTextIndex(header)}
  }

  return {
    meta: {
      header,
      columnMap,
      delimiter: parseMeta.delimiter,
      newline: parseMeta.linebreak
    },
    lines: rows.map(row => parseLine(factory, row, columnMap))
  }
}

function parseTableHeaderAndRows(data: readonly Row[]): {
  header: TableHeader | undefined
  rows: readonly Row[]
} {
  if (data[0] == null || !isHeader(data[0]))
    return {header: undefined, rows: data}
  const [header, ...rows] = data
  return {header, rows}
}

function isHeader(row: Readonly<Row>): boolean {
  return findHeaderTextIndex(row) != null
}

function findHeaderTextIndex(row: Readonly<Row>): number | undefined {
  // Find first index of a text column.
  const index = row.findIndex(cell => /^\s*text\s*$/i.test(cell))
  return index === -1 ? undefined : index
}

function parseLine(factory: IDFactory, row: Row, columnMap: ColumnMap): Line {
  const text = columnMap.text == null ? undefined : row[columnMap.text]
  const state = text == null || text === '' ? 'divider' : 'note'
  return Line.fromRow(factory, state, text, row)
}
