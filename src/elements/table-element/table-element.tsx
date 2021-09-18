import type {Table} from '../../table/table'

import {GroupElement} from './group-element'
import {UnorderedListElement} from '../list-element/list-element'

import './table-element.css'

export type TableProps = Readonly<{table: Readonly<Table>}>

export function TableElement({table}: TableProps): JSX.Element {
  return (
    <article className='table'>
      <UnorderedListElement className='table__list'>
        {table.groups.map((group, x) => (
          <li className='table__list-item' key={group.id}>
            <GroupElement group={group} x={x} />
          </li>
        ))}
      </UnorderedListElement>
    </article>
  )
}
