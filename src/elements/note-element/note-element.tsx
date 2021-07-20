import type React from 'react'

import {Line} from '../../line/line'
import {LineTextElement} from '../line-text-element/line-text-element'
import {useCallback, useMemo} from 'react'

import './note-element.css'

export type NoteElementProps = Readonly<{line: Readonly<Line>}>

/** A sticky note. */
export function NoteElement({line}: NoteElementProps): JSX.Element {
  const className = useMemo(
    () => `note-element ${Line.isEmpty(line) ? 'note-element--empty' : ''}`,
    [line]
  )
  const onClick = useCallback(
    (ev: React.MouseEvent<HTMLElementTagNameMap['aside']>) =>
      // Block clicks from GroupElement. See LineTextElement's focus listener.
      ev.stopPropagation(),
    []
  )
  return (
    <aside className={className} onClick={onClick}>
      <LineTextElement line={line} />
    </aside>
  )
}
