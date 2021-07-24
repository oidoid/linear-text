import type React from 'react'

import {
  addLineAction,
  editLineTextAction,
  focusLineAction,
  removeLineAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {Line} from '../../line/line'
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
  const onBlur = useCallback(
    (ev: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlurSpellcheck(ev)
      if (line.state === 'draft') {
        // Don't retain focus here. If the current state is a draft and the
        // reason for removal is new line creation, the better behavior is to
        // set the cursor back one and recreate a line in the position of this
        // line. This unfortunately causes a focus glitch when pressing tab to
        // cause a focus loss from a draft to a subsequent line.
        dispatch(removeLineAction({line, focus: 'prev'}))
      }
    },
    [dispatch, line, onBlurSpellcheck]
  )
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = ev.currentTarget.value
      setText(text)
      dispatch(editLineTextAction({id: line.id, text}))
    },
    [dispatch, line.id]
  )
  const onFocus = useCallback(
    (ev: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocusSpellcheck(ev)
      ev.stopPropagation()
      // There is not a mirroring dispatch call for blur because focus is lost
      // on discard button press. Clear focus on GroupElement click instead.
      dispatch(focusLineAction(line))
    },
    [dispatch, line, onFocusSpellcheck]
  )
  const onKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const remove =
        (ev.key === 'Backspace' || ev.key === 'Delete') && Line.isEmpty(line)
      if (ev.key !== 'Enter' && !remove) return
      ev.preventDefault()
      ev.stopPropagation()
      dispatch(
        ev.key === 'Enter'
          ? addLineAction(line.state === 'draft' ? 'divider' : 'draft')
          : removeLineAction({
              line,
              focus: ev.key === 'Backspace' ? 'prev' : 'next'
            })
      )
    },
    [dispatch, line]
  )

  const textRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (tableState.focus?.id === line.id) textRef.current?.focus()
  }, [tableState.focus, line.id, textRef])

  return (
    <div className='line-text-element' data-text={text}>
      <textarea
        ref={textRef}
        autoFocus={tableState.focus === line}
        className='line-text-element__text'
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        rows={1}
        spellCheck={spellcheck}
        value={text}
      />
    </div>
  )
}
