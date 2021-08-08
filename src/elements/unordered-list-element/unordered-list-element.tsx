import type {ReactElement} from 'react'

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
    <ul className={`unordered-list unordered-list--${layout}`}>{children}</ul>
  )
}
