import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {GroupElement} from './group-element'
import {
  moveGroupAction,
  moveLineAction
} from '../../store/table-slice/table-slice'
import {NonNull} from '../../utils/assert'
import {parseID} from '../../id/id'
import {Table} from '../../table/table'
import {UnorderedListElement} from '../list-element/list-element'
import {useAppDispatch} from '../../hooks/use-store'

import './table-element.css'

export type TableProps = Readonly<{table: Readonly<Table>}>

export function TableElement({table}: TableProps): JSX.Element {
  const dispatch = useAppDispatch()

  const onDragEnd = (result: DropResult) => {
    const {destination, source, type} = result

    if (destination == null) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    if (type === 'column') {
      dispatch(
        moveGroupAction({
          from: {id: parseID(source.droppableId), x: source.index},
          to: destination.index
        })
      )
      return
    }

    const sourceX = NonNull(Table.findGroup(table, parseID(source.droppableId)))
    const destinationX = NonNull(
      Table.findGroup(table, parseID(destination.droppableId))
    )
    dispatch(
      moveLineAction({
        from: {
          id: NonNull(table.groups[sourceX]?.lines[source.index]?.id),
          x: sourceX,
          y: source.index
        },
        to: {x: destinationX, y: destination.index}
      })
    )
  }

  return (
    <article className='table'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId='all-columns'
          direction='horizontal'
          type='column'
        >
          {provided => (
            <UnorderedListElement
              {...provided.droppableProps}
              className='table__list'
              ref={provided.innerRef}
            >
              {table.groups.map((group, x) => (
                <li className='table__list-item' key={group.id}>
                  <GroupElement group={group} x={x} />
                </li>
              ))}
              {provided.placeholder as any}
            </UnorderedListElement>
          )}
        </Droppable>
      </DragDropContext>
    </article>
  )
}
