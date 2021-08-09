import type {ReactNode} from 'react'

import {HeaderElement, HeaderProps} from '../header-element/header-element'

import './card-element.css'

export type CardProps = Readonly<{
  children: ReactNode
  headerProps?: HeaderProps
}>

export function CardElement({children, headerProps}: CardProps): JSX.Element {
  const className = `card ${headerProps == null ? '' : 'card--header'}`
  return (
    <div className={className}>
      {headerProps == null ? null : <HeaderElement {...headerProps} />}
      {children}
    </div>
  )
}
