import type {ID} from '../id/id'

import {IDFactory, makeID} from '../id/id-factory'

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

/** A line of text and its application state modeling. */
export type Line = {
  /**
   * Unique identity for the program's execution lifetime. No association to
   * line number. Never serialized. Symbols are not used as they cannot be
   * serialized in the store.
   */
  readonly id: ID

  /** State is managed internally. **Do not manually set.** */
  state: LineState

  /**
   * The text to be shown, possibly mini-Markdown or empty. Never contains
   * newlines. Empty lines are usually used for separating logical groups of
   * lines. State and text are coupled internally. **Do not manually set.**
   */
  text: string
}

/** Creates a new line. */
export function Line(
  factory: IDFactory,
  draft: boolean | undefined = false,
  text: string | undefined = ''
): Line {
  throwIfNewline(text)
  return {
    id: makeID(factory),
    state: draft ? 'draft' : text === '' ? 'divider' : 'note',
    text
  }
}

/** Updates the text and state. */
Line.setText = (line: Line, text: string): void => {
  throwIfNewline(text)
  line.text = text
  line.state =
    text === '' ? (line.state === 'divider' ? 'divider' : 'draft') : 'note'
}

function throwIfNewline(text: string): void {
  if (/\r?\n/.test(text)) throw Error('Newlines are forbidden in text.')
}
