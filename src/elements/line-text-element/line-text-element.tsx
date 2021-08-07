import type {ID} from '../../id/id'
import type {Line} from '../../line/line'
import type React from 'react'

import {
  addDividerAction,
  addDraftAction,
  editLineAction,
  focusLineAction,
  removeLineAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useFocusSpellchecker} from '../../hooks/use-focus-spellcheck'

import './line-text-element.css'

export type LineTextProps = Readonly<{line: Readonly<Line>}>

export function LineTextElement({line}: LineTextProps): JSX.Element {
  const dispatch = useAppDispatch()
  const tableState = useAppSelector(selectTableState)

  const {spellcheck, onBlurSpellcheck, onFocusSpellcheck} =
    useFocusSpellchecker()
  const [text, setText] = useState(line.text)
  if (text !== line.text) setText(line.text)
  const onBlur = useCallback(
    (ev: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlurSpellcheck(ev)
      if (line.state === 'draft')
        dispatch(removeLineAction({id: line.id, nextFocus: 'retain'}))
    },
    [dispatch, line, onBlurSpellcheck]
  )
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = ev.currentTarget.value
      setText(text)
      dispatch(editLineAction({id: line.id, text}))
    },
    [dispatch, line.id]
  )
  const onFocus = useCallback(
    (ev: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocusSpellcheck(ev)
      ev.stopPropagation()
      // There is not a mirroring dispatch call for blur because focus is lost
      // on discard button press.
      dispatch(focusLineAction(line.id))
    },
    [dispatch, line, onFocusSpellcheck]
  )
  const onKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const remove =
        (ev.key === 'Backspace' || ev.key === 'Delete') && line.text === ''
      if (ev.key !== 'Enter' && !remove) return
      ev.preventDefault()
      ev.stopPropagation()
      dispatch(
        ev.key === 'Enter'
          ? line.state === 'draft'
            ? addDividerAction()
            : addDraftAction()
          : removeLineAction({
              id: line.id,
              nextFocus: ev.key === 'Backspace' ? 'prev' : 'next'
            })
      )
    },
    [dispatch, line]
  )

  const textRef = useRef<HTMLTextAreaElement>(null)
  const focus = useRef<[ID | undefined, ID] | undefined>()
  useEffect(() => {
    if (textRef.current == null) return
    if (
      focus.current?.[0] === tableState.focus &&
      focus.current?.[1] === line.id
    )
      return
    focus.current = [tableState.focus, line.id]
    if (tableState.focus === line.id) textRef.current.focus()
  })

  return (
    <div className='line-text-element' data-text={text}>
      <textarea
        autoFocus={tableState.focus === line.id}
        className='line-text-element__text'
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        ref={textRef}
        rows={1}
        spellCheck={spellcheck}
        value={text}
      />
    </div>
  )
}
