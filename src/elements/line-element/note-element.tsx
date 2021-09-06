import type {Line} from '../../line/line'
import type React from 'react'
import type {XY} from '../../math/xy'

import {LineTextElement} from '../line-element/line-text-element'
import {useCallback} from 'react'

import './note-element.css'

export type NoteProps = Readonly<{line: Readonly<Line>; xy: Readonly<XY>}>

/** A sticky note. */
export function NoteElement({line, xy}: NoteProps): JSX.Element {
  const onFocusCapture = useCallback(
    (ev: React.FocusEvent<HTMLElementTagNameMap['aside']>) =>
      // Smooth scroll into view.
      ev.currentTarget.scrollIntoView({behavior: 'smooth', block: 'nearest'}),
    []
  )
  return (
    <aside className='note' onFocusCapture={onFocusCapture}>
      <LineTextElement line={line} xy={xy} />
    </aside>
  )
}
