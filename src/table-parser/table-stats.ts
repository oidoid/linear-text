import type {CellType} from './cell-type'
import type {ColumnMap} from '../table/column-map'
import type {Row} from '../table/row'

import {CellTypeStats} from './cell-type-stats'
import {parseCellType} from './cell-type'

export type TableStats = Readonly<{
  /**
   * Column index to CellTypeStats. The maximum number of columns in any row of
   * the table is the length of this array.
   */
  columns: CellTypeStats[]
  /** Aggregated stats for all columns. */
  total: CellTypeStats
}>

export function TableStats(): TableStats {
  return Object.freeze({columns: [], total: CellTypeStats()})
}

/** Tally rows. */
TableStats.sample = (
  stats: TableStats,
  ...rows: readonly Readonly<Row>[]
): void => {
  rows.forEach(row => sampleRow(stats, row))
}

function sampleRow({columns, total}: TableStats, row: Readonly<Row>): void {
  row.forEach((cell, index) => {
    const type = parseCellType(cell)
    // [todo]: ??=.
    if (columns[index] == null) columns[index] = CellTypeStats()
    columns[index]![type]++
    total[type]++
  })
}

TableStats.inferMap = (stats: TableStats): ColumnMap => {
  const maxColumns = stats.columns.length
  return {
    text: findMaxCellTypeIndex(stats, 'text') ?? maxColumns
  }
}

function findMaxCellTypeIndex(
  stats: TableStats,
  type: CellType
): number | undefined {
  if (stats.total[type] === 0) return
  return stats.columns
    .map(columns => columns[type])
    .reduce(
      (maxCountIndex, count, index, types) =>
        count > types[maxCountIndex]! ? index : maxCountIndex,
      0
    )
}
