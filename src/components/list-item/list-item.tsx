import type {ReactNode} from 'react'

import './list-item.css'

export type ListItemProps = Readonly<{children: ReactNode}>

export function ListItem({children}: ListItemProps) {
  return <li className='list-item'>{children}</li>
}
