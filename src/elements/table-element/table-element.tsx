import type {Table} from '../../table/table'

import {LineElement} from '../line-element/line-element'
import {ListElement} from '../list-element/list-element'

import './table-element.css'

export type TableProps = Readonly<{table: Readonly<Table>}>

export function TableElement({table}: TableProps): JSX.Element {
  return (
    <ListElement className='table' unordered>
      {table.lines.map((line, x) => (
        <li className={`table__list-item--${line.state}`} key={line.id}>
          <LineElement line={line} x={x} />
        </li>
      ))}
    </ListElement>
  )
}
