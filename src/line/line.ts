import type {ID} from '../id/id'
import type {Row} from '../table/row'

import {IDFactory, makeID} from '../id/id-factory'
import type {ColumnMap} from '../table/column-map'

/**
 * Interim visual and behavioral representation. Do not serialize. State is used
 * to preserve user intent prior to text mutation.
 *
 * When a line is created from a file, the state intent (divider or note) can be
 * accurately determined by whether or not the line is empty. However, from the
 * UI, a line may be created with the intent to become a note. Without an
 * intermediate draft state, the line would immediately snap to a divider visual
 * representation which is a jarring effect.
 */
export type LineState = 'divider' | 'draft' | 'note'

/** A table row and its application state modeling. */
export type Line = {
  /**
   * Unique model identity for the program's execution lifetime. No association
   * to line number. Never serialized to row. Symbols are not used as they
   * cannot be serialized in the store.
   */
  readonly id: ID

  /** State is managed internally. Do not manually set. */
  state: LineState

  /**
   * The normalized model text to be shown, possibly mini-Markdown or empty.
   * This is a cached copy of the appropriate column kept in sync by setText().
   */
  text: string | undefined

  /** The known columns (text) and any user columns verbatim. */
  readonly row: Row
}

export type ReadonlyLine = Readonly<Omit<Line, 'row'> & {row: Readonly<Row>}>

/** Creates a new, invalidated line. */
export function Line(
  factory: IDFactory,
  map: ColumnMap,
  state: LineState,
  text: string | undefined = undefined,
  row: Row | undefined = []
): Line {
  if (text != null) row[map.text] = text
  return {id: makeID(factory), state, text, row: []}
}

/** Creates a new, valid line. */
Line.fromRow = (
  factory: IDFactory,
  state: LineState,
  text: string | undefined,
  row: Row
): Line => {
  return {id: makeID(factory), state, text, row}
}

/** Updates the text model and invalidates the row. */
Line.setText = (line: Line, map: ColumnMap, text: string): void => {
  line.text = text
  line.row[map.text] = text
  line.state = Line.isEmpty(line)
    ? line.state === 'divider'
      ? 'divider'
      : 'draft'
    : 'note'
}

/**
 * Returns true if text is nullish or empty, false if blank or otherwise
 * nonempty. Additional cells, such as user cells, are not considered.
 *
 * Empty lines are usually used for separating logical groups of lines.
 */
Line.isEmpty = (line: ReadonlyLine): boolean => {
  return line.text == null || line.text === ''
}
