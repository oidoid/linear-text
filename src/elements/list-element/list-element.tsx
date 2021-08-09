import type {ReactElement} from 'react'

import './list-element.css'

export type ListProps = Readonly<
  {
    children: readonly ReactElement<HTMLLIElement>[]
    className?: string | undefined
  } & ({ordered: true} | {unordered: true})
>

export function ListElement({
  children,
  className = '',
  ...props
}: ListProps): JSX.Element {
  if ('ordered' in props)
    return <ol className={`list ${className}`}>{children}</ol>
  return <ul className={`list ${className}`}>{children}</ul>
}
