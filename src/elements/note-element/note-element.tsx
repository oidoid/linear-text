import type {Line} from '../../line/line'
import type React from 'react'

import {LineTextElement} from '../line-text-element/line-text-element'
import {useCallback, useMemo} from 'react'

import './note-element.css'

export type NoteElementProps = Readonly<{line: Readonly<Line>}>

/** A sticky note. */
export function NoteElement({line}: NoteElementProps): JSX.Element {
  const className = useMemo(
    () => `note-element note-element--${line.state}`,
    [line.state]
  )
  const onFocusCapture = useCallback(
    (ev: React.FocusEvent<HTMLElementTagNameMap['aside']>) =>
      // Smooth scroll into view.
      ev.currentTarget.scrollIntoView({behavior: 'smooth', block: 'nearest'}),
    []
  )
  return (
    <aside className={className} onFocusCapture={onFocusCapture}>
      <LineTextElement line={line} />
    </aside>
  )
}
