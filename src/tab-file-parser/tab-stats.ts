import type {TabCellType} from './tab-cell-type'
import type {TabColumnMap, TabRow} from '../tab/tab-record'

import {parseCellType} from './tab-cell-type'

export type TabStats = Readonly<{
  // Column index to TabColumnStats.
  columns: TabColumnStats[]
  total: TabColumnStats
}>

export function TabStats(): TabStats {
  return {columns: [], total: TabColumnStats()}
}

/** Tally rows. */
TabStats.sample = (
  stats: TabStats,
  ...rows: readonly Readonly<TabRow>[]
): void => {
  rows.forEach(row => sampleRow(stats, row))
}

function sampleRow({columns, total}: TabStats, row: Readonly<TabRow>): void {
  row.forEach((cell, index) => {
    const type = parseCellType(cell)
    // [todo]: ??=.
    if (columns[index] == null) columns[index] = TabColumnStats()
    columns[index]![type]++
    total[type]++
  })
}

TabStats.inferMap = (stats: TabStats): TabColumnMap => {
  const map: TabColumnMap = {}
  const textIndex = findMaxCellTypeIndex(stats, 'text')
  if (textIndex != null) map.text = textIndex
  return map
}

function findMaxCellTypeIndex(
  stats: TabStats,
  type: TabCellType
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

/** Column type statistics. Missing cells within the column are uncounted. */
export type TabColumnStats = Record<TabCellType, number>

export function TabColumnStats(): TabColumnStats {
  return {text: 0, number: 0, bool: 0, blank: 0, empty: 0}
}
