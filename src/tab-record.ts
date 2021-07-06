/** A table row and its application state modeling. */
export type TabRecord = {
  id: number

  /** The modeled text to be shown, possibly mini-Markdown or empty. */
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
  row: TabRow
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
export type TabRow = (string | undefined)[]

/**
 * Model column to row index. A given row may have more or less columns than
 * the header or other rows.
 */
export type TabHeader = Record<TabColumn, number>

let uid: number = 0

export function TabRecord(text?: string | undefined): TabRecord {
  uid++
  return {id: uid, text, invalidated: true, row: []}
}

export namespace TabRecord {
  export function fromRow(row: TabRow, header: TabHeader): TabRecord {
    uid++
    return {id: uid, text: row[header.text], invalidated: false, row}
  }

  export function setText(record: TabRecord, text: string): void {
    record.text = text
    record.invalidated = true
  }
}
