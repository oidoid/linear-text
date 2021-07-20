import {focusLineAction} from '../../store/table-slice/table-slice'
import {Line} from '../../line/line'
import {LineElement} from '../line-element/line-element'
import {useAppDispatch} from '../../hooks/use-store'
import {useCallback} from 'react'

import './group-element.css'

export type GroupElementProps = Readonly<{lines: readonly Readonly<Line>[]}>

export function GroupElement({lines}: GroupElementProps): JSX.Element {
  const dispatch = useAppDispatch()
  const dispatchBlurLine = useCallback(() => {
    // See LineTextElement.
    dispatch(focusLineAction(undefined))
  }, [dispatch])

  return (
    <article className='group-element' onClick={dispatchBlurLine}>
      <ul className='group-element__list'>
        {lines.map(line => (
          <li
            className={
              Line.isEmpty(line) ? 'group-element__list-item--empty' : ''
            }
            key={line.id}
          >
            <LineElement line={line} />
          </li>
        ))}
      </ul>
    </article>
  )
}
