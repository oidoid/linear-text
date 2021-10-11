import type {Group} from '../../table/group'

import {
  addDraftAction,
  focusAction,
  removeGroupAction
} from '../../store/table-slice/table-slice'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import {HandlebarElement} from '../handlebar-element/handlebar-element'
import {LineElement} from '../line-element/line-element'
import React, {useCallback, useMemo} from 'react'
import {UnorderedListElement} from '../list-element/list-element'
import {useAppDispatch} from '../../hooks/use-store'

import './group-element.css'

export type GroupProps = Readonly<{group: Group; x: number}>

/** A group of lines in columnar presentation. */
export function GroupElement({group, x}: GroupProps): JSX.Element {
  const dispatch = useAppDispatch()
  const groupIndex = useMemo(() => ({id: group.id, x}), [group.id, x])

  const onClick = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation()
  }, [])
  const onFocus = useCallback(
    (ev: React.FocusEvent<HTMLTextAreaElement>) => {
      ev.stopPropagation()
      // There is not a mirroring dispatch call for blur because focus is lost
      // on discard button press. This need to be a component state not DOM
      // state.
      dispatch(focusAction(groupIndex))
    },
    [dispatch, groupIndex]
  )

  const emptyGroup = group.lines.length === 0
  const onKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const remove =
        (ev.key === 'Backspace' || ev.key === 'Delete') && emptyGroup
      if (ev.key !== 'Enter' && !remove) return
      ev.preventDefault()
      ev.stopPropagation()

      if (ev.key === 'Enter') {
        dispatch(addDraftAction())
      } else {
        dispatch(
          removeGroupAction({
            lineIndex: groupIndex,
            nextFocus: ev.key === 'Backspace' ? 'prev' : 'next'
          })
        )
      }
    },
    [dispatch, emptyGroup, groupIndex]
  )

  return (
    <Draggable draggableId={group.id.toString()} index={x}>
      {provided => (
        <section
          {...(provided.draggableProps as unknown)}
          className={`group ${group.lines.length === 0 ? 'group--empty' : ''}`}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          ref={provided.innerRef}
        >
          <div className='group__handlebar-box'>
            <HandlebarElement dragHandleProps={provided.dragHandleProps} />
          </div>
          <Droppable droppableId={group.id.toString()} type='task'>
            {provided => (
              <UnorderedListElement
                {...provided.droppableProps}
                className='group__list'
                ref={provided.innerRef}
              >
                {group.lines.map((line, y) => (
                  <li className='group__list-item' key={line.id}>
                    <LineElement line={line} xy={{x, y}} />
                  </li>
                ))}
                {provided.placeholder as any}
              </UnorderedListElement>
            )}
          </Droppable>
        </section>
      )}
    </Draggable>
  )
}
