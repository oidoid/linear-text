import type {Group} from '../../table/group'
import type {ID} from '../../id/id'

import {
  addDraftAction,
  focusAction,
  removeGroupAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {LineElement} from '../line-element/line-element'
import React, {useCallback, useEffect, useMemo, useRef} from 'react'
import {UnorderedListElement} from '../list-element/list-element'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'

import './group-element.css'

export type GroupProps = Readonly<{group: Group; x: number}>

export function GroupElement({group, x}: GroupProps): JSX.Element {
  const dispatch = useAppDispatch()
  const groupIndex = useMemo(() => ({id: group.id, x}), [group.id, x])
  const tableState = useAppSelector(selectTableState)

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

  const rootRef = useRef<HTMLElementTagNameMap['section']>(null)
  const idRef = useRef<ID>()
  useEffect(() => {
    if (rootRef.current == null || tableState.focus?.id === idRef.current)
      return
    idRef.current = tableState.focus?.id
    if (tableState.focus?.id === group.id) rootRef.current.focus()
  })
  return (
    <section
      className={`group ${group.lines.length === 0 ? 'group--empty' : ''}`}
      onClick={onClick}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      ref={rootRef}
      tabIndex={group.lines.length === 0 ? 0 : undefined}
    >
      <UnorderedListElement className='group__list'>
        {group.lines.map((line, y) => (
          <li className='group__list-item' key={line.id}>
            <LineElement line={line} xy={{x, y}} />
          </li>
        ))}
      </UnorderedListElement>
    </section>
  )
}
