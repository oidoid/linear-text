import {focusLineAction} from '../../store/table-slice/table-slice'
import {Line} from '../../line/line'
import {LineElement} from '../line-element/line-element'
import {useAppDispatch} from '../../hooks/use-store'
import {useCallback} from 'react'

import './group.css'

export type GroupProps = Readonly<{lines: readonly Readonly<Line>[]}>

export function Group({lines}: GroupProps): JSX.Element {
  const dispatch = useAppDispatch()
  const dispatchBlurLine = useCallback(() => {
    // See LineTextElement.
    dispatch(focusLineAction(undefined))
  }, [dispatch])

  return (
    <article className='group' onClick={dispatchBlurLine}>
      <ul className='group__list'>
        {lines.map(line => (
          <li
            className={Line.isEmpty(line) ? 'group__list-item--empty' : ''}
            key={line.id}
          >
            <LineElement line={line} />
          </li>
        ))}
      </ul>
    </article>
  )
}
