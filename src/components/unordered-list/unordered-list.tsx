import type {ListItem} from '../list-item/list-item'
import type {ReactElement} from 'react'

import './unordered-list.css'

export type UnorderedListProps = Readonly<{
  children: readonly ReactElement<typeof ListItem>[]
  horizontal?: boolean
}>

export function UnorderedList({children, horizontal}: UnorderedListProps) {
  return (
    <ul className={`ul ${horizontal ? 'ul--horizontal' : ''}`}>{children}</ul>
  )
}
