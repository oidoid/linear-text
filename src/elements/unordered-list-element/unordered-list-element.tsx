import type {ReactElement} from 'react'

import './unordered-list-element.css'

export type UnorderedListElementProps = Readonly<{
  children: readonly ReactElement<HTMLLIElement>[]
  layout?: 'grid' | 'horizontal' | 'vertical'
}>

export function UnorderedListElement({
  children,
  layout = 'vertical'
}: UnorderedListElementProps): JSX.Element {
  return (
    <ul className={`unordered-list-element unordered-list-element--${layout}`}>
      {children}
    </ul>
  )
}
