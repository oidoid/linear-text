import type {Line} from '../../line/line'
import type React from 'react'

import {LineTextElement} from '../line-element/line-text-element'
import {useCallback, useMemo} from 'react'

import './note-element.css'

export type NoteProps = Readonly<{line: Readonly<Line>; x: number}>

/** A sticky note. */
export function NoteElement({line, x}: NoteProps): JSX.Element {
  const className = useMemo(() => `note note--${line.state}`, [line.state])
  const onFocusCapture = useCallback(
    (ev: React.FocusEvent<HTMLElementTagNameMap['aside']>) =>
      // Smooth scroll into view.
      ev.currentTarget.scrollIntoView({behavior: 'smooth', block: 'nearest'}),
    []
  )
  return (
    <aside className={className} onFocusCapture={onFocusCapture}>
      <LineTextElement line={line} x={x} />
    </aside>
  )
}
