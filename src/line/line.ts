import type {ID} from '../id/id'
import type {Row} from '../table/row'

import {IDFactory, makeID} from '../id/id-factory'

/** A table row and its application state modeling. */
export type Line = {
  /**
   * Unique model identity for the program's execution lifetime. No association
   * to line number. Never serialized to row. Symbols are not used as they
   * cannot be serialized in the store.
   */
  readonly id: ID

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
   * disk. Exercise care when undoing.
   */
  readonly row: Row
}

/** Creates a new, invalidated line. */
export function Line(factory: IDFactory, text?: string | undefined): Line {
  return {id: makeID(factory), text, invalidated: true, row: []}
}

/** Creates a new, valid line. */
Line.fromRow = (
  factory: IDFactory,
  row: Row,
  text: string | undefined
): Line => {
  return {id: makeID(factory), text, invalidated: false, row}
}

/** Updates the text model and invalidates the row. */
Line.setText = (line: Line, text: string): void => {
  line.text = text
  line.invalidated = true
}

/**
 * Returns true if text is nullish or empty, false if blank or otherwise
 * nonempty. Additional cells, such as user cells, are not considered.
 *
 * Empty lines are usually used for separating logical groups of lines.
 */
Line.isEmpty = (line: Readonly<Line>): boolean => {
  return line.text == null || line.text.length === 0
}
