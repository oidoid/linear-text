import type {Table} from '../../table/table'

import {LineElement} from '../line-element/line-element'

import './table-element.css'

export type TableProps = Readonly<{table: Readonly<Table>}>

export function TableElement({table}: TableProps): JSX.Element {
  return (
    <ul className='table-element'>
      {table.lines.map(line => (
        <li className={`table-element__list-item--${line.state}`} key={line.id}>
          <LineElement line={line} />
        </li>
      ))}
    </ul>
  )
}
