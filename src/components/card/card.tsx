import type {ReactNode} from 'react'
import './card.css'

export type CardProps = Readonly<{children: ReactNode}>

export function Card({children}: CardProps) {
  return <div className='card'>{children}</div>
}
