import type {ReactElement} from 'react'

import {ListElement} from '../list-element/list-element'

import './unordered-list-element.css'

export type UnorderedListProps = Readonly<{
  children: readonly ReactElement<HTMLLIElement>[]
  layout?: 'grid' | 'horizontal' | 'vertical'
}>

export function UnorderedListElement({
  children,
  layout = 'vertical'
}: UnorderedListProps): JSX.Element {
  return (
    <ListElement
      className={`unordered-list unordered-list--${layout}`}
      unordered
    >
      {children}
    </ListElement>
  )
}
