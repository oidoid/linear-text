import type {Cell} from './cell'

/**
 * The ordered row data verbatim, if any. An empty string item indicates no
 * value and undefined indicates the cell was either missing or empty and the
 * last column.
 *
 * This data may be unparseable or unexpected for a given column.
 */
export type Row = Cell[]
