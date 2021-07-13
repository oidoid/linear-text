import type {TabFile, TabHeader} from '../tab/tab-file'
import type {TabRow} from '../tab/tab-record'

import {tabMetaDefaults} from '../tab/tab-file'
import Papa from 'papaparse'
import {TabColumnMap, TabRecord} from '../tab/tab-record'
import {TabStats} from './tab-stats'

export function parseTabFile(input: File | string): Promise<TabFile> {
  return new Promise((resolve, reject) =>
    Papa.parse<TabRow>(input, {
      complete({errors, meta, data}) {
        const delimiterErrorIndex = errors.findIndex(
          ({code}) => code === 'UndetectableDelimiter'
        )
        if (delimiterErrorIndex > -1) {
          errors.splice(delimiterErrorIndex, 1)
          meta.delimiter = tabMetaDefaults.delimiter
        }
        if (errors.length > 0) return reject(errors)
        return resolve(parse(meta, data))
      }
    })
  )
}

function parse(parseMeta: Papa.ParseMeta, data: TabRow[]): TabFile {
  const {header, rows} = parseTabHeaderAndRows(data)
  let columnMap: TabColumnMap = {}
  if (header == null) {
    // No header. Use a heuristic to guess the best mapping from the model
    // columns to the actual row columns.
    const stats = TabStats()
    TabStats.sample(stats, ...rows)
    columnMap = TabStats.inferMap(stats)
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
    records: rows.map(row => parseTabRecord(row, columnMap))
  }
}

function parseTabHeaderAndRows(data: readonly TabRow[]): {
  header: TabHeader | undefined
  rows: readonly TabRow[]
} {
  if (data[0] == null || !isHeader(data[0]))
    return {header: undefined, rows: data}
  const [header, ...rows] = data
  return {header, rows}
}

function parseTabRecord(row: TabRow, columnMap: TabColumnMap): TabRecord {
  const text = columnMap.text == null ? undefined : row[columnMap.text]
  return TabRecord.fromRow(row, text)
}

function isHeader(row: Readonly<TabRow>): boolean {
  return findHeaderTextIndex(row) != null
}

function findHeaderTextIndex(row: Readonly<TabRow>): number | undefined {
  // Find first index of a text column.
  const index = row.findIndex(cell => /^\s*text\s*$/i.test(cell))
  return index === -1 ? undefined : index
}
