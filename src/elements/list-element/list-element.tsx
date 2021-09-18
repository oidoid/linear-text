import {ForwardedRef, forwardRef, ReactElement} from 'react'

import './list-element.css'

export type ListProps = Readonly<{
  children: readonly ReactElement<HTMLLIElement>[]
  className?: string | undefined
}>

export const OrderedListElement = forwardRef(
  (
    {children, className = ''}: ListProps,
    ref: ForwardedRef<HTMLOListElement>
  ): ReactElement<HTMLOListElement> => {
    return (
      <ol className={`list ${className}`} ref={ref}>
        {children}
      </ol>
    )
  }
)

export const UnorderedListElement = forwardRef(
  (
    {children, className = ''}: ListProps,
    ref: ForwardedRef<HTMLUListElement>
  ): ReactElement<HTMLUListElement> => {
    return (
      <ul className={`list ${className}`} ref={ref}>
        {children}
      </ul>
    )
  }
)
