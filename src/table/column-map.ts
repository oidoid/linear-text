import type {Column} from './column'

/**
 * Model column name to column index, if any. A given row may have more or less
 * columns than the header or other rows.
 */
export type ColumnMap = Partial<Record<Column, number | undefined>>
