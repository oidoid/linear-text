import type {CellType} from './cell-type'

/** Cell type statistics. Missing cells are uncounted. */
export type CellTypeStats = Record<CellType, number>

export function CellTypeStats(): CellTypeStats {
  return {text: 0, number: 0, bool: 0, blank: 0, empty: 0}
}
