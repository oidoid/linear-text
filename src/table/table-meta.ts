import type {ColumnMap} from './column-map'
import type {Row} from './row'

export type TableMeta = {
  readonly header: TableHeader | undefined
  /** If header is not present, this will be inferred from the data. */
  columnMap: ColumnMap
  readonly delimiter: string
  readonly newline: string
}

/**
 * If present, this will be serialized and used to infer column map. This
 * can't currently be modified by the program.
 */
export type TableHeader = Row

export function TableMeta(
  header: TableHeader | undefined,
  columnMap: ColumnMap,
  delimiter: string | undefined = tableMetaDefaults.delimiter,
  newline: string | undefined = tableMetaDefaults.newline
): TableMeta {
  return {columnMap, header, delimiter, newline}
}

export const tableMetaDefaults = Object.freeze({delimiter: '\t', newline: '\n'})
