import type {Line} from '../../line/line'

import {LineElement} from '../line-element/line-element'

import './group-element.css'

export type GroupElementProps = Readonly<{lines: readonly Readonly<Line>[]}>

export function GroupElement({lines}: GroupElementProps): JSX.Element {
  return (
    <ul className='group-element'>
      {lines.map(line => (
        <li className={`group-element__list-item--${line.state}`} key={line.id}>
          <LineElement line={line} />
        </li>
      ))}
    </ul>
  )
}
