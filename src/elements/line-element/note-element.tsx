import type {DraggableProvidedDragHandleProps} from 'react-beautiful-dnd'
import type {Line} from '../../line/line'
import type React from 'react'
import type {XY} from '../../math/xy'

import {IconElement} from '../icon-element/icon-element'
import {LineTextElement} from '../line-element/line-text-element'
import {t} from '@lingui/macro'
import {useCallback} from 'react'

import grabIcon from '../../icons/grab-icon.svg'

import './note-element.css'

export type NoteProps = Readonly<{
  dragHandleProps: DraggableProvidedDragHandleProps | undefined
  line: Readonly<Line>
  xy: Readonly<XY>
}>

/** A sticky note. */
export function NoteElement({
  dragHandleProps,
  line,
  xy
}: NoteProps): JSX.Element {
  const onFocusCapture = useCallback(
    (ev: React.FocusEvent<HTMLElementTagNameMap['aside']>) =>
      // Smooth scroll into view.
      ev.currentTarget.scrollIntoView({behavior: 'smooth', block: 'nearest'}),
    []
  )
  return (
    <aside className='note' onFocusCapture={onFocusCapture}>
      <div className='note__drag-handle' {...dragHandleProps}>
        <IconElement alt='' src={grabIcon} title={t`button-grab-line__title`} />
      </div>
      <LineTextElement line={line} xy={xy} />
    </aside>
  )
}
