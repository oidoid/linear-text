import type {MouseEventHandler} from 'react'

import {Button} from '../button/button'
import {Icon} from '../icon/icon'

import './icon-button.css'

export type IconButtonProps = Readonly<{
  alt: string
  label: string
  onClick: MouseEventHandler<HTMLButtonElement>
  src: string
  title: string
}>

export function IconButton({alt, label, onClick, src, title}: IconButtonProps) {
  return (
    <div>
      <Button onClick={onClick} title={title}>
        <Icon alt={alt} src={src} />
      </Button>
      <label className='icon-buttonish__label'>{label}</label>
    </div>
  )
}
