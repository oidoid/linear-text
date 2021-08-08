import type {ReactNode} from 'react'

import './card-element.css'

export type CardProps = Readonly<{children: ReactNode}>

export function CardElement({children}: CardProps): JSX.Element {
  return <div className='card'>{children}</div>
}
