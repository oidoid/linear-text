import type {ID} from '../id/id'

import {IDFactory, makeID} from '../id/id-factory'
import {assert} from '../utils/assert'

/** A line of text and its application state modeling. */
export type Line = {
  /**
   * Unique identity for the program's execution lifetime. No association to
   * line number. Never serialized. Symbols are not used as they cannot be
   * serialized in the store.
   */
  readonly id: ID

  /**
   * The text to be shown, possibly mini-Markdown or empty. Never contains
   * newlines. Empty lines are usually used for separating logical groups of
   * lines. State and text are coupled internally. **Do not manually set.**
   */
  text: string
}

/** Creates a new line. */
export function Line(factory: IDFactory, text: string | undefined = ''): Line {
  assertNoLineBreak(text)
  return {id: makeID(factory), text}
}

/** Validates and updates the tet. */
Line.setText = (line: Line, text: string): void => {
  assertNoLineBreak(text)
  line.text = text
}

/**
 * An empty line is considered a draft. The UI only permits one draft to exist
 * at any time. Empty lines created in the GUI would be parsed as groups so only
 * nonempty lines are persisted.
 */
Line.isEmpty = (line: Readonly<Line>): boolean => line.text === ''

// [to-do]: Instead of asserting, replace all.
function assertNoLineBreak(text: string): void {
  assert(!/\r?\n/.test(text), 'Newlines are forbidden in text.')
}
