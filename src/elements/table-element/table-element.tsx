import type {Table} from '../../table/table'

import {GroupElement} from './group-element'
import {ListElement} from '../list-element/list-element'

import './table-element.css'

export type TableProps = Readonly<{table: Readonly<Table>}>

export function TableElement({table}: TableProps): JSX.Element {
  return (
    <article className='table'>
      <ListElement className='table__list' unordered>
        {table.groups.map((group, x) => (
          <li className='table__list-item' key={group.id}>
            <GroupElement group={group} x={x} />
          </li>
        ))}
      </ListElement>
    </article>
  )
}
