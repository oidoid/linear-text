import type {Line} from '../../line/line'
import type {XY} from '../../math/xy'

import {Draggable, DraggableProvidedDragHandleProps} from 'react-beautiful-dnd'
import {LineType, parseLineType} from '../../table-parser/line-type'
import {NoteElement} from '../line-element/note-element'
import {LineImageElement} from './line-image-element'

export type LineProps = Readonly<{line: Readonly<Line>; xy: Readonly<XY>}>

export function LineElement({line, xy}: LineProps): JSX.Element {
  const type = parseLineType(line.text)
  const LineTypeElement = lineTypeToElement[type]
  return (
    <Draggable draggableId={line.id.toString()} index={xy.y}>
      {provided => (
        <div
          aria-roledescription='Press spacebar to move the line.'
          ref={provided.innerRef}
          {...(provided.draggableProps as any)}
        >
          <LineTypeElement
            dragHandleProps={provided.dragHandleProps}
            line={line}
            xy={xy}
          />
        </div>
      )}
    </Draggable>
  )
}

type LineTypeProps = Readonly<{
  dragHandleProps: DraggableProvidedDragHandleProps | undefined
  line: Readonly<Line>
  xy: Readonly<XY>
}>

const lineTypeToElement: Readonly<
  Record<LineType, (props: LineTypeProps) => JSX.Element>
> = Object.freeze({
  'uri-file': props => <NoteElement {...props} />,
  'uri-http': props => <NoteElement {...props} />,
  'uri-data': props => <NoteElement {...props} />,
  image: props => <LineImageElement {...props} />,
  text: props => <NoteElement {...props} />,
  number: props => <NoteElement {...props} />,
  boolean: props => <NoteElement {...props} />,
  blank: props => <NoteElement {...props} />,
  empty: props => <NoteElement {...props} />
})
