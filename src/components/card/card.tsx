import type React from 'react'
import './card.css'

export type CardProps = Readonly<{children?: React.ReactNode}>

export function Card({children}: CardProps) {
  return <div className='card'>{children}</div>
}
