import type {ListItem} from '../list-item/list-item'
import type {ReactElement} from 'react'

import './unordered-list.css'

export type UnorderedListProps = Readonly<{
  children: readonly ReactElement<typeof ListItem>[]
  layout?: 'grid' | 'horizontal' | 'vertical'
}>

export function UnorderedList({
  children,
  layout = 'vertical'
}: UnorderedListProps) {
  return (
    <ul className={`unordered-list unordered-list--${layout}`}>{children}</ul>
  )
}
