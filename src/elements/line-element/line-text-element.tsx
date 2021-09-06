import type {ID} from '../../id/id'
import type React from 'react'
import type {XY} from '../../math/xy'

import {
  addDraftAction,
  addGroupAction,
  editLineAction,
  focusAction,
  removeLineAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {Line} from '../../line/line'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useFocusSpellchecker} from '../../hooks/use-focus-spellcheck'

import './line-text-element.css'

export type LineTextProps = Readonly<{line: Readonly<Line>; xy: Readonly<XY>}>

export function LineTextElement({line, xy}: LineTextProps): JSX.Element {
  const lineIndex = useMemo(
    () => ({id: line.id, x: xy.x, y: xy.y}),
    [line.id, xy.x, xy.y]
  )
  const emptyLine = Line.isEmpty(line)
  const dispatch = useAppDispatch()
  const tableState = useAppSelector(selectTableState)

  const {spellcheck, onBlurSpellcheck, onFocusSpellcheck} =
    useFocusSpellchecker()
  const [text, setText] = useState(line.text)
  if (text !== line.text) setText(line.text)
  const onBlur = useCallback(
    (ev: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlurSpellcheck(ev)
      if (emptyLine)
        dispatch(removeLineAction({lineIndex, nextFocus: 'retain'}))
    },
    [dispatch, emptyLine, lineIndex, onBlurSpellcheck]
  )
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = ev.currentTarget.value
      setText(text)
      dispatch(editLineAction({lineIndex, text}))
    },
    [dispatch, lineIndex]
  )
  const onFocus = useCallback(
    (ev: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocusSpellcheck(ev)
      ev.stopPropagation()
      // There is not a mirroring dispatch call for blur because focus is lost
      // on discard button press.
      dispatch(focusAction(lineIndex))
    },
    [dispatch, lineIndex, onFocusSpellcheck]
  )
  const onKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const remove =
        (ev.key === 'Backspace' || ev.key === 'Delete') && emptyLine
      if (ev.key !== 'Enter' && !remove) return
      ev.preventDefault()
      ev.stopPropagation()

      if (ev.key === 'Enter') {
        if (emptyLine) dispatch(addGroupAction())
        dispatch(addDraftAction())
      } else {
        dispatch(
          removeLineAction({
            lineIndex,
            nextFocus: ev.key === 'Backspace' ? 'prev' : 'next'
          })
        )
      }
    },
    [dispatch, emptyLine, lineIndex]
  )

  const textRef = useRef<HTMLTextAreaElement>(null)
  const focus = useRef<[ID | undefined, ID]>()
  useEffect(() => {
    if (textRef.current == null) return
    if (
      focus.current?.[0] === tableState.focus?.id &&
      focus.current?.[1] === line.id
    )
      return
    focus.current = [tableState.focus?.id, line.id]
    if (tableState.focus?.id === line.id) textRef.current.focus()
  })

  return (
    <div className='line-text' data-text={text}>
      <textarea
        autoFocus={tableState.focus?.id === line.id}
        className='line-text__text'
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
