import type {MouseEventHandler} from 'react'

import {Button} from '../button/button'
import {Icon} from '../icon/icon'

import './icon-button.css'

export type IconButtonProps = Readonly<{
  label: string
  onClick: MouseEventHandler<HTMLButtonElement>
  src: string
  title: string
}>

export function IconButton({label, onClick, src, title}: IconButtonProps) {
  return (
    <div className='icon-button'>
      <Button onClick={onClick} title={title}>
        <Icon alt='' src={src} />
      </Button>
      <label className='icon-buttonish__label'>{label}</label>
    </div>
  )
}
