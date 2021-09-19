import type {Line} from '../../line/line'
import type {XY} from '../../math/xy'

import {Draggable} from 'react-beautiful-dnd'
import {NoteElement} from '../line-element/note-element'
import {t} from '@lingui/macro'

export type LineProps = Readonly<{line: Readonly<Line>; xy: Readonly<XY>}>

export function LineElement({line, xy}: LineProps): JSX.Element {
  return (
    <Draggable draggableId={line.id.toString()} index={xy.y}>
      {provided => (
        <div
          aria-roledescription={t`button-move-line__description`}
          ref={provided.innerRef}
          {...(provided.draggableProps as unknown)}
        >
          <NoteElement
            dragHandleProps={provided.dragHandleProps}
            line={line}
            xy={xy}
          />
        </div>
      )}
    </Draggable>
  )
}
