import {IDFactory, makeID} from '../id-factory/id-factory'

/** A table row and its application state modeling. */
export type TabRecord = {
  /**
   * Unique for the program's execution lifetime. Never serialized to row.
   * Symbols are not used as they cannot be serialized for the store.
   */
  readonly id: number

  /** The normalized model text to be shown, possibly mini-Markdown or empty. */
  text: string | undefined

  /**
   * True when the row property is outdated. Invalidated data is flushed to the
   * row on save. Invalidating, saving, and reloading data is expected to
   * produce the same model results as just invalidating and saving.
   */
  invalidated: boolean

  /**
   * The model is flushed to the row only on save. Only row data is written to
   * disk.
   */
  readonly row: TabRow
}

/**
 * Recognized model columns. A given file may label these columns differently.
 */
export type TabColumn = keyof TabRecord & 'text'

/**
 * The ordered row data verbatim, if any. An empty string item indicates no
 * value and undefined indicates the cell was either missing or empty and the
 * last column.
 *
 * This data may be unparseable or unexpected for a given column.
 */
export type TabRow = TabCell[]
export type TabCell = string

/**
 * Model column to row index. A given row may have more or less columns than
 * the header or other rows. The mapping may be sparse.
 */
export type TabColumnMap = Partial<Record<TabColumn, number | undefined>>

export function TabRecord(
  factory: IDFactory,
  text?: string | undefined
): TabRecord {
  return {id: makeID(factory), text, invalidated: true, row: []}
}

// new uninvalidated row
TabRecord.fromRow = (
  factory: IDFactory,
  row: TabRow,
  text: string | undefined
): TabRecord => {
  return {id: makeID(factory), text, invalidated: false, row}
}

TabRecord.setText = (record: TabRecord, text: string): void => {
  record.text = text
  record.invalidated = true
}

// "void"
TabRecord.isSpacing = (record: TabRecord): boolean => {
  return record.text == null || record.text.length === 0
}
